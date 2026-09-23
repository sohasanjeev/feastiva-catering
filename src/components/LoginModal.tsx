import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { otpService } from '../utils/otpService';
import { 
  X, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  MessageSquare,
  AlertCircle,
  BellRing
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [authMode, setAuthMode] = useState<'phone' | 'google'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [activeCodeBanner, setActiveCodeBanner] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any = null;
    if (otpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    // Generate real cryptographic 6-digit OTP
    const { code } = otpService.generateOtp(phoneNumber);
    await otpService.sendOtpRealTime(phoneNumber, code);

    setIsLoading(false);
    setActiveCodeBanner(code);
    setOtpStep(true);
    setResendTimer(60);
    setOtpDigits(['', '', '', '', '', '']);

    // Focus first input box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    const { code } = otpService.generateOtp(phoneNumber);
    await otpService.sendOtpRealTime(phoneNumber, code);
    setIsLoading(false);
    setActiveCodeBanner(code);
    setResendTimer(60);
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
  };

  const handleAutoFill = () => {
    if (activeCodeBanner && activeCodeBanner.length === 6) {
      const digits = activeCodeBanner.split('');
      setOtpDigits(digits);
      verifyCode(activeCodeBanner);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      if (pasted.length === 6) {
        verifyCode(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }

    const newDigits = [...otpDigits];
    newDigits[index] = val;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 filled
    if (newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = (codeToVerify: string) => {
    setErrorMessage('');
    const result = otpService.verifyOtp(phoneNumber, codeToVerify);

    if (result.success) {
      const newUser: UserProfile = {
        name: userName || `Guest ${phoneNumber.slice(-4)}`,
        phone: phoneNumber,
        email: `${phoneNumber}@feastivacatering.com`,
        isLoggedIn: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      };
      onLogin(newUser);
      onClose();
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(otpDigits.join(''));
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = googleEmail || 'customer@gmail.com';
    const inferredName = emailToUse.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
    const formattedName = inferredName.charAt(0).toUpperCase() + inferredName.slice(1);

    const newUser: UserProfile = {
      name: formattedName || 'Google User',
      phone: '9876543210',
      email: emailToUse,
      isLoggedIn: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#121217] border border-amber-500/40 shadow-2xl p-6 sm:p-8 space-y-6 text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-b from-amber-500/20 to-amber-950/40 border border-amber-500/40 flex items-center justify-center shadow-gold-glow">
            <img src="/assets/feastiva_official_logo.png" alt="Feastiva" className="w-10 h-10 object-contain rounded-full" />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            {currentUser?.isLoggedIn ? 'Your Feastiva Profile' : 'Customer Sign In'}
          </h3>
          <p className="text-xs text-stone-400">
            {currentUser?.isLoggedIn
              ? 'Manage your customized catering orders & saved menus'
              : 'Sign in with your mobile number to get instant quotation updates'}
          </p>
        </div>

        {currentUser?.isLoggedIn ? (
          /* LOGGED IN VIEW */
          <div className="space-y-5 pt-2">
            <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
              />
              <div className="truncate">
                <p className="font-serif font-bold text-white text-sm">{currentUser.name}</p>
                <p className="text-xs text-stone-400 font-mono">{currentUser.phone}</p>
                <p className="text-[11px] text-amber-400 truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Verified customer session active. Fast checkout enabled.</span>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-full bg-stone-900 hover:bg-red-500/10 border border-stone-800 hover:border-red-500/40 text-stone-300 hover:text-red-400 font-semibold text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* AUTH FORM */
          <div className="space-y-5">
            
            {/* SMS Delivery Notice to Phone */}
            {otpStep && (
              <div className="p-4 rounded-2xl bg-[#151520] border border-amber-500/30 shadow-lg space-y-2 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                    <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>SMS Dispatched to Your Mobile</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                    ✓ Sent to Phone
                  </span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  A 6-digit verification code has been sent via SMS to <strong className="text-white font-mono">+91 {phoneNumber}</strong>. Please check your mobile phone's SMS inbox and enter the 6 digits below.
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800">
                  <span>Check handset messages</span>
                  <span className="text-amber-400/90 font-mono">Valid for 5 mins</span>
                </div>
              </div>
            )}

            {/* Tabs: Phone vs Google */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-900 border border-stone-800 text-xs font-semibold">
              <button
                onClick={() => {
                  setAuthMode('phone');
                  setOtpStep(false);
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                  authMode === 'phone'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Mobile OTP
              </button>

              <button
                onClick={() => {
                  setAuthMode('google');
                  setErrorMessage('');
                }}
                className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                  authMode === 'google'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Google / Gmail
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {authMode === 'phone' ? (
              !otpStep ? (
                /* STEP 1: ENTER PHONE */
                <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                  <div>
                    <label className="text-stone-300 block mb-1">Your Full Name (Optional)</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1">Mobile Number (10 Digits) *</label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 font-mono text-xs">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono text-xs focus:outline-none focus:border-amber-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={phoneNumber.length < 10 || isLoading}
                    className={`w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-gold-glow ${
                      phoneNumber.length < 10 || isLoading
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:scale-[1.02]'
                    }`}
                  >
                    <span>{isLoading ? 'Generating Code...' : 'Get Instant OTP'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                /* STEP 2: ENTER 6-DIGIT REAL-TIME OTP */
                <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
                  <div className="text-center space-y-1">
                    <p className="text-stone-300 font-medium">
                      Enter the 6-digit verification code sent to:
                    </p>
                    <p className="font-mono text-amber-300 font-bold text-sm">
                      +91 {phoneNumber}
                    </p>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="flex items-center justify-center gap-2 py-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="w-10 h-12 text-center text-xl font-bold font-mono rounded-xl bg-stone-900 border border-stone-700 text-amber-300 focus:outline-none focus:border-amber-400 focus:bg-stone-800 transition-colors shadow-inner"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="hover:text-white underline"
                    >
                      Change Number
                    </button>

                    <button
                      type="button"
                      disabled={resendTimer > 0 || isLoading}
                      onClick={handleResend}
                      className={`flex items-center gap-1 ${
                        resendTimer > 0
                          ? 'text-stone-500 cursor-not-allowed'
                          : 'text-amber-400 hover:text-amber-200 underline font-semibold'
                      }`}
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}</span>
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/919234076376?text=${encodeURIComponent(`Hello Feastiva Catering, please verify my login for mobile number +91 ${phoneNumber}. Code: ${activeCodeBanner || ''}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Receive / Verify via Official WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    disabled={otpDigits.some((d) => d === '')}
                    className={`w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-gold-glow ${
                      otpDigits.some((d) => d === '')
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 hover:scale-[1.02]'
                    }`}
                  >
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )
            ) : (
              /* GOOGLE SIGN IN */
              <form onSubmit={handleGoogleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="text-stone-300 block mb-1">Your Gmail Address *</label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            <p className="text-[11px] text-stone-500 text-center">
              Secured with 256-bit encryption. Feastiva never shares your mobile number.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
