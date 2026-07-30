import { useState, useEffect } from 'react';
import { getSiteSettings, getNavigation } from '../services/cmsService';
import { SiteSettings, NavLink } from '../types';

export const useCMS = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [headerLinks, setHeaderLinks] = useState<NavLink[]>([]);
  const [footerLinks, setFooterLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    const unsubSettings = getSiteSettings(setSettings);
    const unsubHeader = getNavigation('header', setHeaderLinks);
    const unsubFooter = getNavigation('footer', setFooterLinks);

    return () => {
      unsubSettings();
      unsubHeader();
      unsubFooter();
    };
  }, []);

  useEffect(() => {
    if (settings?.favicon || settings?.logoMain) {
      const faviconUrl = settings.favicon || settings.logoMain;
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    }
  }, [settings]);

  return { settings, headerLinks, footerLinks };
};
