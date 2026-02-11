import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, Users, Lock, FileText, Smartphone, Shield, Globe, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      title: '1. Information We Collect',
      icon: Users,
      content: 'We collect information you provide directly, such as when you create an account, place an order, or contact us. This includes contact information (name, email, phone number, address), payment information, and any other details you choose to share with us.'
    },
    {
      title: '2. How We Use Your Information',
      icon: FileText,
      content: 'We use the information we collect to: (a) Process and fulfill your orders; (b) Communicate with you about your account and transactions; (c) Provide customer support; (d) Send promotional emails and updates (with your consent); (e) Improve our website and services; (f) Comply with legal obligations.'
    },
    {
      title: '3. Data Security',
      icon: Lock,
      content: 'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.'
    },
    {
      title: '4. Third-Party Sharing',
      icon: Users,
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our website, conducting our business, or serving our customers, provided those service providers agree to keep this information confidential.'
    },
    {
      title: '5. Cookies',
      icon: Smartphone,
      content: 'Our website uses cookies to enhance your experience. Cookies are small files stored on your device that help us remember your preferences and understand how you use our website. You can disable cookies through your browser settings, but this may affect your ability to use certain features.'
    },
    {
      title: '6. Your Rights',
      icon: Shield,
      content: 'You have the right to: (a) Access your personal information; (b) Correct inaccurate information; (c) Request deletion of your information (subject to legal retention requirements); (d) Opt-out of promotional communications; (e) Data portability in certain cases.'
    },
    {
      title: '7. Children\'s Privacy',
      icon: Globe,
      content: 'Sharma Army Store is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18. If we discover such information, we will promptly delete it.'
    },
    {
      title: '8. Changes to Privacy Policy',
      icon: FileText,
      content: 'We reserve the right to update this Privacy Policy at any time. Changes will be effective immediately upon posting to the website. Your continued use of our website following the posting of revised Privacy Policy means you accept and agree to the changes.'
    },
    {
      title: '9. Contact Us',
      icon: Mail,
      content: 'For privacy-related inquiries:\nPhone/WhatsApp: +91 89275 49897\nEmail: sharma2022store@gmail.com\nAddress: Mallaguri More, Pradhan Nagar, Siliguri, West Bengal, 734001'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - Sharma Army Store</title>
        <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your personal information." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 mb-12"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full mb-6"></div>
            <p className="text-blue-100 text-lg">Your privacy is important to us. Please read our privacy policy to understand our practices.</p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSection === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-gray-100 last:border-b-0 ${
                    isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                  } transition-colors duration-200`}
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : index)}
                    className="w-full p-6 text-left flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0 mt-1">
                      <Icon className="w-6 h-6 text-blue-800" />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h2>
                      {!isExpanded && (
                        <p className="text-gray-600 line-clamp-2 text-sm">{section.content}</p>
                      )}
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isExpanded ? 'auto' : 0,
                      opacity: isExpanded ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pl-[72px] text-gray-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Have Questions?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Phone/WhatsApp</p>
                <p className="text-blue-100 text-sm mt-1">+91 89275 49897</p>
              </div>
              <div>
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Email</p>
                <p className="text-blue-100 text-sm mt-1">sharma2022store@gmail.com</p>
              </div>
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <p className="font-semibold">Address</p>
                <p className="text-blue-100 text-sm mt-1">Mallaguri More, Pradhan Nagar, Siliguri, WB 734001</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
