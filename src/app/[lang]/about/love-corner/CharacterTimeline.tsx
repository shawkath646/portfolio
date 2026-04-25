"use client";

import { useMemo, useState, useCallback, memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiClock, FiHeart } from "react-icons/fi";
import { formatDateTime } from "@/utils/dateTime";

const DATE_FORMAT_OPTIONS = { onlyDate: true, showYear: true } as const;
const RELATIONSHIP_COLOR_PALETTE: [string, string][] = [
    ["#ff7eb3", "#ff758c"],
    ["#8b5cf6", "#ec4899"],
    ["#22d3ee", "#14b8a6"],
    ["#f97316", "#fb7185"],
    ["#60a5fa", "#a78bfa"],
    ["#34d399", "#22d3ee"],
];
const TOOLTIP_WIDTH = 256;
const TOOLTIP_HEIGHT = 120;
const TOOLTIP_OFFSET_X = 14;
const TOOLTIP_OFFSET_Y = 18;
const TOOLTIP_EDGE_GAP = 10;

type RelationshipSegment = {
    id: number | string;
    name: string;
    start: string;
    end?: string | null;
};

type RelationshipMetrics = RelationshipSegment & {
    startDate: Date;
    endDate: Date;
    left: number;
    width: number;
    row: number;
    barColor: [string, string];
};

interface CharacterTimelineProps {
    dateOfBirth: Date;
    relationships: RelationshipSegment[];
}

interface TooltipState {
    relationship: RelationshipMetrics;
    x: number;
    y: number;
}

interface TimelineContainerProps {
    dateOfBirth: Date;
    currentDate: Date;
    relationships: RelationshipMetrics[];
    markerYears: number[];
    isDenseScale: boolean;
    shouldReduceMotion: boolean;
    tooltip: TooltipState | null;
    onOpenTooltip: (relationship: RelationshipMetrics, x: number, y: number) => void;
    onMoveTooltip: (x: number, y: number) => void;
    onCloseTooltip: () => void;
}

interface TimelineAxisProps {
    markerYears: number[];
    dateOfBirth: Date;
    currentDate: Date;
    isDenseScale: boolean;
    axisTop: number;
    shouldReduceMotion: boolean;
}

interface RelationshipBarProps {
    relationship: RelationshipMetrics;
    index: number;
    shouldReduceMotion: boolean;
    rowTop: number;
    onOpenTooltip: (relationship: RelationshipMetrics, x: number, y: number) => void;
    onMoveTooltip: (x: number, y: number) => void;
    onCloseTooltip: () => void;
}

interface FloatingTooltipProps {
    tooltip: TooltipState;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toStartOfDay = (dateValue: string | Date): Date => {
    const date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
    return date;
};


const formatDuration = (start: Date, end: Date) => {
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    if (end.getDate() < start.getDate()) {
        months -= 1;
    }

    const normalizedMonths = Math.max(months, 0);
    const years = Math.floor(normalizedMonths / 12);
    const remainingMonths = normalizedMonths % 12;

    if (years === 0 && remainingMonths === 0) {
        return "Less than 1 month";
    }

    if (years > 0 && remainingMonths > 0) {
        return `${years}y ${remainingMonths}m`;
    }

    if (years > 0) {
        return years === 1 ? "1 year" : `${years} years`;
    }

    return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
};

const getPositionPercent = (date: Date, start: Date, end: Date) => {
    const boundedDate = clamp(date.getTime(), start.getTime(), end.getTime());
    const total = Math.max(end.getTime() - start.getTime(), 1);
    return ((boundedDate - start.getTime()) / total) * 100;
};

const buildYearMarkers = (dateOfBirth: Date, currentDate: Date) => {
    const years: number[] = [];
    for (let year = dateOfBirth.getFullYear(); year <= currentDate.getFullYear(); year += 1) {
        years.push(year);
    }
    return years;
};

const pickPaletteColor = (seed: string | number) => {
    const text = String(seed);
    let hash = 0;

    for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }

    return RELATIONSHIP_COLOR_PALETTE[hash % RELATIONSHIP_COLOR_PALETTE.length];
};

const getClampedTooltipPosition = (cursorX: number, cursorY: number) => {
    if (typeof window === "undefined") {
        return { x: cursorX, y: cursorY };
    }

    const viewportMaxX = Math.max(window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_EDGE_GAP, TOOLTIP_EDGE_GAP);
    const viewportMaxY = Math.max(window.innerHeight - TOOLTIP_HEIGHT - TOOLTIP_EDGE_GAP, TOOLTIP_EDGE_GAP);

    let x = cursorX + TOOLTIP_OFFSET_X;
    let y = cursorY - TOOLTIP_OFFSET_Y;

    x = clamp(x, TOOLTIP_EDGE_GAP, viewportMaxX);
    y = clamp(y, TOOLTIP_EDGE_GAP, viewportMaxY);

    return { x, y };
};

