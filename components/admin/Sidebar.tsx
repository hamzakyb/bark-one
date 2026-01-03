'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Settings, Home, LogOut, Menu, Sparkles, Users } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Anasayfa', href: '/admin/home', icon: Home },
    { name: 'Ürünler', href: '/admin/products', icon: Package },
    { name: 'Siparişler', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Üyelikler', href: '/admin/users', icon: Users },
    { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { settings } = useSiteSettings();
    const [isMounted, setIsMounted] = useState(false);

    // Use useEffect to avoid hydration issues
    useEffect(() => {
        setTimeout(() => setIsMounted(true), 0);
    }, []);

    // Only show logo after component is mounted to avoid hydration issues
    const adminLogo = isMounted && settings?.adminLogo && typeof settings.adminLogo === 'string' && settings.adminLogo.trim().length > 0
        ? settings.adminLogo
        : null;

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <Card className="h-full border-0 shadow-none">
                            <CardContent className="flex h-full flex-col p-0">
                                {/* Logo */}
                                <div className="p-6 border-b border-slate-200/60">
                                    <Link href="/admin" className="flex flex-col items-center space-y-2">
                                        {adminLogo ? (
                                            <Image
                                                src={adminLogo}
                                                alt="Admin logosu"
                                                width={380}
                                                height={120}
                                                className="h-12 w-auto"
                                                priority
                                            />
                                        ) : (
                                            <span className="text-2xl font-light tracking-wider text-slate-900">
                                                bark<span className="font-semibold text-slate-600">One</span>
                                            </span>
                                        )}
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                            <Sparkles size={10} className="mr-1" />
                                            Yönetim Merkezi
                                        </Badge>
                                    </Link>
                                </div>

                                {/* Navigation */}
                                <nav className="flex-1 p-4 space-y-2">
                                    {sidebarItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Button
                                                key={item.name}
                                                asChild
                                                variant={isActive ? "default" : "ghost"}
                                                className={cn(
                                                    "w-full justify-start h-auto p-3",
                                                    isActive && "bg-slate-900 hover:bg-slate-800"
                                                )}
                                            >
                                                <Link href={item.href} className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "rounded-lg p-2",
                                                        isActive ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                                                    )}>
                                                        <item.icon size={16} />
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-medium">{item.name}</span>
                                                        <span className="text-xs text-slate-500">
                                                            {item.name === 'Dashboard' && 'Genel görünüm'}
                                                            {item.name === 'Anasayfa' && 'Site vitrinini düzenle'}
                                                            {item.name === 'Ürünler' && 'Envanter yönetimi'}
                                                            {item.name === 'Siparişler' && 'Sipariş akışı'}
                                                            {item.name === 'Ayarlar' && 'Panel ayarları'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </Button>
                                        );
                                    })}
                                </nav>

                                {/* Logout */}
                                <div className="p-4 border-t border-slate-200/">
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full justify-start gap-2 hover:bg-slate-100"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-white md:border-r md:border-slate-200/60 md:z-40">
                {/* Logo */}
                <div className="p-6 border-b border-slate-200/60">
                    <Link href="/admin" className="flex flex-col items-center space-y-2">
                        {adminLogo ? (
                            <Image
                                src={adminLogo}
                                alt="Admin logosu"
                                width={380}
                                height={120}
                                className="h-20 w-auto"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">B</span>
                                </div>
                                <span className="font-semibold text-3xl">BARK</span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Button
                                key={item.name}
                                asChild
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-auto p-3",
                                    isActive && "bg-slate-900 hover:bg-slate-800"
                                )}
                            >
                                <Link href={item.href} className="flex items-center gap-3">
                                    <div className={cn(
                                        "rounded-lg p-2",
                                        isActive ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                                    )}>
                                        <item.icon size={16} />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-xs text-slate-500">
                                            {item.name === 'Dashboard' && 'Genel görünüm'}
                                            {item.name === 'Anasayfa' && 'Site vitrinini düzenle'}
                                            {item.name === 'Ürünler' && 'Envanter yönetimi'}
                                            {item.name === 'Siparişler' && 'Sipariş akışı'}
                                            {item.name === 'Ayarlar' && 'Panel ayarları'}
                                        </span>
                                    </div>
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-200/">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start gap-2 hover:bg-slate-100"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </>
    );
};
