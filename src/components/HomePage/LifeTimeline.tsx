"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FaCalendarDay, FaCompass, FaArrowsAltH } from "react-icons/fa";
import { LifeEvent } from "@/types/common.types";

interface LifeTimelineProps {
    lifeEvents: LifeEvent[];
}

type TooltipPlacement = "top" | "bottom";

interface TooltipData {
    id: string;
    x: number;
    y: number;
    placement: TooltipPlacement;
}

const TOOLTIP_GAP = 14;
const VIEWPORT_GUTTER = 12;
const MOBILE_TOOLTIP_WIDTH = 256;
const DESKTOP_TOOLTIP_WIDTH = 320;

export default function LifeTimelineCarousel({ lifeEvents }: LifeTimelineProps) {
    const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

    const scrollContainerRef = useRef<HTMLOListElement>(null);
    const nearestItemRef = useRef<HTMLLIElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { sortedEvents, nearestEventId } = useMemo(() => {
        const sorted = [...lifeEvents].sort((a, b) => {
            const monthA = a.timestamp.getMonth();
            const monthB = b.timestamp.getMonth();
            if (monthA !== monthB) return monthA - monthB;
            return a.timestamp.getDate() - b.timestamp.getDate();
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let closestId = sorted[0]?.id;
        let minDiff = Infinity;

        sorted.forEach((event) => {
            const anniversary = new Date(today.getFullYear(), event.timestamp.getMonth(), event.timestamp.getDate());
            if (anniversary.getTime() < today.getTime()) {
                anniversary.setFullYear(today.getFullYear() + 1);
            }
            const diff = anniversary.getTime() - today.getTime();
            if (diff < minDiff) {
                minDiff = diff;
                closestId = event.id;
            }
        });

        return { sortedEvents: sorted, nearestEventId: closestId };
    }, [lifeEvents]);

    useEffect(() => {
        if (nearestItemRef.current && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const item = nearestItemRef.current;
            const scrollPosition = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
            container.scrollTo({ left: scrollPosition, behavior: "smooth" });
        }
    }, [nearestEventId]);

    const calculateTooltipPosition = useCallback((target: HTMLElement) => {
        const rect = target.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const tooltipWidth = viewportWidth < 640 ? MOBILE_TOOLTIP_WIDTH : DESKTOP_TOOLTIP_WIDTH;
        const centeredX = rect.left + (rect.width / 2);

        const minX = VIEWPORT_GUTTER + (tooltipWidth / 2);
        const maxX = viewportWidth - VIEWPORT_GUTTER - (tooltipWidth / 2);
        const x = Math.min(Math.max(centeredX, minX), maxX);

        const estimatedTooltipHeight = 172;
        const hasRoomAbove = rect.top > estimatedTooltipHeight + VIEWPORT_GUTTER;

        return {
            x,
            y: hasRoomAbove ? rect.top - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP,
            placement: hasRoomAbove ? "top" as const : "bottom" as const,
        };
    }, []);

    const openTooltip = useCallback((target: HTMLElement, id: string) => {
        const position = calculateTooltipPosition(target);
        setTooltipData({ id, ...position });
    }, [calculateTooltipPosition]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, id: string) => {
        openTooltip(e.currentTarget as HTMLElement, id);
    };

    const closeTooltip = () => setTooltipData(null);

    useEffect(() => {
        window.addEventListener("scroll", closeTooltip, { passive: true });
        window.addEventListener("resize", closeTooltip, { passive: true });
        const container = scrollContainerRef.current;
        if (container) container.addEventListener("scroll", closeTooltip, { passive: true });

        return () => {
            window.removeEventListener("scroll", closeTooltip);
            window.removeEventListener("resize", closeTooltip);
            if (container) container.removeEventListener("scroll", closeTooltip);
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeTooltip();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // --- NEW: Recalculate states for the active teleported popup ---
    const activeEventData = sortedEvents.find((e) => e.id === tooltipData?.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let isPopupToday = false;
    let isPopupPastThisYear = false;

    if (activeEventData) {
        const eDate = activeEventData.timestamp;
        isPopupToday = today.getMonth() === eDate.getMonth() && today.getDate() === eDate.getDate();
        const anniversaryThisYear = new Date(today.getFullYear(), eDate.getMonth(), eDate.getDate());
        isPopupPastThisYear = anniversaryThisYear.getTime() < today.getTime() && !isPopupToday;
    }

    return (
        <section
            aria-labelledby="timeline-heading"
            className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 font-sans relative"
        >
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-linear-to-br from-blue-100 to-blue-50 dark:from-blue-900/60 dark:to-blue-950 rounded-2xl shadow-inner border border-blue-200/50 dark:border-blue-800/50 shrink-0">
                        <FaCompass className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div>
                        <h2
                            id="timeline-heading"
                            className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-950 to-blue-700 dark:from-blue-50 dark:to-blue-300 tracking-tight"
                        >
                            Milestones & Journey
                        </h2>
                        <p className="flex items-center gap-2 text-blue-700/80 dark:text-blue-300/80 mt-1 text-sm font-medium">
                            <FaArrowsAltH className="w-3.5 h-3.5 opacity-60" />
                            Swipe or scroll to explore
                        </p>
                    </div>
                </div>
            </header>

            <div className="relative w-full">
                <ol
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-5 pt-8 pb-8 px-4 -mx-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {sortedEvents.map((event) => {
                        const eventDate = event.timestamp;
                        const day = eventDate.getDate();
                        const month = eventDate.toLocaleString("default", { month: "short" });
                        const originalYear = eventDate.getFullYear();

                        const isToday = today.getMonth() === eventDate.getMonth() && today.getDate() === eventDate.getDate();
                        const anniversaryThisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate());
                        const isPastThisYear = anniversaryThisYear.getTime() < today.getTime() && !isToday;
                        const isNearest = event.id === nearestEventId;

                        return (
                            <li
                                key={event.id}
                                ref={isNearest ? nearestItemRef : null}
                                className="snap-center shrink-0 relative group z-10"
                                data-event-id={event.id}
                                onMouseEnter={(e) => handleInteraction(e, event.id)}
                                onMouseLeave={closeTooltip}
                                onClick={(e) => {
                                    if (tooltipData?.id === event.id) closeTooltip();
                                    else handleInteraction(e, event.id);
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Show details for ${event.title}`}
                                aria-expanded={tooltipData?.id === event.id}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        if (tooltipData?.id === event.id) closeTooltip();
                                        else openTooltip(e.currentTarget, event.id);
                                    }
                                }}
                            >
                                <motion.div
                                    whileHover={shouldReduceMotion ? undefined : { scale: 1.04, y: -3 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 24 }}
                                    className={`flex flex-col items-center justify-center w-28 h-28 rounded-3xl cursor-pointer border-2 transition-all duration-300 shadow-sm ${isToday
                                        ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/40 dark:bg-blue-600 dark:border-blue-400"
                                        : isPastThisYear
                                            ? "bg-blue-50 border-blue-200 hover:border-blue-400 dark:bg-blue-950/40 dark:border-blue-800/50 dark:hover:border-blue-600"
                                            : "bg-transparent border-dashed border-blue-200/70 hover:border-blue-300 dark:border-blue-800/40 dark:hover:border-blue-700"
                                        }`}
                                >
                                    <time
                                        dateTime={eventDate.toISOString()}
                                        className="flex flex-col items-center pointer-events-none"
                                    >
                                        <span className="sr-only">{event.title}</span>
                                        <span
                                            aria-hidden="true"
                                            className={`text-3xl font-black tracking-tighter leading-none ${isToday ? "text-white" : isPastThisYear ? "text-blue-900 dark:text-blue-100" : "text-blue-400/70 dark:text-blue-500/50"
                                                }`}
                                        >
                                            {day}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={`text-xs font-bold uppercase tracking-widest mt-0.5 ${isToday ? "text-white/90" : isPastThisYear ? "text-blue-600 dark:text-blue-400" : "text-blue-400/70 dark:text-blue-500/50"
                                                }`}
                                        >
                                            {month}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className={`text-[10px] mt-0.5 font-medium ${isToday ? "text-white/80" : isPastThisYear ? "text-blue-800/50 dark:text-blue-300/50" : "text-blue-400/50 dark:text-blue-600/50"
                                                }`}
                                        >
                                            {originalYear}
                                        </span>
                                    </time>
                                </motion.div>
                            </li>
                        );
                    })}
                </ol>
            </div>

            <AnimatePresence>
                {activeEventData && tooltipData && (
                    <motion.div
                        key={tooltipData.id}
                        initial={{
                            opacity: 0,
                            y: tooltipData.placement === "top" ? 8 : -8,
                            scale: 0.96,
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                            opacity: 0,
                            y: tooltipData.placement === "top" ? 6 : -6,
                            scale: 0.96,
                        }}
                        transition={
                            shouldReduceMotion
                                ? { duration: 0.12 }
                                : { type: "spring", stiffness: 420, damping: 32, mass: 0.8 }
                        }
                        className={`fixed z-9999 -translate-x-1/2 w-64 sm:w-80 p-4 bg-white/95 dark:bg-gray-950/95 rounded-2xl shadow-2xl pointer-events-none ring-1 ring-black/5 dark:ring-white/10 ${tooltipData.placement === "top" ? "-translate-y-full" : ""
                            }`}
                        style={{
                            left: tooltipData.x,
                            top: tooltipData.y,
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-2 rounded-full shadow-inner shrink-0 ${isPopupToday
                                ? "bg-blue-500 text-white dark:bg-blue-600"
                                : "bg-blue-50 dark:bg-blue-900/50"
                                }`}>
                                <FaCalendarDay className={
                                    isPopupToday
                                        ? "text-white"
                                        : isPopupPastThisYear
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-blue-400 dark:text-blue-600"
                                } />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-blue-950 dark:text-white leading-snug wrap-break-word">
                                    {activeEventData.title}
                                </p>
                                {activeEventData.desc && (
                                    <p className="text-xs text-blue-800/80 dark:text-blue-200/80 mt-1.5 leading-relaxed wrap-break-word">
                                        {activeEventData.desc}
                                    </p>
                                )}
                                <p className="text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 mt-2 font-bold">
                                    {isPopupToday ? "Happening Today" : isPopupPastThisYear ? "Passed This Year" : "Coming Up"}
                                </p>
                            </div>
                        </div>
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent ${tooltipData.placement === "top"
                                ? "top-full -mt-px border-t-white dark:border-t-blue-950"
                                : "bottom-full -mb-px border-b-white dark:border-b-blue-950"
                                }`}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}