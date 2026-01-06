'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Facebook, LucideIcon, ArrowRight, Package, Shield, HelpCircle, FileText, Heart } from 'lucide-react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const quickLinks = [
    { href: '/#products', label: 'Ürünler', icon: Package },
    { href: '/#inspiration', label: 'Galeri', icon: FileText },
    { href: '/about', label: 'Hakkımızda', icon: Shield },
    { href: '/contact', label: 'İletişim', icon: HelpCircle }
];

const supportLinks = [
    { href: '#', label: 'Sipariş Takibi' },
    { href: '#', label: 'İade ve Değişim' },
    { href: '#', label: 'Kargo Bilgileri' },
    { href: '#', label: 'SSS' }
];

export default function Footer() {
    const { settings } = useSiteSettings();
    const siteLogoDark =
        typeof settings?.siteLogoDark === 'string' && settings.siteLogoDark.trim().length > 0
            ? settings.siteLogoDark
            : null;

    return (
        <footer className="mt-auto bg-linear-to-br from-slate-50 to-white border-t border-slate-200">
            <div className="container mx-auto px-4 py-6">
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                    {/* Brand Section */}
                    <div className="space-y-3">
                        <Link href="/" className="inline-flex items-center gap-3">
                            {siteLogoDark ? (
                                <Image
                                    src={siteLogoDark}
                                    alt="Site logosu"
                                    width={240}
                                    height={72}
                                    className="h-12 w-auto"
                                    priority
                                />
                            ) : (
                                <span className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                    bark<span className="text-slate-400">One</span>
                                </span>
                            )}
                        </Link>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-xs">
                            Doğal dokularla rafine tasarım arasında köprü kurarak her yaşam alanına zamansız bir estetik katıyoruz.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-2">
                            {settings?.socialMedia?.instagram && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 rounded-full border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 hover:scale-110 transition-all duration-300"
                                >
                                    <a href={settings.socialMedia.instagram} aria-label="Instagram">
                                        <Instagram className="h-3 w-3 text-slate-600" />
                                    </a>
                                </Button>
                            )}
                            {settings?.socialMedia?.facebook && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 rounded-full border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 hover:scale-110 transition-all duration-300"
                                >
                                    <a href={settings.socialMedia.facebook} aria-label="Facebook">
                                        <Facebook className="h-3 w-3 text-slate-600" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                Hızlı Linkler
                            </h4>
                            <ul className="space-y-2">
                                {quickLinks.map(({ href, label, icon: Icon }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="group flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-all duration-300"
                                        >
                                            <Icon className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                {label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                Destek
                            </h4>
                            <ul className="space-y-2">
                                {supportLinks.map(({ href, label }) => (
                                    <li key={label}>
                                        <a
                                            href={href}
                                            className="group flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 transition-all duration-300"
                                        >
                                            <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                {label}
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Contact Section - No Card */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-400 rounded-full" />
                            İletişim
                        </h4>
                        <div className="space-y-2">
                            <div className="group flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200">
                                    <Mail className="h-3 w-3 text-slate-600" />
                                </div>
                                <a href={`mailto:${settings?.contactEmailPrimary || 'info@barkone.com'}`} className="text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors">
                                    {settings?.contactEmailPrimary || 'info@barkone.com'}
                                </a>
                            </div>

                            <div className="group flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200">
                                    <Phone className="h-3 w-3 text-slate-600" />
                                </div>
                                <a href={`tel:${settings?.contactPhone || '+905551234567'}`} className="text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors">
                                    {settings?.contactPhone || '+90 555 123 45 67'}
                                </a>
                            </div>

                            <div className="group flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-300">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200">
                                    <MapPin className="h-3 w-3 text-slate-600" />
                                </div>
                                <span className="text-xs font-medium text-slate-900">
                                    {settings?.contactAddress || 'İstanbul, Türkiye'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <Separator className="bg-slate-200 mb-4" />

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-slate-300 text-slate-600 text-xs px-2 py-0.5 h-5">
                            &copy; {new Date().getFullYear()}
                        </Badge>
                        <span className="text-xs text-slate-600 flex items-center gap-1">
                            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by barkOne
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-300 font-medium">
                            Gizlilik Politikası
                        </a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-300 font-medium">
                            Kullanım Koşulları
                        </a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-700 transition-colors duration-300 font-medium">
                            KVKK
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
