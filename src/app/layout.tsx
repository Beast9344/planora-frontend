import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import QueryProviders from '@/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import ThemeProvider from '@/providers/ThemeProvider';
import GlobalChatbot from '@/components/shared/GlobalChatbot';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Planora — Build, Host & Join Events',
  description:
    'Planora is a secure event management platform for creating and joining public or private events with smooth registration, invite workflows, and integrated payments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', montserrat.variable)}
    >
      <body className="antialiased">
        <QueryProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <GlobalChatbot />
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </ThemeProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
