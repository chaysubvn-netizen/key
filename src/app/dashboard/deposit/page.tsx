import { Metadata } from 'next';
import DepositPageContent from './DepositPageContent';

export const metadata: Metadata = {
    title: 'Nạp Tiền',
    description: 'Nạp tiền vào tài khoản CMSBVQ',
};

export default function DepositPage() {
    return <DepositPageContent />;
}
