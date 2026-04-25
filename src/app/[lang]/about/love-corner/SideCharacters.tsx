"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiCircle, FiHeart, FiMessageCircle } from "react-icons/fi";
import { LuSparkles } from "react-icons/lu";
import { formatDateTime } from "@/utils/dateTime";

const DATE_FORMAT_OPTIONS = { onlyDate: true, showYear: true } as const;
const TOOLTIP_WIDTH = 260;
const TOOLTIP_HEIGHT = 140;
const TOOLTIP_EDGE_GAP = 10;

type SideCharacterType = "proposed" | "talking" | "random" | "unexpected" | "other";

type SideCharacter = {
	id: number | string;
	name: string;
	type: SideCharacterType | string;
	date: string;
	note?: string;
	color?: [string, string];
	icon?: "heart" | "chat" | "sparkles" | "dot";
};

type TooltipState = {
	character: SideCharacter;
	x: number;
	y: number;
};

type SideCharactersContainerProps = {
	characters?: SideCharacter[];
	title?: string;
	subtitle?: string;
};

type SideCharacterCardProps = {
	character: SideCharacter;
	index: number;
	reduceMotion: boolean;
	onOpenTooltip: (character: SideCharacter, x: number, y: number) => void;
	onMoveTooltip: (x: number, y: number) => void;
	onCloseTooltip: () => void;
};

type SideCharacterTooltipProps = {
	tooltip: TooltipState;
};

const DEFAULT_COLORS: [string, string] = ["#64748b", "#334155"];

