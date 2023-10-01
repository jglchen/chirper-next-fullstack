import jwt from 'jsonwebtoken';
const APP_SECRET = process.env.NEXT_PUBLIC_JWT_APP_SECRET as string;
import { PasswordResetType, UserJwtPasswdReset, ErrorsType } from '@/lib/types';

export default async function validatePasswordResetAPI(inputObj: PasswordResetType){
    const {token, email, password, password_confirmation} = inputObj;
    let valid = true;
    const errorMsg: ErrorsType = {};

    const tokenUser = jwt.verify(token, APP_SECRET) as UserJwtPasswdReset;
    if (email !== tokenUser.email){
        errorMsg.email = ['This password reset token is invalid.'];
        valid = false;
    }

    if (password !== password_confirmation){
        errorMsg.password = ['The password field confirmation does not match.'];
        valid = false;
    }

    //Calculate the time difference in seconds between the current time and the token issuing time
    const currentTime = new Date().getTime()/1000;
    const tokenIssueTime = (new Date(tokenUser.current) as unknown as number)/1000;
    if ((currentTime-tokenIssueTime) > 60*60){
        if (!errorMsg.email){
            errorMsg.email = ['This password reset token is invalid.'];
            valid = false;
        }
    }
    
    if (valid){
        return {
         valid,
         tokenUser
        };
    }
     
    return {
        valid,
        errorMsg
    };
}    