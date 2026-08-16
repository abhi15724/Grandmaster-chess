'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const navigate = (path: string) => router.push(path);

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-[#161512] text-gray-200 antialiased selection:bg-[#81b64c] selection:text-zinc-950 font-sans">
        <Navbar currentPath={pathname || '/'} navigate={navigate} />
        <main className="flex-1 w-full">{children}</main>
        <Footer navigate={navigate} />
      </div>
      <AuthModal />
    </AuthProvider>
  );
}
