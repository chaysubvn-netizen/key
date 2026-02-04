'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== 'admin') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-red-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
                    <span className="font-bold text-lg text-red-500">ADMIN PANEL</span>
                    <MobileAdminNav />
                </div>

                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Mobile Admin Nav Component (Local)
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { adminNavItems } from '@/components/admin/Sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function MobileAdminNav() {
    const { logout } = useAuth();
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-950 border-zinc-800 p-0 text-white w-72">
                <SheetTitle className="hidden">Admin Menu</SheetTitle>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-zinc-800">
                        <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent italic">
                            CMSBVQ ADMIN
                        </Link>
                    </div>
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200',
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
            </SheetContent>
        </Sheet>
    );
}
