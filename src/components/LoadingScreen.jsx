import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, repeatType: "mirror" }}
        className="text-3xl font-bold"
      >
        Loading...
      </motion.div>
      <p className="text-lg mt-4">root@dock-the-flag:~$ please_wait()</p>
    </div>
  );
}
