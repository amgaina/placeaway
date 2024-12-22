'use client'

import { useState } from 'react'
import Layout from '../components/layout'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, DollarSign, Star } from 'lucide-react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{
    id: number;
    name: string;
    destination: string;
    date: string;
    duration: string;
    price: number;
    rating: number;
    image: string;
  }>>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically fetch search results from your backend
    // For now, we'll use mock data
    const mockResults = [
      { id: 1, name: 'Paris Getaway', destination: 'Paris, France', date: '2023-08-15', duration: '7 days', price: 1200, rating: 4.8, image: '/placeholder.svg?height=200&width=300' },
      { id: 2, name: 'Tokyo Adventure', destination: 'Tokyo, Japan', date: '2023-09-01', duration: '10 days', price: 2500, rating: 4.9, image: '/placeholder.svg?height=200&width=300' },
      { id: 3, name: 'New York City Trip', destination: 'New York, USA', date: '2023-07-20', duration: '5 days', price: 1500, rating: 4.7, image: '/placeholder.svg?height=200&width=300' },
    ]
    setSearchResults(mockResults)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Discover Your Next Adventure</h1>
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search destinations, activities, or trips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result) => (
            <Card key={result.id} className="overflow-hidden">
              <div className="relative h-48">
                <img src={result.image} alt={result.name} className="object-cover w-full h-full" />
                <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  {result.rating}
                </div>
              </div>
              <CardHeader>
                <CardTitle>{result.name}</CardTitle>
                <CardDescription>{result.destination}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{result.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{result.duration}</span>
                  </div>
                  <div className="flex items-center text-sm font-semibold">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>${result.price}</span>
                  </div>
                </div>
                <Button className="mt-4 w-full">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

