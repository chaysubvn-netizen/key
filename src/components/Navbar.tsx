'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogIn, UserPlus, LogOut, Key, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-zinc-950/50 backdrop-blur-xl border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-white p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                            <Key className="text-black" size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-white">CMSBVQ</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
                        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                        <Link href="/#products" className="hover:text-white transition-colors">Cửa hàng</Link>
                        <Link href="/#features" className="hover:text-white transition-colors">Tính năng</Link>
                    </div>

                    <div className="flex items-center space-x-3">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link href="/admin">
                                        <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                            <ShieldCheck size={18} className="mr-2" />
                                            Quản trị
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                        <LayoutDashboard size={18} className="mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/20" onClick={logout}>
                                    <LogOut size={18} className="mr-2" />
                                    Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                        <LogIn size={18} className="mr-2" />
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-white text-black hover:bg-zinc-200">
                                        <UserPlus size={18} className="mr-2" />
                                        Đăng ký
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
