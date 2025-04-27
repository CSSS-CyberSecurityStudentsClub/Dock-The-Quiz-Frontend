import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import questions from "../data/questions.json";
import LiveBackground from "../components/LiveBackground";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [hasSurpriseHappened, setHasSurpriseHappened] = useState(false);
  const [shake, setShake] = useState(false);

  const totalQuestions = questions.length;
  const questionsPerRound = 5;
  const [surpriseRoundIndex] = useState(Math.floor(Math.random() * 8)); // random stage surprise

  useEffect(() => {
    if (timeLeft === 0) handleNext();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6) setShake(true); // start screen shake at last 5s
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);
  // Handle move to next question if no answer
  const handleNext = async () => {
    await nextStep();
  };
  const handleAnswer = async (opt) => {
    const correct = questions[currentQuestion]?.answer;

    if (opt === correct) {
      setScore((prev) => prev + 1);
    }
    await nextStep();
  };

  const nextStep = async () => {
    const nextIndex = currentQuestion + 1;
    const id = localStorage.getItem("dock-id");

    const surpriseTriggerIndex = (surpriseRoundIndex + 1) * questionsPerRound;

    if (
      nextIndex === surpriseTriggerIndex &&
      !hasSurpriseHappened &&
      nextIndex < totalQuestions
    ) {
      setHasSurpriseHappened(true);
      navigate("/surprise", { state: { resumeFrom: nextIndex, score } });
      return;
    }

    if (nextIndex < totalQuestions) {
      setCurrentQuestion(nextIndex);
      setTimeLeft(25);
      setShake(false);
    } else {
      await fetch(
        "https://dock-the-flag-backend.onrender.com/api/submit-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, score }),
        }
      );
      navigate("/leaderboard", { state: { score } });
    }
  };

  const current = questions[currentQuestion];

  if (!current) return <div className="text-green-400">Loading...</div>;

  return (
    <>
      <LiveBackground mode="matrix" />

      <div
        className={`flex flex-col items-center justify-center min-h-screen text-green-400 p-4 relative transition-all ${
          shake ? "animate-shake" : ""
        }`}
      >
        {/* Timer */}
        <div
          className={`text-2xl font-bold mb-4 ${
            timeLeft <= 5
              ? "text-red-500 animate-pulse"
              : timeLeft <= 10
              ? "text-yellow-400"
              : "text-green-400"
          }`}
        >
          Time Left: {timeLeft}s
        </div>

        {/* Question Type Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-green-900/30 border border-green-400 text-green-300 rounded-lg px-4 py-2 mb-4 text-center uppercase tracking-wider text-sm"
        >
          {current.type}
        </motion.div>

        {/* Question Card */}
        <GlassCard className="max-w-md w-full">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6 text-center"
          >
            {current.question}
          </motion.h1>

          <div className="flex flex-col gap-4">
            {current.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="bg-transparent border border-green-400 hover:bg-green-400 hover:text-black py-2 transition-all duration-300 font-bold"
              >
                {opt}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
