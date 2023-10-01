import { ChirpSubmitType, MsgErrorsType } from '@/lib/types';

export default async function validateChirpSubmitAPI(inputObj: ChirpSubmitType){
    const { message } = inputObj;
    let valid = true;
    const errorMsg: MsgErrorsType = {};

    if (message.length > 255){
        errorMsg.message = ['The message field must not be greater than 255 characters.'];
        valid = false;
    }

    if (valid){
        return {
         valid,
        };
    }
     
    return {
        valid,
        errorMsg
    };
}    