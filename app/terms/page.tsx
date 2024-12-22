import Layout from '../components/layout'

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using TripZen&apos;s services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Use of Services</h2>
            <p>You agree to use TripZen&apos;s services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">3. Booking and Cancellation</h2>
            <p>When you book a trip through TripZen, you agree to the specific terms and conditions of that booking, including any cancellation policies. TripZen acts as an intermediary between you and the service providers and is not responsible for the actions or inactions of these providers.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2>
            <p>All content and materials available on TripZen, including but not limited to text, graphics, logos, button icons, images, audio clips, data compilations, and software, are the property of TripZen or its content suppliers and are protected by copyright laws.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Limitation of Liability</h2>
            <p>TripZen shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Modifications to Terms</h2>
            <p>TripZen reserves the right to modify these Terms of Service at any time. We will notify users of any significant changes. Your continued use of our services after such modifications constitutes your acceptance of the updated terms.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at legal@tripzen.com or through our Contact Us page.</p>
          </section>
          <p className="text-sm text-gray-600">Last Updated: June 1, 2023</p>
        </div>
      </div>
    </Layout>
  )
}

