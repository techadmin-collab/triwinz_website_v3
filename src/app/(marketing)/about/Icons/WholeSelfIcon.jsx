export default function WholeSelfIcon({ size = 28 }) {
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
        d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z"
        stroke="url(#triwinzGradient)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
