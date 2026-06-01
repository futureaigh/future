import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { motion } from 'motion/react';
import { useCMS } from '../hooks/useCMS';

export const Layout = () => {
  const { settings } = useCMS();

  const getFontUrl = () => {
    if (!settings) return '';
    const fonts: string[] = [];
    if (settings.headingFont) {
      const match = settings.headingFont.match(/'([^']+)'/);
      if (match) fonts.push(match[1]);
    }
    if (settings.bodyFont) {
      const match = settings.bodyFont.match(/'([^']+)'/);
      if (match) fonts.push(match[1]);
    }
    
    if (fonts.length === 0) return '';
    const uniqueFonts = Array.from(new Set(fonts)).map(f => f.replace(/\s+/g, '+'));
    return `https://fonts.googleapis.com/css2?${uniqueFonts.map(f => `family=${f}:wght@300;400;500;600;700`).join('&')}&display=swap`;
  };

  const fontUrl = getFontUrl();

  return (
    <div className="flex flex-col min-h-screen">
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      {settings && (
        <style>
          {`
            :root {
              ${settings.primaryColor ? `--color-brand-navy: ${settings.primaryColor};` : ''}
              ${settings.secondaryColor ? `--color-brand-gold: ${settings.secondaryColor};` : ''}
              ${settings.bodyFont ? `--font-sans: ${settings.bodyFont};` : ''}
              ${settings.headingFont ? `--font-display: ${settings.headingFont};` : ''}
            }
          `}
        </style>
      )}
      <Navbar />
      <main className="flex-grow pt-20">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
