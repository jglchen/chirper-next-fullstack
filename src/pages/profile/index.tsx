import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const Profile = () => {
    const mustVerifyEmail = true;
    const verifyEmail = '';

    const UpdateProfileInformationForm = dynamic(() => import('./components/UpdateProfileInformationForm'), { ssr: false })
    const UpdatePasswordForm = dynamic(() => import('./components/UpdatePasswordForm'), { ssr: false })
    const DeleteUserForm = dynamic(() => import('./components/DeleteUserForm'), { ssr: false })
    
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-50 leading-tight">
                    Profile
                </h2>
            }>
            <Head>
                <title>Profile - Next.js Fullstack Emulating Laravel Chirper</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-black shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            verifyEmail={verifyEmail}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-black shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-black shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>

        </AppLayout>
    )
}

export default Profile
