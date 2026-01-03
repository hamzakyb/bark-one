'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users, Mail, ShoppingBag, Edit, Trash2, Shield, User, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    orderCount: number;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setUsers(data.data as AdminUser[]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        void fetchUsers();
    }, []);

    const handleEdit = (user: AdminUser) => {
        setEditingUser({ ...user });
    };

    const handleSave = async () => {
        if (!editingUser) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingUser.id,
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setUsers(users.map(u => u.id === editingUser.id ? data.data : u));
                setEditingUser(null);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (data.success) {
                setUsers(users.filter(u => u.id !== userId));
            } else {
                alert(data.error || 'Silme işlemi başarısız');
            }
        } catch (error) {
            alert('Silme işlemi başarısız');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full min-height-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-wood-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-linear-to-br from-white via-white to-stone-50 p-10 shadow-[0_35px_120px_-70px_rgba(15,15,15,0.35)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_900px_at_-10%_-20%,rgba(214,162,88,0.18),transparent_65%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_1100px_at_110%_120%,rgba(59,130,246,0.18),transparent_70%)]" />
                <div className="relative space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.38em] text-wood-500 backdrop-blur-md">
                        Üye Yönetimi
                    </span>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-light text-anthracite md:text-[38px]">Üyeler</h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-stone-500 md:text-base">
                            Siteye kayıt olan tüm kullanıcıları, rollerini ve verdikleri sipariş sayılarını buradan yönetebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
                    <Card className="relative w-full max-w-md mx-4 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-anthracite">Kullanıcı Düzenle</h2>
                                <Button
                                    onClick={() => setEditingUser(null)}
                                    variant="ghost"
                                    size="icon"
                                >
                                    <X size={20} />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Ad Soyad</Label>
                                    <Input
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-posta</Label>
                                    <Input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Rol</Label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="user">Kullanıcı</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button
                                    onClick={() => setEditingUser(null)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    İptal
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-1"
                                >
                                    {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                                    Kaydet
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="rounded-[26px] border border-stone-200 bg-white/95 p-6 shadow-[0_20px_80px_-48px_rgba(20,20,20,0.35)]">
                {users.length === 0 ? (
                    <p className="text-sm text-stone-500">Henüz kayıtlı bir üye bulunmuyor.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-white/90 p-5 shadow-[0_20px_60px_-50px_rgba(20,20,20,0.45)]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="inline-flex items-center gap-1 rounded-full border border-stone-200/80 bg-stone-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500">
                                                <Users size={14} /> Üye
                                            </div>
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                {user.role === 'admin' ? (
                                                    <><Shield size={12} className="mr-1" />Admin</>
                                                ) : (
                                                    <><User size={12} className="mr-1" />Kullanıcı</>
                                                )}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-anthracite">{user.name}</p>
                                            <p className="flex items-center gap-1.5 text-xs text-stone-500">
                                                <Mail size={13} />
                                                <span className="truncate">{user.email}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-700">
                                            <ShoppingBag size={13} />
                                            {user.orderCount}
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                onClick={() => handleEdit(user)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(user.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
