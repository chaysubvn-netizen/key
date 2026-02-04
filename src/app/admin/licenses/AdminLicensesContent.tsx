'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { ShieldCheck, ShieldAlert, Globe, User, Package } from 'lucide-react';

export default function AdminLicensesPage() {
    const [licenses, setLicenses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLicenses = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest('get_all_licenses', {}, 'GET');
            if (res.status === 'success') {
                setLicenses(res.data || []);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    const handleToggleStatus = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const res = await apiRequest('update_license_status', { id, status: newStatus });
        if (res.status === 'success') {
            toast.success(res.message);
            fetchLicenses();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản Lý Toàn Bộ License</h1>
                <p className="text-zinc-400 mt-2">Xem và điều chỉnh trạng thái của tất cả mã bản quyền trong hệ thống.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="border-zinc-800 font-bold italic underline">
                                <TableHead className="text-zinc-400">Mã Bản Quyền / Sản Phẩm</TableHead>
                                <TableHead className="text-zinc-400">Người Sở Hữu</TableHead>
                                <TableHead className="text-zinc-400">Tên Miền</TableHead>
                                <TableHead className="text-zinc-400">Trạng Thái</TableHead>
                                <TableHead className="text-zinc-400 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Đang tải...</TableCell>
                                </TableRow>
                            ) : licenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Chưa có license nào được tạo.</TableCell>
                                </TableRow>
                            ) : (
                                licenses.map((license) => (
                                    <TableRow key={license.id} className="border-zinc-800">
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <code className="text-sm bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-300 w-fit font-mono">
                                                    {license.license_key}
                                                </code>
                                                <div className="flex items-center gap-1 text-xs text-zinc-500 italic">
                                                    <Package size={12} /> {license.product_name}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <User size={14} className="text-zinc-600" />
                                                <span className="font-medium underline decoration-zinc-800">{license.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-zinc-400 italic">
                                                <Globe size={14} className="text-zinc-600" />
                                                {license.domain}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={license.status === 'active' ? 'default' : 'destructive'} className="italic">
                                                {license.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={license.status === 'active' ? "text-red-400 hover:text-red-300 hover:bg-red-950/20" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20"}
                                                onClick={() => handleToggleStatus(license.id, license.status)}
                                            >
                                                {license.status === 'active' ? (
                                                    <><ShieldAlert size={16} className="mr-2" /> Khóa Key</>
                                                ) : (
                                                    <><ShieldCheck size={16} className="mr-2" /> Kích Hoạt</>
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
