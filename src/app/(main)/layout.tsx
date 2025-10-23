import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container relative py-6 lg:py-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
