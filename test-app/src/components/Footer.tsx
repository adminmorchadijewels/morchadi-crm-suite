export function Footer() {
  return (
    <footer className="border-t bg-gray-50 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Test App. All rights reserved.</p>
      </div>
    </footer>
  )
}
