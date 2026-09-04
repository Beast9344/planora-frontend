import Link from 'next/link';

const footerLinks = [
  { label: 'About', href: '/about-us' },
  { label: 'Contact', href: '/contact-us' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
];

const HomeFooter = () => {
  return (
    <footer className="border-t border-border bg-background py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Planora - Secure event management for modern communities.
        </p>
        <div className="flex items-center gap-5 text-sm">
          {footerLinks.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
