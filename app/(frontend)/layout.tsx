// app/(frontend)/layout.tsx
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 min-h-0">
        {children}
      </main>
      <Footer />
    </>
  )
}