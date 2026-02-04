import { Metadata } from 'next';
import StorePageContent from './StorePageContent';

export const metadata: Metadata = {
    title: 'Cửa Hàng Dịch Vụ',
};

export default function StorePage() {
    return <StorePageContent />;
}