const TimelineAxis = ({ markerYears, dateOfBirth, currentDate, isDenseScale, axisTop, shouldReduceMotion }: TimelineAxisProps) => {
    return (
        <div className="absolute left-0 right-0" style={{ top: axisTop }}>
            <motion.div
                initial={{ scaleX: 0, opacity: 0.6 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
                className="absolute left-0 right-0 top-0 h-0.5 origin-left rounded-full bg-linear-to-r from-pink-300/60 via-rose-300/80 to-sky-300/70 dark:from-pink-400/30 dark:via-rose-300/45 dark:to-cyan-300/35 shadow-[0_0_18px_rgba(251,113,133,0.25)]"
            />

            {markerYears.map((year) => {
                const markerDate = new Date(year, 0, 1);
                const left = getPositionPercent(markerDate, dateOfBirth, currentDate);
                const isMajor = year % (isDenseScale ? 10 : 5) === 0 || year === dateOfBirth.getFullYear() || year === currentDate.getFullYear();
                const isFirst = year === dateOfBirth.getFullYear();
                const isLast = year === currentDate.getFullYear();

                return (
                    <div
                        key={year}
                        className="absolute top-0"
                        style={{ left: `${left}%` }}
                    >
                        <div className={`h-3 w-px ${isMajor ? "bg-white/35 dark:bg-white/40" : "bg-white/20 dark:bg-white/20"}`} />
                        <span
                            className={`mt-2 absolute text-[10px] font-medium tracking-wide text-slate-600/70 dark:text-slate-300/70 ${isFirst
                                ? "left-0"
                                : isLast
                                    ? "right-0"
                                    : "left-1/2 -translate-x-1/2"
                                } ${isMajor ? "opacity-90" : "opacity-35 hidden md:block"
                                }`}
                        >
                            {year}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

TimelineAxis.displayName = "TimelineAxis";
const MemoTimelineAxis = memo(TimelineAxis);


const RelationshipBar = ({ relationship, index, shouldReduceMotion, rowTop, onOpenTooltip, onMoveTooltip, onCloseTooltip }: RelationshipBarProps) => {
    return (
        <motion.button
            type="button"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${relationship.width}%`, opacity: 1 }}
            transition={{
                width: { duration: shouldReduceMotion ? 0.2 : 1.1, delay: shouldReduceMotion ? 0 : index * 0.08, ease: "easeOut" },
                opacity: { duration: 0.35, delay: index * 0.08 },
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -3, filter: "brightness(1.08)" }}
            className="absolute z-20 h-6 sm:h-7 rounded-2xl shadow-[0_8px_26px_rgba(8,10,26,0.32)] backdrop-blur-sm cursor-pointer overflow-hidden"
            style={{
                left: `${relationship.left}%`,
                top: rowTop,
                background: `linear-gradient(115deg, ${relationship.barColor[0]}, ${relationship.barColor[1]})`,
            }}
            onMouseEnter={(event) => onOpenTooltip(relationship, event.clientX, event.clientY)}
            onMouseMove={(event) => onMoveTooltip(event.clientX, event.clientY)}
            onMouseLeave={onCloseTooltip}
            onFocus={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                onOpenTooltip(relationship, rect.left + rect.width / 2, rect.top - 12);
            }}
            onBlur={onCloseTooltip}
            onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                onOpenTooltip(relationship, rect.left + rect.width / 2, rect.top - 12);
            }}
            aria-label={`${relationship.name}: ${formatDateTime(relationship.startDate, DATE_FORMAT_OPTIONS)} to ${formatDateTime(relationship.endDate, DATE_FORMAT_OPTIONS)}`}
        >
            <span className="relative z-10 block truncate px-2 sm:px-2.5 text-[11px] sm:text-xs font-semibold text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                {relationship.name}
            </span>
        </motion.button>
    );
};

RelationshipBar.displayName = "RelationshipBar";
const MemoRelationshipBar = memo(RelationshipBar);


const FloatingTooltip = ({ tooltip }: FloatingTooltipProps) => {
    const durationText = formatDuration(tooltip.relationship.startDate, tooltip.relationship.endDate);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.7 }}
            className="pointer-events-none fixed z-50 w-64 rounded-2xl border border-white/20 bg-white/14 dark:bg-slate-900/48 px-4 py-3 shadow-[0_10px_45px_rgba(0,0,0,0.28)] backdrop-blur-md"
            style={{ left: tooltip.x, top: tooltip.y }}
        >
            <div className="flex items-start gap-2.5">
                <span className="mt-0.5 rounded-full bg-white/18 p-1.5 text-rose-100">
                    <FiHeart className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{tooltip.relationship.name}</p>
                    <p className="mt-1 text-xs text-white/78">
                        {formatDateTime(tooltip.relationship.startDate, DATE_FORMAT_OPTIONS)} - {formatDateTime(tooltip.relationship.endDate, DATE_FORMAT_OPTIONS)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/66">
                        <FiClock className="h-3 w-3" />
                        {durationText}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};


const TimelineContainer = ({
    dateOfBirth,
    currentDate,
    relationships,
    markerYears,
    isDenseScale,
    shouldReduceMotion,
    tooltip,
    onOpenTooltip,
    onMoveTooltip,
    onCloseTooltip,
}: TimelineContainerProps) => {
    const rowHeight = 44;
    const rowStart = 10;
    const axisGap = 24;
    const axisTop = rowStart + (relationships.length * rowHeight) + axisGap;
    const timelineHeight = axisTop + 54;

    return (
        <section className="relative mx-auto w-full overflow-hidden rounded-3xl border border-white/20 bg-slate-950/45 px-4 py-8 sm:px-6 md:px-8">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-linear-to-br from-rose-300/10 via-transparent to-cyan-300/10" />
            </div>

            <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.26em] text-rose-100/70">Love Timeline</p>
                </div>

                <div className="custom-scrollbar overflow-x-hidden pb-4">
                    <div className="min-w-full lg:min-w-0">
                        <div className="relative overflow-x-clip" style={{ height: timelineHeight }}>
                            {relationships.map((relationship, index) => (
                                <MemoRelationshipBar
                                    key={relationship.id}
                                    relationship={relationship}
                                    index={index}
                                    shouldReduceMotion={shouldReduceMotion}
                                    rowTop={rowStart + (relationship.row * rowHeight)}
                                    onOpenTooltip={onOpenTooltip}
                                    onMoveTooltip={onMoveTooltip}
                                    onCloseTooltip={onCloseTooltip}
                                />
                            ))}
                            <MemoTimelineAxis
                                markerYears={markerYears}
                                dateOfBirth={dateOfBirth}
                                currentDate={currentDate}
                                isDenseScale={isDenseScale}
                                axisTop={axisTop}
                                shouldReduceMotion={shouldReduceMotion}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {tooltip && <FloatingTooltip tooltip={tooltip} />}
            </AnimatePresence>
        </section>
    );
};


export default function CharacterTimeline({ dateOfBirth, relationships }: CharacterTimelineProps) {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const shouldReduceMotion = useReducedMotion();

    const currentDate = useMemo(() => toStartOfDay(new Date()), []);
    const dob = useMemo(() => toStartOfDay(dateOfBirth), [dateOfBirth]);

    const timelineData = useMemo(() => {
        const parsed = relationships
            .map((item): RelationshipMetrics | null => {
                const startDate = toStartOfDay(item.start);
                const endDate = item.end ? toStartOfDay(item.end) : currentDate;
                if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
                    return null;
                }

                const safeStart = startDate < dob ? dob : startDate;
                const safeEnd = endDate > currentDate ? currentDate : endDate;
                if (safeEnd < dob) {
                    return null;
                }

                const left = getPositionPercent(safeStart, dob, currentDate);
                const right = getPositionPercent(safeEnd, dob, currentDate);
                const width = Math.max(right - left, 1.8);
                const barColor = pickPaletteColor(`${item.id}-${item.name}-${item.start}`);

                return {
                    ...item,
                    startDate: safeStart,
                    endDate: safeEnd,
                    left,
                    width,
                    row: 0,
                    barColor,
                };
            })
            .filter((item): item is RelationshipMetrics => item !== null)
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

        return parsed.map((item, index) => ({ ...item, row: index }));
    }, [relationships, dob, currentDate]);

    const markerYears = useMemo(() => buildYearMarkers(dob, currentDate), [dob, currentDate]);
    const isDenseScale = markerYears.length > 25;

    const handleOpenTooltip = useCallback((relationship: RelationshipMetrics, x: number, y: number) => {
        const nextPosition = getClampedTooltipPosition(x, y);
        setTooltip({ relationship, x: nextPosition.x, y: nextPosition.y });
    }, []);

    const handleMoveTooltip = useCallback((x: number, y: number) => {
        const nextPosition = getClampedTooltipPosition(x, y);
        setTooltip((current) => (current ? { ...current, x: nextPosition.x, y: nextPosition.y } : current));
    }, []);

    const handleCloseTooltip = useCallback(() => {
        setTooltip(null);
    }, []);

    return (
        <TimelineContainer
            dateOfBirth={dob}
            currentDate={currentDate}
            relationships={timelineData}
            markerYears={markerYears}
            isDenseScale={isDenseScale}
            shouldReduceMotion={shouldReduceMotion === true}
            tooltip={tooltip}
            onOpenTooltip={handleOpenTooltip}
            onMoveTooltip={handleMoveTooltip}
            onCloseTooltip={handleCloseTooltip}
        />
    );
}
