import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import KakaoSDKLoader from "@/features/share/components/KakaoSDKLoader";
import Header from "@/features/landing/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "데모 - 당신의 이야기를 담은 청첩장",
  description: "감성적인 디자인과 편안한 경험, Moments Wedding에서 시작하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 카카오 JavaScript 키 (환경 변수에서 가져오거나 기본값 사용)
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased font-sans text-foreground bg-background`}
      >
        {kakaoJsKey && (
          <KakaoSDKLoader jsKey={kakaoJsKey} />
        )}
        <Header />
        {children}
      </body>
    </html>
  );
}
