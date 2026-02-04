'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await register({ username, password });
            if (res.status === 'success') {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                router.push('/login');
            } else {
                toast.error(res.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1),transparent)] pointer-events-none" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            Tạo Tài Khoản
                        </CardTitle>
                        <CardDescription className="text-zinc-500">
                            Tham gia hệ thống CMSBVQ ngay hôm nay
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                            </Button>
                            <p className="text-sm text-zinc-500 text-center">
                                Đã có tài khoản?{' '}
                                <Link href="/login" className="text-white hover:underline">
                                    Đăng nhập
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
