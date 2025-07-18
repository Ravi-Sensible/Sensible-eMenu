
import { Search, MapPin } from 'lucide-react'

interface HeaderProps {
  searchQuery: string
   outlet: {
    name?: string
    branch?: string
    // optionally add: openingTime?: string, closingTime?: string, status?: string
  }
  setSearchQuery: (query: string) => void
}

export default function Header({ searchQuery, setSearchQuery,outlet }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{outlet?.name}</h1>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{outlet?.branch}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600 font-semibold">Open</div>
            <div className="text-xs text-gray-500">Until 11:00 PM</div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input
            type="text"
            placeholder="Search for food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </header>
  )
}