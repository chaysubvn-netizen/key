import { Metadata } from 'next';
import LandingPageContent from './LandingPageContent';

export const metadata: Metadata = {
  title: 'Trang Chủ',
};

export default function LandingPage() {
  return <LandingPageContent />;
}
