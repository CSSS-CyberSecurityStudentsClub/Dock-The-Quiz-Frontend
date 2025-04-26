import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      navigate("/quiz");
    }, 1000); // short delay to feel smooth
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen text-green-400 bg-black bg-opacity-90 z-10 relative p-4">
        <div className="max-w-2xl p-6 border-2 border-green-400 rounded-lg backdrop-blur-md">
          <h1 className="text-3xl font-bold mb-4 text-center">Event Rules</h1>
          <ul className="list-disc space-y-2 pl-5 text-lg">
            <li>
              No tab switching or copying text — violations will be tracked.
            </li>
            <li>Each round has 5 questions with 25 seconds to answer.</li>
            <li>Top scorers move faster on the leaderboard in real-time!</li>
            <li>Strictly mobile devices only, no laptops allowed.</li>
            <li>Any cheating detected = Immediate disqualification!</li>
          </ul>

          <button
            onClick={handleAccept}
            className="mt-6 w-full bg-green-400 hover:bg-green-500 transition-all py-2 text-black font-semibold text-lg"
          >
            I Accept the Rules &rarr;
          </button>
        </div>
      </div>
    </>
  );
}
