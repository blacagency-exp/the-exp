/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
	  extend: {
		animation: {
			scroll: "scroll 300s linear infinite",
			marquee: "marquee var(--duration) linear infinite",
			"marquee-vertical": "marquee-vertical var(--duration) linear infinite",
		  },
		  keyframes: {
			scroll: {
			  "0%": { transform: "translateX(0)" },
			  "100%": { transform: "translateX(calc(-280px * 6 - 16px * 6))" },
			},
			marquee: {
			  "0%": { transform: "translateX(0)" },
			  "100%": { transform: "translateX(-100%)" },
			},
			"marquee-vertical": {
			  "0%": { transform: "translateY(0)" },
			  "100%": { transform: "translateY(-100%)" },
			},
		  },
		fontFamily: {
		  sans: [
			"Inter",
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"Helvetica Neue",
			"Arial",
			"Noto Sans",
			"sans-serif",
			"Apple Color Emoji",
			"Segoe UI Emoji",
			"Segoe UI Symbol",
			"Noto Color Emoji",
		  ],
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  }
  
  