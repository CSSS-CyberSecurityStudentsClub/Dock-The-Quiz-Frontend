import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const [accepted, setAccepted] = useState(false);
  const [checked, setChecked] = useState(false); // Checkbox state
  const navigate = useNavigate();

  const handleAccept = () => {
    if (!checked) return; // Prevent navigation if checkbox is not checked
    setAccepted(true);
    setTimeout(() => {
      navigate("/quiz");
    }, 1000); // short delay for smooth transition
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen text-green-400 bg-black bg-opacity-90 relative p-4">
        {/* Animated Neon Border */}
        <div className="max-w-2xl p-6 border-2 border-green-400 rounded-lg backdrop-blur-md relative">
          <div className="absolute inset-0 border-2 border-green-400 rounded-lg animate-pulse opacity-20 pointer-events-none"></div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center glitch">
            Event Rules
          </h1>

          {/* Rules List */}
          <ul className="list-disc space-y-4 pl-5 text-lg sm:text-xl">
            <li>
              <span className="text-yellow-400 font-bold">
                No tab switching
              </span>{" "}
              or copying text — violations will be tracked.
            </li>
            <li>
              Each round has{" "}
              <span className="text-yellow-400 font-bold">5 questions</span>{" "}
              with <span className="text-yellow-400 font-bold">25 seconds</span>{" "}
              to answer.
            </li>
            <li>
              Top scorers move faster on the leaderboard in{" "}
              <span className="text-yellow-400 font-bold">real-time</span>!
            </li>
            <li>
              Strictly{" "}
              <span className="text-yellow-400 font-bold">
                mobile devices only
              </span>
              , no laptops allowed.
            </li>
            <li>
              <span className="text-red-500 font-bold">
                Any cheating detected = Immediate disqualification!
              </span>
            </li>
          </ul>

          {/* Checkbox */}
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="acceptRules"
              className="w-5 h-5 text-green-400 bg-black border-2 border-green-400 rounded focus:ring-2 focus:ring-green-400"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <label
              htmlFor="acceptRules"
              className="ml-3 text-lg sm:text-xl font-semibold"
            >
              I agree to the rules.
            </label>
          </div>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={!checked} // Disable button if checkbox is not checked
            className={`mt-6 w-full py-2 text-lg sm:text-xl font-bold rounded-md transition-all ${
              checked
                ? "bg-green-400 hover:bg-green-500 text-black"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            I Accept the Rules &rarr;
          </button>
        </div>
      </div>
    </>
  );
}
