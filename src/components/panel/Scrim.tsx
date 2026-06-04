import { motion } from "framer-motion";

export function Scrim({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      aria-hidden="true"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0"
      style={{ background: "var(--scrim)", zIndex: "var(--z-scrim)" as unknown as number }}
    />
  );
}
