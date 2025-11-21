import localFont from 'next/font/local';

export const Montserrat = localFont({
  src: [
    {
      path: '../../public/fonts/Montserrat-VariableFont_wght.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Montserrat-Italic-VariableFont_wght.woff2',
      weight: '100 900',
      style: 'italic',
    },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
});