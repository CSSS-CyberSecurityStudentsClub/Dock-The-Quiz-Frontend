import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LiveBackground from "../components/LiveBackground";

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Auto move to login after 5 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <LiveBackground mode="matrix" />
      <div className="flex flex-col items-center justify-center min-h-screen text-green-400 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-gradient-to-br from-green-500/10 to-transparent" />
        <h1 className="text-6xl font-bold glitch">DOCK THE FLAG</h1>
        <p className="text-xl mt-6 animate-fadein">
          Prepare to Hack the Impossible...
        </p>
      </div>
    </>
  );
}
