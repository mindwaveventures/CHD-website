/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        font: {
          dark: '#00408A',
          light: '#FFFFFF',
        },
        button: {
          primary: '#00408A',
          secondary: '#FFFFFF',
          success: '#03963B',
        },
        background: {
          primary: '#ffffff',
        },
        placeholder: '#707070',
        input: '#C4C4C4',
        primary: '#ffffff',
        secondary: '#00408a',
        grey: '#DBDBDB',
        error: '#CD4518',
        bgError: '#f5dad0',
        success: '#03963b',
        bgSuccess: '#94cc4c4f',
        cyan: '#C7D9E6',
        headerBorder: '#e3ecf3',
        disableBg: '#00000029 !important',
        tabBg: '#DEEFF9',
        black: '#000',
      },
      backgroundImage: {
        secondary:
          'transparent linear-gradient(180deg, #51BDDDD9 0%, #94CC4CE6 100%) 0% 0% no-repeat padding-box;',
      },
      fontFamily: {
        mons: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        xs: ['7px', '9px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['22px', '27px'],
      },
      border: {
        '4xl': '2.25rem',
        borderColor: '#C7D9E6',
      },
      screens: {
        '2xl': { max: '1535px' },
        xl: { max: '1279px' },
        lg: { max: '992px' },
        'ipad': {max : '820px' },
        md: { max: '768px' },
        sm: { max: '639px' },
        xsm: { max: '530px' },
      },
    },

    plugins: [],
  },
};
