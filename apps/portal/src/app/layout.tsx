import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

import { cn } from '#/lib/utils';
import { Providers } from '#/components/providers/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Aurexillion — Support Ticket Dashboard',
  description:
    'Manage, track and assign customer support tickets in real-time.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn('font-sans', inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
