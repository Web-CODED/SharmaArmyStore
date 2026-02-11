import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, FileText, Shield, AlertCircle, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const sections = [
    {
      title: '1. Agreement to Terms',
      icon: FileText,
      content: 'By accessing and using Sharma Army Store, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      title: '2. Use License',
      icon: Shield,
      content: 'Permission is granted to temporarily download one copy of the materials (information or software) on Sharma Army Store for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: (a) Modify or copy the materials; (b) Use the materials for any commercial purpose or for any public display; (c) Attempt to decompile or reverse engineer any software contained on the Sharma Army Store; (d) Remove any copyright or other proprietary notations from the materials; (e) Transfer the materials to another person or "mirror" the materials on any other server.'
    },
    {
      title: '3. Disclaimer',
      icon: AlertCircle,
      content: 'The materials on Sharma Army Store are provided "as is". Sharma Army Store makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.'
    },
    {
      title: '4. Limitations',
      icon: Shield,
      content: 'In no event shall Sharma Army Store or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sharma Army Store, even if Sharma Army Store or an authorized representative has been notified orally or in writing of the possibility of such damage.'
    },
    {
      title: '5. Accuracy of Materials',
      icon: CheckCircle,
      content: 'The materials appearing on Sharma Army Store could include technical, typographical, or photographic errors. Sharma Army Store does not warrant that any of the materials on the website are accurate, complete, or current. Sharma Army Store may make changes to the materials contained on the website at any time without notice.'
    },
    {
      title: '6. Materials on Website',
      icon: FileText,
      content: 'Sharma Army Store has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Sharma Army Store of the site. Use of any such linked website is at the user\'s own risk.'
    },
    {
      title: '7. Modifications',
      icon: Shield,
      content: 'Sharma Army Store may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.'
    },
    {
      title: '8. Governing Law',
      icon: FileText,
      content: 'These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.'
    },
    {
      title: '9. Contact Information',
      icon: Mail,
      content: 'If you have any questions about these Terms & Conditions:\nPhone/WhatsApp: +91 89275 49897\nEmail: sharma2022store@gmail.com\nAddress: Mallaguri More, Pradhan Nagar, Siliguri, West Bengal, 734001'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - Sharma Army Store</title>
        <meta name="description" content="Read our terms and conditions to understand the rules and regulations for using Sharma Army Store." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full mb-6"></div>
            <p className="text-blue-100 text-lg">Please read our terms and conditions carefully before using our service.</p>
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

export default TermsAndConditions;
