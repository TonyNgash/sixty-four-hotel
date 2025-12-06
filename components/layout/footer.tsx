// components/layout/footer.tsx
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <p>
          <small>Sixty four hotel &copy; created with ❤️ by <Link href="https://instagram.com/antonioportofolio" target='_blank'>everydayapps</Link></small>
           
        </p>
      </div>
    </footer>
  )
}