import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { LoginInputType, ErrorsType } from '@/lib/types';

export default async function validateLoginAPI(inputObj: LoginInputType){
    const {email, password} = inputObj;
    let valid = false;
    const errorMsg: ErrorsType = {};

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (user){
        valid = await bcrypt.compare(password, user.password);
        user.password = '';
    }

    if (valid){
        return {
            valid,
            user
        };
    }
 
    errorMsg.email = ['These credentials do not match our records.'];
    return {
        valid,
        errorMsg
    };
}    