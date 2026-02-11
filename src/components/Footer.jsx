import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  const socialLinks = [{
    icon: Facebook,
    href: 'https://www.facebook.com/profile.php?id=100042494335961',
    label: 'Facebook',
    color: 'hover:text-blue-500'
  }, {
    icon: Youtube,
    href: 'https://youtube.com/@sharmaarmystore?si=MNQ_sHwylYYJlqt_',
    label: 'YouTube',
    color: 'hover:text-red-500'
  }, {
    icon: Instagram,
    href: 'https://www.instagram.com/sharma_army_store_23/?utm_source=ig_web_button_share_sheet',
    label: 'Instagram',
    color: 'hover:text-pink-500'
  }];
  return <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                  Sharma Army Store<br />
                  Mallaguri More,<br />
                  Oppo. Hotel Central Plaza,<br />
                  Pradhan Nagar, Siliguri<br />
                  Dist- Darjeeling, 734001
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">+91 8927549897 / +91 9641385334</p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 group-hover:text-yellow-400 transition-colors" />
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">sharma2022store@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Social Media & MSME */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-4 text-yellow-400">Follow Us</h3>
              <div className="flex space-x-4 mb-8">
                {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className={`bg-gray-700 p-3 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg ${social.color}`}>
                    <social.icon className="w-5 h-5" />
                  </a>)}
              </div>
            </div>

            {/* MSME Registration */}
            <div className="bg-white rounded-lg p-3 shadow-md inline-block">
               <div className="flex flex-col items-center">
                <img src="https://horizons-cdn.hostinger.com/b9f511a5-b437-4404-bbe4-e577af5d79fe/51c554d71b61dab09f3ece1ec3160ec1.png" alt="Ministry of MSME, Govt. of India" className="h-16 object-contain mb-2" />
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-900">Reg No.</p>
                  <p className="text-xs font-bold text-blue-800">WB-06-00-58769</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-2 h-64 md:h-full min-h-[250px] rounded-xl overflow-hidden shadow-2xl border border-gray-700 relative group cursor-pointer transition-all duration-300 hover:shadow-blue-900/50 hover:border-blue-500">
            <a href="https://maps.app.goo.gl/qqqvWo2h99b9FQjy5" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 bg-transparent" aria-label="Open Map Location">
            </a>
            <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3563.858788484839!2d88.42081131500366!3d26.727100083208595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e44114f0e6081d%3A0x7d97d0c7c8c3c1e2!2sPradhan%20Nagar%2C%20Siliguri%2C%20West%20Bengal%20734001!5e0!3m2!1sen!2sin!4v1675240000000!5m2!1sen!2sin" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Sharma Army Store Location"></iframe>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Sharma Army Store. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2 md:mt-0 flex items-center">
            Designed and Developed by Rana Routh
            <ExternalLink className="w-3 h-3 ml-1" />
        </p>
        <p className="text-xs text-gray-500 mt-2 md:mt-0 flex items-center">
          <Link
            to="/privacy-policy"
            className="hover:underline"
          >
            Privacy Policy
          </Link>
        </p>
 
        <p className="text-xs text-gray-500 mt-2 md:mt-0 flex items-center">
          <Link
            to="/terms-conditions"
            className="hover:underline"
          >
            Terms and Conditions
          </Link>
        </p>    
        </div>
      </div>
    </footer>;
};
export default Footer;