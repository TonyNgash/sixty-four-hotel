import localFont from 'next/font/local';

export const GeistSans = localFont({
  src: '../../public/fonts/Geist-VariableFont_wght.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  preload: true,
});