const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

const brandColor = colors.blue;

module.exports = {
	mode: 'jit',
	darkMode: 'class',
	purge: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],

	theme: {
		extend: {
			fontFamily: {
				Comfortaa: ['Comfortaa'],
				Manrope: ['Manrope'],
			},
			colors: {
				defaultBg: '#222224',
				darkBg: '#171719',
				borderColor: '#EEEEEE',
				blue: '#005DFF',
				gradientPurple: '#5546CD',
				gradientPink: '#9C41D5',
				formBg: '#1B191F',
			},
		},
	},

	// Add some basic Tailwind plugins to add additional features:
	plugins: [
		// require('@tailwindcss/typography'),
		// require('@tailwindcss/aspect-ratio'),
		// require('@tailwindcss/forms'),
	],
};
