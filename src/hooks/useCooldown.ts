"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export function useCooldown(defaultDurationSeconds: number = 5) {
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearCooldown = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const startCooldown = useCallback((duration: number = defaultDurationSeconds) => {
        clearCooldown();

        setCooldown(duration);

        intervalRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearCooldown();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [defaultDurationSeconds, clearCooldown]);

    useEffect(() => {
        return clearCooldown;
    }, [clearCooldown]);

    return {
        cooldown,
        isCoolingDown: cooldown > 0,
        startCooldown,
        clearCooldown,
    };
}