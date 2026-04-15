// 1. Le type de l'état
interface CircularProgressProps {
  timeLeft: number;
  totalDuration: number;
}

function CircularProgress({ timeLeft, totalDuration }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 135;
  const offset = (totalDuration / timeLeft) * circumference;
  return (
    <svg className="absolute w-full h-full z-30" viewBox="0 0 300 300">
      <circle
        cx={150}
        cy={150}
        r={135}
        fill="none"
        stroke="var(--app-color)"
        strokeDashoffset={offset}
        strokeDasharray={circumference}
        strokeWidth={8}
        transform="rotate(-90 150 150) scale(1 -1) translate(0 -300)  "
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
    </svg>
  );
}

export default CircularProgress;
