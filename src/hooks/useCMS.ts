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

  return { settings, headerLinks, footerLinks };
};
