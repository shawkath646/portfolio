import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

const hasVercelFlagsEnv = Boolean(process.env.FLAGS && process.env.FLAGS_SECRET);

export const isActiveFlag = flag<boolean>({
    key: "isActive",
    ...(hasVercelFlagsEnv
        ? { adapter: vercelAdapter() }
        : {
            decide: () => true,
        }),
    defaultValue: true,
    description: "Controls whether the app is active or in maintenance mode.",
    options: [
        { value: true, label: "Active" },
        { value: false, label: "Maintenance" },
    ],
});
