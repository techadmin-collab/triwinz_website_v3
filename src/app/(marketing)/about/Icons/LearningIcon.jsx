export default function LearningIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient
          id="triwinzGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>

      <path
        d="M4 16l6-6 4 4 6-6"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
