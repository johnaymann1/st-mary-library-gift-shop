/**
 * Theme Configuration System
 * 
 * This file contains all theme configurations for the St. Mary Gift Shop.
 * Themes can be activated through the admin settings dashboard.
 */

export interface Theme {
  id: string
  name: string
  description: string
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
  seasonal?: {
    startDate?: string // Format: 'MM-DD'
    endDate?: string   // Format: 'MM-DD'
  }
}

export const themes: Record<string, Theme> = {
  default: {
    id: 'default',
    name: 'Default Theme',
    description: 'Classic rose and pink theme for St. Mary Gift Shop',
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

  christmas: {
    id: 'christmas',
    name: 'Christmas Theme',
    description: 'Festive red and green theme for the Christmas season',
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
    seasonal: {
      startDate: '12-01', // December 1st
      endDate: '12-31',   // December 31st
    },
  },

  easter: {
    id: 'easter',
    name: 'Easter Theme',
    description: 'Soft pastels for the Easter celebration',
    colors: {
      primary: 'rgb(168, 85, 247)', // purple-500
      primaryHover: 'rgb(147, 51, 234)', // purple-600
      primaryLight: 'rgb(250, 245, 255)', // purple-50
      secondary: 'rgb(251, 191, 36)', // amber-400
      accent: 'rgb(254, 249, 195)', // yellow-100
      background: 'rgb(255, 255, 255)',
      text: 'rgb(23, 23, 23)',
    },
    gradients: {
      hero: 'linear-gradient(to bottom right, rgb(250, 245, 255), rgb(255, 255, 255), rgb(254, 249, 195))',
      button: 'linear-gradient(to right, rgb(168, 85, 247), rgb(251, 191, 36))',
      card: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(250, 245, 255))',
      navbar: 'linear-gradient(to right, rgb(168, 85, 247), rgb(251, 191, 36))',
    },
    seasonal: {
      startDate: '03-15', // Mid-March
      endDate: '04-30',   // End of April
    },
  },

  summer: {
    id: 'summer',
    name: 'Summer Theme',
    description: 'Bright and vibrant colors for summer',
    colors: {
      primary: 'rgb(14, 165, 233)', // sky-500
      primaryHover: 'rgb(2, 132, 199)', // sky-600
      primaryLight: 'rgb(240, 249, 255)', // sky-50
      secondary: 'rgb(251, 146, 60)', // orange-400
      accent: 'rgb(254, 243, 199)', // amber-100
      background: 'rgb(255, 255, 255)',
      text: 'rgb(23, 23, 23)',
    },
    gradients: {
      hero: 'linear-gradient(to bottom right, rgb(240, 249, 255), rgb(255, 255, 255), rgb(254, 243, 199))',
      button: 'linear-gradient(to right, rgb(14, 165, 233), rgb(251, 146, 60))',
      card: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(240, 249, 255))',
      navbar: 'linear-gradient(to right, rgb(14, 165, 233), rgb(251, 146, 60))',
    },
    seasonal: {
      startDate: '06-01', // June 1st
      endDate: '08-31',   // August 31st
    },
  },

  halloween: {
    id: 'halloween',
    name: 'Halloween Theme',
    description: 'Spooky orange and purple for Halloween',
    colors: {
      primary: 'rgb(249, 115, 22)', // orange-500
      primaryHover: 'rgb(234, 88, 12)', // orange-600
      primaryLight: 'rgb(255, 247, 237)', // orange-50
      secondary: 'rgb(124, 58, 237)', // violet-600
      accent: 'rgb(245, 243, 255)', // violet-50
      background: 'rgb(255, 255, 255)',
      text: 'rgb(23, 23, 23)',
    },
    gradients: {
      hero: 'linear-gradient(to bottom right, rgb(255, 247, 237), rgb(255, 255, 255), rgb(245, 243, 255))',
      button: 'linear-gradient(to right, rgb(249, 115, 22), rgb(124, 58, 237))',
      card: 'linear-gradient(to bottom right, rgb(255, 255, 255), rgb(255, 247, 237))',
      navbar: 'linear-gradient(to right, rgb(249, 115, 22), rgb(124, 58, 237))',
    },
    seasonal: {
      startDate: '10-01', // October 1st
      endDate: '10-31',   // October 31st
    },
  },
}

/**
 * Get the active theme based on current date and admin settings
 */
export function getActiveTheme(selectedThemeId?: string): Theme {
  // If admin selected a theme, use it
  if (selectedThemeId && themes[selectedThemeId]) {
    return themes[selectedThemeId]
  }

  // Otherwise check for seasonal themes
  const now = new Date()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const currentDay = String(now.getDate()).padStart(2, '0')
  const currentDate = `${currentMonth}-${currentDay}`

  for (const theme of Object.values(themes)) {
    if (theme.seasonal?.startDate && theme.seasonal?.endDate) {
      if (currentDate >= theme.seasonal.startDate && currentDate <= theme.seasonal.endDate) {
        return theme
      }
    }
  }

  // Default theme
  return themes.default
}

/**
 * Generate CSS custom properties for a theme
 */
export function generateThemeCSS(theme: Theme): string {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-primary-hover: ${theme.colors.primaryHover};
      --color-primary-light: ${theme.colors.primaryLight};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --gradient-hero: ${theme.gradients.hero};
      --gradient-button: ${theme.gradients.button};
      --gradient-card: ${theme.gradients.card};
      --gradient-navbar: ${theme.gradients.navbar};
    }
  `
}
