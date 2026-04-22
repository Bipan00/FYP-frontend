/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand color — deep maroon inspired by Nepal tone
                primary: {
                    DEFAULT: '#8B0000',
                    light: '#a31515',
                    dark: '#6b0000',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.375rem', // rounded-md is the standard
            },
            boxShadow: {
                card: '0 1px 3px 0 rgba(0,0,0,0.08)',
            },
        },
    },
    plugins: [],
}
