'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { UserCog, Coins, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        money: 0,
        role: 'user'
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await apiRequest('get_users', {}, 'GET');
            if (res.status === 'success') {
                setUsers(res.data || []);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await apiRequest('edit_user', {
            id: selectedUser.id,
            ...formData
        });
        if (res.status === 'success') {
            toast.success(res.message);
            setIsDialogOpen(false);
            fetchUsers();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
                <p className="text-zinc-400 mt-2">Xem danh sách, quản lý số dư và phân quyền thành viên.</p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="pt-6 overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="border-zinc-800 font-bold italic underline">
                                <TableHead className="text-zinc-400">ID</TableHead>
                                <TableHead className="text-zinc-400">Tên Đăng Nhập</TableHead>
                                <TableHead className="text-zinc-400">Số Dư (VNĐ)</TableHead>
                                <TableHead className="text-zinc-400">Vai Trò</TableHead>
                                <TableHead className="text-zinc-400 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Đang tải...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Chưa có người dùng nào.</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id} className="border-zinc-800">
                                        <TableCell className="text-zinc-500">#{user.id}</TableCell>
                                        <TableCell className="font-medium font-mono">{user.username}</TableCell>
                                        <TableCell className="font-bold text-emerald-400 italic">
                                            {Number(user.money).toLocaleString('vi-VN')} VNĐ
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold italic underline ${user.role === 'admin' ? 'bg-red-950 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-white"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setFormData({ money: user.money, role: user.role });
                                                    setIsDialogOpen(true);
                                                }}
                                            >
                                                <UserCog size={16} className="mr-2" />
                                                Quản lý
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Quản Lý Người Dùng: {selectedUser?.username}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 italic font-bold flex items-center gap-2">
                                <Coins size={14} /> Số dư tài khoản (VNĐ)
                            </label>
                            <Input
                                type="number"
                                value={formData.money}
                                onChange={(e) => setFormData({ ...formData, money: Number(e.target.value) })}
                                className="bg-zinc-950 border-zinc-800"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400 italic font-bold flex items-center gap-2">
                                <ShieldCheck size={14} /> Vai trò hệ thống
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full h-10 bg-zinc-950 border border-zinc-800 rounded-md px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent"
                            >
                                <option value="user">Thành viên</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200">
                                Lưu Thay Đổi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
