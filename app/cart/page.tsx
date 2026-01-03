'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2, ShieldCheck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  description: string;
  category?: string;
  stock?: number;
  specifications?: Record<string, string>;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY'
  }).format(value);
};

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('creditCard');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const FREE_SHIPPING_THRESHOLD = 1500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);
  const progressPercentage = Math.min(100, (totalAmount / FREE_SHIPPING_THRESHOLD) * 100);
  const shippingCost = totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : 49.99;
  const orderTotal = totalAmount + shippingCost;

  // Load recommended products
  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const allProducts = await res.json();
        
        // Exclude items already in cart
        const cartProductIds = cart.map(item => item.product._id);
        const filtered = (allProducts as Product[])
          .filter((product: Product) => !cartProductIds.includes(product._id))
          .slice(0, 4);
        
        setRecommendedProducts(filtered);
      } catch (error) {
        console.error('Error loading recommended products:', error);
      }
    };

    loadRecommendedProducts();
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24">
        <Card className="mx-auto max-w-2xl text-center">
          <CardHeader>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-light tracking-wider">SEPETİNİZ BOŞ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground">
              Raf koleksiyonmuzu inceleyin ve sepetinize ürün ekleyerek alışverişe devam edin.
            </p>
            <Button asChild className="gap-2">
              <Link href="/products">
                Ürünleri Keşfet
                <ArrowRight size={18} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Alışveriş Sepetim</h1>
        <p className="text-muted-foreground mt-2">
          {cart.length} ürün sepetinizde
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-6">
          {cart.map((item) => (
            <Card key={item.product._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-48 w-full sm:w-48 bg-gray-100">
                  {item.product.images && item.product.images.length > 0 && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      {item.product.category && <p className="text-sm text-muted-foreground">{item.product.category}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product._id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ara Toplam</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Kargo</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'Ücretsiz Kargo' : formatCurrency(shippingCost)}
                  </span>
                </div>
                
                {remainingForFreeShipping > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(remainingForFreeShipping)} daha harcayın ücretsiz kargo için
                      </span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-medium">
                <span>Toplam</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">
                  Güvenli Ödemeye Geç
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ödeme Yöntemi</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={selectedPaymentMethod} 
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary">
                  <RadioGroupItem value="creditCard" id="creditCard" />
                  <div className="flex-1">
                    <Label htmlFor="creditCard" className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Kredi / Banka Kartı
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rounded-lg border p-4 hover:border-primary">
                  <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                  <div className="flex-1">
                    <Label htmlFor="bankTransfer" className="flex items-center">
                      <Banknote className="mr-2 h-5 w-5" />
                      Havale / EFT
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          <div className="flex items-center justify-center space-x-2 rounded-lg bg-primary/5 p-4 text-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">Güvenli ödeme ile alışveriş yapın</span>
          </div>
        </div>
      </div>
      
      {recommendedProducts.length > 0 && (
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Diğer Öneriler</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sepetinizdeki ürünlere benzer ürünler
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {recommendedProducts.map((product) => (
                  <Card key={product._id} className="group overflow-hidden transition-all hover:shadow-md">
                    <div className="relative aspect-square overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-100">
                          <ShoppingBag className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 text-sm font-medium line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-lg font-semibold">
                        {formatCurrency(product.price)}
                      </p>
                      <Button 
                        className="mt-3 w-full" 
                        size="sm"
                        onClick={() => {
                          // Add to cart functionality would go here
                          console.log('Adding to cart:', product.name);
                        }}
                      >
                        Sepete Ekle
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
