import { useEffect, useRef } from "react";

export default function LiveBackground({ mode = "matrix", timeLeft }) {
  const canvasRef = useRef(null);
  const timeLeftRef = useRef(timeLeft); // Ref to store the latest timeLeft value

  useEffect(() => {
    timeLeftRef.current = timeLeft; // Update the ref whenever timeLeft changes
  }, [timeLeft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    let characters = "01".split("");
    if (mode === "scanline") characters = "████░░▒▒▓▓".split("");
    if (mode === "grid") characters = "+-*|\\/".split("");
    if (mode === "chiness")
      characters =
        "アァイィウヴエェオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモヤユヨラリルレロワヲン".split(
          ""
        );

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Slightly darker fade effect
      ctx.fillRect(0, 0, width, height);

      // Use the latest value of timeLeft from the ref
      const currentTimeLeft = timeLeftRef.current;

      // Dynamic color based on timeLeft
      let color = "#00FF00"; // Default Green
      if (currentTimeLeft <= 10 && currentTimeLeft > 5) color = "#FFFF00"; // Yellow
      if (currentTimeLeft <= 5) color = "#FF0000"; // Red

      ctx.fillStyle = color;
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode]); // Only depend on mode, not timeLeft

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-[-1]"
    />
  );
}
