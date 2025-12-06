// app/(frontend)/layout.tsx
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProgressBar from '@/components/shared/progress-bar';
import LuxuryLoader from '@/components/shared/page-loader';

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <ProgressBar />
      <LuxuryLoader  />
      <main className="flex-1 min-h-0">
        {children}
      </main>
      <Footer />
    </>
  )
}