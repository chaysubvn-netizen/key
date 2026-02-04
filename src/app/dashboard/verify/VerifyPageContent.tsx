'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Search, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyKeyPage() {
    const [key, setKey] = useState('');
    const [domain, setDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!key || !domain) return;

        setIsLoading(true);
        setResult(null);
        try {
            const res = await apiRequest('checkkey', { key, domain }, 'GET');
            setResult(res);
            if (res.status === 'success') {
                toast.success('Mã bản quyền hợp lệ!');
            } else {
                toast.error(res.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold italic">Kiểm Tra Bản Quyền</h1>
                <p className="text-zinc-400 mt-2">Kiểm tra ngay lập tức trạng thái và hiệu lực của bất kỳ mã bản quyền nào.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
                <CardHeader>
                    <CardTitle>Công Cụ Xác Thực</CardTitle>
                    <CardDescription>Nhập mã bản quyền chính xác như khi bạn nhận được.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 italic font-bold">Mã Bản Quyền</label>
                                <Input
                                    placeholder="XXXXXXXX-XXXX-XXXX..."
                                    className="bg-zinc-950 border-zinc-800 font-mono"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 italic font-bold">Tên Miền (Domain)</label>
                                <Input
                                    placeholder="example.com"
                                    className="bg-zinc-950 border-zinc-800 font-mono"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-white text-black hover:bg-zinc-200"
                            disabled={isLoading}
                        >
                            <Search size={18} className="mr-2" />
                            {isLoading ? 'Đang xác thực...' : 'Xác Thực Bản Quyền'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="w-full pt-4 border-t border-zinc-800"
                            >
                                <div className={`flex items-center gap-4 p-4 rounded-lg bg-zinc-950 border ${result.status === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                                    {result.status === 'success' ? (
                                        <CheckCircle2 className="text-emerald-500 shrink-0" size={24} />
                                    ) : (
                                        <XCircle className="text-red-500 shrink-0" size={24} />
                                    )}
                                    <div>
                                        <h4 className={`font-bold ${result.status === 'success' ? 'text-emerald-400 italic' : 'text-red-400 italic underline'}`}>
                                            {result.status === 'success' ? 'Key Đang Hoạt Động' : 'Key Không Hợp Lệ'}
                                        </h4>
                                        <p className="text-sm text-zinc-500">{result.message}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-orange-400" />
                        Mẹo Bảo Mật
                    </h3>
                    <p className="text-xs text-zinc-500">
                        Không bao giờ chia sẻ mã bản quyền của bạn với người không có thẩm quyền. Mỗi mã được giới hạn mức sử dụng và có thể bị thu hồi nếu lạm dụng.
                    </p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                        Xác Thực Chính Thức
                    </h3>
                    <p className="text-xs text-zinc-500">
                        Công cụ này cung cấp dữ liệu thời gian thực trực tiếp từ hệ thống CMSBVQ, đảm bảo tính chính xác 100%.
                    </p>
                </div>
            </div>
        </div>
    );
}
