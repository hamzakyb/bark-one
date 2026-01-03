'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Eye, CheckCircle, XCircle, Truck, Package } from 'lucide-react';

interface Order {
    _id: string;
    orderNumber: string;
    customer: {
        name: string;
        surname: string;
        email: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'PaymentReceived': return 'bg-blue-100 text-blue-800';
            case 'Shipped': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'Pending': return 'Bekliyor';
            case 'PaymentReceived': return 'Ödeme Alındı';
            case 'Shipped': return 'Kargolandı';
            case 'Delivered': return 'Teslim Edildi';
            case 'Cancelled': return 'İptal';
            default: return status;
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-anthracite mb-8">Siparişler</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-500">Sipariş No</th>
                                <th className="p-4 font-medium text-gray-500">Müşteri</th>
                                <th className="p-4 font-medium text-gray-500">Tutar</th>
                                <th className="p-4 font-medium text-gray-500">Tarih</th>
                                <th className="p-4 font-medium text-gray-500">Durum</th>
                                <th className="p-4 font-medium text-gray-500">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-anthracite">
                                        <Link href={`/admin/orders/${order._id}`} className="hover:text-wood-500 hover:underline">
                                            {order.orderNumber}
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium">{order.customer.name} {order.customer.surname}</div>
                                        <div className="text-sm text-gray-400">{order.customer.email}</div>
                                    </td>
                                    <td className="p-4 font-bold text-wood-500">
                                        {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.totalAmount)}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-wood-500"
                                        >
                                            <option value="Pending">Bekliyor</option>
                                            <option value="PaymentReceived">Ödeme Alındı</option>
                                            <option value="Shipped">Kargolandı</option>
                                            <option value="Delivered">Teslim Edildi</option>
                                            <option value="Cancelled">İptal</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-gray-500">Henüz sipariş bulunmuyor.</div>
                )}
            </div>
        </div>
    );
}
