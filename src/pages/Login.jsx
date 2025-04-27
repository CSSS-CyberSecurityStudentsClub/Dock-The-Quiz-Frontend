import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveBackground from "../components/LiveBackground";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";

export default function Login() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (username.trim() && name.trim() && phone.trim() && college.trim()) {
      try {
        const res = await fetch(
          "https://dock-the-quiz-backend-production.up.railway.app/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, name, phone, college }),
          }
        );

        if (!res.ok) {
          throw new Error("Login API failed");
        }

        const data = await res.json();

        localStorage.setItem("dock-username", username);
        localStorage.setItem("dock-name", name);
        localStorage.setItem("dock-phone", phone);
        localStorage.setItem("dock-college", college);
        localStorage.setItem("dock-id", data.player.id);

        navigate("/rules");
      } catch (err) {
        console.error(err);
        alert("Server Error. Try again later.");
      }
    }
  };

  return (
    <>
      <LiveBackground mode="scanline" />

      <div className="flex flex-col items-center justify-center min-h-screen text-green-400 relative p-4">
        <GlassCard className="w-full max-w-md p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center text-green-400 relative">
            {/* <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
              Enter Your Details
            </h1> */}
            <motion.h1
              className="text-3xl sm:text-4xl font-bold mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <span className="typewriter">Enter Your Codename</span>
            </motion.h1>

            <form
              onSubmit={(e) => {
                e.preventDefault(); // Very first thing
                handleSubmit();
              }}
              className="flex flex-col gap-4 w-full"
            >
              <input
                type="text"
                className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md"
                placeholder="Codename (e.g., root@dock)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md"
                placeholder="College Name"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
              {/* <button
                type="submit"
                className="bg-green-400 text-black py-2 text-lg sm:text-xl font-semibold rounded-md hover:bg-green-500 transition-all duration-300"
              >
                Log In
              </button> */}
              <button
                type="submit"
                className="bg-green-400 text-black py-2 text-xl font-bold hover:scale-105 hover:shadow-[0_0_10px_#00FF00] transition-all duration-300"
              >
                Enter Arena
              </button>
            </form>
          </div>
        </GlassCard>
      </div>
    </>
  );
}
