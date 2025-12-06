import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3B82F6',
                    dark: '#2563EB',
                    light: '#60A5FA',
                },
                secondary: {
                    DEFAULT: '#1E293B',
                    light: '#334155',
                },
                accent: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['SF Pro Display', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
                'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
        },
    },
    plugins: [],
};

export default config;
