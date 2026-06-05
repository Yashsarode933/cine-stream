import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { Check, Tv, Smartphone, Monitor } from 'lucide-react';

// Zod schemas for validation
const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

const passwordSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [searchParams] = useSearchParams();
  const { register: registerUser, loading, error, setError, clearError } = useAuthStore();
  const navigate = useNavigate();

  // Form states
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredName, setRegisteredName] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('standard');

  // Form 1: Email
  const {
    register: regField1,
    handleSubmit: handleF1,
    formState: { errors: errorsF1 },
    setValue: setVal1,
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  // Form 2: Password
  const {
    register: regField2,
    handleSubmit: handleF2,
    formState: { errors: errorsF2 },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Pre-populate email from query parameter if coming from Landing page
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setVal1('email', emailParam);
    }
  }, [searchParams, setVal1]);

  const onF1Submit = (data) => {
    clearError();
    setRegisteredEmail(data.email);
    setStep(2);
  };

  const onF2Submit = (data) => {
    clearError();
    setRegisteredName(data.name);
    setRegisteredPassword(data.password);
    setStep(3);
  };

  const handleFinishSignup = async () => {
    clearError();
    const res = await registerUser(
      registeredName,
      registeredEmail,
      registeredPassword,
      selectedPlan
    );
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-brand-black flex flex-col justify-between"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0.85) 0%, rgba(20, 20, 20, 0.85) 100%), url('https://assets.nflxext.com/ffe/siteui/vlv3/7ca5b7c7-e7e0-4e20-9832-98b6f618482b/9a764d08-7d7b-4ad3-b183-5c7429177a1d/US-en-20240326-popsignuptwoweeks-perspective_yca_small.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between px-6 py-6 border-b border-gray-800 bg-brand-black/40">
        <h1 className="text-brand-red font-display text-4xl tracking-wider select-none cursor-pointer" onClick={() => navigate('/landing')}>
          CINESTREAM
        </h1>
        <Link to="/login" className="text-white hover:underline text-sm font-semibold">
          Sign In
        </Link>
      </header>

      {/* Main Form container */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-[500px] glass-card px-8 py-12 rounded-lg text-white">
          {/* Step Indicator */}
          <div className="text-xs text-brand-red font-bold uppercase tracking-wider mb-2">
            Step {step} of 3
          </div>

          {error && (
            <div className="bg-orange-600/20 border border-orange-600/50 text-orange-200 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          {/* STEP 1: EMAIL ENTRY */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-4">Create your account</h2>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Enter your email address to start your membership. Netflix is personalized for you.
              </p>
              
              <form onSubmit={handleF1(onF1Submit)} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
                    {...regField1('email')}
                  />
                  {errorsF1.email && (
                    <span className="text-brand-red text-xs mt-1 block">{errorsF1.email.message}</span>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-red-700 text-white font-semibold py-3.5 rounded transition mt-4"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: PASSWORD & DETAILS ENTRY */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-4">Choose a password</h2>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Few more details, and you will be ready to stream!
              </p>
              
              <form onSubmit={handleF2(onF2Submit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
                    {...regField2('name')}
                  />
                  {errorsF2.name && (
                    <span className="text-brand-red text-xs mt-1 block">{errorsF2.name.message}</span>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Create Password"
                    className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
                    {...regField2('password')}
                  />
                  {errorsF2.password && (
                    <span className="text-brand-red text-xs mt-1 block">{errorsF2.password.message}</span>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-[#333] hover:bg-[#444] focus:bg-[#444] border-b-2 border-transparent focus:border-brand-red focus:outline-none px-5 py-4 rounded text-white placeholder-gray-400 transition"
                    {...regField2('confirmPassword')}
                  />
                  {errorsF2.confirmPassword && (
                    <span className="text-brand-red text-xs mt-1 block">{errorsF2.confirmPassword.message}</span>
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3.5 rounded transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-brand-red hover:bg-red-700 text-white font-semibold py-3.5 rounded transition"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: PLAN SELECTION */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Select your streaming plan</h2>
              <p className="text-gray-300 text-xs mb-6">
                Choose the plan that suits you best. Downgrade or upgrade at any time.
              </p>

              {/* Plan Cards Grid */}
              <div className="space-y-3 mb-6">
                {/* Basic Plan */}
                <div 
                  onClick={() => setSelectedPlan('basic')}
                  className={`border p-4 rounded-lg cursor-pointer transition flex items-center justify-between ${
                    selectedPlan === 'basic' ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-gray-400" />
                    <div>
                      <h4 className="font-bold text-sm">Basic</h4>
                      <p className="text-xs text-gray-400">720p • Mobile/Tablet</p>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm">$9.99/mo</div>
                </div>

                {/* Standard Plan */}
                <div 
                  onClick={() => setSelectedPlan('standard')}
                  className={`border p-4 rounded-lg cursor-pointer transition flex items-center justify-between ${
                    selectedPlan === 'standard' ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Tv className="w-6 h-6 text-brand-red" />
                    <div>
                      <h4 className="font-bold text-sm">Standard</h4>
                      <p className="text-xs text-gray-400">1080p • FHD • 2 Screens</p>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm">$14.99/mo</div>
                </div>

                {/* Premium Plan */}
                <div 
                  onClick={() => setSelectedPlan('premium')}
                  className={`border p-4 rounded-lg cursor-pointer transition flex items-center justify-between ${
                    selectedPlan === 'premium' ? 'border-brand-red bg-brand-red/10' : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-brand-red animate-pulse" />
                    <div>
                      <h4 className="font-bold text-sm">Premium</h4>
                      <p className="text-xs text-gray-400">4K + HDR • UHD • 4 Screens</p>
                    </div>
                  </div>
                  <div className="font-extrabold text-sm">$19.99/mo</div>
                </div>
              </div>

              {/* Plan Benefits Checklist */}
              <ul className="text-xs text-gray-300 space-y-2 mb-6 px-1">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red" /> Watch all you want. Ad-free.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red" /> Recommendations just for you.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-red" /> Change or cancel your plan anytime.
                </li>
              </ul>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3.5 rounded transition"
                >
                  Back
                </button>
                <button
                  onClick={handleFinishSignup}
                  disabled={loading}
                  className="flex-1 bg-brand-red hover:bg-red-700 disabled:bg-brand-red/50 text-white font-semibold py-3.5 rounded transition flex items-center justify-center"
                >
                  {loading ? <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div> : 'Start Membership'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-brand-black/90 text-brand-gray text-xs py-8 border-t border-gray-800 text-center">
        <p>Questions? Contact us. Portfolio Project © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Register;
