export default function FAQPage() {
  const faqs = [
    {
      category: 'General',
      questions: [
        { q: 'What is FarmBridge?', a: 'FarmBridge is Nigeria\'s premium agricultural marketplace connecting verified farmers and buyers with secure escrow payments.' },
        { q: 'Is FarmBridge free to use?', a: 'Yes! Buyers can browse and purchase for free. Sellers can start with a free Basic plan.' },
        { q: 'How do I get started?', a: 'Simply create an account, verify your identity, and start browsing or listing products.' },
      ]
    },
    {
      category: 'Buyers',
      questions: [
        { q: 'How do I purchase a product?', a: 'Browse the marketplace, find what you need, click "Buy Now", and complete payment securely via Paystack.' },
        { q: 'Is my payment safe?', a: 'Absolutely. All payments are held in escrow by Paystack and only released when you confirm delivery.' },
        { q: 'What if the product is not as described?', a: 'You can raise a dispute within 72 hours of delivery. Our team will review and resolve fairly.' },
      ]
    },
    {
      category: 'Sellers',
      questions: [
        { q: 'How do I become a seller?', a: 'Create an account, then click "Become a Seller" in your dashboard. Complete your profile and start listing products.' },
        { q: 'How do I get verified?', a: 'Upload your government ID and bank details. Our team reviews within 24-48 hours.' },
        { q: 'When do I get paid?', a: 'Payment is released to your bank account after the buyer confirms delivery, usually within 24-72 hours.' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Everything you need to know about FarmBridge.</p>
        </div>

        {faqs.map((section) => (
          <div key={section.category} className="mb-10">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">{section.category}</h2>
            <div className="space-y-3">
              {section.questions.map((faq) => (
                <details key={faq.q} className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-200 transition">
                  <summary className="flex justify-between items-center cursor-pointer font-semibold text-gray-900 list-none">
                    {faq.q}
                    <span className="text-gray-400 group-open:hidden">+</span>
                    <span className="text-green-700 hidden group-open:inline">−</span>
                  </summary>
                  <p className="text-gray-500 mt-3 text-sm leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12 bg-amber-50 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900">Still have questions?</h3>
          <p className="text-gray-500 mt-1">Contact us on WhatsApp or email.</p>
          <div className="flex justify-center gap-3 mt-4 text-sm">
            <a href="https://wa.me/2349077753551" className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">📱 09057773551</a>
            <a href="mailto:farmpricenigeria@gmail.com" className="bg-white border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition">📧 Email Us</a>
          </div>
        </div>

      </div>
    </div>
  );
}
