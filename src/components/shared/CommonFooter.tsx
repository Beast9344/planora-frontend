import Link from 'next/link';
import { Facebook, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Events', href: '/events' },
      { label: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about-us' },
      { label: 'Contact', href: '/contact-us' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
    ],
  },
];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Asad9340',
    icon: Facebook,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/Asad9340',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Asad9340',
    icon: Github,
  },
];

const CommonFooter = () => {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold text-foreground">Planora</h2>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A secure event management platform where users can create, manage,
              join, review, and pay for public or private events with ease.
            </p>

            <div className="mt-5">
              <p className="text-sm font-medium text-foreground">
                Create events. Join communities. Manage smarter.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:asadulimran1999@gmail.com"
                  className="inline-flex items-center gap-2 transition hover:text-foreground"
                >
                  <Mail className="size-4" />
                  asadulimran1999@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801710101984"
                  className="inline-flex items-center gap-2 transition hover:text-foreground"
                >
                  <Phone className="size-4" />
                  +880 1710-101984
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 size-4" />
                Tangail, Bangladesh
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:text-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Planora. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Secure event experiences for modern communities.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CommonFooter;
