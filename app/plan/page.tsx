'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/layout'
import { AbstractLines, AbstractShapes } from '@/components/decorative-elements'
import { TripPlannerForm } from '@/components/trip-planner-form'
import { DraftList } from '@/components/draft-list'

export default function Plan() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [drafts, setDrafts] = useState<Array<{ id: string; name: string; destinations: string[]; duration: number; travelers: number }>>([])

  useEffect(() => {
    // In a real application, you would fetch drafts from your backend or local storage
    const mockDrafts = [
      { id: 'draft1', name: 'Paris Getaway', destinations: ['Paris'], duration: 7, travelers: 2 },
      { id: 'draft2', name: 'Asian Adventure', destinations: ['Tokyo', 'Seoul', 'Bangkok'], duration: 14, travelers: 3 },
      { id: 'draft3', name: 'European Tour', destinations: ['London', 'Paris', 'Rome'], duration: 10, travelers: 2 },
    ]
    setDrafts(mockDrafts)
  }, [])

  const handleGeneratePlan = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    // In a real application, you would send the plan details to your backend
    // and receive a unique trip ID in response
    const tripId = 'unique-trip-id'
    setIsLoading(false)
    router.push(`/playground?tripId=${tripId}`)
  }

  const handleContinueDraft = (draftId: string) => {
    // In a real application, you would fetch the draft details from your backend
    // and navigate to the playground with the draft data
    router.push(`/playground?draftId=${draftId}`)
  }

  return (
    <Layout>
      <section className="relative py-12 bg-gray-100 overflow-hidden">
        <AbstractShapes className="text-amber-200 opacity-30 top-0 right-0" />
        <AbstractLines className="text-sky-200 opacity-30 bottom-0 left-0" />
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Plan Your Dream Trip</h1>
          <div className="max-w-4xl mx-auto">
            <TripPlannerForm onGeneratePlan={handleGeneratePlan} isLoading={isLoading} />
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Drafts</h2>
          <DraftList drafts={drafts} onContinueDraft={handleContinueDraft} onDeleteDraft={function (draftId: string): void {
            console.log(draftId)
            throw new Error('Function not implemented.')
          } } />
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-sky-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Inspiration?</h2>
          <p className="text-xl mb-8">Check out our curated travel guides for popular destinations.</p>
          <button className="bg-white text-sky-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Explore Travel Guides
          </button>
        </div>
      </section>
    </Layout>
  )
}

