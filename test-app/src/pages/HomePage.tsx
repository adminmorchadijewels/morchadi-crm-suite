import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card'

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to Test App
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          A simple, clean React application built with Vite, TypeScript, and Tailwind CSS.
          Perfect for testing and development purposes.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Link to="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fast Development</CardTitle>
            <CardDescription>
              Powered by Vite for lightning-fast hot module replacement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Experience instant feedback during development with Vite's blazing-fast
              build tool and hot module replacement.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type Safety</CardTitle>
            <CardDescription>
              Built with TypeScript for reliable code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Catch errors early with TypeScript's static type checking and enjoy
              better IDE support with autocompletion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modern Styling</CardTitle>
            <CardDescription>
              Styled with Tailwind CSS for rapid UI development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Build beautiful, responsive interfaces quickly using Tailwind's
              utility-first CSS framework.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
