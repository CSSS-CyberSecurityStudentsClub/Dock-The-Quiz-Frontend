import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LiveBackground from "../components/LiveBackground";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";
// Dummy MCQs (add more later)
const sampleQuestions = [
  {
    question: "What does SSH stand for?",
    options: ["Secure Shell", "Super Socket", "Socket Secure", "Shell Secure"],
    answer: "Secure Shell",
  },
  {
    question: "Which command lists running processes?",
    options: ["ls", "ps", "grep", "pwd"],
    answer: "ps",
  },
  {
    question: "Linux command to display current path?",
    options: ["cd", "whereami", "path", "pwd"],
    answer: "pwd",
  },
  {
    question: "Which port does HTTP use?",
    options: ["21", "80", "22", "443"],
    answer: "80",
  },
  {
    question: "What is the root user ID?",
    options: ["1000", "0", "1", "500"],
    answer: "0",
  },
];

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const totalQuestions = 5;
  const questionsPerRound = 5;

  const resumeFrom = location?.state?.resumeFrom || 0;
  const [currentQuestion, setCurrentQuestion] = useState(resumeFrom);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [hasSurpriseHappened, setHasSurpriseHappened] = useState(false);

  // Random surprise round (fixed once)
  const [surpriseRoundIndex] = useState(Math.floor(Math.random() * 8)); // 0 to 7

  useEffect(() => {
    if (timeLeft === 0) handleNext();

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = async (opt) => {
    const correct = sampleQuestions[currentQuestion]?.answer;

    if (opt === correct) {
      setScore((prev) => prev + 1); // Update score here
      await nextStep(true);
    } else {
      await nextStep(false);
    }
  };

  // anti cheat

  const [cheatCount, setCheatCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatCount((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (cheatCount >= 2) {
      alert("Cheating detected! You have been disqualified!");
      localStorage.clear();
      window.location.href = "/login"; // force logout
    }
  }, [cheatCount]);
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      setCheatCount((prev) => prev + 1);
      alert("Copying not allowed!");
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);
  useEffect(() => {
    const handleRightClick = (e) => {
      e.preventDefault();
      alert("Right-click disabled!");
    };

    const handleKeydown = (e) => {
      if (
        e.ctrlKey &&
        (e.key === "u" || e.key === "s" || e.key === "i" || e.key === "j")
      ) {
        e.preventDefault();
        alert("Inspecting blocked!");
        setCheatCount((prev) => prev + 1);
      }
    };

    document.addEventListener("contextmenu", handleRightClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const nextStep = async (wasCorrect) => {
    const id = localStorage.getItem("dock-id");
    const nextIndex = currentQuestion + 1;

    // Surprise logic
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
    } else {
      // Final score is already updated in handleAnswer
      await fetch(
        "https://dock-the-quiz-backend-production.up.railway.app/api/submit-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, score }), // Use the updated score
        }
      );

      navigate("/leaderboard", { state: { score } });
    }
  };

  const question = sampleQuestions[currentQuestion];

  if (!question) return <div className="text-green-400">Loading...</div>;

  return (
    <>
      <LiveBackground mode="matrix" />
      <div className="flex flex-col items-center justify-center min-h-screen text-green-400 p-4 relative">
        <div className="text-xl mb-2">Time Left: {timeLeft}s</div>
        <GlassCard className="max-w-md w-full">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-4 text-center"
          >
            {question.question}
          </motion.h1>

          <div className="flex flex-col gap-4">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="bg-transparent border border-green-400 hover:bg-green-400 hover:text-black py-2 transition-all duration-300"
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
