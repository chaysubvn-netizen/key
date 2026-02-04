'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/api';
import { Key, Package, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverview() {
    const [stats, setStats] = useState({
        totalLicenses: 0,
        activeLicenses: 0,
        totalSpent: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const res = await apiRequest('get_licenses', {}, 'GET');
            if (res.status === 'success') {
                const licenses = res.data || [];
                setStats({
                    totalLicenses: licenses.length,
                    activeLicenses: licenses.filter((l: any) => l.status === 'active').length,
                    totalSpent: 0, // Mock or fetch if available
                });
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Tổng License', value: stats.totalLicenses, icon: Package, color: 'text-blue-400' },
        { label: 'Key Hoạt Động', value: stats.activeLicenses, icon: ShieldCheck, color: 'text-emerald-400' },
        { label: 'Tổng Chi Tiêu', value: `${stats.totalSpent.toLocaleString('vi-VN')} VNĐ`, icon: CreditCard, color: 'text-amber-400' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Chào mừng trở lại</h1>
                <p className="text-zinc-400 mt-2">Dưới đây là tổng quan hoạt động hệ thống bản quyền của bạn.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-zinc-400 italic">
                                    {stat.label}
                                </CardTitle>
                                <stat.icon className={stat.color} size={20} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Tin Tức & Cập Nhật Hệ Thống</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-500">
                    Không có tin nhắn mới từ quản trị viên. Hãy quay lại sau để cập nhật thông tin hệ thống và các sản phẩm mới nhất.
                </CardContent>
            </Card>
        </div>
    );
}
