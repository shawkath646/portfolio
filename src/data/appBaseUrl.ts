const rawUrl = process.env.NEXT_PUBLIC_APP_BASE_URL ||
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
    "http://localhost:3000";

const appBaseUrl = Object.freeze(new URL(rawUrl));

export default appBaseUrl;