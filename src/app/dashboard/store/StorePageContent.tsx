'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Globe } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function StorePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [domain, setDomain] = useState('');
    const [isBuying, setIsBuying] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await apiRequest('get_products', {}, 'GET');
                if (res.status === 'success') {
                    setProducts(res.data || []);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleBuy = async () => {
        if (!domain) {
            toast.error('Vui lòng nhập tên miền cho bản quyền của bạn.');
            return;
        }

        setIsBuying(true);
        try {
            const res = await apiRequest('buy_license', {
                product_id: selectedProduct.id,
                domain: domain
            });
            if (res.status === 'success') {
                toast.success('Mua bản quyền thành công!');
                setSelectedProduct(null);
                setDomain('');
            } else {
                toast.error(res.message);
            }
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Cửa Hàng Sản Phẩm</h1>
                <p className="text-zinc-400 mt-2">Chọn giải pháp phần mềm tốt nhất cho nhu cầu của bạn.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Đang tải sản phẩm...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col hover:border-zinc-700 transition-colors">
                                <CardHeader>
                                    <Package className="text-white mb-2" size={32} />
                                    <CardTitle>{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-zinc-400 text-sm line-clamp-3">
                                        {product.description || 'Không có mô tả cho sản phẩm này.'}
                                    </p>
                                    <div className="mt-4 text-2xl font-bold">{Number(product.price).toLocaleString('vi-VN')} VNĐ</div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full bg-white text-black hover:bg-zinc-200"
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <ShoppingCart size={18} className="mr-2" />
                                        Chọn & Mua
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Hoàn Tất Giao Dịch</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Mã bản quyền được liên kết với một tên miền cụ thể. Vui lòng nhập tên miền của bạn bên dưới.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-4">
                            <Package className="text-zinc-400" size={24} />
                            <div>
                                <h4 className="font-bold">{selectedProduct?.name}</h4>
                                <p className="text-sm text-zinc-500 font-mono italic">{Number(selectedProduct?.price).toLocaleString('vi-VN')} VNĐ</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 italic font-bold">Tên Miền (Domain)</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 text-zinc-600" size={18} />
                                <Input
                                    placeholder="example.com"
                                    className="bg-zinc-950 border-zinc-800 pl-10"
                                    value={domain}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="w-full bg-white text-black hover:bg-zinc-200"
                            onClick={handleBuy}
                            disabled={isBuying}
                        >
                            {isBuying ? 'Đang xử lý...' : 'Xác Nhận Mua Hàng'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
