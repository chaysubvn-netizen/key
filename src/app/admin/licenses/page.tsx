import { Metadata } from 'next';
import AdminLicensesContent from './AdminLicensesContent';

export const metadata: Metadata = {
    title: 'Quản Lý License',
};

export default function AdminLicensesPage() {
    return <AdminLicensesContent />;
}
