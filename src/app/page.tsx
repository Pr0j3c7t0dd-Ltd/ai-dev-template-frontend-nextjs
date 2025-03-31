import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your App</CardTitle>
          <CardDescription>You are now signed in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a protected page that only authenticated users can see.</p>
        </CardContent>
      </Card>
    </div>
  )
}
