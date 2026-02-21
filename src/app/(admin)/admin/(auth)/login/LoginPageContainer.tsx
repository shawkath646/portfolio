"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiShield, FiCheck } from "react-icons/fi";
import { performLogin, verify2FA } from "@/actions/authentication/authActions";
import PasswordForm from "./PasswordForm";
import VerificationForm from "./VerificationForm";

const steps = [
  { icon: FiLock, label: "Password" },
  { icon: FiShield, label: "Verify" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-5">
      {steps.map((s, i) => {
        const isCompleted = currentStep > i;
        const isActive = currentStep === i;
        const Icon = isCompleted ? FiCheck : s.icon;

        return (
          <div key={i} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? "rgb(34 197 94)"
                    : isActive
                      ? "rgb(99 102 241)"
                      : "rgba(255 255 255 / 0.08)",
                  borderColor: isCompleted
                    ? "rgb(34 197 94)"
                    : isActive
                      ? "rgb(129 140 248)"
                      : "rgba(255 255 255 / 0.15)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center"
              >
                <motion.div
                  key={isCompleted ? "check" : "icon"}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Icon
                    className={`text-xs sm:text-sm ${isCompleted || isActive ? "text-white" : "text-gray-500"
                      }`}
                  />
                </motion.div>
              </motion.div>
              <motion.span
                initial={false}
                animate={{
                  color: isCompleted
                    ? "rgb(134 239 172)"
                    : isActive
                      ? "rgb(199 210 254)"
                      : "rgb(107 114 128)",
                }}
                className="text-[9px] sm:text-[10px] font-medium tracking-wide uppercase"
              >
                {s.label}
              </motion.span>
            </div>

            {i < steps.length - 1 && (
              <div className="w-8 sm:w-12 h-px mb-4 relative overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 bg-green-400 origin-left"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LoginPageContainer() {
  const [step, setStep] = useState(0);
  const [password, setPassword] = useState("");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const handlePasswordSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await performLogin(password);
      if (!response.success) {
        setError(response.message);
        setIsLoading(false);
        return;
      }

      setAttemptId(response.attemptId ?? null);
      setIsLoading(false);
      setStep(1);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    if (!attemptId) return;
    setError("");
    setIsLoading(true);

    try {
      const response = await verify2FA(attemptId, code);
      if (response.success) {
        router.replace(redirectUrl);
      } else {
        setError(response.message);
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-8"
        role="region"
        aria-labelledby="login-heading"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <PasswordForm
              key="password"
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              error={error}
              onSubmit={handlePasswordSubmit}
              stepIndicator={<StepIndicator currentStep={0} />}
            />
          )}

          {step === 1 && (
            <VerificationForm
              key="verify"
              isLoading={isLoading}
              error={error}
              onSubmit={handleVerificationSubmit}
              stepIndicator={<StepIndicator currentStep={1} />}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
