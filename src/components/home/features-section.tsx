import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Zap, Shield } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Everything you need to build modern applications with AI assistance.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 mt-12">
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>AI-Powered Development</CardTitle>
              <CardDescription>
                Leverage AI to accelerate your coding workflow with intelligent suggestions and
                automation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <Shield className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Secure Authentication</CardTitle>
              <CardDescription>
                Industry-standard auth with Supabase for user management and secure access control.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="flex flex-col items-center text-center">
            <CardHeader>
              <BarChart className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Monitor your application metrics and optimize for better user experiences.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
