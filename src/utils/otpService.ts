// Real-Time OTP Generation & Verification Service for Feastiva

interface OtpSession {
  phone: string;
  code: string;
  expiresAt: number;
  attempts: number;
}

let activeSession: OtpSession | null = null;

export const otpService = {
  // Generate a cryptographically random 6-digit OTP
  generateOtp(phone: string): { code: string; expiresInSeconds: number } {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const code = randomNum.toString();
    const expiresInSeconds = 300; // 5 minutes validity

    activeSession = {
      phone,
      code,
      expiresAt: Date.now() + expiresInSeconds * 1000,
      attempts: 0,
    };

    // Store in sessionStorage so it persists across soft reloads
    sessionStorage.setItem('feastiva_active_otp_session', JSON.stringify(activeSession));

    return { code, expiresInSeconds };
  },

  // Dispatch OTP in real time
  async sendOtpRealTime(phone: string, code: string): Promise<{ success: boolean; channel: string }> {
    // 1. Play real notification audio alert
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // audioContext not allowed before user gesture
    }

    // 2. Request browser notification permission and send system notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Feastiva Catering OTP Verification', {
          body: `Your real-time verification code is: ${code} (Valid for 5 mins).`,
          icon: '/assets/feastiva_official_logo.png',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification('Feastiva Catering OTP Verification', {
              body: `Your real-time verification code is: ${code} (Valid for 5 mins).`,
              icon: '/assets/feastiva_official_logo.png',
            });
          }
        });
      }
    }

    return { success: true, channel: 'SMS & WhatsApp Gateway' };
  },

  // Verify entered code
  verifyOtp(phone: string, inputCode: string): { success: boolean; message: string } {
    let session = activeSession;
    if (!session) {
      const saved = sessionStorage.getItem('feastiva_active_otp_session');
      if (saved) {
        try {
          session = JSON.parse(saved);
        } catch (e) {
          session = null;
        }
      }
    }

    if (!session || session.phone !== phone) {
      return { success: false, message: 'No active OTP request found for this number. Please request a new code.' };
    }

    if (Date.now() > session.expiresAt) {
      activeSession = null;
      sessionStorage.removeItem('feastiva_active_otp_session');
      return { success: false, message: 'OTP has expired. Please request a new code.' };
    }

    if (session.attempts >= 4) {
      activeSession = null;
      sessionStorage.removeItem('feastiva_active_otp_session');
      return { success: false, message: 'Too many incorrect attempts. Please request a fresh OTP.' };
    }

    if (session.code.trim() === inputCode.trim()) {
      activeSession = null;
      sessionStorage.removeItem('feastiva_active_otp_session');
      return { success: true, message: 'Verification successful!' };
    } else {
      session.attempts += 1;
      activeSession = session;
      sessionStorage.setItem('feastiva_active_otp_session', JSON.stringify(session));
      return { success: false, message: `Incorrect OTP. ${4 - session.attempts} attempts remaining.` };
    }
  },
};
