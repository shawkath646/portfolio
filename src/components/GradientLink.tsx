import Link from "next/link";
import clsx from "clsx";

type GradientVariant = "blue" | "purple" | "green" | "orange";
interface GradientLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: GradientVariant;
  target?: React.HTMLAttributeAnchorTarget;
}

const gradientMap: Record<GradientVariant, string> = {
  blue: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:ring-blue-300",
  purple: "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:ring-purple-300",
  green: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:ring-green-300",
  orange: "from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 focus:ring-orange-300",
};

export default function GradientLink({
  href,
  children,
  variant = "blue",
  target = "_self",
}: GradientLinkProps) {
  const gradientClasses = gradientMap[variant];

  return (
    <Link
      href={href}
      target={target}
      className={clsx(
        "inline-block bg-gradient-to-r text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2",
        gradientClasses
      )}
    >
      {children}
    </Link>
  );
}
