'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSiteSettings } from '@/context/SiteSettingsContext';

const contactSchema = z.object({
    name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır'),
});

type ContactForm = z.infer<typeof contactSchema>;

const DEFAULT_SETTINGS = {
    contactHeroBadge: 'İletişim',
    contactHeroTitle: 'Bize Ulaşın',
    contactHeroSubtitle: 'Projeleriniz, sorularınız veya sadece merhaba demek için.',
    contactEmailPrimary: 'info@barkone.com',
    contactPhone: '+90 555 123 45 67',
    contactAddress: 'Mobilyacılar Sitesi, A Blok, Ümraniye/İstanbul',
    contactMapEmbedUrl: 'https://www.google.com/maps/embed?pb=...'
};

export default function ContactPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errors, setErrors] = useState<Partial<ContactForm>>({});
    const [formData, setFormData] = useState<ContactForm>({
        name: '',
        email: '',
        message: '',
    });
    const { settings } = useSiteSettings();
    const [contactSettings, setContactSettings] = useState(DEFAULT_SETTINGS);

    useEffect(() => {
        // Hydrate settings
        if (settings) {
            setContactSettings(prev => ({ ...prev, ...settings }));
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            contactSchema.parse(formData);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSent(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Partial<ContactForm> = {};
                error.issues.forEach(err => {
                    if (err.path[0]) fieldErrors[err.path[0] as keyof ContactForm] = err.message;
                });
                setErrors(fieldErrors);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof ContactForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Left Column: Context & Info (Sticky on Desktop) */}
                <div className="w-full lg:w-5/12 relative bg-stone-900 text-white lg:min-h-screen p-8 lg:p-20 flex flex-col justify-between overflow-hidden">
                    {/* Background Texture/Image */}
                    <div className="absolute inset-0 opacity-40 bg-[url('/images/luxury-bg.png')] bg-cover bg-center mix-blend-overlay" />
                    <div className="absolute inset-0 bg-stone-900/50" />

                    <div className="relative z-10 pt-24 lg:pt-12">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block py-1 px-3 border border-white/20 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium mb-8"
                        >
                            {contactSettings.contactHeroBadge}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-7xl font-serif mb-8 leading-tight"
                        >
                            {contactSettings.contactHeroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-stone-400 text-lg font-light leading-relaxed max-w-sm"
                        >
                            {contactSettings.contactHeroSubtitle}
                        </motion.p>
                    </div>

                    <div className="relative z-10 mt-16 space-y-12">
                        <div className="space-y-6">
                            <div className="group">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Adres</h3>
                                <p className="text-xl font-serif text-stone-300 group-hover:text-white transition-colors">{contactSettings.contactAddress}</p>
                            </div>
                            <div className="group">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Telefon</h3>
                                <p className="text-xl font-serif text-stone-300 group-hover:text-white transition-colors">{contactSettings.contactPhone}</p>
                            </div>
                            <div className="group">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">E-posta</h3>
                                <p className="text-xl font-serif text-stone-300 group-hover:text-white transition-colors">{contactSettings.contactEmailPrimary}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Social Placeholders if needed */}
                        </div>
                    </div>
                </div>

                {/* Right Column: Form (Scrollable) */}
                <div className="w-full lg:w-7/12 bg-stone-50 p-8 lg:p-24 flex items-center justify-center">
                    <div className="w-full max-w-xl py-12 lg:py-0">
                        <div className="mb-12">
                            <h2 className="text-3xl font-serif text-stone-900 mb-4">Size nasıl yardımcı olabiliriz?</h2>
                            <p className="text-stone-500 font-light">Formu doldurun, tasarım ekibimiz en kısa sürede sizinle iletişime geçsin.</p>
                        </div>

                        {isSent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-12 rounded-sm border border-stone-200 text-center shadow-sm"
                            >
                                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-6 h-6 text-stone-900" />
                                </div>
                                <h3 className="text-2xl font-serif text-stone-900 mb-2">Teşekkürler</h3>
                                <p className="text-stone-500 mb-8">Mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.</p>
                                <Button onClick={() => setIsSent(false)} variant="outline" className="border-stone-200 text-stone-900 hover:bg-stone-50">
                                    Yeni Mesaj
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="group space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Adınız Soyadınız</label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="border-0 border-b border-stone-200 rounded-none px-0 py-4 h-auto bg-transparent focus-visible:ring-0 focus-visible:border-stone-900 placeholder:text-stone-300 text-lg transition-colors"
                                        placeholder="Adınız Soyadınız"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">E-posta Adresi</label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="border-0 border-b border-stone-200 rounded-none px-0 py-4 h-auto bg-transparent focus-visible:ring-0 focus-visible:border-stone-900 placeholder:text-stone-300 text-lg transition-colors"
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="group space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Mesajınız</label>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        className="border-0 border-b border-stone-200 rounded-none px-0 py-4 min-h-[150px] bg-transparent focus-visible:ring-0 focus-visible:border-stone-900 placeholder:text-stone-300 text-lg resize-none transition-colors"
                                        placeholder="Projenizden bahsedin..."
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <div className="pt-8">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-16 px-12 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold tracking-[0.2em] uppercase w-full sm:w-auto transition-all duration-300"
                                    >
                                        {isLoading ? "Gönderiliyor..." : "Mesajı Gönder"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Optional Map Strip */}
            <div className="h-64 w-full bg-stone-200 grayscale opacity-80">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.981274921595!2d29.11467167674907!3d41.02963537134786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7e99389c9bb%3A0xf65794048bb2c0d7!2s%C3%9Cmran%C4%B0ye%20Mobilyac%C4%B1lar%20Sitesi!5e0!3m2!1str!2str!4v1732302560000!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full filter grayscale"
                />
            </div>
        </div>
    );
}
