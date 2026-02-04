import { Metadata } from 'next';
import AdminUsersContent from './AdminUsersContent';

export const metadata: Metadata = {
    title: 'Quản Lý Thành Viên',
};

export default function AdminUsersPage() {
    return <AdminUsersContent />;
}
