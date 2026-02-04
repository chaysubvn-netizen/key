'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Key, ShoppingCart, User, LogOut, PackageSearch, CreditCard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const navItems = [
    { label: 'Bảng Điều Khiển', href: '/dashboard', icon: LayoutDashboard },
    { label: 'License Của Tôi', href: '/dashboard/licenses', icon: Key },
    { label: 'Cửa Hàng', href: '/dashboard/store', icon: ShoppingCart },
    { label: 'Nạp Tiền', href: '/dashboard/deposit', icon: CreditCard },
    { label: 'Kiểm Tra Key', href: '/dashboard/verify', icon: PackageSearch },
    { label: 'Tài Khoản', href: '/dashboard/profile', icon: User },
];

export default function DashboardSidebar() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex w-64 border-r border-zinc-800 bg-zinc-950 flex-col h-screen sticky top-0">
            <div className="p-6">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                    CMSBVQ
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-white text-black'
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
