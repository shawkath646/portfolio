"use client";
import { Patrick_Hand } from "next/font/google";
import { motion } from "framer-motion";

const tasks = [
  "Write documentation",
  "Fix navbar issue",
  "Contact the client",
  "Implement new API",
  "Code the signup form",
];

const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export default function TasksBoard() {
  return (
    <motion.section
      className={`p-6 rounded-xl bg-[#2f3e46] text-white shadow-lg border-[3px] border-white/20 w-full lg:w-1/2 ${patrickHand.className}`}
      style={{
        fontFamily: "'Patrick Hand', cursive",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 underline decoration-dashed">
        NEXT TASKS
      </h2>
      <ul className="space-y-4 pl-4">
        {tasks.map((task, idx) => (
          <motion.li
            key={idx}
            className="flex items-center gap-3 text-lg sm:text-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
          >
            <span className="inline-block w-5 h-5 border-2 border-white rounded-sm" />
            {task}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
