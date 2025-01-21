import { 
  Raleway,
  Playfair_Display,
  Roboto_Slab,
  EB_Garamond,
  Crimson_Text,
  Poppins,
  Tajawal
} from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import { CartProvider } from '@/context/CartContext';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/LoadingScreen';

// Inicializar las fuentes
export const parkinsans = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'] 
});
export const raleway = Raleway({ subsets: ['latin'] });
export const playfair = Playfair_Display({ subsets: ['latin'] });
export const robotoSlab = Roboto_Slab({ subsets: ['latin'] });
export const ebGaramond = EB_Garamond({ subsets: ['latin'] });
export const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'], 
  subsets: ['latin'] 
});
export const tajawal = Tajawal({
  weight: ['400', '500', '700'],
  subsets: ['latin']
});

export const metadata = {
  title: 'FANTASEEDS',
  description: 'ONG DE LA SALUD.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full">
      <body className="flex flex-col min-h-screen bg-[#1a1f2e]">
        <CartProvider>
          <Providers>
            <Navbar />
            <LoadingScreen />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
