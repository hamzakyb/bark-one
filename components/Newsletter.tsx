'use client';

import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';

export default function Newsletter() {
    return (
        <section
            id="newsletter"
            className="relative overflow-hidden py-32 text-white bg-[#0f0f0f]"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_1200px_at_10%_10%,rgba(255,255,255,0.12),transparent)]" />
            <div className="pointer-events-none absolute inset-x-0 top-14 mx-auto h-px max-w-4xl bg-linear-to-r from-transparent via-white/20 to-transparent" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-medium uppercase tracking-[0.35em] text-white/70"
                    >
                        Bülten
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mt-8 text-4xl md:text-5xl font-light leading-tight"
                    >
                        BarkOne bültenine kaydolun
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-6 text-lg font-light leading-relaxed text-white/70"
                    >
                        Yeni ürün duyurularını, stok güncellemelerini ve kampanyaları ilk siz öğrenin.
                    </motion.p>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            className="flex-1 rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/90 px-8 py-4 text-sm font-medium uppercase tracking-[0.35em] text-stone-900 transition-colors duration-300 hover:bg-white"
                        >
                            Abone Ol
                            <HiArrowRight className="h-5 w-5" />
                        </button>
                    </motion.form>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-6 text-xs uppercase tracking-[0.35em] text-white/50"
                    >
                        Her ay en fazla iki e-posta. Güvenli abonelik.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
