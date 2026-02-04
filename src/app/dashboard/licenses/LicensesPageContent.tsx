'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Copy, Globe } from 'lucide-react';

export default function LicensesPage() {
    const [licenses, setLicenses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest('get_licenses', {}, 'GET');
            if (res.status === 'success') {
                setLicenses(res.data || []);
            } else {
                toast.error(res.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success('Đã sao chép mã bản quyền!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white italic underline">License Của Tôi</h1>
                <p className="text-zinc-400 mt-2">Quản lý và xem các khóa bản quyền bạn đã mua.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Key Đang Hoạt Động</CardTitle>
                    <CardDescription>Danh sách tất cả các khóa bản quyền và trạng thái hiện tại của chúng.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Đang tải bản quyền...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                                <TableHeader>
                                    <TableRow className="border-zinc-800">
                                        <TableHead className="text-zinc-400">Mã Bản Quyền</TableHead>
                                        <TableHead className="text-zinc-400">Sản Phẩm</TableHead>
                                        <TableHead className="text-zinc-400">Tên Miền</TableHead>
                                        <TableHead className="text-zinc-400">Trạng Thái</TableHead>
                                        <TableHead className="text-zinc-400">Hết Hạn</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {licenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                                Không tìm thấy bản quyền nào. Hãy bắt đầu bằng cách mua một gói trong Cửa hàng!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        licenses.map((license) => (
                                            <TableRow key={license.id} className="border-zinc-800">
                                                <TableCell className="font-mono">
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-300">
                                                            {license.license_key}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-zinc-500 hover:text-white"
                                                            onClick={() => handleCopy(license.license_key)}
                                                        >
                                                            <Copy size={14} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold italic underline">{license.product_name || 'N/A'}</TableCell>
                                                <TableCell className="text-zinc-400 italic">
                                                    <div className="flex items-center gap-2">
                                                        <Globe size={14} className="text-zinc-600" />
                                                        {license.domain || 'N/A'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={license.status === 'active' ? 'default' : 'secondary'}>
                                                        {license.status === 'active' ? 'Đang hoạt động' : license.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-zinc-400 italic font-bold">
                                                    {license.expires_at || 'Vĩnh viễn'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
