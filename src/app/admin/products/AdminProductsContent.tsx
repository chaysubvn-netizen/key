'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Trash2, Edit, Plus } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        version: '1.0.0',
        update_link: ''
    });

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest('get_products', {}, 'GET');
            if (res.status === 'success') {
                setProducts(res.data || []);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = editingProduct ? 'edit_product' : 'add_product';
        const data = editingProduct ? { ...formData, id: editingProduct.id } : formData;

        const res = await apiRequest(action, data);
        if (res.status === 'success') {
            toast.success(`Sản phẩm đã được ${editingProduct ? 'cập nhật' : 'thêm'} thành công!`);
            setIsDialogOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', version: '1.0.0', update_link: '' });
            fetchProducts();
        } else {
            toast.error(res.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            const res = await apiRequest('delete_product', { id });
            if (res.status === 'success') {
                toast.success('Xóa sản phẩm thành công');
                fetchProducts();
            } else {
                toast.error(res.message);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
                    <p className="text-zinc-400 mt-2">Thêm, sửa hoặc xóa sản phẩm khỏi hệ thống.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-white text-black hover:bg-zinc-200">
                            <Plus size={18} className="mr-2" />
                            Thêm Sản Phẩm
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 max-h-[80vh] overflow-y-auto px-1">
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 italic font-bold">Tên sản phẩm</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400 italic font-bold">Giá (VNĐ)</label>
                                    <Input
                                        type="number"
                                        step="1"
                                        value={formData.price}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400 italic font-bold">Phiên bản</label>
                                    <Input
                                        value={formData.version}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, version: e.target.value })}
                                        className="bg-zinc-950 border-zinc-800"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 italic font-bold">Link cập nhật</label>
                                <Input
                                    value={formData.update_link}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, update_link: e.target.value })}
                                    className="bg-zinc-950 border-zinc-800"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400 italic font-bold">Mô tả</label>
                                <textarea
                                    className="w-full bg-zinc-950 border-zinc-800 rounded-md p-2 min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full bg-white text-black">{editingProduct ? 'Cập nhật' : 'Tạo mới'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow className="border-zinc-800">
                                <TableHead className="text-zinc-400">Tên Sản Phẩm</TableHead>
                                <TableHead className="text-zinc-400 text-center">Giá (VNĐ)</TableHead>
                                <TableHead className="text-zinc-400 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-8 text-zinc-500">Chưa có sản phẩm nào.</TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id} className="border-zinc-800">
                                        <TableCell className="font-medium font-mono">{product.name}</TableCell>
                                        <TableCell className="text-center italic">{Number(product.price).toLocaleString('vi-VN')}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-zinc-400 hover:text-white"
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setFormData({
                                                        name: product.name,
                                                        price: product.price,
                                                        description: product.description,
                                                        version: product.version || '1.0.0',
                                                        update_link: product.update_link || ''
                                                    });
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div >
    );
}
