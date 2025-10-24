import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SkillChain - Where Skills Become Currency',
  description: 'Connect with people worldwide, offer your skills, learn new ones, and earn SkillCoins.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseAuthProvider>
          <NotificationProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#000',
                  color: '#fff',
                  border: '1px solid #fff',
                },
              }}
            />
          </NotificationProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}


