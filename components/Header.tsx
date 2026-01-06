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
    { href: '/#inspiration', label: 'Galeri' },
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
                'fixed top-0 left-0 right-0 z-60 transition-all duration-500',
                isScrolled || forceSolidHeader
                    ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border/50'
                    : isTransparent
                        ? 'bg-transparent border-transparent'
                        : 'bg-background/80 backdrop-blur-md shadow-sm border-b border-border/20'
            )}
        >
            <div className="container px-4 mx-auto">
                <div className="flex items-center justify-between h-14 md:h-16">
                    {/* Left Section - Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            {siteLogoLight ? (
                                <Image
                                    src={siteLogoLight}
                                    alt="Site logosu"
                                    width={200}
                                    height={60}
                                    priority
                                    className="h-14 w-auto md:h-16"
                                />
                            ) : (
                                <span className={cn(
                                    "text-2xl md:text-3xl font-bold transition-colors",
                                    isTransparent ? "text-white" : "text-foreground"
                                )}>
                                    bark<span className={cn(isTransparent ? "text-white" : "text-primary")}>One</span>
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Center Section - Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1 px-4">
                        <nav className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.href}
                                    className="relative group/nav-item"
                                    whileHover="hover"
                                >
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className={cn(
                                            'relative text-sm font-medium rounded-full transition-colors duration-300',
                                            pathname === item.href
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25 border border-slate-800'
                                                : isTransparent
                                                    ? 'text-white group-hover/nav-item:text-black border border-white/20 hover:bg-transparent' // Transparent mode styles
                                                    : 'text-slate-700 hover:text-slate-900 border border-transparent hover:border-slate-200'
                                        )}
                                    >
                                        <Link href={item.href} className="relative z-10">
                                            {item.label}
                                        </Link>
                                    </Button>
                                    {pathname !== item.href && (
                                        <motion.div
                                            className={cn(
                                                "absolute inset-0 rounded-full opacity-0 group-hover/nav-item:opacity-100 transition-opacity duration-300",
                                                isTransparent ? "bg-white" : "bg-linear-to-r from-slate-100 to-slate-200"
                                            )}
                                            variants={{
                                                hover: { scale: 1.05, opacity: 1 },
                                                rest: { scale: 1, opacity: 0 }
                                            }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        />
                                    )}
                                    {pathname === item.href && (
                                        <motion.div
                                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full"
                                            layoutId="activeTab"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </nav>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Search */}
                        <div className="relative">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 180, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden"
                                    >
                                        <form onSubmit={handleSearch} className="flex">
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Ürün ara..."
                                                className="h-8 w-full rounded-l-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            />
                                            <Button type="submit" size="sm" variant="outline" className="h-8 rounded-l-none">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                onClick={() => {
                                    setIsSearchOpen(!isSearchOpen);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "h-8 w-8 rounded-full",
                                    isTransparent
                                        ? "bg-white text-black hover:bg-white/90"
                                        : "bg-transparent text-foreground hover:bg-accent"
                                )}
                            >
                                <Search className="h-4 w-4" />
                                <span className="sr-only">Ara</span>
                            </Button>
                        </div>

                        {/* Profile Button */}
                        {user ? (
                            <>
                                <Link href="/profile" className="flex items-center gap-2 group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-8 w-8 relative rounded-full",
                                            isTransparent
                                                ? "bg-white text-black hover:bg-white/90"
                                                : "text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background">
                                            <span className="sr-only">Çevrimiçi</span>
                                        </span>
                                        {user?.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="rounded-full h-6 w-6 object-cover"
                                            />
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                <User className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                        )}
                                        <span className="sr-only">Profil</span>
                                    </Button>
                                    <span className={cn(
                                        "hidden md:inline text-sm font-normal group-hover:underline",
                                        isTransparent ? "text-white" : "text-foreground"
                                    )}>
                                        {user.name.split(' ')[0]}
                                    </span>
                                </Link>

                                {/* Logout Button */}
                                <div className="ml-auto">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLogout}
                                        className={cn(
                                            "hidden md:flex items-center gap-1.5 text-xs",
                                            isTransparent
                                                ? "bg-white/10 text-white border-white/20 hover:bg-red-500 hover:text-white hover:border-red-500"
                                                : "text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        )}
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                        <span>Çıkış Yap</span>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(
                                        "hidden md:flex h-8 text-xs",
                                        isTransparent
                                            ? "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
                                            : ""
                                    )}
                                >
                                    <Link href="/login">Giriş Yap</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(
                                        "hidden md:flex h-8 text-xs",
                                        isTransparent
                                            ? "bg-white text-black hover:bg-white/90"
                                            : ""
                                    )}
                                >
                                    <Link href="/register">Üye Ol</Link>
                                </Button>
                                <div className="md:hidden">
                                    {isMounted && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn(
                                                        "h-8 w-8 rounded-full",
                                                        isTransparent
                                                            ? "bg-white text-black hover:bg-white/90"
                                                            : ""
                                                    )}
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span className="sr-only">Hesap</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link href="/login" className="w-full cursor-pointer">
                                                        <LogIn className="mr-2 h-4 w-4" />
                                                        <span>Giriş Yap</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href="/register" className="w-full cursor-pointer">
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        <span>Üye Ol</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Cart Button - Always visible */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 relative rounded-full",
                                isTransparent
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-transparent text-foreground hover:bg-accent"
                            )}
                            asChild
                        >
                            <Link href="/cart">
                                <ShoppingCart className="h-4 w-4" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                                <span className="sr-only">Sepetim</span>
                            </Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        {isMounted && (
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "md:hidden h-8 w-8 rounded-full",
                                            isTransparent
                                                ? "bg-white text-black hover:bg-white/90"
                                                : "bg-transparent text-foreground hover:bg-accent"
                                        )}
                                    >
                                        <Menu className="h-4 w-4" />
                                        <span className="sr-only">Menüyü Aç</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between p-4 border-b">
                                            <Link
                                                href="/"
                                                className="text-lg font-bold"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {siteLogoLight ? (
                                                    <Image
                                                        src={siteLogoLight}
                                                        alt="Site logosu"
                                                        width={100}
                                                        height={32}
                                                        className="h-8 w-auto"
                                                    />
                                                ) : (
                                                    <span className="text-foreground">
                                                        bark<span className="text-primary">One</span>
                                                    </span>
                                                )}
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Menüyü Kapat</span>
                                            </Button>
                                        </div>

                                        <nav className="flex-1 p-4 space-y-2">
                                            {navItems.map((item) => (
                                                <Button
                                                    key={item.href}
                                                    asChild
                                                    variant="ghost"
                                                    className={cn(
                                                        'block py-2 px-4 text-sm',
                                                        pathname === item.href ? 'bg-accent text-black' : 'hover:bg-accent/50 hover:text-black text-black'
                                                    )}
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    <Link href={item.href}>{item.label}</Link>
                                                </Button>
                                            ))}
                                        </nav>

                                        <div className="border-t p-4 space-y-2">
                                            {user ? (
                                                <>
                                                    <div className="flex items-center space-x-3 p-2 rounded-md bg-accent/50">
                                                        <div className="shrink-0">
                                                            {user.avatar ? (
                                                                <Image
                                                                    src={user.avatar}
                                                                    alt={user.name}
                                                                    width={36}
                                                                    height={36}
                                                                    className="h-9 w-9 rounded-full"
                                                                />
                                                            ) : (
                                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <User className="h-4.5 w-4.5 text-primary" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium truncate">{user.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => {
                                                            router.push('/profile');
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        <User className="mr-2 h-4 w-4" />
                                                        Profilim
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start text-red-500 hover:text-red-600"
                                                        onClick={() => {
                                                            void handleLogout();
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        Çıkış Yap
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={() => {
                                                            router.push('/login');
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        Giriş Yap
                                                    </Button>
                                                    <Button
                                                        className="w-full"
                                                        onClick={() => {
                                                            router.push('/register');
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        Üye Ol
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        )}
                    </div>
                </div>
            </div>
        </header >
    );
}