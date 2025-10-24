import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Domain Insights',
  description: 'AI-powered domain and keyword analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-muted/20">
            <div className="container relative py-6 lg:py-10">
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
