import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award, Briefcase, BadgeCheck, Zap } from 'lucide-react';

const AboutUs = () => {
  const expertisePoints = [
    { text: "Specialized in authentic military uniforms and ceremonial wear", icon: Briefcase },
    { text: "Premium tactical boots for extreme terrain and conditions", icon: BadgeCheck },
    { text: "Custom embroidery and name patches with regulation compliance", icon: Award },
    { text: "High-performance outdoor survival gear and equipment", icon: Zap }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: '100% Authenticity',
      description: 'We guarantee genuine military-grade products sourced directly from authorized manufacturers.'
    },
    {
      icon: Target,
      title: 'Precision Quality',
      description: 'Every item undergoes strict quality control to meet defense standards.'
    },
    {
      icon: Users,
      title: 'Expert Consultation',
      description: 'Founded by defense veterans who understand the real-world needs of our customers.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Sharma Army Store</title>
        <meta name="description" content="Discover the legacy of Sharma Army Store. Your trusted partner for premium military and tactical equipment in Siliguri." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            >
              Our Legacy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Excellence</span>
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="h-1 w-24 bg-yellow-400 mx-auto mb-8"
            />
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto font-light"
            >
              Serving the brave since 2010 with unwavering commitment to quality and honor.
            </motion.p>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-l-4 border-yellow-400 pl-4">Who We Are</h2>
                <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Nestled in the strategic hub of Siliguri, <strong>Sharma Army Store</strong> stands as a beacon of reliability for defense personnel, security professionals, and outdoor enthusiasts. Established in 2010, our journey began with a singular vision: to bridge the gap between rigorous military standards and accessible tactical gear.
                  </p>
                  <p>
                    We are more than just a retail store; we are a part of the community that respects discipline and durability. Over the years, we have evolved from a small outfit to a premier destination for tactical equipment, earning the trust of thousands through transparent business practices and an uncompromising approach to quality.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                 <div className="absolute inset-0 bg-blue-600 rounded-2xl transform rotate-3 opacity-10"></div>
                 <img 
                    src="https://images.unsplash.com/photo-1541543975512-86aad5d2cf93" 
                    alt="Tactical Equipment" 
                    className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                 />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-20 bg-white shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
             >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Expertise</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">We specialize in equipping you with the best gear for any mission.</p>
             </motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {expertisePoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-700">
                      <point.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-800">{point.text}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Why Choose Sharma Army Store?</h2>
              <div className="h-1 w-16 bg-yellow-400 mx-auto rounded-full"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 mb-6 shadow-lg">
                    <item.icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-blue-100 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;