import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Plus, Minus } from 'lucide-react';

const faqData = [
  {
    q: "What is CineStream?",
    a: "CineStream is a streaming discovery platform that allows you to browse thousands of movies, TV shows, and trailers. Powered by live data, it helps you manage your watchlist, rate items, and explore categories effortlessly."
  },
  {
    q: "How much does CineStream cost?",
    a: "Watch CineStream on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from Basic at $9.99 to Premium at $19.99 a month. No extra costs, no contracts."
  },
  {
    q: "Where can I watch?",
    a: "Watch anywhere, anytime. Sign in with your CineStream account to watch instantly on the web from your personal computer or on any internet-connected device."
  },
  {
    q: "How do I cancel?",
    a: "CineStream is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees — start or stop your account anytime."
  },
  {
    q: "What can I watch on CineStream?",
    a: "CineStream has an extensive library of feature films, award-winning documentaries, TV shows, anime, and more. Watch as much as you want, anytime you want."
  }
];

const Landing = () => {
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (!email) return;
    navigate(`/register?email=${encodeURIComponent(email)}`);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      {/* Background Hero Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(20, 20, 20, 1) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/7ca5b7c7-e7e0-4e20-9832-98b6f618482b/9a764d08-7d7b-4ad3-b183-5c7429177a1d/US-en-20240326-popsignuptwoweeks-perspective_yca_small.jpg')`
        }}
      />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <h1 className="text-brand-red font-display text-4xl sm:text-5xl tracking-wider select-none cursor-pointer" onClick={() => navigate('/landing')}>
          CINESTREAM
        </h1>
        <button 
          onClick={() => navigate('/login')}
          className="bg-brand-red px-5 py-1.5 rounded text-sm font-semibold hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </header>

      {/* Hero CTA section */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-24 pb-32">
        <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          Unlimited movies, TV shows, and more
        </h2>
        <p className="text-lg sm:text-2xl font-normal mb-8 text-gray-200">
          Watch anywhere. Cancel anytime.
        </p>
        <p className="text-base sm:text-xl font-normal text-gray-300 mb-6">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        
        <form onSubmit={handleGetStarted} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full sm:flex-1 bg-black/60 border border-gray-600 focus:border-white focus:outline-none px-4 py-4 rounded text-white text-base transition-colors"
          />
          <button 
            type="submit"
            className="w-full sm:w-auto bg-brand-red hover:bg-red-700 text-white font-semibold text-lg sm:text-xl px-8 py-4 rounded flex items-center justify-center gap-2 transition"
          >
            Get Started <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </form>
      </section>

      {/* FAQ Accordion Section */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-16 border-t-8 border-brand-darkGray">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          Frequently Asked Questions
        </h3>
        
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-brand-darkGray rounded">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left text-lg sm:text-2xl hover:bg-gray-800 transition"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <Minus className="w-6 h-6 sm:w-8 sm:h-8" /> : <Plus className="w-6 h-6 sm:w-8 sm:h-8" />}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-96 border-t border-brand-black/30' : 'max-h-0'
                }`}
              >
                <p className="px-6 py-6 text-base sm:text-lg leading-relaxed text-gray-300">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-brand-black/90 text-brand-gray text-xs sm:text-sm py-16 border-t-8 border-brand-darkGray">
        <div className="max-w-4xl mx-auto px-6">
          <p className="mb-8 hover:underline cursor-pointer">Questions? Contact us.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer">FAQ</p>
              <p className="hover:underline cursor-pointer">Investor Relations</p>
              <p className="hover:underline cursor-pointer">Ways to Watch</p>
              <p className="hover:underline cursor-pointer">Corporate Information</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer">Help Center</p>
              <p className="hover:underline cursor-pointer">Jobs</p>
              <p className="hover:underline cursor-pointer">Terms of Use</p>
              <p className="hover:underline cursor-pointer">Contact Us</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer">Account</p>
              <p className="hover:underline cursor-pointer">Redeem Gift Cards</p>
              <p className="hover:underline cursor-pointer">Privacy</p>
              <p className="hover:underline cursor-pointer">Speed Test</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer">Media Center</p>
              <p className="hover:underline cursor-pointer">Buy Gift Cards</p>
              <p className="hover:underline cursor-pointer">Cookie Preferences</p>
              <p className="hover:underline cursor-pointer">Legal Notices</p>
            </div>
          </div>
          <p className="text-[10px]">CineStream Project Portfolio © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
