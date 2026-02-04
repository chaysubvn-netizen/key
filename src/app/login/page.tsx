import { Metadata } from 'next';
import LoginPageContent from './LoginPageContent';

export const metadata: Metadata = {
    title: 'Đăng Nhập',
    description: 'Đăng nhập vào hệ thống CMSBVQ',
};

export default function LoginPage() {
    return <LoginPageContent />;
}
