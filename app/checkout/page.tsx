'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Banknote, 
  CheckCircle, 
  Loader2,
  MapPin,
  User
} from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  surname: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  address: z.string().min(10, 'Adres en az 10 karakter olmalıdır'),
  city: z.string().min(2, 'Şehir adı giriniz'),
  zipCode: z.string().min(5, 'Posta kodu giriniz'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'creditCard' | 'bankTransfer'>('creditCard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Read payment method from URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const method = params.get('paymentMethod');
    if (method === 'creditCard' || method === 'bankTransfer') {
      setSelectedPaymentMethod(method);
    }
  }, []);

  const [formData, setFormData] = useState<CheckoutForm>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CheckoutForm]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const generateReference = () => {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `B1-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const fieldErrors: Partial<CheckoutForm> = {};

      Object.keys(formattedErrors).forEach((key) => {
        const k = key as keyof CheckoutForm;
        if (formattedErrors[k]) {
          fieldErrors[k] = formattedErrors[k]?.[0];
        }
      });

      setErrors(fieldErrors);
      return;
    }

    // Ödeme yöntemi seçilmemişse hata göster
    if (!selectedPaymentMethod) {
      toast.error('Lütfen bir ödeme yöntemi seçiniz.');
      return;
    }

    // Kredi kartı ödemesi için iyzico'ya yönlendir
    if (selectedPaymentMethod === 'creditCard') {
      setIsProcessingPayment(true);
      try {
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            price: totalAmount,
            basketItems: cart.map(item => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity
            })),
            buyer: {
              id: 'guest_' + Math.random().toString(36).substr(2, 9),
              name: formData.name,
              surname: formData.surname,
              email: formData.email,
              address: formData.address,
              city: formData.city
            }
          })
        });

        const data = await response.json();
        if (data.paymentPageUrl) {
          window.location.href = data.paymentPageUrl;
        } else {
          throw new Error('Ödeme sayfası oluşturulamadı');
        }
      } catch (error) {
        console.error('Ödeme hatası:', error);
        toast.error('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        setIsProcessingPayment(false);
      }
      return;
    }

    // Havale/EFT için referans oluştur ve talimatları göster
    const reference = generateReference();
    setPaymentReference(reference);
    setShowPaymentInstructions(true);
  };

  const submitOrder = async () => {
    setIsLoading(true);
    try {
      // Siparişi veritabanına kaydet
      const orderData = {
        customer: {
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: orderTotal,
        paymentMethod: selectedPaymentMethod === 'creditCard' ? 'Kredi Kartı' : 'Havale/EFT',
        reference: paymentReference
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Siparişiniz başarıyla oluşturuldu!');
        clearCart();
        
        // Sipariş numarasını URL parametresi olarak gönder
        const orderNumber = data.data.orderNumber || '';
        router.push(`/orders/success${orderNumber ? '?order=' + orderNumber : ''}`);
      } else {
        throw new Error(data.error || 'Sipariş oluşturulamadı');
      }
    } catch (error: any) {
      console.error('Sipariş hatası:', error);
      toast.error(error.message || 'Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const shippingCost = totalAmount >= 1500 ? 0 : 49.99;
  const orderTotal = totalAmount + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle>Sepetiniz Boş</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Ödeme yapabilmek için önce sepetinize ürün ekleyin.
            </p>
            <Button asChild>
              <Link href="/products">Ürünleri Keşfet</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showPaymentInstructions) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Siparişiniz Alındı!</CardTitle>
            <p className="text-muted-foreground">
              Havale/EFT ile ödeme için aşağıdaki bilgileri kullanabilirsiniz.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 font-semibold">Banka Bilgileri</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Banka:</span> Türkiye İş Bankası</p>
                <p><span className="font-medium">Hesap Sahibi:</span> BarkOne Dekorasyon</p>
                <p><span className="font-medium">IBAN:</span> TR12 0006 1000 0001 2345 6789 01</p>
                <p><span className="font-medium">Referans No:</span> {paymentReference}</p>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold">Önemli Not</h3>
              <p className="text-sm text-muted-foreground">
                Havale/EFT işlemi sırasında açıklama kısmına referans numarasını ({paymentReference}) 
                mutlaka yazınız. Ödeme onaylandıktan sonra siparişiniz işleme alınacaktır.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={submitOrder} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                'Siparişi Tamamla'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/cart" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Sepete Dön
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Ödeme</h1>
        <p className="mt-2 text-muted-foreground">
          Sipariş bilgilerinizi tamamlayın ve ödeme yapın
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                İletişim Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Adınızı girin"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    placeholder="Soyadınızı girin"
                    className={errors.surname ? 'border-red-500' : ''}
                  />
                  {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@email.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0555 123 45 67"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Teslimat Adresi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Detay adres bilgilerinizi girin"
                  rows={3}
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Şehir</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="İstanbul"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Posta Kodu</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="34000"
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Ödeme Yöntemi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedPaymentMethod} 
                onValueChange={(value) => setSelectedPaymentMethod(value as 'creditCard' | 'bankTransfer')}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary">
                  <RadioGroupItem value="creditCard" id="creditCard" />
                  <div className="flex-1">
                    <Label htmlFor="creditCard" className="flex cursor-pointer items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <div>
                        <p className="font-medium">Kredi / Banka Kartı</p>
                        <p className="text-sm text-muted-foreground">Güvenli ödeme ile tek çekim veya taksitli ödeme</p>
                      </div>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary">
                  <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                  <div className="flex-1">
                    <Label htmlFor="bankTransfer" className="flex cursor-pointer items-center">
                      <Banknote className="mr-2 h-5 w-5" />
                      <div>
                        <p className="font-medium">Havale / EFT</p>
                        <p className="text-sm text-muted-foreground">Banka havalesi ile ödeme</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
                        {item.product.images && item.product.images.length > 0 ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100">
                            <Truck className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Adet: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                      {shippingCost === 0 ? 'Ücretsiz' : formatCurrency(shippingCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Toplam</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isProcessingPayment}
                  className="w-full" 
                  size="lg"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Yönlendiriliyor...
                    </>
                  ) : (
                    'Ödemeyi Tamamla'
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 rounded-lg bg-primary/5 p-4 text-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-muted-foreground">Güvenli ödeme ile alışveriş yapın</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
