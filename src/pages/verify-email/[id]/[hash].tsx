import ApplicationLogo from '@/components/ApplicationLogo';
import AuthCard from '@/components/AuthCard';
import GuestLayout from '@/components/Layouts/GuestLayout';
import Link from 'next/link';
import VerifyEmailToAPIForm from '@/components/VerifyEmailToAPIForm';

const VerifyEmailToAPI = () => {

    return (
        <GuestLayout>
            <AuthCard
                logo={
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                }>
                <VerifyEmailToAPIForm />
            </AuthCard>
        </GuestLayout>
    )
}

export default VerifyEmailToAPI;