const sideCharacters: SideCharacter[] = [
	{
		id: 1,
		name: "M.",
		type: "proposed",
		date: "2021-08-14",
		note: "Random proposal out of nowhere.",
		color: ["#facc15", "#f59e0b"],
		icon: "heart",
	},
	{
		id: 2,
		name: "N.",
		type: "talking",
		date: "2022-03-22",
		note: "Short conversation, meaningful tone.",
		color: ["#38bdf8", "#0ea5e9"],
		icon: "chat",
	},
	{
		id: 3,
		name: "R.",
		type: "random",
		date: "2023-01-08",
		note: "Unexpected hello that stayed in memory.",
		color: ["#a78bfa", "#7c3aed"],
		icon: "sparkles",
	},
	{
		id: 4,
		name: "A.",
		type: "unexpected",
		date: "2023-07-11",
		note: "An intense but brief connection.",
		color: ["#fb7185", "#e11d48"],
		icon: "heart",
	},
	{
		id: 5,
		name: "S.",
		type: "talking",
		date: "2024-02-17",
		note: "A kind person, met for one conversation.",
		color: ["#22d3ee", "#06b6d4"],
		icon: "chat",
	},
	{
		id: 6,
		name: "T.",
		type: "random",
		date: "2024-11-03",
		note: "A quick encounter with unusual timing.",
		color: ["#f97316", "#ea580c"],
		icon: "sparkles",
	},
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const seedNumber = (value: string | number) => {
	const text = String(value);
	let hash = 0;

	for (let index = 0; index < text.length; index += 1) {
		hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
	}

	return hash;
};

const resolveCardStyle = (character: SideCharacter, index: number) => {
	const seed = seedNumber(`${character.id}-${character.date}-${index}`);
	const rotation = ((seed % 5) - 2) * 0.7;
	const yOffset = (seed % 9) - 4;
	const zIndex = 10 + (seed % 20);
	const duration = 6 + (seed % 4);
	const delay = (seed % 10) * 0.1;

	return { rotation, yOffset, zIndex, duration, delay };
};

const formatType = (type: string) => {
	if (!type) {
		return "Unknown";
	}

	return type.charAt(0).toUpperCase() + type.slice(1);
};

const renderTypeIcon = (type: string, icon: SideCharacter["icon"] | undefined, className: string) => {
	const normalized = (icon ?? type ?? "").toLowerCase();

	if (normalized.includes("heart") || normalized.includes("proposed")) {
		return <FiHeart className={className} />;
	}

	if (normalized.includes("chat") || normalized.includes("talk")) {
		return <FiMessageCircle className={className} />;
	}

	if (normalized.includes("spark") || normalized.includes("random") || normalized.includes("unexpected")) {
		return <LuSparkles className={className} />;
	}

	return <FiCircle className={className} />;
};

const getTooltipPosition = (cursorX: number, cursorY: number) => {
	if (typeof window === "undefined") {
		return { x: cursorX, y: cursorY };
	}

	const maxX = Math.max(window.innerWidth - TOOLTIP_WIDTH - TOOLTIP_EDGE_GAP, TOOLTIP_EDGE_GAP);
	const maxY = Math.max(window.innerHeight - TOOLTIP_HEIGHT - TOOLTIP_EDGE_GAP, TOOLTIP_EDGE_GAP);

	const x = clamp(cursorX + 16, TOOLTIP_EDGE_GAP, maxX);
	const y = clamp(cursorY - 20, TOOLTIP_EDGE_GAP, maxY);

	return { x, y };
};

const SideCharacterTooltip = ({ tooltip }: SideCharacterTooltipProps) => {
	const gradient = tooltip.character.color ?? DEFAULT_COLORS;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.92, y: 8 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95, y: 6 }}
			transition={{ duration: 0.2, ease: "easeOut", delay: 0.06 }}
			className="pointer-events-none fixed z-70 w-65 rounded-2xl border border-white/20 bg-slate-950/70 p-3 shadow-[0_14px_50px_rgba(2,6,23,0.6)] backdrop-blur-lg"
			style={{
				left: tooltip.x,
				top: tooltip.y,
				backgroundImage: `linear-gradient(135deg, ${gradient[0]}20, ${gradient[1]}10)`,
			}}
		>
			<div className="flex items-start gap-2.5">
				<span
					className="rounded-lg p-1.5 text-white/90"
					style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
				>
					{renderTypeIcon(tooltip.character.type, tooltip.character.icon, "h-3.5 w-3.5")}
				</span>

				<div className="min-w-0">
					<p className="truncate text-sm font-semibold text-white">{tooltip.character.name}</p>
					<p className="text-xs uppercase tracking-[0.16em] text-white/65">{formatType(tooltip.character.type)}</p>
					<p className="mt-1.5 text-xs text-white/75">
						{formatDateTime(new Date(tooltip.character.date), DATE_FORMAT_OPTIONS)}
					</p>
					{tooltip.character.note && (
						<p className="mt-1.5 line-clamp-2 text-xs text-white/78">{tooltip.character.note}</p>
					)}
				</div>
			</div>
		</motion.div>
	);
};

