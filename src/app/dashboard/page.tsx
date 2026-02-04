import { Metadata } from 'next';
import DashboardPageContent from './DashboardPageContent';

export const metadata: Metadata = {
    title: 'Bảng Điều Khiển',
};

export default function DashboardPage() {
    return <DashboardPageContent />;
}
