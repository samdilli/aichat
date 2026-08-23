import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AI Asistan',
  description: 'Modern, ChatGPT tarzı beyaz temalı yapay zeka asistanı.',
  openGraph: {
    title: 'AI Asistan',
    description: 'Modern, ChatGPT tarzı beyaz temalı yapay zeka asistanı.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Asistan',
    description: 'Modern, ChatGPT tarzı beyaz temalı yapay zeka asistanı.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="bg-white text-neutral-900">{children}</body>
    </html>
  );
}
