import Layout from '../components/layout'

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
            <p>At TripZen, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our website and services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, book a trip, or contact our support team. This may include your name, email address, phone number, and payment information. We also automatically collect certain information about your device and how you interact with our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process your transactions, communicate with you, and personalize your experience. We may also use your information to send you promotional materials and updates about our services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Data Sharing and Disclosure</h2>
            <p>We may share your information with third-party service providers who perform services on our behalf, such as payment processing and customer support. We may also share your information as required by law or to protect our rights and the rights of others.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">6. Your Rights and Choices</h2>
            <p>You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided in the &quot;Contact Us&quot; section.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@tripzen.com or through our Contact Us page.</p>
          </section>
          <p className="text-sm text-gray-600">Last Updated: June 1, 2023</p>
        </div>
      </div>
    </Layout>
  )
}

