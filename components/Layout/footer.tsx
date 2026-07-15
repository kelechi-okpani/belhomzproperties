import Link from 'next/link';

export default function Footer() {
  return (
      // Changed bg-background to bg-muted/50 or bg-muted for a subtle luxury contrast
      <footer className="bg-muted/40 text-foreground pt-24 pb-12 px-6 border-t border-border/40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Section 1: Brand Profile */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-widest text-primary">
              BELHOMZ<span className="text-foreground">.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Crafting luxury experiences in Nigerian and international Real Estate.
              From initial consultation to final closing, we curate perfection.
            </p>
          </div>

          {/* Section 2: Locations */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">
              Locations
            </h4>
            <div className="text-foreground/90 text-sm space-y-4">
              <div>
              <span className="block text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
                Abuja, Nigeria
              </span>
                <p className="leading-relaxed">
                  Transcorp Hilton, M1 Floor, 1 Aguiyi Ironsi Street, Maitama, Abuja.
                </p>
              </div>
              <div>
              <span className="block text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">
                Dubai, UAE
              </span>
                <p className="leading-relaxed">
                  Sahaa Offices, Souk Al Bahar, Downtown, Dubai, UAE.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Connect */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">
              Connect
            </h4>
            <ul className="text-muted-foreground text-sm space-y-3">
              <li>
                <a
                    href="https://www.instagram.com/officialbelhomz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-200 inline-flex items-center"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                    href="https://www.facebook.com/officialbelhomz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-200 inline-flex items-center"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-200 inline-flex items-center"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                    href="https://wa.me/your-number"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors duration-200 inline-flex items-center"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto border-t border-border mt-20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Belhomz Properties. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
  );
}