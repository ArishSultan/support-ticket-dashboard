'use client';

import { Suspense } from 'react';
import { GalleryVerticalEnd } from 'lucide-react';

import { SignInForm } from '#/features/auth/components/SignInForm';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '#/components/ui/card';

export default function SignInPage() {
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
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Sign in to manage your tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense
                fallback={
                  <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
                    <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm flex items-center justify-center py-20">
                      <p className="text-sm font-medium text-muted-foreground">
                        Loading sign-in form...
                      </p>
                    </div>
                  </div>
                }
              >
                <SignInForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
