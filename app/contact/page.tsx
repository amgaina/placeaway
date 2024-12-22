import Layout from '../components/layout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <Input type="text" id="name" name="name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <Input type="email" id="email" name="email" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <Textarea id="message" name="message" rows={4} required />
              </div>
              <Button type="submit">Send Message</Button>
            </form>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                <span>support@tripzen.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-600" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                <span>700 University Avenue, Monroe, LA 71209</span>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM (PST)</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

