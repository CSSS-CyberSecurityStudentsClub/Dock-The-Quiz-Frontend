import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LiveBackground from "../components/LiveBackground";

const surpriseQs = [
  {
    question: "Which port does SSH use?",
    options: ["21", "22", "80", "443"],
    answer: "22",
  },
  {
    question: "Command to see current user?",
    options: ["whoami", "username", "id", "echo $USER"],
    answer: "whoami",
  },
  // Add more surprise Qs here...
];

export default function Surprise() {
  const navigate = useNavigate();
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [bonus, setBonus] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // 10-15s speed round

  useEffect(() => {
    if (timeLeft === 0) handleNext();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (opt) => {
    if (opt === surpriseQs[qIndex].answer) setScore((prev) => prev + 2);
    handleNext();
  };

  const handleNext = () => {
    if (qIndex + 1 < surpriseQs.length) {
      setQIndex((prev) => prev + 1);
      setTimeLeft(15);
    } else {
      // Bonus if all correct
      if (score === surpriseQs.length * 2) {
        setScore((prev) => prev + 5);
        setBonus(true);
      }
      setTimeout(() => {
        navigate("/quiz"); // Resume quiz
      }, 1500);
    }
  };

  return (
    <>
      <LiveBackground mode="scanline" />
      <div className="flex flex-col items-center justify-center h-screen text-green-400 z-10 relative p-4">
        <div className="text-3xl mb-4">🔥 Surprise Round! 🔥</div>
        <div className="text-xl mb-4">Time Left: {timeLeft}s</div>
        <div className="max-w-2xl p-6 border-2 border-pink-500 rounded-lg text-center">
          <h1 className="text-2xl font-bold mb-4">
            {surpriseQs[qIndex].question}
          </h1>
          <div className="flex flex-col gap-4">
            {surpriseQs[qIndex].options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(opt)}
                className="bg-transparent border border-pink-500 hover:bg-pink-500 hover:text-black py-2 transition-all duration-300"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        {bonus && (
          <p className="mt-4 text-pink-400 text-lg">+5 Bonus Points! 💥</p>
        )}
      </div>
    </>
  );
}
