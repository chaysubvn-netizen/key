'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, PackagePlus, Settings, LogOut, Users, Key } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const adminNavItems = [
    { label: 'Bảng Điều Khiển', href: '/admin', icon: LayoutDashboard },
    { label: 'Quản Lý Sản Phẩm', href: '/admin/products', icon: PackagePlus },
    { label: 'Quản Lý License', href: '/admin/licenses', icon: Key },
    { label: 'Quản Lý Người Dùng', href: '/admin/users', icon: Users },
    { label: 'Cài Đặt', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (

        <div className="hidden lg:flex w-64 border-r border-zinc-800 bg-zinc-950 flex-col h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent italic">
                    CMSBVQ ADMIN
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-red-600 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                            )}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-800 mt-auto">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/10"
                    onClick={logout}
                >
                    <LogOut size={20} className="mr-3" />
                    Đăng Xuất
                </Button>
            </div>
        </div>
    );
}
