import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black/1 backdrop-blur-sm border-2 border-green-400 rounded-xl p-8 max-w-md w-full"
    >
      {children}
    </motion.div>
  );
}
