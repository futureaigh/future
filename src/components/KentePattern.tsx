import React from 'react';

export const KentePattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: 0.05 }}
  >
    <pattern id="kente" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="10" height="10" fill="currentColor" />
      <rect x="10" y="10" width="10" height="10" fill="currentColor" />
      <path d="M0 20 L20 0" stroke="currentColor" strokeWidth="1" />
      <circle cx="5" cy="15" r="2" fill="currentColor" />
      <circle cx="15" cy="5" r="2" fill="currentColor" />
    </pattern>
    <rect width="100" height="100" fill="url(#kente)" />
  </svg>
);
