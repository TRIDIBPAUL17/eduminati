import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Chatbot from "@/components/Chatbot";
import { ClerkProvider } from "@clerk/nextjs";
import TanStackProvider from "@/components/TanStackProvider";

const inter = Inter({ subsets: ["latin"] });
// The 'poppins' variable is declared but not used in the current code.
// If it's not needed, consider removing it.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Eduminati - Online Learning Platform",
  description: "Access quality education anywhere, anytime",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        {/* Changed dark background to a lighter grey */}
        {/* Apply the 'inter' font class here. If 'poppins' is needed, add it as well e.g., `${inter.className} ${poppins.className}` */}
        <body className={`${inter.className} dark:bg-gray-800`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <TanStackProvider>
              <Navbar />
              {children}
            </TanStackProvider>
          </ThemeProvider>
          <Chatbot />
        </body>
      </ClerkProvider>
    </html>
  );
}

