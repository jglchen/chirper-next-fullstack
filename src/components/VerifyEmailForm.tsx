import { useState, useContext, useEffect } from 'react';
import secureLocalStorage  from  'react-secure-storage';
import createAxios from '@/lib/axios';
import Button from '@/components/Button';
import { UserContextType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import { getHostURL } from '@/lib/hosturl';

const VerifyEmailForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const [status, setStatus] = useState<string | null>(null)
    const axios = createAxios(userContext ? userContext.authToken: '');

    useEffect(() => {
        if (!userContext.user.id){
            window.location.pathname = '/login';
        }else if (userContext.user.email_verified_at){
            window.location.pathname = '/dashboard';
        }
    },[userContext]);
    
    const resendEmailVerification = () => {
            axios
            .post('/api/email/verification-notification', {hosturl: getHostURL()})
            .then(response => setStatus(response.data.status));
    }

    const logout = () => {
        // Remove all saved data from secureLocalStorage
        secureLocalStorage.clear();
        // Remove all saved data from sessionStorage
        sessionStorage.clear();
        userContext.userlLogout();

        window.location.pathname = '/login';
   };

   return (
        <>
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-200">
            Thanks for signing up! Before getting started, could you
            verify your email address by clicking on the link we just
            emailed to you? If you didn&rsquo;t receive the email, we will
            gladly send you another.
        </div>

        {status === 'verification-link-sent' && (
            <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-200">
                A new verification link has been sent to the email
                address you provided during registration.
            </div>
        )}

        <div className="mt-4 flex items-center justify-between">
            <Button
                onClick={() => resendEmailVerification()}>
                Resend Verification Email
            </Button>

            <button
                type="button"
                className="underline text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50"
                onClick={logout}>
                Logout
            </button>
        </div>
        </>
   );
}  

export default VerifyEmailForm;