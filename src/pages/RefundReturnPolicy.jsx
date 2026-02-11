import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldAlert, Video, Truck, Clock, CreditCard, RefreshCw, FileCheck, Gavel, Phone } from 'lucide-react';

const RefundReturnPolicy = () => {
  const sections = [
    {
      title: "1. Mandatory Unboxing Video (Strict Requirement)",
      icon: Video,
      content: "To ensure transparency and authenticity, an unboxing video is mandatory for all return or refund claims. The video must start before opening the package, clearly showing the label and the condition of the package from all sides. It must continue without cuts or edits until the product is fully taken out and the issue is demonstrated. Claims without a valid unboxing video will be rejected immediately."
    },
    {
      title: "2. Valid Reasons for Return / Refund",
      icon: FileCheck,
      content: "Returns are accepted only if: (a) The product received is damaged or defective. (b) The wrong product, size, or color was delivered. (c) The product is significantly different from the description on our website. Please note that minor color variations due to screen settings are not considered defects."
    },
    {
      title: "3. Non-Returnable / Non-Refundable Cases",
      icon: ShieldAlert,
      content: "We do not accept returns for: (a) Products damaged due to misuse or mishandling by the customer. (b) Custom-made or personalized items (e.g., embroidered name tags). (c) Used, washed, or soiled items. (d) Items without original tags and packaging. (e) Change of mind after the product has been shipped."
    },
    {
      title: "4. Return Request Timeframe",
      icon: Clock,
      content: "All return or exchange requests must be raised within 48 hours of delivery. Requests made after this period will not be entertained. Please inspect your order immediately upon arrival., we will replace the item with in 6  working days"
    },
    {
      title: "5. Refund Amount & Shipping Charges",
      icon: CreditCard,
      content: "If a return is approved, the refund amount will be calculated based on the product price. Original shipping charges are non-refundable. For self-shipped returns, courier charges will be reimbursed only if the error was on our end (e.g., wrong item sent)."
    },
    {
      title: "6. Refund Processing Time",
      icon: RefreshCw,
      content: "Once the returned item reaches our warehouse and passes inspection, the refund will be initiated within 3-5 business days. The amount will be credited to the original payment source or your Sharma Army Store wallet, depending on your preference."
    },
    {
      title: "7. Return Procedure",
      icon: Truck,
      content: "To initiate a return, contact our support team via WhatsApp or Email with your Order ID and the mandatory unboxing video. Once approved, we will either arrange a reverse pickup (if available in your area) or ask you to ship the item to our warehouse address."
    },
    {
      title: "8. Inspection & Approval",
      icon: ShieldAlert,
      content: "All returned items undergo a strict quality check. If the item is found to be used, damaged by the customer, or missing original tags, the return will be rejected, and the item will be sent back to the customer at their expense."
    },
    {
      title: "9. Company Rights & Final Decision",
      icon: Gavel,
      content: "Sharma Army Store reserves the right to accept or decline any return request based on the evidence provided. In case of disputes, the decision of our management team will be final and binding."
    },
    {
      title: "10. Contact & Support",
      icon: Phone,
      content: "For any queries regarding returns or refunds, please reach out to us. \nPhone/WhatsApp: +91 89275 49897 \nEmail: sharma2022store@gmail.com \nAddress: Mallaguri More, Pradhan Nagar, Siliguri, West Bengal, 734001."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Refund & Return Policy - Sharma Army Store</title>
        <meta name="description" content="Read our comprehensive refund and return policy including mandatory unboxing video requirements and return procedures." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-16 mb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund & Return Policy</h1>
            <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div>
            <p className="mt-6 text-blue-100 text-lg">
              Transparency and trust are the core of our service. Please read our policy carefully.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`p-8 ${index !== sections.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg flex-shrink-0">
                    <section.icon className="w-6 h-6 text-blue-800" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Last Updated: January 2026
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundReturnPolicy;