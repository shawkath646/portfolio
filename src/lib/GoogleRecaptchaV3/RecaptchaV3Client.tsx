"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
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

export interface RecaptchaV3Handle {
    execute: () => Promise<string>;
}

type GoogleRecaptchaV3Props = {
    action: string;
    inputId?: string;
};

const RecaptchaV3Client = forwardRef<RecaptchaV3Handle, GoogleRecaptchaV3Props>(
    ({ action, inputId = "recaptcha-token" }, ref) => {
        const [token, setToken] = useState<string | null>(null);
        const scriptSrc = `https://www.google.com/recaptcha/api.js?render=${googleRecaptchaSiteKey}`;

        useImperativeHandle(ref, () => ({
            execute: () => {
                return new Promise<string>((resolve, reject) => {
                    if (!window.grecaptcha) {
                        reject(new Error("reCAPTCHA script has not loaded yet."));
                        return;
                    }

                    window.grecaptcha.ready(async () => {
                        try {
                            const nextToken = await window.grecaptcha!.execute(
                                googleRecaptchaSiteKey,
                                { action }
                            );
                            setToken(nextToken);
                            resolve(nextToken);
                        } catch (e) {
                            console.error("Recaptcha error", e);
                            reject(e);
                        }
                    });
                });
            }
        }), [action]);

        return (
            <>
                <Script
                    src={scriptSrc}
                    strategy="afterInteractive"
                />
                <input type="hidden" name="recaptchaToken" id={inputId} value={token || ""} readOnly />
            </>
        );
    }
);

RecaptchaV3Client.displayName = "RecaptchaV3Client";

export default RecaptchaV3Client;