'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, CreditCard, Home, LogOut, Package, Pencil, PlusCircle, Settings, Trash2, User, UserCog } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

interface MeResponse {
    success: boolean;
    data?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        avatar?: string;
        createdAt: string;
    };
    error?: string;
}

interface OrderItemProduct {
    _id: string;
    name: string;
    image?: string;
    price: number;
}

interface UserOrder {
    _id: string;
    orderNumber: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    totalAmount: number;
    createdAt: string;
    items: { product: OrderItemProduct; quantity: number }[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Beklemede</Badge>;
        case 'processing':
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Hazırlanıyor</Badge>;
        case 'shipped':
            return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Kargoda</Badge>;
        case 'delivered':
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Teslim Edildi</Badge>;
        case 'cancelled':
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">İptal Edildi</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [user, setUser] = useState<MeResponse['data'] | null>(null);
    const [orders, setOrders] = useState<UserOrder[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data: MeResponse = await res.json();
                if (!res.ok || !data.success || !data.data) {
                    setError('Oturum bulunamadı');
                    router.push('/login');
                    return;
                }
                setUser(data.data);
                setFormData({
                    name: data.data.name,
                    email: data.data.email,
                    phone: data.data.phone || '',
                    address: data.data.address || ''
                });

                try {
                    const ordersRes = await fetch('/api/user/orders');
                    if (ordersRes.ok) {
                        const ordersJson = await ordersRes.json();
                        if (ordersJson?.success && Array.isArray(ordersJson.data)) {
                            setOrders(ordersJson.data as UserOrder[]);
                        }
                    }
                } catch {
                    // Silently fail if orders can't be loaded
                }
            } catch {
                setError('Profil bilgisi alınamadı');
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setUser(prev => prev ? { ...prev, ...formData } : null);
                setEditing(false);
            }
        } catch (error) {
            console.error('Profil güncellenirken hata oluştu:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-8">
                        <Skeleton className="h-10 w-64" />
                        <div className="grid gap-6 md:grid-cols-4">
                            <Skeleton className="h-96 rounded-xl" />
                            <div className="md:col-span-3 space-y-6">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const userInitials = user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Hesabım</h1>
                        <p className="text-muted-foreground">Hesap bilgileriniz ve sipariş geçmişiniz</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" />
                        Çıkış Yap
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="h-4 w-4" />
                            Profil
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="gap-2">
                            <Package className="h-4 w-4" />
                            Siparişlerim
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="gap-2">
                            <Home className="h-4 w-4" />
                            Adreslerim
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profil Bilgileri</CardTitle>
                                <CardDescription>
                                    Kişisel bilgilerinizi görüntüleyin ve düzenleyin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col md:flex-row items-start gap-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <Avatar className="h-24 w-24">
                                            {user.avatar ? (
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                            ) : (
                                                <AvatarFallback className="text-xl">
                                                    {userInitials}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <Button variant="outline" size="sm" className="w-full">
                                            Resmi Değiştir
                                        </Button>
                                    </div>

                                    {editing ? (
                                        <form onSubmit={handleSaveProfile} className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Ad Soyad</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">E-posta</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        required
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Telefon</Label>
                                                    <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setEditing(false)}
                                                >
                                                    İptal
                                                </Button>
                                                <Button type="submit">Kaydet</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Ad Soyad</p>
                                                    <p className="font-medium">{user.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">E-posta</p>
                                                    <p className="font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Telefon</p>
                                                    <p className="font-medium">
                                                        {user.phone || 'Belirtilmemiş'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Üyelik Tarihi</p>
                                                    <p className="font-medium">
                                                        {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-4">
                                                <Button onClick={() => setEditing(true)}>
                                                    Profili Düzenle
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sipariş Geçmişim</CardTitle>
                                <CardDescription>
                                    Geçmiş siparişlerinizi görüntüleyin ve takip edin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-2 text-sm font-medium">Henüz siparişiniz yok</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Alışverişe başlayarak ilk siparişinizi oluşturabilirsiniz.
                                        </p>
                                        <Button className="mt-6" onClick={() => router.push('/products')}>
                                            Alışverişe Başla
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <Card key={order._id} className="overflow-hidden">
                                                <div className="p-4 sm:p-6">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Sipariş No: {order.orderNumber}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">Durum:</span>
                                                            {getStatusBadge(order.status)}
                                                        </div>
                                                    </div>

                                                    <div className="mt-6 border-t pt-6">
                                                        <div className="space-y-4">
                                                            {order.items.map((item, index) => (
                                                                <div key={index} className="flex items-center gap-4">
                                                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                                                                        {item.product.image ? (
                                                                            <img
                                                                                src={item.product.image}
                                                                                alt={item.product.name}
                                                                                className="h-full w-full object-cover object-center"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h4 className="font-medium">
                                                                            {item.product.name}
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {item.quantity} adet × {item.product.price.toFixed(2)} ₺
                                                                        </p>
                                                                    </div>
                                                                    <div className="font-medium">
                                                                        {(item.product.price * item.quantity).toFixed(2)} ₺
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t">
                                                            <div className="text-sm">
                                                                <p className="text-muted-foreground">Toplam Tutar</p>
                                                                <p className="text-lg font-semibold">
                                                                    {order.totalAmount.toFixed(2)} ₺
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm">
                                                                    Sipariş Detayı
                                                                </Button>
                                                                <Button size="sm">
                                                                    Tekrar Sipariş Ver
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="addresses">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Adreslerim</CardTitle>
                                        <CardDescription>
                                            Kayıtlı adreslerinizi yönetin.
                                        </CardDescription>
                                    </div>
                                    <Button size="sm">
                                        Yeni Adres Ekle
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">Ev Adresi</h4>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Pencil className="h-4 w-4" />
                                                            <span className="sr-only">Düzenle</span>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Sil</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <p>Ahmet Yılmaz</p>
                                                    <p className="text-muted-foreground">Atatürk Mah. Cumhuriyet Cad. No:123</p>
                                                    <p className="text-muted-foreground">Kadıköy, İstanbul</p>
                                                    <p className="text-muted-foreground">+90 555 123 4567</p>
                                                </div>
                                                <div className="pt-2">
                                                    <Badge variant="secondary" className="text-xs">Varsayılan</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-dashed">
                                        <CardContent className="h-full flex items-center justify-center p-6">
                                            <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center gap-2 py-8">
                                                <PlusCircle className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-sm font-medium">Yeni Adres Ekle</span>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
