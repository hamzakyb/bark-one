"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface SiteSettings {
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  contactEmailPrimary?: string;
  contactAddress?: string;
  homeHeroVerticalText?: string;
  [key: string]: unknown;
}

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  setSettings: (value: SiteSettings | null) => void;
}

const defaultContext: SiteSettingsContextValue = {
  settings: null,
  setSettings: () => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("setSettings called outside of SiteSettingsProvider");
    }
  },
};

const SiteSettingsContext = createContext<SiteSettingsContextValue>(
  defaultContext
);

export function SiteSettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings?: SiteSettings | null;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(
    initialSettings ?? null
  );

  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings]
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
