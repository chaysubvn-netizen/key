'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Key, Shield, DollarSign } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminOverview() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_products: 0, // Note: You'll need to update API/functions.php if you want this specific count, or rely on licenses count if that's what was intended. 
        // Looking at get_admin_stats in api_backend, it returns 'total_users', 'total_licenses', 'total_revenue'.
        // Wait, get_admin_stats in functions.php returns 'total_users', 'total_licenses', 'total_revenue'.
        // I should fix the frontend state to match what is returned.
        total_licenses: 0,
        total_revenue: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await apiRequest('get_admin_stats', {}, 'GET');
                if (res.status === 'success') {
                    setStats(res.data);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Bảng Điều Khiển Admin</h1>
                <p className="text-zinc-400">Tổng quan hệ thống và thống kê.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 italic">Tổng Người Dùng</CardTitle>
                        <Users className="text-blue-500" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold italic">
                            {isLoading ? '...' : stats.total_users}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 italic">Tổng Doanh Thu</CardTitle>
                        <DollarSign className="text-emerald-500" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold italic">
                            {isLoading ? '...' : Number(stats.total_revenue).toLocaleString('vi-VN')} VNĐ
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400 italic">License Hoạt Động</CardTitle>
                        <Key className="text-red-500" size={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold italic">
                            {isLoading ? '...' : stats.total_licenses}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Bảo Mật & Nhật Ký</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-zinc-950 rounded border border-zinc-800">
                            <span className="text-sm text-zinc-400 italic">Hệ thống hoạt động bình thường</span>
                            <Shield className="text-emerald-500" size={16} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
