export function getHostURL() {
    if (typeof window !== "undefined"){
        return `${window.location.protocol}//${window.location.host}`;
    }
    return process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_PRO_SITE_URL: process.env.NEXT_PUBLIC_DEV_SITE_URL;
}    