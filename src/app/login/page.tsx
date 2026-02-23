'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type LoginStep = 'loading' | 'selector' | 'email' | 'verification' | 'mypage';

interface UserInfo {
  userId: string;
  nickname: string;
  email: string;
}

/* ─────────────────────────────────────────────
   인라인 아이콘
───────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0C4.029 0 0 3.134 0 7c0 2.467 1.574 4.634 3.963 5.9L2.99 17.1a.3.3 0 0 0 .455.316L8.418 13.9c.192.013.386.02.582.02 4.971 0 9-3.134 9-7S13.971 0 9 0Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   6자리 인증번호 입력
───────────────────────────────────────────── */
function VerificationCodeInput({
  digits,
  onDigitChange,
  disabled,
}: {
  digits: string[];
  onDigitChange: (index: number, value: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const numeric = value.replace(/\D/g, '');

    if (numeric.length > 1) {
      const chars = numeric.slice(0, 6).split('');
      chars.forEach((ch, i) => onDigitChange(i, ch));
      const nextIdx = Math.min(chars.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    onDigitChange(index, numeric);
    if (numeric && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    pasted.split('').forEach((ch, i) => onDigitChange(i, ch));
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 border-2 border-border rounded-xl text-center text-lg font-semibold bg-muted focus:border-primary focus:bg-white focus:outline-none disabled:opacity-40 transition-all duration-200"
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   타이머 훅
───────────────────────────────────────────── */
function useCountdown(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  return { timeLeft, formatted: `${mm}:${ss}`, expired: timeLeft === 0 };
}

/* ─────────────────────────────────────────────
   Step 1 — 로그인 방식 선택
───────────────────────────────────────────── */
function LoginSelector({ onSelectEmail }: { onSelectEmail: () => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h3 className="font-serif text-3xl text-foreground mb-2">시작하기</h3>
          <p className="text-base text-muted-foreground">
            로그인하거나 새 계정을 만들어보세요
          </p>
        </div>

        <button
          onClick={onSelectEmail}
          className="w-full py-4 rounded-full font-medium text-base tracking-wide mb-3 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
          style={{ backgroundColor: '#cfc4b4', color: '#1c1917' }}
        >
          이메일로 계속하기
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">또는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex gap-3 mb-7">
          <button className="flex-1 h-13 border border-border rounded-full bg-[#FEE500] flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <KakaoIcon />
            <span className="text-[#3C1E1E] font-medium text-base">카카오</span>
          </button>
          <button className="flex-1 h-13 border border-border rounded-full bg-white flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <GoogleIcon />
            <span className="text-foreground font-medium text-base">Google</span>
          </button>
        </div>

        <p className="text-center text-muted-foreground text-sm leading-relaxed">
          계속하면 서비스의{' '}
          <span className="underline cursor-pointer hover:text-foreground transition-colors duration-200">
            이용 약관
          </span>
          에 동의하는 것입니다.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   공통 카드 래퍼 (반응형)
───────────────────────────────────────────── */
function AuthCard({
  onBack,
  children,
}: {
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:items-center md:justify-center md:px-6 md:py-12">
      <div className="flex flex-col flex-1 md:flex-none w-full md:max-w-md">
        {/* 뒤로가기 — 모바일 */}
        <div className="px-6 pt-12 pb-2 md:hidden">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 -ml-1"
          >
            <ChevronLeft />
            <span className="text-base">뒤로</span>
          </button>
        </div>

        {/* 뒤로가기 — 데스크탑 고정 */}
        <button
          onClick={onBack}
          className="hidden md:flex fixed top-6 left-6 items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ChevronLeft />
          <span className="text-base">뒤로</span>
        </button>

        <div className="flex flex-col flex-1 md:flex-none px-6 md:px-10 pb-10">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — 이메일 입력
───────────────────────────────────────────── */
function EmailStep({
  email,
  onChange,
  onSubmit,
  onBack,
  isLoading,
  errorMessage,
}: {
  email: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage: string;
}) {
  return (
    <AuthCard onBack={onBack}>
      <div className="pt-8 pb-8">
        <h2 className="font-serif text-3xl text-foreground mb-2">이메일로 계속하기</h2>
        <p className="text-base text-muted-foreground">이메일로 로그인하거나 가입하세요</p>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={onChange}
          onKeyDown={(e) => e.key === 'Enter' && email && onSubmit()}
          autoComplete="email"
          disabled={isLoading}
          className="w-full px-4 py-3.5 border border-border rounded-xl text-base bg-muted placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white transition-colors duration-200"
        />

        {errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}

        <button
          onClick={onSubmit}
          disabled={!email.trim() || isLoading}
          className="w-full py-4 bg-primary text-primary-foreground rounded-full font-medium text-base tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:shadow-[0_8px_30px_rgba(87,107,83,0.3)] hover:enabled:-translate-y-0.5 transition-all duration-200 active:enabled:scale-[0.98]"
        >
          {isLoading ? '전송 중...' : '인증번호 받기'}
        </button>
      </div>
    </AuthCard>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — 인증번호 입력
───────────────────────────────────────────── */
function VerificationStep({
  email,
  digits,
  onDigitChange,
  onVerify,
  onBack,
  onInquiry,
  isLoading,
  errorMessage,
}: {
  email: string;
  digits: string[];
  onDigitChange: (index: number, value: string) => void;
  onVerify: () => void;
  onBack: () => void;
  onInquiry: () => void;
  isLoading: boolean;
  errorMessage: string;
}) {
  const isComplete = digits.every((d) => d !== '');
  const { formatted, expired } = useCountdown(300);

  return (
    <AuthCard onBack={onBack}>
      <div className="pt-8 pb-8">
        <h2 className="font-serif text-3xl text-foreground mb-2">인증번호 입력</h2>
        <p className="text-base text-muted-foreground">
          <span className="text-foreground font-medium">{email}</span>로 인증번호를 보냈습니다
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <VerificationCodeInput digits={digits} onDigitChange={onDigitChange} disabled={expired || isLoading} />

        <div className="text-right">
          {expired ? (
            <p className="text-sm text-red-500">5분이 지나 인증번호가 만료되었어요.</p>
          ) : (
            <span className="text-base text-muted-foreground">{formatted}</span>
          )}
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        <button
          onClick={onVerify}
          disabled={!isComplete || expired || isLoading}
          className="w-full py-4 mt-4 bg-primary text-primary-foreground rounded-full font-medium text-base tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:shadow-[0_8px_30px_rgba(87,107,83,0.3)] hover:enabled:-translate-y-0.5 transition-all duration-200 active:enabled:scale-[0.98]"
        >
          {isLoading ? '확인 중...' : '인증번호 확인'}
        </button>

        <div className="mt-4 text-center">
          <p
            className="text-base text-muted-foreground underline cursor-pointer hover:text-foreground transition-colors duration-200 inline-block"
            onClick={onInquiry}
          >
            인증번호가 안 오나요?
          </p>
        </div>
      </div>
    </AuthCard>
  );
}

/* ─────────────────────────────────────────────
   Step 4 — 마이페이지
───────────────────────────────────────────── */
function MyPage({
  user,
  onLogout,
  isLoading,
}: {
  user: UserInfo;
  onLogout: () => void;
  isLoading: boolean;
}) {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [showPremiumInput, setShowPremiumInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    fetch('/api/v1/auth/premium')
      .then((r) => r.json())
      .then((d) => setIsPremium(d.isPremium ?? false))
      .catch(() => setIsPremium(false));
  }, []);

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.message || '코드가 유효하지 않습니다.');
        return;
      }
      setCouponSuccess('프리미엄이 활성화되었습니다!');
      setIsPremium(true);
      setShowPremiumInput(false);
      setCouponCode('');
    } catch {
      setCouponError('네트워크 오류가 발생했습니다.');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* 사용자 정보 */}
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-1">반갑습니다</p>
          <h2 className="font-serif text-3xl text-foreground mb-1">{user.nickname}</h2>
          <p className="text-base text-muted-foreground">{user.email}</p>
        </div>

        {/* 프리미엄 섹션 */}
        <div className="bg-muted rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium text-muted-foreground mb-1">현재 플랜</p>
          {isPremium === null ? (
            <p className="text-base font-medium text-foreground mb-4">확인 중...</p>
          ) : isPremium ? (
            <p className="text-base font-medium text-foreground mb-4">
              ✦ 프리미엄 플랜
            </p>
          ) : (
            <>
              <p className="text-base font-medium text-foreground mb-4">무료 플랜</p>

              {couponSuccess && (
                <p className="text-sm text-primary mb-3">{couponSuccess}</p>
              )}

              {showPremiumInput ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    placeholder="코드를 입력하세요"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40 tracking-widest"
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeemCoupon()}
                  />
                  {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => { setShowPremiumInput(false); setCouponError(''); setCouponCode(''); }}
                      className="flex-1 py-2.5 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleRedeemCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      {couponLoading ? '확인 중...' : '등록'}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPremiumInput(true)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium text-base hover:shadow-[0_8px_30px_rgba(87,107,83,0.3)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  프리미엄 등록하기
                </button>
              )}
            </>
          )}
        </div>

        {/* 대시보드 이동 */}
        <a
          href="/dashboard"
          className="block w-full py-4 text-center rounded-full font-medium text-base mb-3 transition-all duration-200"
          style={{ backgroundColor: '#cfc4b4', color: '#1c1917' }}
        >
          내 청첩장 보기
        </a>

        {/* 로그아웃 */}
        <button
          onClick={onLogout}
          disabled={isLoading}
          className="w-full py-4 border border-border rounded-full font-medium text-base text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 disabled:opacity-40"
        >
          {isLoading ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   페이지 루트
───────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<LoginStep>('loading');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);

  /* ── 초기 로그인 상태 확인 ── */
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
          setStep('mypage');
          return;
        }
      }
    } catch {
      // 네트워크 오류 시 selector로
    }
    setStep('selector');
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /* ── 핸들러들 ── */
  const handleDigitChange = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleRequestVerification = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/v1/auth/email/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || '인증번호 발송에 실패했습니다.');
        return;
      }
      setDigits(['', '', '', '', '', '']);
      setStep('verification');
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndLogin = async () => {
    const code = digits.join('');
    if (code.length !== 6) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      // email + verifyCode를 한 번에 전송 (login-web-app과 동일한 흐름)
      const loginRes = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verifyCode: code }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setErrorMessage(loginData.message || '인증번호가 올바르지 않습니다.');
        return;
      }

      // 성공 → redirect 또는 마이페이지
      const redirect = searchParams.get('redirect');
      if (redirect) {
        router.push(redirect);
      } else {
        await checkAuth();
      }
    } catch {
      setErrorMessage('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
      setUser(null);
      setStep('selector');
    } catch {
      // 실패해도 selector로
      setStep('selector');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── 렌더링 ── */
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 'mypage' && user) {
    return <MyPage user={user} onLogout={handleLogout} isLoading={isLoading} />;
  }

  if (step === 'email') {
    return (
      <EmailStep
        email={email}
        onChange={(e) => { setEmail(e.target.value); setErrorMessage(''); }}
        onSubmit={handleRequestVerification}
        onBack={() => { setStep('selector'); setErrorMessage(''); }}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    );
  }

  if (step === 'verification') {
    return (
      <VerificationStep
        email={email}
        digits={digits}
        onDigitChange={handleDigitChange}
        onVerify={handleVerifyAndLogin}
        onBack={() => { setStep('email'); setErrorMessage(''); }}
        onInquiry={() => {
          setStep('email');
          setErrorMessage('');
        }}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    );
  }

  return <LoginSelector onSelectEmail={() => { setStep('email'); setErrorMessage(''); }} />;
}
