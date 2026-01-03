import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ConditionalLayout from "@/components/ConditionalLayout";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { Toaster } from 'sonner';

type SiteSettingsData = Record<string, unknown> & { _id?: string };

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne().lean<SiteSettingsData & { _id: string }>();

    if (!settings) {
      const created = await SiteSettings.create({});
      settings = created.toObject();
    }

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Site settings could not be loaded from MongoDB. Falling back to defaults.", error);
    return {};
  }
}

export const metadata: Metadata = {
  title: "barkOne - Modern Duvar Rafları",
  description: "Minimalist ve modern duvar rafları. v1.0.1",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="tr" className={`${inter.variable} font-sans`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-white bg-opacity-50 backdrop-blur-sm">
        <SiteSettingsProvider initialSettings={siteSettings}>
          <CartProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster
              position="top-center"
              toastOptions={{
                classNames: {
                  success: '!bg-green-500/10 !border-green-500/20',
                  error: '!bg-destructive/10 !border-destructive/20',
                  warning: '!bg-amber-500/10 !border-amber-500/20',
                  info: '!bg-blue-500/10 !border-blue-500/20',
                },
              }}
            />
          </CartProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
