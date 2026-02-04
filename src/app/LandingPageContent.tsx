'use client';

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Key, Shield, Zap, Globe, Github, Twitter, Cpu, Terminal, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiRequest('get_products', {}, 'GET');
        if (res.status === 'success') {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30 blur-[120px] pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full animate-pulse" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-600 rounded-full animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-8 text-sm font-medium text-zinc-400"
          >
            <Badge className="bg-white text-black hover:bg-white">MỚI</Badge>
            <span>v1.0.0 Đã Sẵn Sàng - Kích Hoạt Tức Thì</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-[1.1]"
          >
            TƯƠNG LAI CỦA <br />
            <span className="text-white">QUẢN LÝ BẢN QUYỀN</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Hệ thống quản lý bản quyền chuyên nghiệp, bảo mật tuyệt đối với API tích hợp sẵn.
            Quản lý, kích hoạt và cập nhật license chỉ trong nháy mắt.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/#products">
              <Button size="lg" className="h-14 px-8 bg-white text-black hover:bg-zinc-200 text-lg font-bold group">
                <ShoppingCart className="mr-2 group-hover:scale-110 transition-transform" />
                Mua Ngay
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-14 px-8 border-zinc-800 hover:bg-zinc-900 text-lg font-bold">
                Bắt đầu miễn phí
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Logo Cloud */}
      <section className="py-10 border-y border-zinc-900 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-40">
          <div className="flex items-center space-x-2"><Github size={24} /> <span className="font-bold text-xl">GitHub</span></div>
          <div className="flex items-center space-x-2"><Twitter size={24} /> <span className="font-bold text-xl">X.com</span></div>
          <div className="flex items-center space-x-2"><Terminal size={24} /> <span className="font-bold text-xl">Stack</span></div>
          <div className="flex items-center space-x-2"><Cpu size={24} /> <span className="font-bold text-xl">Intel</span></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Giải pháp tối ưu cho việc phân phối phần mềm và quản lý bản quyền.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={32} />, title: 'Bảo mật tuyệt đối', desc: 'Mã hóa License Key theo thuật toán mới nhất, chống bẻ khóa và giả mạo.' },
              { icon: <Zap size={32} />, title: 'Tốc độ cực nhanh', desc: 'Hệ thống API tối ưu phản hồi dưới 50ms, đảm bảo khách hàng không phải chờ đợi.' },
              { icon: <Globe size={32} />, title: 'Quản lý Domain', desc: 'Giới hạn license theo tên miền hoặc địa chỉ IP để bảo vệ quyền lợi của bạn.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section id="products" className="py-24 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Sản Phẩm Của Chúng Tôi</h2>
              <p className="text-zinc-500">Lựa chọn gói bản quyền phù hợp với nhu cầu của bạn.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-zinc-900 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-3 py-20 text-center text-zinc-600 border border-dashed border-zinc-800 rounded-3xl">
                  Hiện tại không có sản phẩm nào được niêm yết.
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <Key className="text-black" size={16} />
            </div>
            <span className="text-xl font-bold tracking-tighter">CMSBVQ</span>
          </div>
          <div className="flex space-x-6 text-sm text-zinc-500 font-medium">
            <Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link>
            <Link href="#" className="hover:text-white transition-colors">Liên hệ</Link>
          </div>
          <p className="text-zinc-600 text-sm italic">© 2026 CMSBVQ. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}

// Small helper component
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${className}`}>
      {children}
    </span>
  );
}

// Icon Import for hero (re-defined or imported)
// import { ShoppingCart } from 'lucide-react';
