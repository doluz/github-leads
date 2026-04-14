import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitLeads — GitHub developer outreach',
  description: 'Find and reach GitHub developers who match your ICP.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
