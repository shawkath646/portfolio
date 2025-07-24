import Link from "next/link";
import clsx from "clsx";

type GradientVariant = "blue" | "purple" | "green" | "orange";
interface GradientLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: GradientVariant;
  target?: React.HTMLAttributeAnchorTarget;
}

const gradientMap: Record<GradientVariant, { base: string; hover: string; focus: string }> = {
  blue: {
    base: "from-blue-500 to-cyan-500",
    hover: "from-blue-600 to-cyan-600",
    focus: "focus:ring-blue-300"
  },
  purple: {
    base: "from-purple-500 to-pink-500",
    hover: "from-purple-600 to-pink-600",
    focus: "focus:ring-purple-300"
  },
  green: {
    base: "from-green-500 to-emerald-500",
    hover: "from-green-600 to-emerald-600",
    focus: "focus:ring-green-300"
  },
  orange: {
    base: "from-orange-500 to-yellow-500",
    hover: "from-orange-600 to-yellow-600",
    focus: "focus:ring-orange-300"
  },
};

export default function GradientLink({
  href,
  children,
  variant = "blue",
  target = "_self",
}: GradientLinkProps) {
  const gradientConfig = gradientMap[variant];

  return (
    <Link
      href={href}
      target={target}
      className={clsx(
        "relative inline-block text-white font-semibold px-6 py-2 rounded-full shadow focus:outline-none focus:ring-2 overflow-hidden group transition-all duration-300",
        gradientConfig.focus
      )}
    >
      {/* Base gradient background */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-r transition-opacity duration-300",
        gradientConfig.base
      )} />
      
      {/* Hover gradient overlay */}
      <div className={clsx(
        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradientConfig.hover
      )} />
      
      {/* Content */}
      <span className="relative z-10">
        {children}
      </span>
    </Link>
  );
}
