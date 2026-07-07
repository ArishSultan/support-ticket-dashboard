'use client';

import { Suspense } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import { SignUpForm } from '#/features/auth/components/SignUpForm';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '#/components/ui/card';

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Demo Inc.
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Register yourself</CardTitle>
              <CardDescription>
                Sign up to get access to the support ticket dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
                    <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm flex items-center justify-center py-20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Loading sign-up form...
                      </p>
                    </div>
                  </div>
                }
              >
                <SignUpForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { auth } from '#/lib/auth';
// import { toast } from 'sonner';

// export default function SignUpPage() {
//   const router = useRouter();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name || !email || !password) {
//       toast.error('All fields are required');
//       return;
//     }

//     setIsLoading(true);
//     const { data, error } = await auth.signUp.email({
//       email,
//       password,
//       name,
//       callbackURL: '/',
//     });

//     setIsLoading(false);

//     if (error) {
//       toast.error(error.message || 'Registration failed. Please try again.');
//     } else {
//       toast.success('Registration successful! Logging you in...');
//       router.push('/');
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
//       <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm animate-fade-in">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-extrabold tracking-tight">
//             Create an Account
//           </h1>
//           <p className="text-sm text-muted-foreground mt-2">
//             Sign up to get access to the support ticket dashboard
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-sm font-semibold block mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               required
//               disabled={isLoading}
//               className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//               placeholder="Jane Doe"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-semibold block mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               required
//               disabled={isLoading}
//               className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//               placeholder="jane@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-semibold block mb-1">Password</label>
//             <input
//               type="password"
//               required
//               disabled={isLoading}
//               className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold py-2.5 text-sm transition-colors disabled:opacity-50"
//           >
//             {isLoading ? 'Creating account...' : 'Create Account'}
//           </button>
//         </form>

//         <div className="mt-6 text-center text-sm text-muted-foreground">
//           Already have an account?{' '}
//           <Link
//             href="/sign-in"
//             className="text-primary font-semibold hover:underline"
//           >
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
