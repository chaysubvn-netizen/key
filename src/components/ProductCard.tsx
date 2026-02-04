'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: string;
        description: string;
        version?: string;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 p-4">
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                        v{product.version || '1.0.0'}
                    </Badge>
                </div>

                <CardHeader>
                    <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Zap className="text-white" size={24} />
                    </div>
                    <CardTitle className="text-xl font-bold tracking-tight text-white">{product.name}</CardTitle>
                    <CardDescription className="text-zinc-400 line-clamp-2 min-h-[40px]">
                        {product.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow">
                    <div className="mb-6">
                        <span className="text-3xl font-bold text-white">{Number(product.price).toLocaleString('vi-VN')} VNĐ</span>
                        <span className="text-zinc-500 text-sm ml-2">/ vĩnh viễn</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                        <li className="flex items-center text-sm text-zinc-300">
                            <CheckCircle2 size={16} className="text-green-500 mr-2" />
                            Bản quyền vĩnh viễn
                        </li>
                        <li className="flex items-center text-sm text-zinc-300">
                            <ShieldCheck size={16} className="text-blue-500 mr-2" />
                            Cập nhật miễn phí
                        </li>
                        <li className="flex items-center text-sm text-zinc-300">
                            <Zap size={16} className="text-yellow-500 mr-2" />
                            Hỗ trợ 24/7
                        </li>
                    </ul>
                </CardContent>

                <CardFooter>
                    <Link href="/login" className="w-full">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 group">
                            <ShoppingCart size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                            Mua ngay
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
