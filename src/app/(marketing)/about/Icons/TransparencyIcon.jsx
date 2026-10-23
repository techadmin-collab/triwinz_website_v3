export default function TransparencyIcon({ size = 24 }) {
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
        cx="6"
        cy="12"
        r="2"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
      />
      <circle
        cx="18"
        cy="6"
        r="2"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
      />
      <circle
        cx="18"
        cy="18"
        r="2"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
      />

      <path
        d="M8 11l8-4M8 13l8 4"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
