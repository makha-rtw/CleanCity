import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;
  const dark = document.documentElement.classList.contains("dark");
  confetti({
    particleCount: 70,
    spread: 70,
    startVelocity: 38,
    origin: { y: 0.65 },
    ticks: 160,
    scalar: 0.9,
    colors: dark
      ? ["#41C889", "#ECEDEB", "#2E8F63"]
      : ["#0F6C4A", "#16181A", "#CFD8D3"],
  });
}
