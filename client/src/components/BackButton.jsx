import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { ArrowLeft } from "@phosphor-icons/react";

/**
 * Reusable Premium BackButton Component
 * Taste Skill: Variance 6, Motion 7, Density 5
 */
export default function BackButton({ to = "/", label = "Quay về trang chủ" }) {
  const navigate = useNavigate();

  // Định nghĩa hiệu ứng chuyển động tịnh tiến sang trái cho Arrow (Motion: 7)
  const arrowVariants = {
    initial: { x: 0 },
    hover: { 
      x: -4, 
      transition: { type: "spring", stiffness: 400, damping: 17 } 
    }
  };

  return (
    <motion.button
      onClick={() => navigate(to)}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-blue-600 font-medium text-sm rounded-lg hover:bg-zinc-100/50 transition-all cursor-pointer outline-none select-none"
    >
      <motion.span 
        variants={arrowVariants} 
        className="flex items-center justify-center"
      >
        <ArrowLeft size={16} weight="bold" />
      </motion.span>
      <span>{label}</span>
    </motion.button>
  );
}
