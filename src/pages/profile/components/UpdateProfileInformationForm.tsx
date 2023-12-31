import { useEffect, useState, useRef, useContext, FormEvent, MouseEvent } from 'react';
import { decryptSessionData, encryptSessionData } from '@/lib/cryptosession';
import Link from 'next/link';
import createAxios from '@/lib/axios';
import secureLocalStorage  from  'react-secure-storage';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Button from '@/components/Button';
import Label from '@/components/Label';
import { Transition } from '@headlessui/react';
import { UserContextType, ErrorsType } from '@/lib/types';
import { UserContext } from '@/lib/context';
import { getHostURL } from '@/lib/hosturl';
import validateUpdateProfileClient from '@/validate/update-profile-client';

interface UpdateProfileInformationProps {
    mustVerifyEmail?: boolean;
    verifyEmail?: string;
    className?: string;
}

export default function UpdateProfileInformationForm({ mustVerifyEmail=false, verifyEmail='', className = '' }: UpdateProfileInformationProps) {
    const userContext: UserContextType = useContext(UserContext);
    const [name, setName] = useState(userContext ? (userContext.user.name ? userContext.user.name:''):'');
    const [email, setEmail] = useState(userContext ? (userContext.user.email ? userContext.user.email:''):'');
    const [errors, setErrors] = useState<ErrorsType>({});
    const [status, setStatus] = useState<string | null>(verifyEmail);
    const [processing, setProcessing] = useState(false);
    const verifyStatus = useRef(verifyEmail);
    const axios = createAxios(userContext ? userContext.authToken: '');

    useEffect(() => {
        if (status === 'updateprofile_done') {
           const statusTimeout = setTimeout(() => {
                setStatus(verifyStatus.current);
                setErrors({});
           }, 1000);
 
           return () => clearTimeout(statusTimeout);
        }
        if (status === 'verification-link-sent') {
            verifyStatus.current = status;
        }
    },[status]);
    
    const updateProfile = async (event: FormEvent) => {
        event.preventDefault();

        setErrors({});
        setStatus(verifyStatus.current);
        setProcessing(true);

        const inputObj = {
            name,
            email,
        }

        const validateResult = validateUpdateProfileClient(inputObj);
        if (!validateResult.valid){
            setErrors(validateResult.errorMsg as ErrorsType);
            return; 
        }
        
        await axios
            .patch('/api/update-profile', inputObj)
            .then(res => {
                //console.log(res);
                if (res.data){
                    userContext.userlLogin(res.data);
                    if (secureLocalStorage.getItem('user_data')){
                        secureLocalStorage.setItem('user_data', res.data);
                    }
                    if (decryptSessionData('user_data', 'object')){
                        encryptSessionData('user_data', res.data);
                    }
                    setStatus('updateprofile_done');
                }
            })
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data);
        });

        setProcessing(false);    
    };
    
    const sendVerifyEmail = (event: MouseEvent) => {
        event.preventDefault();

        axios
            .post('/api/email/verification-notification', {hosturl: getHostURL()})
            .then(response => setStatus(response.data.status));
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">Profile Information</h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">
                    Update your account&rsquo;s profile information and email address.
                </p>
            </header>

            <form onSubmit={updateProfile} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">Name</Label>

                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={name}
                        onChange={(event: FormEvent) => setName((event.target as HTMLInputElement).value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />

                    <InputError
                            messages={errors.name}
                            className="mt-2"
                        />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={email}
                        onChange={(event: FormEvent) => setEmail((event.target as HTMLInputElement).value)}
                        required
                        autoComplete="username"
                    />

                    <InputError
                            messages={errors.email}
                            className="mt-2"
                        />
               </div>
               
               {mustVerifyEmail && userContext.user?.email_verified_at === null && (

                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-100">
                            Your email address is unverified.
                            <Link
                                href={'/'}
                                onClick={sendVerifyEmail}
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-200">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}
 
                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>

                    <Transition
                        show={status === 'updateprofile_done'}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-200">Saved.</p>
                    </Transition>
                </div>

            </form>
 
        </section>
    );

}    