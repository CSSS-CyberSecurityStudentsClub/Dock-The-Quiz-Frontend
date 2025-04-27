export default function LiveBackground({ mode = "matrix" }) {
  if (mode === "neon") {
    return <NeonGridBackground />;
  } else {
    return <DefaultBlackBackground />;
  }
}

function NeonGridBackground() {
  return <div className="neon-grid" />;
}

// Example fallback if mode is unknown
function DefaultBlackBackground() {
  return <div className="fixed inset-0 bg-black z-[-10]" />;
}
