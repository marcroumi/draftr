export type FontSize = 'small' | 'medium' | 'large'

export const fontSizeMap: Record<FontSize, string> = {
  small: '0.65rem',
  medium: '0.75rem',
  large: '0.875rem',
}

export interface Theme {
  id: string
  name: string
  headingFont: string   // CSS font-family string
  bodyFont: string
  primaryColor: string  // headings, header strip
  accentColor: string   // highlights, links
  bgColor: string       // document background
  textColor: string     // body text
}

export const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern',
    headingFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#1d4ed8',
    accentColor: '#3b82f6',
    bgColor: '#ffffff',
    textColor: '#1e293b',
  },
  {
    id: 'classic',
    name: 'Classic',
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "Georgia, 'Times New Roman', serif",
    primaryColor: '#292524',
    accentColor: '#a16207',
    bgColor: '#fefce8',
    textColor: '#44403c',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    headingFont: "'DM Sans', system-ui, sans-serif",
    bodyFont: "'DM Sans', system-ui, sans-serif",
    primaryColor: '#09090b',
    accentColor: '#52525b',
    bgColor: '#ffffff',
    textColor: '#27272a',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    headingFont: "'Roboto', Arial, sans-serif",
    bodyFont: "'Roboto', Arial, sans-serif",
    primaryColor: '#0f3460',
    accentColor: '#0e6db7',
    bgColor: '#f8fafc',
    textColor: '#1e293b',
  },
  {
    id: 'bold',
    name: 'Bold',
    headingFont: "'Montserrat', Arial Black, sans-serif",
    bodyFont: "'Open Sans', Arial, sans-serif",
    primaryColor: '#18181b',
    accentColor: '#f97316',
    bgColor: '#ffffff',
    textColor: '#27272a',
  },
  {
    id: 'creative',
    name: 'Creative',
    headingFont: "'Raleway', sans-serif",
    bodyFont: "'Lato', sans-serif",
    primaryColor: '#5b21b6',
    accentColor: '#8b5cf6',
    bgColor: '#faf5ff',
    textColor: '#2e1065',
  },
]

export const defaultTheme = themes[0]
