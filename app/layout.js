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
const parkinsans = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'] 
});
const raleway = Raleway({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
const robotoSlab = Roboto_Slab({ subsets: ['latin'] });
const ebGaramond = EB_Garamond({ subsets: ['latin'] });
const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'], 
  subsets: ['latin'] 
});
const tajawal = Tajawal({
  weight: ['400', '600', '700'],
  subsets: ['latin']
});

export const metadata = {
  title: 'FANTASEEDS',
  description: 'ONG DE LA SALUD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={raleway.className}>
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
