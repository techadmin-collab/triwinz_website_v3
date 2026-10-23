export default function IconWrapper({ children }) {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      <rect width="40" height="40" rx="10" fill="url(#grad)" />

      <g
        transform="translate(8 8)"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}
