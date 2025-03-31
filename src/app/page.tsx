import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-4 text-center py-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to Your Next.js App
        </h1>
        <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          Built with the latest technologies including Next.js 14, Tailwind CSS, and shadcn/ui components.
        </p>
        <div className="space-x-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Modern Stack</CardTitle>
            <CardDescription>Built with Next.js 14</CardDescription>
          </CardHeader>
          <CardContent>
            Leverage the power of React Server Components and the App Router for optimal performance.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Beautiful UI</CardTitle>
            <CardDescription>Styled with Tailwind CSS</CardDescription>
          </CardHeader>
          <CardContent>
            Fully responsive and customizable design system using utility-first CSS framework.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Accessible Components</CardTitle>
            <CardDescription>Using shadcn/ui</CardDescription>
          </CardHeader>
          <CardContent>
            Beautiful and accessible components built with Radix UI and Tailwind CSS.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
