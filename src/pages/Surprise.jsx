import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import surpriseQuestions from "../data/surpriseQuestions.json"; // Separate file for surprise
import LiveBackground from "../components/LiveBackground";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";

export default function Surprise() {
  const navigate = useNavigate();
  const location = useLocation();

  const resumeFrom = location?.state?.resumeFrom || 0;
  const existingScore = location?.state?.score || 0;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shake, setShake] = useState(false);
  const [fadeOut, setFadeOut] = useState(false); // State for fade-out effect
  const [selectedOption, setSelectedOption] = useState(null);

  const totalQuestions = surpriseQuestions.length;

  useEffect(() => {
    if (timeLeft === 0) handleNext();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 7) setShake(true); // Shake after 8 seconds passed
        if (prev <= 2) setFadeOut(true); // Start fade-out effect after 5 seconds
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (opt) => {
    setSelectedOption(opt);
    const correct = surpriseQuestions[currentQuestion]?.answer;

    if (opt === correct) {
      setScore((prev) => prev + 2); // +2 points per correct
    }

    handleNext();
  };

  const handleNext = () => {
    const nextIndex = currentQuestion + 1;

    if (nextIndex < totalQuestions) {
      setCurrentQuestion(nextIndex);
      setTimeLeft(15);
      setShake(false);
      setFadeOut(false); // Reset fade-out effect
      setSelectedOption(null);
    } else {
      let finalScore = existingScore + score;

      // Bonus if all answers are correct
      if (score === totalQuestions * 2) {
        finalScore += 10;
      }

      const id = localStorage.getItem("dock-id");

      fetch("https://dock-the-flag-backend.onrender.com/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, score: finalScore }),
      });

      navigate("/quiz", {
        state: { resumeFrom: resumeFrom, score: finalScore },
      });
    }
  };

  const current = surpriseQuestions[currentQuestion];

  if (!current) return <div className="text-green-400">Loading...</div>;

  return (
    <>
      <LiveBackground mode="chiness" timeLeft={timeLeft} />
      <div
        className={`flex flex-col items-center justify-center min-h-screen text-red-400 p-4 relative transition-all ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Timer */}
        <div
          className={`text-2xl font-bold mb-4 ${
            timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-yellow-400"
          }`}
        >
          Danger! Time Left: {timeLeft}s
        </div>

        {/* Danger Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-red-900/30 border border-red-400 text-red-300 rounded-lg px-4 py-2 mb-4 text-center uppercase tracking-wider text-sm"
        >
          Surprise Attack Challenge
        </motion.div>

        {/* Question Card */}
        <GlassCard className="max-w-md w-full border-red-400">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: fadeOut ? 0 : 1, // Gradually fade out as time decreases
              scale: fadeOut ? 0.9 : 1, // Slightly shrink the question
            }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-6 text-center"
          >
            {current.question}
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: fadeOut ? 0 : 1, // Gradually fade out as time decreases
              scale: fadeOut ? 0.9 : 1, // Slightly shrink the question
            }}
            transition={{ duration: 1 }}
            className="text-2xl font-bold mb-6 text-center"
          >
            <div className="flex flex-col gap-4">
              {current.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className={`bg-transparent border py-2 font-bold transition-all duration-300 ${
                    selectedOption === opt
                      ? "bg-red-400 text-black border-red-500"
                      : "border-red-400 hover:bg-red-400 hover:text-black"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.h1>
        </GlassCard>
      </div>
    </>
  );
}
