import { Metadata } from 'next';
import LicensesPageContent from './LicensesPageContent';

export const metadata: Metadata = {
    title: 'License Của Tôi',
};

export default function LicensesPage() {
    return <LicensesPageContent />;
}
