'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { auth } from '#/lib/auth';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  Ticket,
  Users,
  LogOut,
  Sun,
  Moon,
  User,
  Shield,
  Loader2,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = auth.useSession();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
      router.push('/sign-in');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Verifying session...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userRole = session.user.role || 'agent';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header navbar */}
      <header className="sticky top-0 z-40 border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-lg">
              A
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">
                Aurexillion
              </span>
              <span className="text-xs text-muted-foreground block -mt-1">
                Support Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 md:gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                pathname === '/'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>Tickets</span>
            </Link>
            {userRole === 'admin' && (
              <Link
                href="/users"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  pathname === '/users'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </Link>
            )}
          </nav>

          {/* Right navbar elements */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
            </button>

            {/* Profile Avatar / Info */}
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-semibold leading-none">
                  {session.user.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                  {userRole === 'admin' ? (
                    <>
                      <Shield className="h-3 w-3 text-destructive" />
                      Admin
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" />
                      Agent
                    </>
                  )}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Container */}
      <main className="flex-1 px-6 py-8 md:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
