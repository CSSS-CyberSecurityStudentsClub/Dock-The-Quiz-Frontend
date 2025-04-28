import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import questions from "../data/questions.json";
import LiveBackground from "../components/LiveBackground";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";
import siren from "../assets/siren.mp3"; // Import the siren sound

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const sirenRef = useRef(new Audio(siren)); // Use useRef to persist the siren audio object
  useEffect(() => {
    sirenRef.current.volume = 1; // Set the volume for the siren
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [hasSurpriseHappened, setHasSurpriseHappened] = useState(false);
  const [shake, setShake] = useState(false);
  const [flicker, setFlicker] = useState(false);

  const totalQuestions = questions.length;
  const questionsPerRound = 5;
  const [surpriseRoundIndex] = useState(Math.floor(Math.random() * 8)); // Random stage surprise

  useEffect(() => {
    if (timeLeft === 0) handleNext(); // Automatically move to the next question if time runs out

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 8) setShake(true); // Start shaking after 8 seconds
        if (prev <= 4) setFlicker(true); // Start flickering after 4 seconds
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleNext = async () => {
    await nextStep(); // Move to the next question or leaderboard
  };

  const handleAnswer = async (opt) => {
    const correct = questions[currentQuestion]?.answer;
    const id = localStorage.getItem("dock-id");

    if (opt === correct) {
      setScore((prev) => prev + 1);

      // ✨ IMMEDIATELY UPDATE DB
      try {
        await fetch(
          "https://dock-the-quiz-backend-production.up.railway.app/api/submit-score",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, score: score + 1 }),
          }
        );
      } catch (error) {
        console.error("Failed to update score:", error);
      }
    }

    await nextStep(); // move to next question
  };

  const nextStep = async (updatedScore) => {
    const nextIndex = currentQuestion + 1;
    const id = localStorage.getItem("dock-id");

    const surpriseTriggerIndex = (surpriseRoundIndex + 1) * questionsPerRound;

    // Navigate to the surprise round if applicable
    if (
      nextIndex === surpriseTriggerIndex &&
      !hasSurpriseHappened &&
      nextIndex < totalQuestions
    ) {
      setHasSurpriseHappened(true);
      navigate("/surprise", {
        state: { resumeFrom: nextIndex, score: updatedScore },
      });
      return;
    }

    // If there are more questions, move to the next question
    if (nextIndex < totalQuestions) {
      setCurrentQuestion(nextIndex);
      setTimeLeft(25);
      setShake(false);
      setFlicker(false); // Reset flicker effect
    } else {
      // Submit the score and navigate to the leaderboard after the last question
      await fetch(
        "https://dock-the-quiz-backend-production.up.railway.app/api/submit-score",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, score: updatedScore }),
        }
      );
      navigate("/leaderboard", { state: { score: updatedScore } });
    }
  };

  const current = questions[currentQuestion];

  if (!current) return <div className="text-green-400">Loading...</div>;

  const [cheatCount, setCheatCount] = useState(0);

  // 1. Detect tab switch (user hides tab)
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

  // 2. Detect copy attempt
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      setCheatCount((prev) => prev + 1);
      alert("Copying is not allowed!");
    };
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);
  // 6. Detect Long Press on Mobile
  useEffect(() => {
    const handleTouchStart = (e) => {
      e.preventDefault();
      setCheatCount((prev) => prev + 1);
      alert("Long press detected! Cheating attempt!");
    };
    document.addEventListener("contextmenu", handleTouchStart); // Long press triggers contextmenu on mobile

    return () => {
      document.removeEventListener("contextmenu", handleTouchStart);
    };
  }, []);

  // 7. Detect Text Selection (Selecting text to copy)
  useEffect(() => {
    const handleSelectStart = (e) => {
      e.preventDefault();
      setCheatCount((prev) => prev + 1);
      alert("Selection detected! No copying allowed!");
    };
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);

  useEffect(() => {
    if (cheatCount >= 2) {
      // Display cheating alert
      const alertDiv = document.createElement("div");
      alertDiv.style.cssText = `
        background: black;
        color: #0f0;
        font-family: monospace;
        font-size: 1.5em;
        padding: 20px;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
      `;
      alertDiv.innerHTML = `
        <div>
          <p>SECURITY BREACH DETECTED ⚠️</p>
          <p>Traceback (most recent hack attempt):</p>
          <p>iptables DROP ALL TRAFFIC 🚫</p>
          <p>Session Terminated. 🔥</p>
          <p style="margin-top:20px;">Goodbye, Hacker!</p>
        </div>
      `;
      document.body.appendChild(alertDiv);

      // Play siren sound
      const playSiren = () => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(sirenRef.current);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1; // Set volume to maximum
        source.connect(gainNode).connect(audioContext.destination);

        sirenRef.current.play();
      };

      // Ensure siren plays after user interaction
      const handleUserInteraction = () => {
        playSiren();
        document.removeEventListener("click", handleUserInteraction);
        document.removeEventListener("touchstart", handleUserInteraction);
      };

      document.addEventListener("click", handleUserInteraction);
      document.addEventListener("touchstart", handleUserInteraction);
    }
  }, [cheatCount]);

  return (
    <>
      <LiveBackground mode="matrix" />
      <div
        className={`flex flex-col items-center justify-center min-h-screen text-green-400 p-4 relative transition-all ${
          shake ? "animate-shake" : ""
        } ${flicker ? "animate-flicker" : ""}`}
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
