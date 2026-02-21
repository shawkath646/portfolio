type RecaptchaInvalidReason =
    | "INVALID_REASON_UNSPECIFIED"
    | "UNKNOWN_INVALID_REASON"
    | "MALFORMED"
    | "EXPIRED"
    | "DUPE"
    | "MISSING";

type RecaptchaRiskReason =
    | "LOW_CONFIDENCE_SCORE"
    | "AUTOMATION"
    | "UNEXPECTED_ENVIRONMENT"
    | "TOO_MUCH_TRAFFIC"
    | "UNEXPECTED_USAGE_PATTERNS";

export interface RecaptchaEnterpriseAssessment {
    name: string;

    riskAnalysis: {
        score: number;
        reasons: RecaptchaRiskReason[];
        extendedVerdictReasons?: string[];
    };

    tokenProperties: {
        valid: boolean;
        invalidReason: RecaptchaInvalidReason;
        hostname: string;
        action: string;
        createTime: string;
    };

    accountDefenderAssessment?: {
        labels: string[];
    };
}