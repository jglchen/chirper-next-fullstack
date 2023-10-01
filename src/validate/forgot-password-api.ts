import prisma from '@/lib/prisma';
import { ForgotPasswordType, ErrorsType } from '@/lib/types';

export default async function validateForgotPasswordAPI(inputObj: ForgotPasswordType){
    const {email} = inputObj;
    let valid = true;
    const errorMsg: ErrorsType = {};

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if (!user){
        errorMsg.email = ["We can't find a user with that email address."];
        valid = false;
        return {
            valid,
            errorMsg
        };
    }

    return {
        valid,
        user
    };
}    