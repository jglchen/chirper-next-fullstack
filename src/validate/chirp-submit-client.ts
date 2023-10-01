import { ChirpSubmitType, MsgErrorsType } from '@/lib/types';

export default function validateChirpSubmitClient(inputObj: ChirpSubmitType){
    const { message } = inputObj;
    const errorMsg: MsgErrorsType = {};
    let valid = true;

    if (!message){
        errorMsg.message = ['This field is required.'];
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