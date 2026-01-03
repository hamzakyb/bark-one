'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') return;

        // Check authentication
        const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';
        if (!isAuthenticated) {
            router.push('/admin/login');
        }
    }, [pathname, router]);

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 overflow-auto md:ml-64">
                <div className="px-4 py-6 md:px-8 md:py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
