"use client";
import { useLayoutEffect } from "react";

export default function useLockBodyScroll(isOpen: boolean = true) {
    useLayoutEffect(() => {
        if (!isOpen) return;

        const body = document.body;

        const scrollBarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        const originalOverflow = body.style.overflow;
        const originalPaddingRight = body.style.paddingRight;

        body.style.overflow = "hidden";
        body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            body.style.overflow = originalOverflow;
            body.style.paddingRight = originalPaddingRight;
        };
    }, [isOpen]);
}