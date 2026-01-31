import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/authContext";
import { MessageProvider } from "@/context/messageContext";
import { ThemeProvider } from "@/context/themeContext";

export const metadata = {
  title: "LinkUp - Modern Chat Experience",
  description: "Connect instantly with friends, family, and teams. A modern, secure, and beautiful chat experience.",
  keywords: "chat, messaging, communication, real-time, social",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <MessageProvider>
              <Provider>
                {children}
                <Toaster />
              </Provider>
            </MessageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
