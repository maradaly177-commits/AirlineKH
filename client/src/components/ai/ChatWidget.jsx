// eslint-disable-next-line no-unused-vars
import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import { useChat } from "../../hooks/useChat";
import ChatWindow from "./ChatWindow";

/**
 * Bong bóng chat nổi ở mọi trang, mở/đóng khung trợ lý AI.
 */
export default function ChatWidget() {
  const { isOpen, toggle, close } = useChat();
  const dragConstraintsRef = useRef(null);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            aria-label="Đóng trợ lý AI"
            className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{isOpen && <ChatWindow />}</AnimatePresence>

      <div ref={dragConstraintsRef} className="fixed inset-0 z-50 pointer-events-none">
        <motion.div
          drag
          dragConstraints={dragConstraintsRef}
          dragMomentum={false}
          className="pointer-events-auto fixed bottom-6 right-4 md:right-6"
        >
          {!isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex h-4 w-4"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
            </motion.span>
          )}

          <motion.button
            type="button"
            onClick={toggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-shadow ${
              isOpen
                ? "bg-zinc-800 text-white shadow-zinc-900/30 hover:shadow-2xl"
                : "bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-blue-600/35 hover:shadow-2xl hover:shadow-blue-600/40"
            }`}
          >
            {isOpen ? (
              <X size={24} weight="bold" />
            ) : (
              <PaperPlaneTilt size={26} weight="fill" />
            )}
          </motion.button>
        </motion.div>
      </div>
    </>
  );
}
