import nodemailer from 'nodemailer';
import { SENDER_MAIL_HOST, SENDER_MAIL_PORT, SENDER_MAIL_USER, SENDER_USER_PASSWORD, SECURE_CONNECTION, TLS_CIPHERS} from '@/lib/envariables';

interface MailTransportType {
     host: string;
     secureConnection: boolean;
     port: number;
     tls: {
        ciphers: string;
     }
     auth: {
        user: string;
        pass: string;
     }
}

//Outlook
export const outlookTransporter = nodemailer.createTransport({
    host: SENDER_MAIL_HOST, // hostname
    secureConnection: SECURE_CONNECTION, // TLS requires secureConnection to be false
    port: SENDER_MAIL_PORT, // port for secure SMTP
    tls: {
        ciphers:TLS_CIPHERS
    },
    auth: {
        user: SENDER_MAIL_USER,
        pass: SENDER_USER_PASSWORD
    }
} as MailTransportType);