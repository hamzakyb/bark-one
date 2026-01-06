'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Search, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
    { href: '/', label: 'Anasayfa' },
    { href: '/products', label: 'Ürünler' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/contact', label: 'İletişim' },
] as const;

type UserType = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
};

export default function Header() {
    const [isMounted, setIsMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<UserType | null>(null);
    const { totalItems } = useCart();
    const router = useRouter();
    const pathname = usePathname();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { settings } = useSiteSettings();

    const siteLogoLight = settings?.siteLogoLight?.toString().trim() || null;

    useEffect(() => {
        setIsMounted(true);

        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                if (data?.success && data?.data) {
                    setUser({ id: data.data.id, name: data.data.name, email: data.data.email });
                }
            } catch {
                // sessiz geç
            }
        };

        void loadUser();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            setIsMenuOpen(false);
        } finally {
            router.push('/');
        }
    };

    const forceSolidHeader = pathname === '/login' || pathname === '/register' || pathname === '/profile';
    const isHomePage = pathname === '/';
    const isTransparent = isHomePage && !isScrolled && !forceSolidHeader;

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
                isScrolled || forceSolidHeader
                    ? 'bg-white/80 backdrop-blur-md border-b border-stone-200/50 py-2'
                    : isTransparent
                        ? 'bg-transparent border-transparent py-4'
                        : 'bg-white/80 backdrop-blur-md shadow-sm border-b border-stone-200/50 py-2'
            )}
        >
            <div className="container px-6 mx-auto">
                <div className="flex items-center justify-between h-14 md:h-16">
                    {/* Left Section - Logo */}
                    <div className="flex items-center w-[200px]">
                        <Link href="/" className="flex items-center group">
                            {siteLogoLight ? (
                                <Image
                                    src={siteLogoLight}
                                    alt="Site logosu"
                                    width={200}
                                    height={60}
                                    priority
                                    className="h-12 w-auto md:h-14 transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <span className={cn(
                                    "text-2xl md:text-3xl font-serif font-bold tracking-tight transition-colors duration-300",
                                    isTransparent ? "text-white" : "text-stone-900"
                                )}>
                                    bark<span className={cn("font-light", isTransparent ? "text-white/80" : "text-stone-500")}>One</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Center Section - Navigation (Redesigned) */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <nav className="flex items-center gap-8 lg:gap-12">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "relative group py-2 text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-300",
                                        pathname === item.href
                                            ? isTransparent ? "text-white" : "text-stone-900"
                                            : isTransparent
                                                ? "text-white/80 hover:text-white"
                                                : "text-stone-500 hover:text-stone-900"
                                    )}
                                >
                                    {item.label}
                                    {/* Animated Underline */}
                                    <span className={cn(
                                        "absolute bottom-0 left-0 w-full h-[2px] transform scale-x-0 transition-transform duration-300 ease-out origin-left group-hover:scale-x-100",
                                        pathname === item.href ? "scale-x-100" : "",
                                        isTransparent ? "bg-white" : "bg-stone-900"
                                    )} />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center justify-end gap-2 md:gap-4 w-[200px]">
                        {/* Search */}
                        <div className="relative">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 180, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden bg-white rounded-full shadow-lg"
                                    >
                                        <form onSubmit={handleSearch} className="flex items-center pr-2">
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Ara..."
                                                className="h-9 w-full bg-transparent px-4 text-xs tracking-wide focus:outline-none placeholder:text-stone-400"
                                            />
                                            <Button type="submit" size="sm" variant="ghost" className="h-7 w-7 rounded-full p-0 hover:bg-stone-100">
                                                <Search className="h-3 w-3" />
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "h-10 w-10 rounded-full transition-colors duration-300",
                                    isTransparent
                                        ? "bg-white text-stone-900 hover:bg-stone-200"
                                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                )}
                            >
                                <Search className="h-5 w-5 stroke-[1.5]" />
                            </Button>
                        </div>

                        {/* Profile & Auth */}
                        <div className="hidden md:flex items-center">
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={cn(
                                                "h-10 w-10 rounded-full transition-colors duration-300",
                                                isTransparent
                                                    ? "bg-white text-stone-900 hover:bg-stone-200"
                                                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                            )}
                                        >
                                            <User className="h-5 w-5 stroke-[1.5]" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-stone-100 bg-white/95 backdrop-blur-md">
                                        <div className="px-2 py-1.5 mb-1 border-b border-stone-100">
                                            <p className="text-sm font-medium text-stone-900">{user.name}</p>
                                            <p className="text-xs text-stone-500 truncate">{user.email}</p>
                                        </div>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer rounded-lg hover:bg-stone-50">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profilim</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-500 focus:text-red-500 focus:bg-red-50 rounded-lg cursor-pointer"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Çıkış Yap</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-10 w-10 rounded-full transition-colors duration-300",
                                        isTransparent
                                            ? "bg-white text-stone-900 hover:bg-stone-200"
                                            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                    )}
                                >
                                    <Link href="/login">
                                        <User className="h-5 w-5 stroke-[1.5]" />
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {/* Cart Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className={cn(
                                "h-10 w-10 relative rounded-full transition-colors duration-300",
                                isTransparent
                                    ? "bg-white text-stone-900 hover:bg-stone-200"
                                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                            )}
                        >
                            <Link href="/cart">
                                <ShoppingCart className="h-5 w-5 stroke-[1.5]" />
                                {totalItems > 0 && (
                                    <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                                )}
                            </Link>
                        </Button>

                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 rounded-full transition-colors duration-300",
                                            isTransparent
                                                ? "bg-white text-stone-900 hover:bg-stone-200"
                                                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                                        )}
                                    >
                                        <Menu className="h-6 w-6 stroke-[1.5]" />
                                    </Button>
                                </SheetTrigger>
                                {/* Hide default close button with [&>button]:hidden */}
                                <SheetContent side="right" className="w-[300px] border-l-stone-100 bg-white/95 backdrop-blur-xl p-0 [&>button]:hidden">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between p-6 border-b border-stone-100">
                                            {/* Mobile Menu Logo */}
                                            <div className="flex items-center">
                                                {siteLogoLight ? (
                                                    <Image
                                                        src={siteLogoLight}
                                                        alt="Site logosu"
                                                        width={120}
                                                        height={40}
                                                        className="h-8 w-auto filter grayscale opacity-90"
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-serif font-bold text-stone-900">
                                                        bark<span className="font-light text-stone-500">One</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Custom Close Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-full"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <nav className="flex-1 px-6 py-8 space-y-6">
                                            {navItems.map((item) => (
                                                <div key={item.href}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={cn(
                                                            "text-2xl font-serif font-medium block transition-colors duration-300",
                                                            pathname === item.href ? "text-stone-900" : "text-stone-400 hover:text-stone-900"
                                                        )}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </div>
                                            ))}
                                        </nav>

                                        <div className="p-6 border-t border-stone-100 space-y-4">
                                            {user ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3 px-2">
                                                        {user.avatar ? (
                                                            <Image
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                width={40}
                                                                height={40}
                                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-stone-100"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center">
                                                                <User className="h-5 w-5 text-stone-500" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-stone-900">{user.name}</p>
                                                            <p className="text-xs text-stone-500">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="w-full justify-start rounded-xl h-11 border-stone-200 hover:bg-stone-50" onClick={() => router.push('/profile')}>
                                                        <User className="mr-3 h-4 w-4" /> Profilim
                                                    </Button>
                                                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl h-11" onClick={handleLogout}>
                                                        <LogOut className="mr-3 h-4 w-4" /> Çıkış Yap
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Button variant="outline" className="rounded-xl h-11 border-stone-200 hover:bg-stone-50" onClick={() => router.push('/login')}>
                                                        Giriş
                                                    </Button>
                                                    <Button className="rounded-xl h-11 bg-stone-900 text-white hover:bg-stone-800" onClick={() => router.push('/register')}>
                                                        Üye Ol
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}