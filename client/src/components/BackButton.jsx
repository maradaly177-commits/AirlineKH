import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { ArrowLeft } from "@phosphor-icons/react";

/**
 * Reusable Premium BackButton Component
 */
export default function BackButton({ to, onClick, label = "Quay lại" }) {
  const navigate = useNavigate();

  const arrowVariants = {
    initial: { x: 0 },
    hover: { 
      x: -4, 
      transition: { type: "spring", stiffness: 400, damping: 17 } 
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      // Return to previous step in browser history if available, else default to flight search
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/flights");
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial="initial"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-blue-600 font-bold text-xs sm:text-sm rounded-xl hover:bg-blue-50/80 transition-all cursor-pointer outline-none select-none"
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

