import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "MysteryQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
