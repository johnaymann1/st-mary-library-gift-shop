/**
 * Theme Configuration System
 * 
 * This file manages all theme configurations for the St. Mary Gift Shop.
 * Themes can be dynamically activated through the admin settings dashboard,
 * allowing seasonal or promotional customizations without code changes.
 * 
 * Features:
 * - Multiple theme presets (Default, Christmas, etc.)
 * - Dynamic color schemes and gradients
 * - Customizable hero section content
 * - CSS variable generation for runtime theme switching
 */

/**
 * Theme Interface
 * Defines the structure for all theme configurations
 */
export interface Theme {
  id: string
  name: string
  description: string
  hero: {
    title: string
    subtitle: string
    badge: string
  }
  colors: {
    primary: string
    primaryHover: string
    primaryLight: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  gradients: {
    hero: string
    button: string
    card: string
    navbar: string
  }
  logo?: {
    url?: string
    text?: string
  }
}

/**
 * Theme Registry
 * All available themes for the application
 * Add new themes here to make them available in admin settings
 */
export const themes: Record<string, Theme> = {
  // Default theme - Classic rose and pink color scheme
  default: {
    id: 'default',
    name: 'Default Theme',
    description: 'Classic rose and pink theme for St. Mary Gift Shop',
    hero: {
      title: 'Discover the Perfect',
      subtitle: 'Gift for Everyone',
      badge: '🎁 Premium Gift Collection',
    },
    colors: {
      primary: 'rgb(225, 29, 72)', // rose-600
      primaryHover: 'rgb(190, 18, 60)', // rose-700
      primaryLight: 'rgb(255, 228, 230)', // rose-50
      secondary: 'rgb(236, 72, 153)', // pink-500
      accent: 'rgb(251, 207, 232)', // pink-200
      background: 'rgb(255, 255, 255)',
      text: 'rgb(23, 23, 23)', // neutral-900
    },
    gradients: {
      hero: 'linear-gradient(to bottom right, rgb(255, 228, 230), rgb(255, 255, 255), rgb(252, 231, 243))',
      button: 'linear-gradient(to right, rgb(225, 29, 72), rgb(236, 72, 153))',
      card: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(255, 228, 230))',
      navbar: 'linear-gradient(to right, rgb(225, 29, 72), rgb(236, 72, 153))',
    },
  },

  // Christmas theme - Festive red and green for holiday season
  christmas: {
    id: 'christmas',
    name: 'Christmas Theme',
    description: 'Festive red and green theme for the Christmas season',
    hero: {
      title: 'Spread Joy This Christmas',
      subtitle: 'with Heartfelt Gifts 🎄',
      badge: '🎅 Holiday Gift Collection',
    },
    colors: {
      primary: 'rgb(220, 38, 38)', // red-600
      primaryHover: 'rgb(185, 28, 28)', // red-700
      primaryLight: 'rgb(254, 242, 242)', // red-50
      secondary: 'rgb(22, 163, 74)', // green-600
      accent: 'rgb(240, 253, 244)', // green-50
      background: 'rgb(255, 255, 255)',
      text: 'rgb(23, 23, 23)',
    },
    gradients: {
      hero: 'linear-gradient(to bottom right, rgb(254, 242, 242), rgb(255, 255, 255), rgb(240, 253, 244))',
      button: 'linear-gradient(to right, rgb(220, 38, 38), rgb(22, 163, 74))',
      card: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(254, 242, 242))',
      navbar: 'linear-gradient(to right, rgb(220, 38, 38), rgb(22, 163, 74))',
    },
  },
}

/**
 * Get the active theme based on admin settings
 * Falls back to default theme if the selected theme doesn't exist
 * 
 * @param selectedThemeId - The theme ID from admin settings
 * @returns The theme configuration object
 */
export function getActiveTheme(selectedThemeId?: string): Theme {
  // If admin selected a valid theme, use it
  if (selectedThemeId && themes[selectedThemeId]) {
    return themes[selectedThemeId]
  }

  // Fall back to default theme
  return themes.default
}

/**
 * Generate CSS custom properties for a theme
 * Creates CSS variables that can be used throughout the application
 * 
 * @param theme - The theme configuration object
 * @returns CSS string with custom properties
 */
export function generateThemeCSS(theme: Theme): string {
  return `
    :root {
      --primary: ${theme.colors.primary} !important;
      --primary-hover: ${theme.colors.primaryHover} !important;
      --primary-light: ${theme.colors.primaryLight} !important;
      --secondary: ${theme.colors.secondary} !important;
      --accent: ${theme.colors.accent} !important;
      --ring: ${theme.colors.primary} !important;
      --gradient-hero: ${theme.gradients.hero} !important;
      --gradient-button: ${theme.gradients.button} !important;
      --gradient-card: ${theme.gradients.card} !important;
      --gradient-navbar: ${theme.gradients.navbar} !important;
    }
  `
}
