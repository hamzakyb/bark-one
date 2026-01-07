'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Grid,
  List,
  ShoppingCart,
  Heart,
  SlidersHorizontal,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useSiteSettings } from '@/context/SiteSettingsContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { SheetClose } from '@/components/ui/sheet';

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  description: string;
  category?: string;
  stock?: number;
  specifications?: Record<string, string | undefined>;
};

interface ProductsSettings {
  productsHeroBadge: string;
  productsHeroTitle: string;
  productsHeroSubtitle: string;
  productsHeroImage: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

const categories = [
  { id: 'all', name: 'Tüm Ürünler' },
  { id: 'signature', name: 'Signature Koleksiyon' },
  { id: 'atelier', name: 'Atelier Serisi' },
  { id: 'studio', name: 'Studio Modüler' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { settings } = useSiteSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsSettings, setProductsSettings] = useState<ProductsSettings>({
    productsHeroBadge: 'Ürün Kataloğu',
    productsHeroTitle: 'Ürünler',
    productsHeroSubtitle: 'Modern ve şık duvar rafları koleksiyonumuzu keşfedin',
    productsHeroImage: '/images/products-hero.png'
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Ürünler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();

    // Also load settings
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setProductsSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Error loading products settings:', error);
      }
    };
    loadSettings();
  }, [settings]);

  // Filter products
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }

      // Price filter
      filtered = filtered.filter(product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // Stock filter
      if (inStockOnly) {
        filtered = filtered.filter(product => (product.stock || 0) > 0);
      }

      // Sort
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Featured - keep original order
          break;
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, inStockOnly]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success(`${product.name} sepete eklendi`);
  };

  const handleAddToWishlist = (product: Product) => {
    // Add to wishlist logic here
    toast.success(`${product.name} favorilere eklendi`);
  };

  const handleViewProduct = (productId: string) => {
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  };

  if (loading) {
    return (
      <div className="container px-4 pt-24 pb-8 mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 pt-32 pb-8 mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 md:items-center mb-12">
          <div className="flex-1">
            <div className="inline-block py-1 px-3 border border-stone-200 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 mb-6 bg-white/50 backdrop-blur-sm">
              {productsSettings.productsHeroBadge}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif tracking-tight text-slate-900 mb-6">{productsSettings.productsHeroTitle}</h1>
            <p className="text-lg text-muted-foreground font-light max-w-xl leading-relaxed">
              {productsSettings.productsHeroSubtitle}
            </p>
          </div>
          <div className="w-full md:w-1/2 aspect-[16/6] relative overflow-hidden rounded-sm">
            <Image
              key={productsSettings.productsHeroImage}
              src={productsSettings.productsHeroImage}
              alt="Products Hero"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-stone-900/5" />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Filters */}
        <div className="w-80 shrink-0 hidden lg:block">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filtreler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <Label className="text-base font-medium text-slate-700">Kategori</Label>
                <div className="mt-3 space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={selectedCategory === category.id}
                        onCheckedChange={() => setSelectedCategory(category.id)}
                      />
                      <Label htmlFor={category.id} className="text-sm font-normal text-slate-600 cursor-pointer">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Price Range Filter */}
              <div>
                <Label className="text-base font-medium text-slate-700">Fiyat Aralığı</Label>
                <div className="mt-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20000}
                    step={100}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between text-sm text-slate-600">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stock"
                  checked={inStockOnly}
                  onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                />
                <Label htmlFor="stock" className="text-sm font-normal text-slate-600 cursor-pointer">
                  Sadece stoktakiler
                </Label>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setPriceRange([0, 20000]);
                }}
              >
                Filtreleri Temizle
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Controls Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Öne Çıkan</SelectItem>
                  <SelectItem value="price-low">Fiyat: Düşükten Yükseğe</SelectItem>
                  <SelectItem value="price-high">Fiyat: Yüksekten Düşüğe</SelectItem>
                  <SelectItem value="name">İsim A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtreler
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-80 overflow-y-auto pt-16">
                  <SheetHeader className="pb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <SheetTitle className="text-lg font-semibold text-slate-900">Filtreler</SheetTitle>
                        <SheetDescription className="text-xs text-slate-600 mt-1">
                          Ürünleri istediğiniz kriterlere göre filtreleyin
                        </SheetDescription>
                      </div>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full hover:bg-slate-100"
                        >
                          ×
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetHeader>
                  <div className="space-y-8">
                    {/* Category Filter */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-slate-900">Kategori</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <Checkbox
                              id={`mobile-${category.id}`}
                              checked={selectedCategory === category.id}
                              onCheckedChange={() => setSelectedCategory(category.id)}
                              className="shrink-0 h-4 w-4"
                            />
                            <Label
                              htmlFor={`mobile-${category.id}`}
                              className="text-xs font-medium text-slate-700 cursor-pointer flex-1"
                            >
                              {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range Filter */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold text-slate-900">Fiyat Aralığı</Label>
                      <div className="space-y-3">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={20000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded-lg">
                          <span className="bg-white px-2 py-1 rounded">{formatCurrency(priceRange[0])}</span>
                          <span className="bg-white px-2 py-1 rounded">{formatCurrency(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Stock Filter */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <Checkbox
                        id="mobile-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                        className="shrink-0 h-4 w-4"
                      />
                      <Label htmlFor="mobile-stock" className="text-xs font-medium text-slate-700 cursor-pointer">
                        Sadece stoktakiler
                      </Label>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-6">
                      <Button
                        variant="outline"
                        className="w-full h-10 text-xs font-medium"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setInStockOnly(false);
                          setPriceRange([0, 20000]);
                        }}
                      >
                        Filtreleri Temizle
                      </Button>
                      <SheetClose asChild>
                        <Button
                          className="w-full h-10 text-xs font-medium bg-slate-900 hover:bg-slate-800"
                        >
                          Filtreleri Uygula
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all' || inStockOnly) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Arama: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Kategori: {categories.find(c => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {inStockOnly && (
                <Badge variant="secondary" className="gap-1">
                  Sadece stoktakiler
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-sm p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6 text-sm text-muted-foreground">
            {filteredProducts.length} ürün gösteriliyor
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Arama kriterlerinize uygun ürün bulunamadı.</p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setInStockOnly(false);
                setPriceRange([0, 20000]);
              }}>
                Filtreleri Temizle
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <Card key={product._id} className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer flex flex-col h-full" onClick={() => handleViewProduct(product._id)}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="relative aspect-square overflow-hidden shrink-0">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100">
                            <div className="text-gray-400">Ürün görseli yok</div>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(product);
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {(product.stock || 0) === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Stokta Yok</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 line-clamp-2 text-sm">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">{product.description}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(product._id);
                              }}
                              className="flex-1 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              İncele
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={(product.stock || 0) === 0}
                              className="flex-1 text-xs"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Sepete Ekle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="p-4 flex gap-4">
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100">
                            <div className="text-gray-400 text-xs">Görsel yok</div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{formatCurrency(product.price)}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(product._id);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              İncele
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToWishlist(product);
                              }}
                              className="text-xs px-2 py-1"
                            >
                              <Heart className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={(product.stock || 0) === 0}
                              className="text-xs px-2 py-1"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Sepete Ekle
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container px-4 pt-24 pb-8 mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
