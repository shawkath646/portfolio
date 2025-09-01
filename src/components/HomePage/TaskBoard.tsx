"use client";
import { Patrick_Hand } from "next/font/google";
import { motion } from "framer-motion";
import { memo } from "react";

// Sample tasks - could be fetched from an API in a real scenario
const tasks = [
  { id: 1, text: "Write documentation", priority: "high" },
  { id: 2, text: "Fix navbar responsiveness", priority: "medium" },
  { id: 3, text: "Contact the client", priority: "high" },
  { id: 4, text: "Implement new API endpoints", priority: "medium" },
  { id: 5, text: "Code the signup form", priority: "low" },
];

// Load font once
const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400" });

// Memoized Task Item component for better performance
const TaskItem = memo(function TaskItem({ task, index }: { task: { id: number, text: string, priority: string }, index: number }) {
  // Priority color mapping
  const priorityColor = {
    high: "bg-red-400/20 border-red-500",
    medium: "bg-amber-400/20 border-amber-500",
    low: "bg-green-400/20 border-green-500"
  }[task.priority];

  return (
    <motion.li
      key={task.id}
      className="flex items-center gap-3 text-lg sm:text-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1 * index
      }}
    >
      <motion.span 
        className={`inline-block w-5 h-5 border-2 border-white rounded-sm ${priorityColor}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        role="presentation"
      />
      <span>{task.text}</span>
    </motion.li>
  );
});

const TasksBoard = memo(function TasksBoard() {
  return (
    <motion.section
      aria-labelledby="tasks-heading"
      className={`p-8 rounded-2xl bg-gradient-to-br from-gray-800 to-[#2f3e46] text-white shadow-xl 
                 border-[3px] border-white/20 backdrop-blur-sm 
                 ${patrickHand.className} relative overflow-hidden`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" aria-hidden="true" />
      
      <header className="relative z-10 flex items-center justify-between mb-6">
        <h2 
          id="tasks-heading"
          className="text-3xl sm:text-4xl font-bold text-center mx-auto mb-2 underline decoration-wavy decoration-cyan-400/70 underline-offset-8"
        >
          NEXT TASKS
        </h2>
      </header>
      
      <ul className="space-y-5 pl-4 relative z-10">
        {tasks.map((task, idx) => (
          <TaskItem key={task.id} task={task} index={idx} />
        ))}
      </ul>
      
      {/* Paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: "url('data:image/png;base64,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')"
        }}
      ></div>
    </motion.section>
  );
});

export default TasksBoard;
