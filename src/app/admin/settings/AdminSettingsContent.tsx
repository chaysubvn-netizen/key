'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Save, Globe, Lock, CreditCard } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useEffect } from 'react';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'CMSBVQ System',
        adminEmail: 'admin@example.com',
        maintenanceMode: false
    });
    const [bankConfig, setBankConfig] = useState({
        bank_number: '',
        bank_name: 'ACB',
        account_name: '',
        bank_token: ''
    });

    useEffect(() => {
        const fetchConfig = async () => {
            const res = await apiRequest('get_bank_config', {}, 'GET');
            if (res.status === 'success') {
                const data = res.data;
                setBankConfig({
                    bank_number: data.bank_number || '',
                    bank_name: data.bank_name || 'ACB',
                    account_name: data.account_name || '',
                    bank_token: data.bank_token || ''
                });
            }
        };
        fetchConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Save Bank Config
        const res = await apiRequest('save_bank_config', bankConfig);
        if (res.status === 'success') {
            toast.success('Cấu hình đã được lưu thành công!');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Cài Đặt Hệ Thống</h1>
                <p className="text-zinc-400 mt-2">Cấu hình thông số chung cho trang web.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="text-blue-500" size={20} />
                            Thông Tin Chung
                        </CardTitle>
                        <CardDescription>Các cài đặt cơ bản hiển thị trên website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-bold">Tên Website</label>
                            <Input
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-bold">Email Quản Trị</label>
                            <Input
                                value={settings.adminEmail}
                                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="text-orange-500" size={20} />
                            Bảo Mật & Bảo Trì
                        </CardTitle>
                        <CardDescription>Quản lý trạng thái hoạt động của hệ thống.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-zinc-950 rounded border border-zinc-800">
                            <div>
                                <h4 className="font-bold text-white">Chế độ bảo trì</h4>
                                <p className="text-sm text-zinc-500">Tạm dừng truy cập từ người dùng thường.</p>
                            </div>
                            <Button
                                type="button"
                                variant={settings.maintenanceMode ? "destructive" : "secondary"}
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            >
                                {settings.maintenanceMode ? 'Đang Bật' : 'Đang Tắt'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="text-emerald-500" size={20} />
                            Cấu Hình Tự Động Nạp (ACB)
                        </CardTitle>
                        <CardDescription>Kết nối API nạp tiền tự động qua spay5s.com (ACB)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 font-bold">Tên Ngân Hàng</label>
                                <Input
                                    value={bankConfig.bank_name}
                                    onChange={(e) => setBankConfig({ ...bankConfig, bank_name: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                    placeholder="Ví dụ: ACB"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 font-bold">Số Tài Khoản</label>
                                <Input
                                    value={bankConfig.bank_number}
                                    onChange={(e) => setBankConfig({ ...bankConfig, bank_number: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                    placeholder="Nhập số tài khoản..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-bold">Tên Chủ Tài Khoản</label>
                            <Input
                                value={bankConfig.account_name}
                                onChange={(e) => setBankConfig({ ...bankConfig, account_name: e.target.value })}
                                className="bg-zinc-950 border-zinc-800"
                                placeholder="NGUYEN VAN A"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 font-bold">API Token (spay5s.com)</label>
                            <Input
                                type="password"
                                value={bankConfig.bank_token}
                                onChange={(e) => setBankConfig({ ...bankConfig, bank_token: e.target.value })}
                                className="bg-zinc-950 border-zinc-800"
                                placeholder="Nhập Token API..."
                            />
                            <p className="text-xs text-zinc-500 italic">Token được bảo mật và chỉ hiển thị với Admin.</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" className="bg-white text-black hover:bg-zinc-200">
                        <Save size={18} className="mr-2" />
                        Lưu Cấu Hình
                    </Button>
                </div>
            </form>
        </div>
    );
}
