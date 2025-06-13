import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Erasmus33",
  description: "The best place to find your next Erasmus stay in Guarda",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
    shortcut: "/assets/logo.png"
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <footer className="w-full flex flex-col relative">
            {/* Bottom Layer */}
            <div className="w-full h-10 z-0" style={{ backgroundImage: 'url(/assets/misc/faixa.png)', backgroundSize: 'cover', position: 'absolute', top: 0, left: 0 }}></div>

            {/* Top Layer */}
            <div className="w-full flex justify-center border-t border-t-foreground/10 h-16 bg-background/80 backdrop-blur-sm shadow-md z-10 relative">
              <div className="w-full max-w-7xl flex justify-center items-center p-3 px-5 text-sm">
                <span className="text-gray-500">© 2025 Erasmus33. All rights reserved.</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
