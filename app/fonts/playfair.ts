import localFont from 'next/font/local';

export const PlayfairDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/PlayfairDisplay-VariableFont_wght.woff2',
      weight: '400 900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlayfairDisplay-Italic-VariableFont_wght.woff2',
      weight: '400 900',
      style: 'italic',
    },
  ],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});