import { Metadata } from 'next';
import AdminSettingsContent from './AdminSettingsContent';

export const metadata: Metadata = {
    title: 'Cài Đặt Hệ Thống',
};

export default function AdminSettingsPage() {
    return <AdminSettingsContent />;
}
