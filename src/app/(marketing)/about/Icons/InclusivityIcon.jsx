export default function InclusivityIcon({ size = 28 }) {
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

      <circle
        cx="12"
        cy="8"
        r="3"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
      />
      <path
        d="M5 20c0-4 14-4 14 0"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
