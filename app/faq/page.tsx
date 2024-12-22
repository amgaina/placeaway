import Layout from '../components/layout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqItems = [
    {
      question: "How do I book a trip on TripZen?",
      answer: "To book a trip on TripZen, simply use our AI-powered trip planner to create your ideal itinerary. Once you're satisfied with the plan, you can book flights, hotels, and activities directly through our platform."
    },
    {
      question: "What is TripZen's cancellation policy?",
      answer: "Our cancellation policy varies depending on the specific bookings you've made. Generally, we offer free cancellation up to 48 hours before your trip starts. For more details, please check the terms and conditions of each booking."
    },
    {
      question: "How does TripZen's AI trip planner work?",
      answer: "Our AI trip planner uses advanced algorithms to analyze your preferences, budget, and travel style. It then creates a personalized itinerary based on this information, suggesting destinations, activities, and accommodations that best suit your needs."
    },
    {
      question: "Can I modify my itinerary after booking?",
      answer: "Yes, you can modify your itinerary after booking. However, changes may be subject to availability and additional fees. We recommend contacting our customer support team for assistance with any modifications."
    },
    {
      question: "Is my personal information secure with TripZen?",
      answer: "Yes, we take data security very seriously. We use industry-standard encryption and security measures to protect your personal information. For more details, please refer to our Privacy Policy."
    }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  )
}

