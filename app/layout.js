import { Poppins } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import { CartProvider } from '@/context/CartContext';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/LoadingScreen';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'FANTASEEDS',
  description: 'ONG DE LA SALUD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={poppins.className}>
      <body>
        <CartProvider>
          <Providers>
            <Navbar />
            <LoadingScreen />
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
