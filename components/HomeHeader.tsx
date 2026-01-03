'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomeHeader() {
    return (
        <div className="text-center mb-20">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-light text-anthracite mb-4 tracking-tight"
            >
                Doğal Dokunuşlar,<br />Modern Çizgiler
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-2xl mb-10 text-gray-200 font-light max-w-2xl mx-auto"
            >
                Evinizin havasını değiştirecek minimalist duvar rafları.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <Link
                    href="#products"
                    className="bg-wood-500 hover:bg-wood-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all hover:shadow-lg hover:-translate-y-1 inline-block"
                >
                    Ürünleri Keşfet
                </Link>
            </motion.div>
        </div>
    );
}
