import { Link, NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-blue-600">Test App</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn(
                'text-sm font-medium transition-colors hover:text-blue-600',
                isActive ? 'text-blue-600' : 'text-gray-600'
              )
            }
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
