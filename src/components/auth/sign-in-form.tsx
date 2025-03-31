'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Link } from '@/components/ui/link';
import { SocialLoginButtons } from './social-login-buttons';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function SignInForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="w-[450px]">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your credentials below</p>
      </div>

      <Card className="border shadow-sm mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold text-center mb-3">Sign In</h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
        </div>
      </div>

      <SocialLoginButtons />

      <div className="flex justify-center mt-4">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
