import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type FontSize = 'small' | 'medium' | 'large';
type PrimaryColor = 'blue' | 'purple' | 'green' | 'indigo' | 'rose';

interface ThemeSettings {
  theme: Theme;
  fontSize: FontSize;
  primaryColor: PrimaryColor;
}

interface ThemeContextType {
  settings: ThemeSettings;
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  settings: {
    theme: 'light',
    fontSize: 'medium',
    primaryColor: 'blue'
  },
  toggleTheme: () => {},
  setFontSize: () => {},
  setPrimaryColor: () => {}
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const savedSettings = localStorage.getItem('themeSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      theme: prefersDark ? 'dark' : 'light',
      fontSize: 'medium',
      primaryColor: 'blue'
    };
  });

  // Apply theme settings on mount and when they change
  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    
    // Apply font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(
      settings.fontSize === 'small' ? 'text-sm' :
      settings.fontSize === 'large' ? 'text-lg' :
      'text-base'
    );
    
    // Apply primary color
    document.documentElement.classList.remove(
      'primary-blue',
      'primary-purple',
      'primary-green',
      'primary-indigo',
      'primary-rose'
    );
    document.documentElement.classList.add(`primary-${settings.primaryColor}`);
    
    // Save settings to localStorage
    localStorage.setItem('themeSettings', JSON.stringify(settings));
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const setFontSize = (size: FontSize) => {
    setSettings(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  const setPrimaryColor = (color: PrimaryColor) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: color
    }));
  };

  return (
    <ThemeContext.Provider value={{ settings, toggleTheme, setFontSize, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => React.useContext(ThemeContext);