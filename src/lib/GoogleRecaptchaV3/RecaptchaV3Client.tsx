"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        grecaptcha?: {
            ready: (cb: () => void) => void;
            execute: (
                siteKey: string,
                options: { action: string }
            ) => Promise<string>;
        };
    }
}

const googleRecaptchaSiteKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY;
if (!googleRecaptchaSiteKey) throw new Error("Error: Environment variable \"NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY\" is not defined");

type GoogleRecaptchaV3Props = {
    action: string;
    onToken?: (token: string | null) => void;
    trigger?: number;
    inputId?: string;
};

export default function RecaptchaV3Client({
    action,
    onToken,
    trigger,
    inputId = "recaptcha-token",
}: GoogleRecaptchaV3Props) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;

    const executeRecaptcha = useCallback(async () => {
        if (!googleRecaptchaSiteKey) return;
        if (!window.grecaptcha) return;

        window.grecaptcha.ready(async () => {
            try {
                const nextToken = await window.grecaptcha?.execute(
                    googleRecaptchaSiteKey,
                    { action }
                );

                setToken(nextToken || null);
                onToken?.(nextToken || null);
            } catch (e) {
                console.error("Recaptcha error", e);
                setToken(null);
                onToken?.(null);
            }
        });
    }, [action, onToken]);

    useEffect(() => {
        if (isLoaded && typeof trigger === "number") {
            void executeRecaptcha();
        }
    }, [action, executeRecaptcha, isLoaded, onToken, trigger]);


    return (
        <>
            <Script
                src={scriptSrc}
                strategy="afterInteractive"
                onLoad={() => {
                    setIsLoaded(true);
                    if (typeof trigger !== "number") {
                        void executeRecaptcha();
                    }
                }}
            />
            <input type="hidden" name="recaptchaToken" id={inputId} value={token || ""} readOnly />
        </>
    );
}