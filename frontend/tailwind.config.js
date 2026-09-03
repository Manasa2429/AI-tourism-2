/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aetheria: {
          void: '#020408',
          obsidian: '#030712',
          surface: '#060e1a',
          card: '#091526',
          border: 'rgba(6, 182, 212, 0.16)',
          borderLight: 'rgba(255, 255, 255, 0.08)',
          muted: '#7a8ba3',
          subtle: '#475569',
        },
        aurora: {
          cyan: '#00f2fe',
          cyanDark: '#06b6d4',
          emerald: '#10b981',
          emeraldDark: '#059669',
          mint: '#34d399',
          frost: '#e0f2fe',
          coral: '#ff6b6b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.45)',
        'glow-aurora': '0 0 35px -5px rgba(0, 242, 254, 0.35), 0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px 0 rgba(6, 182, 212, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
