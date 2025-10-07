import './globals.css';

export const metadata = {
  title: 'Campaign Dashboard',
  description: 'Manage your in-app campaigns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
