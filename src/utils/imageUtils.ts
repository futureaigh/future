import React from 'react';

export const createSvgFallback = (title: string, subtitle = 'Future Digital Infrastructure'): string => {
  const safeTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeSubtitle = subtitle.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#0F172A" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <circle cx="400" cy="340" r="180" fill="url(#gold)" opacity="0.1" />
    <circle cx="400" cy="340" r="120" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.3" stroke-dasharray="8 8" />
    <path d="M 320 400 L 380 300 L 430 350 L 480 270" fill="none" stroke="url(#gold)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="480" cy="270" r="10" fill="#F59E0B" />
    <text x="400" y="550" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#F8FAFC" text-anchor="middle">${safeTitle}</text>
    <text x="400" y="595" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#94A3B8" text-anchor="middle">${safeSubtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const isValidImageUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 10) return false;
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/')
  );
};

export const handleImgError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  backupUrl?: string,
  svgTitle = 'Future Media'
) => {
  const img = e.currentTarget;
  const currentSrc = img.src || '';

  if (backupUrl && currentSrc !== backupUrl && !currentSrc.startsWith('data:image/svg')) {
    img.src = backupUrl;
  } else if (!currentSrc.startsWith('data:image/svg')) {
    img.src = createSvgFallback(svgTitle);
  }
};
