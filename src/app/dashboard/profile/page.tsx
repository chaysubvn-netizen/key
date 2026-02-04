import { Metadata } from 'next';
import ProfilePageContent from './ProfilePageContent';

export const metadata: Metadata = {
    title: 'Thông Tin Cá Nhân',
};

export default function ProfilePage() {
    return <ProfilePageContent />;
}
