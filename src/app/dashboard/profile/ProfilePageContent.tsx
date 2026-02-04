'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Hồ Sơ Cá Nhân</h1>
                <p className="text-zinc-400 mt-2">Quản lý thông tin tài khoản và cài đặt bảo mật.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-1">
                    <CardHeader className="text-center">
                        <div className="w-24 h-24 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-4 border-2 border-zinc-700">
                            <User size={48} className="text-zinc-500" />
                        </div>
                        <CardTitle>{user?.username}</CardTitle>
                        <CardDescription className="capitalize italic">
                            {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Chi Tiết Tài Khoản</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <User size={18} />
                                <span>Tên đăng nhập</span>
                            </div>
                            <span className="font-bold italic">{user?.username}</span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Shield size={18} />
                                <span>Vai trò tài khoản</span>
                            </div>
                            <span className="capitalize px-2 py-0.5 bg-zinc-800 rounded text-xs font-bold text-white italic underline">
                                {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3 text-zinc-400">
                                <Calendar size={18} />
                                <span>Thành viên từ</span>
                            </div>
                            <span className="text-zinc-500 italic">Hôm nay</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
