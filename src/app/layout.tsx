// adminqinq/src/app/layout.tsx
import { Providers } from './providers';
import './globals.css';
import { Metadata } from 'next';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Qinq Laundry System',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Laundry',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("font-sans", inter.variable)}>
      <body>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}