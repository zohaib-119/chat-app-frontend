import "./globals.css";
import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/authContext";
import { MessageProvider } from "@/context/messageContext";


export const metadata = {
  title: "LinkUp",
  description: "Developed by Muhammad Zohaib. All rights are reserved",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <MessageProvider>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </MessageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
