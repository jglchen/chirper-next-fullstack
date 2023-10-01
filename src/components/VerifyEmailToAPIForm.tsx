import { useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import createAxios from '@/lib/axios';
import secureLocalStorage  from  'react-secure-storage';
import { decryptSessionData, encryptSessionData } from '@/lib/cryptosession';
import { UserContext } from '@/lib/context';
import { UserContextType, UserType } from'@/lib/types';


const VerifyEmailToAPIForm = () => {
    const userContext: UserContextType = useContext(UserContext);
    const router = useRouter();
    const axios = createAxios();

    useEffect(() => {
        if (router.query.id || router.query.hash || router.query.expires || router.query.signature){
            const inputObj = {
                id: router.query.id,
                hash: router.query.hash,
                expires: router.query.expires,
                signature: router.query.signature
            };
            axios
                .post('/api/email/verify', inputObj)
                .then(res => {
                    if (res.data && userContext.user.id){
                        const userData = {
                            user: res.data.user,
                            authorization: {
                                token: userContext.authToken,
                                type: 'bearer',
                            }
                        }
                        if (secureLocalStorage.getItem('user_data')){
                            secureLocalStorage.setItem('user_data', userData);
                        }
                        if (decryptSessionData('user_data', 'object')){
                            encryptSessionData('user_data', userData);
                        }
                        userContext.userlLogin(userData);
                    }
                    router.push('/dashboard');
                })
                .catch(error => {
                    throw error;
                });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[router, axios]);
    
    return (
        <div>
            Please wait to verify your email address...
        </div>
    );

}    

export default VerifyEmailToAPIForm;
