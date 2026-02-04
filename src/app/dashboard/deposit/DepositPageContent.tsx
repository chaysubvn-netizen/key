'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Copy, History, RefreshCw, Search, Calendar, Filter, Eye, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Common Bank BINS for VietQR (Simplified)
const BANK_BINS: Record<string, string> = {
    'ACB': '970416',
    'VCB': '970436', // Vietcombank
    'MB': '970422', // MBBank
    'TCB': '970407', // Techcombank
    'VPB': '970432', // VPBank
    'VIB': '970441',
    'ICB': '970415', // VietinBank
    'BIDV': '970418',
    'TPB': '970423',
};

export default function DepositPage() {
    const { user } = useAuth();
    const [bankConfig, setBankConfig] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Invoice State
    const [amount, setAmount] = useState<number>(0);
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });

    const checkInterval = 30000; // 30s

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Bank Config
            const configRes = await apiRequest('get_bank_config', {}, 'GET');
            if (configRes.status === 'success') {
                setBankConfig(configRes.data);
            }

            // Fetch History
            const historyRes = await apiRequest('get_user_deposits', {}, 'GET');
            if (historyRes.status === 'success') {
                setHistory(historyRes.data || []);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(async () => {
            await apiRequest('check_deposit', {}, 'GET');
            const historyRes = await apiRequest('get_user_deposits', {}, 'GET');
            if (historyRes.status === 'success') {
                setHistory(historyRes.data || []);
            }
        }, checkInterval);
        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Đã sao chép vào bộ nhớ tạm!');
    };

    const handleQuickAmount = (val: number) => {
        setAmount((prev) => prev + val);
    };

    const handleCreateInvoice = () => {
        if (!bankConfig) return;
        if (amount < 10000) {
            toast.error('Số tiền nạp tối thiểu là 10.000 VNĐ');
            return;
        }

        // Determine Bank Bin
        let bin = '970416'; // Default ACB
        if (bankConfig.bank_name) {
            // Try to find BIN by simple partial match
            const upperName = bankConfig.bank_name.toUpperCase();
            for (const [key, val] of Object.entries(BANK_BINS)) {
                if (upperName.includes(key)) {
                    bin = val;
                    break;
                }
            }
        }

        const transferContent = `nap ${user?.username || 'user'}`;
        // VietQR Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png
        const url = `https://img.vietqr.io/image/${bin}-${bankConfig.bank_number}-compact.jpg?amount=${amount}&addInfo=${transferContent}&accountName=${encodeURIComponent(bankConfig.account_name)}`;

        setQrUrl(url);
        toast.success('Đã tạo hóa đơn chuyển khoản!');
    };

    const transferSyntax = `nap ${user?.username || 'user'}`;

    // Filter Logic
    const filteredHistory = history.filter(item => {
        const matchesSearch = item.trans_id.toLowerCase().includes(searchTerm.toLowerCase());

        // Date Filter
        let matchesDate = true;
        if (dateRange.from) {
            matchesDate = matchesDate && new Date(item.created_at) >= new Date(dateRange.from);
        }
        if (dateRange.to) {
            // Add 1 day to include end date fully or set time to end of day
            const endDate = new Date(dateRange.to);
            endDate.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && new Date(item.created_at) <= endDate;
        }

        return matchesSearch && matchesDate;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Nạp Tiền</h1>
                    <p className="text-zinc-400 mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Hệ thống nạp tiền tự động 24/7
                    </p>
                </div>
            </div>

            {/* Deposit Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Input & Options */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-zinc-950 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-lg">Tạo lệnh nạp tiền</CardTitle>
                            <CardDescription>Chọn mệnh giá hoặc nhập số tiền bạn muốn nạp</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Auto Bank Status */}
                            {!bankConfig && (
                                <div className="bg-zinc-900 p-4 rounded text-zinc-500 text-center text-sm border border-zinc-800 border-dashed">
                                    Hiện chưa có ngân hàng thanh toán khả dụng.
                                </div>
                            )}

                            {/* Amount Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-400">Nhập số tiền (Tối thiểu 10.000đ)</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={amount || ''}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        placeholder="0"
                                        className="bg-zinc-900 border-zinc-800 h-12 text-lg pl-4 pr-12 focus-visible:ring-blue-600"
                                    />
                                    <span className="absolute right-4 top-3 text-zinc-500 font-bold">VNĐ</span>
                                </div>
                            </div>

                            {/* Quick Select Buttons */}
                            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                                {[20000, 50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                                    <Button
                                        key={val}
                                        variant="outline"
                                        className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-blue-600 transition-all text-xs md:text-sm"
                                        onClick={() => handleQuickAmount(val)}
                                    >
                                        +{val / 1000}k
                                    </Button>
                                ))}
                            </div>

                            {/* Action Button */}
                            <Button
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base"
                                onClick={handleCreateInvoice}
                                disabled={!bankConfig}
                            >
                                Tạo hóa đơn nạp tiền
                            </Button>

                            {/* QR Code Display */}
                            {qrUrl && bankConfig && (
                                <div className="mt-6 p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                                    <div className="bg-white p-2 rounded-lg">
                                        <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain" />
                                    </div>
                                    <div className="mt-4 text-center space-y-2 w-full">
                                        <p className="text-zinc-200 font-bold">Quét mã để thanh toán</p>
                                        <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                                            <p className="text-xs text-zinc-500 uppercase">Nội Dung Chuyển Khoản</p>
                                            <div className="flex items-center justify-center gap-2 mt-1">
                                                <code className="text-lg font-mono font-bold text-blue-500">{transferSyntax}</code>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-zinc-400 hover:text-blue-500" onClick={() => copyToClipboard(transferSyntax)}>
                                                    <Copy size={12} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Notes */}
                <div className="lg:col-span-1">
                    <Card className="bg-blue-950/20 border-blue-900/30 h-full">
                        <CardHeader>
                            <CardTitle className="text-blue-400 flex items-center gap-2 text-base">
                                <div className="p-1 bg-blue-500/10 rounded">i</div>
                                Lưu ý quan trọng
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-zinc-400">
                            <p>1. Vui lòng chuyển khoản đúng nội dung để được cộng tiền tự động.</p>
                            <p>2. Nếu sau 15 phút không nhận được tiền, vui lòng liên hệ Admin.</p>
                            <p>3. Không nạp dưới mức tối thiểu 10.000đ.</p>
                            <div className="pt-4 border-t border-blue-900/30">
                                <p className="text-xs text-zinc-500 mb-2 uppercase font-bold">Hỗ trợ ngân hàng</p>
                                <div className="flex gap-2 flex-wrap">
                                    {['ACB', 'MB', 'VCB', 'TCB', 'BIDV'].map(b => (
                                        <Badge key={b} variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white cursor-help">
                                            {b}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* History Section - Enhanced */}
            <Card className="bg-zinc-950 border-zinc-800">
                <CardHeader className="pb-3 border-b border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
                            <Input
                                placeholder="Tìm kiếm mã giao dịch..."
                                className="pl-9 bg-zinc-900 border-zinc-800 text-sm h-10 ring-offset-zinc-950 focus-visible:ring-zinc-700"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white h-10">
                                <Calendar size={14} className="mr-2" /> Lọc theo ngày
                            </Button>
                            <Button variant="outline" size="sm" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white h-10">
                                <Filter size={14} className="mr-2" /> Trạng thái
                            </Button>
                            <Button size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white h-10" onClick={fetchData}>
                                <RefreshCw size={14} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader className="bg-zinc-900/50">
                            <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase w-[80px]">ID</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase">Mã GD</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase">Ngân hàng</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase">Số tiền / Thực nhận</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase">Trạng thái</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase">Thời gian</TableHead>
                                <TableHead className="text-zinc-500 text-xs font-bold uppercase text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500">Đang tải dữ liệu...</TableCell>
                                </TableRow>
                            ) : filteredHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-[200px]">
                                        <div className="flex flex-col items-center justify-center text-zinc-500 gap-2 h-full">
                                            <Search size={32} className="opacity-20" />
                                            <p className="text-sm">Chưa có giao dịch nào phù hợp</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredHistory.map((item) => (
                                    <TableRow key={item.id} className="border-zinc-800 group hover:bg-zinc-900/30 transition-colors">
                                        <TableCell className="text-zinc-500 text-xs">#{item.id}</TableCell>
                                        <TableCell className="font-mono text-zinc-300 text-xs font-medium">{item.trans_id}</TableCell>
                                        <TableCell className="text-zinc-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-[10px] px-1 py-0 h-5">ACB</Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-emerald-400 text-sm">+{Number(item.amount).toLocaleString('vi-VN')} đ</span>
                                                <span className="text-[10px] text-zinc-500">{Number(item.amount).toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                                Hoàn thành
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500 text-xs">
                                            {new Date(item.created_at).toLocaleString('vi-VN')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Eye size={16} />
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