const SideCharacterCard = ({
	character,
	index,
	reduceMotion,
	onOpenTooltip,
	onMoveTooltip,
	onCloseTooltip,
}: SideCharacterCardProps) => {
	const gradient = character.color ?? DEFAULT_COLORS;
	const styleSeed = resolveCardStyle(character, index);

	return (
		<motion.button
			type="button"
			className="group relative w-fit max-w-full rounded-full border border-white/14 px-3.5 py-2 text-left backdrop-blur-md"
			style={{
				rotate: styleSeed.rotation,
				zIndex: styleSeed.zIndex,
				background: "linear-gradient(145deg, rgba(15,23,42,0.54), rgba(2,6,23,0.42))",
				boxShadow: `0 8px 24px rgba(2, 6, 23, 0.3), 0 0 0 1px ${gradient[0]}1c inset`,
			}}
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: styleSeed.yOffset }}
			transition={{
				duration: reduceMotion ? 0.2 : 0.45,
				delay: reduceMotion ? 0 : index * 0.07,
				ease: "easeOut",
			}}
			whileHover={{ scale: 1.05, y: styleSeed.yOffset - 4, rotate: styleSeed.rotation * 0.4 }}
			onMouseEnter={(event) => onOpenTooltip(character, event.clientX, event.clientY)}
			onMouseMove={(event) => onMoveTooltip(event.clientX, event.clientY)}
			onMouseLeave={onCloseTooltip}
			onFocus={(event) => {
				const rect = event.currentTarget.getBoundingClientRect();
				onOpenTooltip(character, rect.left + rect.width / 2, rect.top - 16);
			}}
			onBlur={onCloseTooltip}
			aria-label={`${character.name} ${formatType(character.type)} on ${formatDateTime(new Date(character.date), DATE_FORMAT_OPTIONS)}`}
		>
			<motion.div
				className="absolute inset-0 rounded-full opacity-45 transition-opacity duration-300 group-hover:opacity-75"
				style={{
					background: `radial-gradient(circle at 18% 22%, ${gradient[0]}3c 0%, transparent 44%), radial-gradient(circle at 82% 78%, ${gradient[1]}38 0%, transparent 42%)`,
				}}
				animate={
					reduceMotion
						? undefined
						: {
							y: [0, -2, 0, 2, 0],
							scale: [1, 1.01, 1, 0.99, 1],
						}
				}
				transition={{
					duration: styleSeed.duration,
					repeat: Infinity,
					ease: "easeInOut",
					delay: styleSeed.delay,
				}}
			/>

			<div className="relative z-10 flex items-center gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<span
						className="rounded-full p-1.5 text-white/90"
						style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
					>
						{renderTypeIcon(character.type, character.icon, "h-3.5 w-3.5")}
					</span>
					<p className="truncate text-sm font-semibold text-white/92">{character.name}</p>
				</div>
				<span className="h-1 w-1 rounded-full bg-white/35" />
				<span className="truncate text-[10px] uppercase tracking-[0.12em] text-white/65">
					{formatType(character.type)}
				</span>
			</div>
		</motion.button>
	);
};

const MemoSideCharacterCard = memo(SideCharacterCard);

export function SideCharactersContainer({
	characters = sideCharacters,
	subtitle = "Small moments that passed quickly but left a trace.",
}: SideCharactersContainerProps) {
	const reduceMotion = useReducedMotion() === true;
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);

	const safeCharacters = useMemo(() => {
		return characters.filter((item) => item.name && item.date);
	}, [characters]);

	const openTooltip = useCallback((character: SideCharacter, x: number, y: number) => {
		const position = getTooltipPosition(x, y);
		setTooltip({ character, x: position.x, y: position.y });
	}, []);

	const moveTooltip = useCallback((x: number, y: number) => {
		const position = getTooltipPosition(x, y);
		setTooltip((current) => (current ? { ...current, x: position.x, y: position.y } : current));
	}, []);

	const closeTooltip = useCallback(() => {
		setTooltip(null);
	}, []);

	return (
		<section className="relative overflow-hidden rounded-2xl px-2 py-3 sm:px-3 sm:py-4">
			<div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-30" />

			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-16 left-[10%] h-52 w-52 rounded-full bg-rose-400/12 blur-3xl" />
				<div className="absolute bottom-2 right-[8%] h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
				<div className="absolute top-[38%] left-[46%] h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />
			</div>

			<div className="relative z-10 mb-3">
				<h3 className="text-[10px] uppercase tracking-[0.24em] text-rose-100/60">Memory Characters</h3>
				<p className="mt-1 text-xs text-white/68 sm:text-sm">{subtitle}</p>
			</div>

			<motion.div
				className="relative z-10 flex flex-wrap items-start gap-2.5 sm:gap-3"
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: {
							staggerChildren: reduceMotion ? 0 : 0.06,
							delayChildren: reduceMotion ? 0 : 0.1,
						},
					},
				}}
			>
				{safeCharacters.map((character, index) => (
					<MemoSideCharacterCard
						key={character.id}
						character={character}
						index={index}
						reduceMotion={reduceMotion}
						onOpenTooltip={openTooltip}
						onMoveTooltip={moveTooltip}
						onCloseTooltip={closeTooltip}
					/>
				))}
			</motion.div>

			<AnimatePresence>{tooltip && <SideCharacterTooltip tooltip={tooltip} />}</AnimatePresence>
		</section>
	);
}

export default function SideCharacters() {
	return <SideCharactersContainer />;
}

export { sideCharacters };
