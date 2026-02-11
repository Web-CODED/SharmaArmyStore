import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronDown, ChevronUp, ShoppingBag, Phone, Truck, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Jai Hind! Welcome to Sharma Army Store. How can I assist you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const quickActions = [
    { label: "Browse Products", action: () => handleQuickAction("I want to browse products", "/products") },
    { label: "Track Order", action: () => handleQuickAction("How do I track my order?", "/profile") },
    { label: "Return Policy", action: () => handleQuickAction("What is your return policy?", "/refund-policy") },
    { label: "Contact Support", action: () => handleQuickAction("I need support", "/contact") },
  ];

  const handleQuickAction = (text, route) => {
    addMessage(text, 'user');
    setTimeout(() => {
      if (route) {
        navigate(route);
        addMessage(`Navigating you to ${text.toLowerCase().includes('policy') ? 'our policy page' : 'the requested page'}...`, 'bot');
      } else {
        processBotResponse(text);
      }
    }, 600);
  };

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    addMessage(input, 'user');
    const userInput = input;
    setInput("");

    setTimeout(() => {
      processBotResponse(userInput);
    }, 800);
  };

  const processBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    let response = "I'm not sure about that. Please contact our support team directly at +91 89275 49897 for detailed assistance.";

    if (lowerText.includes('hi') || lowerText.includes('hello')) {
      response = "Hello! Ready to gear up? Ask me about our tactical boots, jackets, or badges.";
    } else if (lowerText.includes('price') || lowerText.includes('cost')) {
      response = "Our prices are competitive and reflect authentic military-grade quality. You can view specific prices on the Products page.";
    } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
      response = "We ship across India! Delivery usually takes 5-7 business days depending on your location.";
    } else if (lowerText.includes('payment')) {
      response = "We accept Online Payments (UPI, Cards, NetBanking) and Cash on Delivery (COD).";
    } else if (lowerText.includes('return') || lowerText.includes('refund')) {
      response = "Returns are accepted within 48 hours with a mandatory unboxing video. Check our Refund Policy page for details.";
    } else if (lowerText.includes('shop') || lowerText.includes('buy')) {
      response = "You can browse our full catalog by clicking the 'Products' link in the menu.";
    }

    addMessage(response, 'bot');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-bold">Sharma Army Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-800 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="p-2 bg-gray-100 flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="px-3 py-1.5 bg-white border border-blue-200 text-blue-800 text-xs rounded-full hover:bg-blue-50 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-blue-800 to-yellow-500 text-white rounded-full shadow-2xl hover:shadow-blue-900/50 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default ChatBot;