import prisma from '@/lib/prisma';
import { RegisterInputType, ErrorsType } from '@/lib/types';

export default async function validateRegisterAPI(inputObj: RegisterInputType){
    const {email} = inputObj;
    let valid = true;
    const errorMsg: ErrorsType = {};

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    
    if (user?.email){
        errorMsg.email = ['The email has already been taken.'];
        valid = false;
    }

    if (valid){
       return {
        valid
       };
    }
    
    return {
        valid,
        errorMsg
    };
}