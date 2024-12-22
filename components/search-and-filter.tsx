import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SearchAndFilter({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search itinerary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

