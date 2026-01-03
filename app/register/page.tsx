'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useSiteSettings } from '@/context/SiteSettingsContext';

export default function RegisterPage() {
    const router = useRouter();
    const { settings } = useSiteSettings();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Password validation
        if (password !== confirmPassword) {
            const errorMessage = 'Şifreler eşleşmiyor';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            const errorMessage = 'Şifre en az 6 karakter olmalıdır';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                const errorMessage = data.error || 'Kayıt işlemi başarısız';
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                toast.success('Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.');
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            }
        } catch {
            const errorMessage = 'Beklenmeyen bir hata oluştu';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 flex items-start justify-center p-4 pt-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center text-white">
                        {settings?.siteLogoDark ? (
                            <div className="relative w-32 h-32">
                                <Image
                                    src={settings.siteLogoDark as string}
                                    alt="BarkOne Logo"
                                    fill

                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                    BARK
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kayıt Formu */}
                <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-semibold text-white mb-2">
                            Hesap Oluştur
                        </CardTitle>
                        <p className="text-slate-400">
                            Premium üyeliğe katılın
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300 text-sm font-medium">
                                    Ad Soyad
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-slate-600"
                                        placeholder="Adınız Soyadınız"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
                                    E-posta Adresi
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-slate-600"
                                        placeholder="ornek@eposta.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                                    Şifre
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-slate-600"
                                        placeholder="En az 6 karakter"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">
                                    Şifre Tekrar
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-slate-600 focus:ring-slate-600"
                                        placeholder="Şifrenizi tekrar girin"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-900/20 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Kayıt yapılıyor...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Hesap Oluştur
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Separator className="flex-1 bg-slate-700" />
                                <span className="text-xs text-slate-500">veya</span>
                                <Separator className="flex-1 bg-slate-700" />
                            </div>

                            <div className="text-center space-y-3">
                                <p className="text-sm text-slate-400">
                                    Zaten hesabınız var mı?{' '}
                                    <Link 
                                        href="/login" 
                                        className="text-white hover:text-slate-300 font-medium transition-colors"
                                    >
                                        Giriş Yap
                                    </Link>
                                </p>
                                
                                <p className="text-xs text-slate-500">
                                    Kayıt olarak{' '}
                                    <Link href="#" className="text-slate-400 hover:text-slate-300 underline">
                                        Kullanım Koşulları
                                    </Link>{' '}
                                    ve{' '}
                                    <Link href="#" className="text-slate-400 hover:text-slate-300 underline">
                                        Gizlilik Politikası
                                    </Link>
                                    &apos;nı kabul etmiş olursunuz.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
