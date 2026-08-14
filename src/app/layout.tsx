import LeftBar from "@/components/LeftBar";
import "./globals.css";
import RightBar from "@/components/RightBar";
import ThemeProvider from "@/components/ThemeProvider";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Devvit — Build, Ship, Compete',
  description: 'Student-first platform for young builders to connect with real-world projects, verified contributions, and code duels.',
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl mx-auto flex justify-between">
            <div className="px-2 xsm:px-4 lg:flex-1 lg:min-w-[200px]">
              <LeftBar />
            </div>
            <div className="flex-1 lg:min-w-[600px] border-x-[1px] border-borderGray ">
              {children}
              {modal}
            </div>
            <div className="hidden lg:flex ml-4 md:ml-8 flex-1 min-w-[200px]">
              <RightBar />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
