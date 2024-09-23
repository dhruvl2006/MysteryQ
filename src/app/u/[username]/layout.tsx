import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`antialiased dark:bg-slate-950`}>
          <Navbar />
          <Toaster />
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
