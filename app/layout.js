import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import { CartProvider } from '@/context/CartContext';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron'
});

export const metadata = {
  title: 'FANTASEEDS',
  description: 'Club Cannábico Medicinal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${orbitron.variable}`}>
        <CartProvider>
          <Providers>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
