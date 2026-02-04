import { Metadata } from 'next';
import VerifyPageContent from './VerifyPageContent';

export const metadata: Metadata = {
    title: 'Kiểm Tra License',
};

export default function VerifyPage() {
    return <VerifyPageContent />;
}
