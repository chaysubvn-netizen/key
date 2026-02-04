import { Metadata } from 'next';
import RegisterPageContent from './RegisterPageContent';

export const metadata: Metadata = {
    title: 'Đăng Ký',
    description: 'Tạo tài khoản mới trên hệ thống CMSBVQ',
};

export default function RegisterPage() {
    return <RegisterPageContent />;
}
