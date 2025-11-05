"use client";
import { Patrick_Hand } from "next/font/google";
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useInView } from "framer-motion";

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

// Define type for task
interface Task {
  id: number;
  text: string;
  priority: 'high' | 'medium' | 'low';
}

// Priority mapping for better accessibility and maintainability
const PRIORITY_MAP = {
  high: {
    class: "bg-red-400/20 border-red-500",
    label: "High priority"
  },
  medium: {
    class: "bg-amber-400/20 border-amber-500",
    label: "Medium priority"
  },
  low: {
    class: "bg-green-400/20 border-green-500",
    label: "Low priority"
  }
};

// Task Item component
const TaskItem = ({ 
  task, 
  index,
  prefersReducedMotion
}: { 
  task: Task, 
  index: number,
  prefersReducedMotion: boolean 
}) => {
  // Get priority color and label from the map
  const priority = PRIORITY_MAP[task.priority];
  
  // Prioritize animation controls for efficiency
  const controls = useAnimation();
  
  // Use effect to animate tasks when parent becomes visible
  useEffect(() => {
    if (!prefersReducedMotion) {
      controls.start({ opacity: 1, x: 0 });
    } else {
      controls.start({ opacity: 1, x: 0 });
    }
  }, [controls, prefersReducedMotion]);

  return (
    <motion.li
      key={task.id}
      className={`flex items-center gap-3 text-base sm:text-lg ${patrickHand.className}`}
      initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      animate={controls}
      transition={{ 
        duration: 0.5,
        delay: 0.1 * index,
        type: "spring",
        bounce: 0.4
      }}
      whileHover={prefersReducedMotion ? {} : { x: 5, scale: 1.02 }}
      aria-label={`${task.text} - ${priority.label}`}
    >
      <motion.span 
        className={`inline-block w-4 h-4 border-2 border-white rounded-sm ${priority.class}`}
        whileHover={prefersReducedMotion ? {} : { scale: 1.2, rotate: 45 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.8, rotate: 90 }}
        animate={prefersReducedMotion ? {} : {
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          rotate: {
            duration: 4,
            repeat: Infinity,
            delay: index * 0.3
          }
        }}
        role="presentation"
        aria-hidden="true"
      />
      <span>{task.text}</span>
    </motion.li>
  );
};

const TasksBoard = () => {
  // Animation controls
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion(controls);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  // Tasks with proper type
  const typedTasks = tasks as Task[];
  
  // Trigger animations when in view
  useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, prefersReducedMotion, controls]);
  
  return (
    <motion.aside
      aria-labelledby="tasks-heading"
      className={`p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-[#2f3e46] text-white shadow-xl 
                 border-[3px] border-white/20 backdrop-blur-sm 
                 ${patrickHand.className} relative overflow-hidden`}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 50, rotate: -2 }}
      animate={controls}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      whileHover={prefersReducedMotion ? {} : { rotate: 0, y: -8, scale: 1.02 }}
      ref={ref}
      role="complementary"
    >
      {/* Decorative elements */}
      <motion.div 
        className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" 
        aria-hidden="true"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" 
        aria-hidden="true"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      
      <header className="relative z-10 flex items-center justify-between mb-5">
        <motion.h2 
          id="tasks-heading"
          className="text-2xl sm:text-3xl font-bold text-center mx-auto mb-2 underline decoration-wavy decoration-cyan-400/70 underline-offset-8"
          animate={prefersReducedMotion ? {} : {
            textShadow: [
              "0 0 10px rgba(34, 211, 238, 0.3)",
              "0 0 20px rgba(34, 211, 238, 0.5)",
              "0 0 10px rgba(34, 211, 238, 0.3)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          NEXT TASKS
        </motion.h2>
      </header>
      
      <ul 
        className="space-y-4 pl-3 relative z-10"
        aria-label="Task list"
      >
        {typedTasks.map((task, idx) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            index={idx}
            prefersReducedMotion={prefersReducedMotion} 
          />
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
      
      {/* Animated pin */}
      <motion.div
        className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full shadow-lg z-20"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.4)",
            "0 0 0 8px rgba(239, 68, 68, 0)",
            "0 0 0 0 rgba(239, 68, 68, 0)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      />
    </motion.aside>
  );
};

export default TasksBoard;
