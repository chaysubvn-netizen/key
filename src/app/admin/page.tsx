import { Metadata } from 'next';
import AdminOverviewContent from './AdminOverviewContent';

export const metadata: Metadata = {
    title: 'Quản Trị Hệ Thống',
};

export default function AdminOverviewPage() {
    return <AdminOverviewContent />;
}
