import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
          About Test App
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Learn more about this application and the technologies it uses.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This Test App serves as a foundation for development and testing purposes.
              It provides a clean, minimal setup that can be extended for various use cases
              including prototyping, learning, and building production applications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li><strong>React 18</strong> - Modern React with hooks and concurrent features</li>
              <li><strong>TypeScript</strong> - Static type checking for JavaScript</li>
              <li><strong>Vite</strong> - Next-generation frontend build tool</li>
              <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
              <li><strong>React Router</strong> - Declarative routing for React</li>
              <li><strong>Vitest</strong> - Fast unit testing framework</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">
              To run this application locally:
            </p>
            <pre className="rounded-lg bg-gray-100 p-4 text-sm">
              <code>{`# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
