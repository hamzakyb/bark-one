'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  Heart, 
  Truck, 
  ShieldCheck, 
  Star,
  Minus,
  Plus,
  Share2,
  Loader2,
  Package,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await res.json();
        if (data.success && data.data) {
          setProduct(data.data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
        toast.error('Ürün yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      toast.success(`${product.name} sepete eklendi`);
    } catch {
      toast.error('Ürün sepete eklenirken bir hata oluştu');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    toast.success(`${product.name} favorilere eklendi`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Ürün linki kopyalandı');
    }
  };

  if (loading) {
    return (
      <div className="container px-4 pb-8 mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 pb-8 mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h1>
          <p className="text-muted-foreground mb-6">Aradığınız ürün mevcut değil veya kaldırılmış.</p>
          <Button asChild>
            <Link href="/products">Ürünlere Dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = (product.stock || 0) > 0;

  return (
    <div className="min-h-screen bg-background pt-32">
      <div className="container px-4 pb-6 mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Ana Sayfa</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Ürünler</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Section */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="relative aspect-square w-full">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-50">
                      <div className="text-gray-400 text-center">
                        <Package className="h-16 w-16 mx-auto mb-2" />
                        <div>Ürün görseli yok</div>
                      </div>
                    </div>
                  )}
                  {!isInStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        Stokta Yok
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <Card 
                    key={index}
                    className={`overflow-hidden cursor-pointer transition-all ${
                      selectedImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {product.category === 'signature' && 'Signature'}
                      {product.category === 'atelier' && 'Atelier'}
                      {product.category === 'studio' && 'Studio'}
                    </Badge>
                    <Badge variant={isInStock ? "default" : "destructive"}>
                      {isInStock ? 'Stokta' : 'Tükendi'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{product.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(4.0 · 128 değerlendirme)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</div>
                <p className="text-muted-foreground">{product.description}</p>
                
                <Separator />
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Adet</Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="h-9 w-9 rounded-r-none"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-12 text-center font-semibold">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      disabled={quantity >= (product.stock || 10)}
                      className="h-9 w-9 rounded-l-none"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isInStock || isAddingToCart}
                    size="lg"
                    className="w-full h-12 text-lg"
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Ekleniyor...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Sepete Ekle
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleAddToWishlist}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favori
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Paylaş
                    </Button>
                  </div>
                </div>
                
                {/* Security Badges */}
                <div className="flex items-center justify-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-5 w-5" />
                    <span>Hızlı Teslimat</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-5 w-5" />
                    <span>İade Garantisi</span>
                  </div>
                </div>
                
                {!isInStock && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                    Bu ürün şu anda stokta bulunmamaktadır.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
              <TabsTrigger value="specs">Teknik Özellikler</TabsTrigger>
              <TabsTrigger value="shipping">Teslimat & İade</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold">Ürün Açıklaması</h2>
                      <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                          <div className="h-10 w-1 bg-primary rounded-full"></div>
                          Tasarım Özellikleri
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          BarkOne raf sistemleri, modern yaşam alanları için özel olarak tasarlanmıştır. 
                          Doğal malzemelerin işlevsel tasarım ile buluştuğu bu ürünler, evinize hem estetik 
                          hem de pratik çözümler sunar.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold flex items-center gap-3">
                          <div className="h-10 w-1 bg-primary rounded-full"></div>
                          Kullanım Alanları
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Oturma odası, yatak odası, çalışma odası veya koridor gibi farklı alanlarda 
                          kullanıma uygun olan bu raf sistemleri, kitaplar, dekoratif objeler ve kişisel 
                          eşyalarınız için mükemmel depolama çözümleri sunar.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specs" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Teknik Özellikler</h2>
                      <p className="text-muted-foreground mt-2">Ürünle ilgili detaylı teknik bilgiler</p>
                    </div>
                    
                    <Separator />
                    
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <div className="grid gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <span className="font-medium">{key}</span>
                            <span className="text-muted-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Teknik Özellik Bilgisi Bulunamadı</h3>
                        <p className="text-muted-foreground">Bu ürün için teknik özellik bilgisi henüz eklenmemiştir.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">Teslimat & İade</h2>
                      <p className="text-muted-foreground mt-2">Sipariş süreci, kargo bilgileri ve iade koşulları</p>
                    </div>
                    
                    <Separator />
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left text-lg font-medium">Teslimat Süreci</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Siparişleriniz 3-5 iş günü içinde kargoya teslim edilir.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Kargo ücreti 1500 TL ve üzeri siparişlerde ücretsizdir. Altında ise 49.99 TL uygulanır.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Ürünlerimiz kurulum talimatlarıyla birlikte gelir. İsteğe bağlı olarak profesyonel montaj hizmeti de sağlayabiliriz.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left text-lg font-medium">İade Koşulları</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Ürünleri teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Ürünlerin kullanılmamış, ambalajı hasar görmemiş ve orijinal halinde olması gerekmektedir.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>İade talebinizi müşteri hizmetlerimize bildirmeniz yeterlidir. Onaylanan iadeler için kargo ücreti tarafımızdan karşılanır.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left text-lg font-medium">Garanti Koşulları</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>BarkOne tüm ürünlerinde 2 yıl garantisi bulunmaktadır.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Garanti kapsamında üretim kaynaklı hatalar giderilmektedir.</p>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                              <p>Doğal aşınmalardan veya yanlış kullanım sonucu oluşan hasarlar garanti kapsamı dışındadır.</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}