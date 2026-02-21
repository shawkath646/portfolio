"use server";

import { APIResponseType } from "@/types/common.types";
import { RecaptchaEnterpriseAssessment } from "@/types/recaptcha.types";
import { getEnv } from "@/utils/getEnv";

const googleRecaptchaSiteKey = getEnv("NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY");
const googleApiKey = getEnv("GOOGLE_API_KEY");

const SCORE_THRESHOLD = 0.5;

export default async function verifyRecaptchaToken(
    token: string,
    action: string
): Promise<APIResponseType> {
    try {
        const res = await fetch(
            `https://recaptchaenterprise.googleapis.com/v1/projects/shawkath646-portfolio/assessments?key=${googleApiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    event: {
                        token,
                        expectedAction: action,
                        siteKey: googleRecaptchaSiteKey,
                    },
                }),
            }
        );

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to verify reCAPTCHA.",
            };
        }

        const data = (await res.json()) as RecaptchaEnterpriseAssessment;

        if (!data.tokenProperties?.valid) {
            return {
                success: false,
                message: "Invalid reCAPTCHA token.",
            };
        }

        if (data.tokenProperties.action !== action) {
            return {
                success: false,
                message: "reCAPTCHA action mismatch.",
            };
        }

        if (
            data.tokenProperties.hostname &&
            data.tokenProperties.hostname !== "localhost" &&
            !data.tokenProperties.hostname.includes("yourdomain.com")
        ) {
            return {
                success: false,
                message: "Invalid reCAPTCHA hostname.",
            };
        }

        const score = data.riskAnalysis?.score ?? 0;

        if (score < SCORE_THRESHOLD) {
            return {
                success: false,
                message: "Suspicious activity detected.",
            };
        }

        return {
            success: true,
            message: "reCAPTCHA verification successful.",
        };
    } catch (error) {
        console.error("reCAPTCHA verification error:", error);

        return {
            success: false,
            message: "Error verifying reCAPTCHA.",
        };
    }
}
