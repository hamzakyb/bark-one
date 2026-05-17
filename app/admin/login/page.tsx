'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simple authentication
        if (username === 'admin' && password === 'barkone2024') {
            localStorage.setItem('adminAuth', 'true');
            router.push('/admin');
        } else {
            setError('Kullanıcı adı veya şifre hatalı');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-900 to-stone-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-anthracite mb-2">
                        bark<span className="text-wood-500">One</span>
                    </h1>
                    <p className="text-gray-500">Admin Paneli</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kullanıcı Adı
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-wood-500 focus:ring-2 focus:ring-wood-100 outline-none transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Şifre
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-wood-500 focus:ring-2 focus:ring-wood-100 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-wood-500 hover:bg-wood-600 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>


            </div>
        </div>
    );
}
