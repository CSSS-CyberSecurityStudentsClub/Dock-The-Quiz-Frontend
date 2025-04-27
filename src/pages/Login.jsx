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
  const [isLoading, setIsLoading] = useState(false); // State for loading modal
  const [error, setError] = useState(""); // State for validation errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (username.trim() && name.trim() && phone.trim() && college.trim()) {
      setIsLoading(true); // Show loading modal
      setError(""); // Clear any previous errors
      try {
        const res = await fetch(
          "https://dock-the-flag-backend.onrender.com/api/login",
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

        // Save player data to localStorage
        savePlayerData(username, name, phone, college, data.player.id);

        // Navigate to the quiz rules page
        setTimeout(() => {
          setIsLoading(false); // Hide loading modal
          navigate("/rules");
        }, 300);
      } catch (err) {
        console.error(err);
        setIsLoading(false); // Hide loading modal on error
        alert("Server Error. Try again later.");
      }
    }
  };

  const savePlayerData = (username, name, phone, college, id) => {
    localStorage.setItem("dock-username", username);
    localStorage.setItem("dock-name", name);
    localStorage.setItem("dock-phone", phone);
    localStorage.setItem("dock-college", college);
    localStorage.setItem("dock-id", id);
  };

  return (
    <>
      <LiveBackground mode="matrix" />

      <div className="flex flex-col items-center justify-center min-h-screen text-green-400 relative p-4">
        {/* Animated Glass Card */}
        <GlassCard className="w-full max-w-md p-6 sm:p-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl font-bold mb-6 text-center glitch"
          >
            Welcome to the Arena
          </motion.h1>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col gap-4 w-full"
          >
            <input
              type="text"
              className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Codename (e.g., root@dock)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="text"
              className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="Phone Number (10 digits)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
              type="text"
              className="bg-transparent border border-green-400 px-4 py-2 text-lg sm:text-xl outline-none rounded-md focus:ring-2 focus:ring-green-400"
              placeholder="College Name"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-500 text-sm font-bold text-center">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00FF00" }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-400 text-black py-2 text-xl font-bold rounded-md transition-all duration-300"
            >
              Enter Arena →
            </motion.button>
          </motion.form>
        </GlassCard>
      </div>

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="loader mb-4 mx-auto"></div>
            <p className="text-green-400 text-xl font-bold">
              Logging you in...
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
}
