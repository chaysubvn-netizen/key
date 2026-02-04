import { Metadata } from 'next';
import AdminProductsContent from './AdminProductsContent';

export const metadata: Metadata = {
    title: 'Quản Lý Sản Phẩm',
};

export default function AdminProductsPage() {
    return <AdminProductsContent />;
}
