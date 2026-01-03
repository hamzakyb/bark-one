'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Calendar, Shield, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
    name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    surname: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır'),
});

type ContactForm = z.infer<typeof contactSchema>;

const DEFAULT_SETTINGS = {
    contactHeroBadge: 'Müşteri Destek Ekibi',
    contactHeroTitle: 'İletişim',
    contactHeroSubtitle: 'Sorularınız, önerileriniz veya özel sipariş talepleriniz için bizimle iletişime geçin.',
    contactHeroDescription: 'Sipariş süreçleri, teslimat planlaması ve ürün soruları için destek ekibimiz yanınızda. Telefon, e-posta veya randevu seçeneklerinden dilediğinizi tercih edebilirsiniz.',
    contactHeroImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2000&auto=format&fit=crop',
    contactEmailPrimary: 'info@barkone.com',
    contactEmailSecondary: 'destek@barkone.com',
    contactPhone: '+90 555 123 45 67',
    contactPhoneHours: 'Hafta içi 09:00 - 18:00',
    contactAddress: 'Mobilyacılar Sitesi, A Blok No: 12, Ümraniye, İstanbul',
    contactMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.981274921595!2d29.11467167674907!3d41.02963537134786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e99389c9bb%3A0xf65794048bb2c0d7!2s%C3%9Cmran%C4%B0ye%20Mobilyac%C4%B1lar%20Sitesi!5e0!3m2!1str!2str!4v1732302560000!5m2!1str!2str',
};

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errors, setErrors] = useState<Partial<ContactForm>>({});
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        surname: '',
        email: '',
        message: '',
    });
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                if (!response.ok) throw new Error('Failed to load settings');
                const data = await response.json();
                setSettings((prev) => ({ ...prev, ...data }));
            } catch (error) {
                console.error('Error fetching contact settings:', error);
            }
        };
        void loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            contactSchema.parse(formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsSent(true);
            setFormData({ name: '', surname: '', email: '', message: '' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<ContactForm> = {};
                error.issues.forEach(err => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as keyof ContactForm] = err.message;
                    }
                });
                setErrors(fieldErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof ContactForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const contactEmails = [settings.contactEmailPrimary, settings.contactEmailSecondary].filter(Boolean);
    const contactPhone = settings.contactPhone || DEFAULT_SETTINGS.contactPhone;
    const contactAddress = settings.contactAddress || DEFAULT_SETTINGS.contactAddress;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-slate-900/10 to-transparent" />
                <div className="container mx-auto px-4 py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <Badge className="w-fit px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 border-slate-200">
                                {settings.contactHeroBadge}
                            </Badge>

                            <div className="space-y-4">
                                <h1 className="text-4xl lg:text-6xl font-bold bg-linear-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                                    {settings.contactHeroTitle}
                                </h1>
                                <p className="text-lg lg:text-xl text-slate-600 font-light">
                                    {settings.contactHeroSubtitle}
                                </p>
                            </div>

                            <p className="text-slate-600 leading-relaxed max-w-2xl">
                                {settings.contactHeroDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {contactPhone}
                                </Button>
                                <Button size="lg" variant="outline">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {settings.contactEmailPrimary}
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={settings.contactHeroImage}
                                    alt="İletişim"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-linear-to-br from-slate-900/20 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-2"
                        >
                            <Card className="border-slate-200 bg-white shadow-lg">
                                <CardHeader className="p-8 pb-6">
                                    <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                        <MessageSquare className="h-6 w-6 text-slate-600" />
                                        Mesaj Gönder
                                    </CardTitle>
                                    <p className="text-slate-600">
                                        Sorularınız ve talepleriniz için bize yazın, en kısa sürede size geri döneceğiz.
                                    </p>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    {isSent ? (
                                        <div className="text-center py-12 space-y-4">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                                <Send className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900">Mesajınız Gönderildi!</h3>
                                            <p className="text-slate-600">En kısa sürede size geri döneceğiz.</p>
                                            <Button onClick={() => setIsSent(false)} variant="outline">
                                                Yeni Mesaj Gönder
                                            </Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                                        Adınız
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                        placeholder="Adınızı girin"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-500">{errors.name}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="surname" className="text-sm font-medium text-slate-700">
                                                        Soyadınız
                                                    </Label>
                                                    <Input
                                                        id="surname"
                                                        type="text"
                                                        value={formData.surname}
                                                        onChange={(e) => handleInputChange('surname', e.target.value)}
                                                        placeholder="Soyadınızı girin"
                                                        className={errors.surname ? 'border-red-500' : ''}
                                                    />
                                                    {errors.surname && (
                                                        <p className="text-sm text-red-500">{errors.surname}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                    E-posta Adresiniz
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    placeholder="E-posta adresinizi girin"
                                                    className={errors.email ? 'border-red-500' : ''}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                                                    Mesajınız
                                                </Label>
                                                <Textarea
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                                    placeholder="Mesajınızı buraya yazın..."
                                                    rows={6}
                                                    className={errors.message ? 'border-red-500' : ''}
                                                />
                                                {errors.message && (
                                                    <p className="text-sm text-red-500">{errors.message}</p>
                                                )}
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                                size="lg"
                                            >
                                                {isLoading ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Gönderiliyor...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Send className="h-4 w-4" />
                                                        Mesajı Gönder
                                                    </div>
                                                )}
                                            </Button>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Quick Contact */}
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-6">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Hızlı İletişim
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-4">
                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200">
                                            <Phone className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">Telefon</h4>
                                            <a href={`tel:${contactPhone.replace(/[^\d+]/g, '')}`} className="text-slate-600 hover:text-slate-900 transition-colors">
                                                {contactPhone}
                                            </a>
                                            <p className="text-sm text-slate-500">{settings.contactPhoneHours}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200">
                                            <Mail className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">E-posta</h4>
                                            {contactEmails.map((email) => (
                                                <a
                                                    key={email}
                                                    href={`mailto:${email}`}
                                                    className="block text-slate-600 hover:text-slate-900 transition-colors"
                                                >
                                                    {email}
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200">
                                            <MapPin className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">Adres</h4>
                                            <p className="text-slate-600">{contactAddress}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Hours */}
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-6">
                                    <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-slate-600" />
                                        Çalışma Saatleri
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Pazartesi - Cuma</span>
                                            <span className="font-medium text-slate-900">09:00 - 18:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Cumartesi</span>
                                            <span className="font-medium text-slate-900">10:00 - 16:00</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Pazar</span>
                                            <span className="font-medium text-slate-900">Kapalı</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader className="p-6">
                                    <CardTitle className="text-lg font-semibold text-slate-900">
                                        Hızlı İşlemler
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Randevu Talep Et
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <HelpCircle className="h-4 w-4 mr-2" />
                                        SSS
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Shield className="h-4 w-4 mr-2" />
                                        Garanti ve Destek
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Konumumuz
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            İstanbul&apos;un merkezinde, kolay ulaşılabilir konumumuzda sizi bekliyoruz.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div className="aspect-video bg-slate-200 rounded-2xl flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600">Harita yükleniyor...</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
