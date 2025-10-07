import React, {createContext, useContext, ReactNode} from 'react';

/**
 * Theme type - This should match the structure defined by the customer app
 * SDK accepts any theme that conforms to this interface
 */
export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
  };
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Context
const ThemeContext = createContext<AppTheme | undefined>(undefined);

// Provider Props
interface ThemeProviderProps {
  theme: AppTheme;
  children: ReactNode;
}

// Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): AppTheme => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
