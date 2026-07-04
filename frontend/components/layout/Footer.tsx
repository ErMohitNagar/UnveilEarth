import Link from "next/link";
import { Compass, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col items-start space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-bold font-outfit text-xl tracking-tight">
                UnveilEarth
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Peel back the surface of every place you visit. A GenAI-powered destination discovery platform.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 font-outfit text-foreground/90">Explore</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/discover" className="hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/experiences" className="hover:text-primary transition-colors">Local Experiences</Link></li>
              <li><Link href="/events" className="hover:text-primary transition-colors">Events & Festivals</Link></li>
              <li><Link href="/chat" className="hover:text-primary transition-colors">AI Companion</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 font-outfit text-foreground/90">For Guides</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/guide/onboarding" className="hover:text-primary transition-colors">Become a Guide</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partner Resources</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 font-outfit text-foreground/90">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} UnveilEarth. All rights reserved.</p>
          <p className="flex items-center mt-2 md:mt-0">
            <MapPin className="h-4 w-4 mr-1 inline" /> Built for the curious traveler.
          </p>
        </div>
      </div>
    </footer>
  );
}
