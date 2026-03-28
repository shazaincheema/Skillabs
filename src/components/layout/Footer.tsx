import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={40} showText={true} textColor="text-white" />
          </Link>
          <p className="text-white/60 text-sm leading-relaxed">
            Empowering individuals with lifelong skills through expert-led hybrid learning.
            Learn. Achieve. Become.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-display font-semibold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            <li><a href="#courses" className="hover:text-accent transition-colors">Courses</a></li>
            <li><a href="#hybrid" className="hover:text-accent transition-colors">Hybrid Learning</a></li>
            <li><a href="#why" className="hover:text-accent transition-colors">Why Skillabs</a></li>
            <li><a href="#how" className="hover:text-accent transition-colors">How It Works</a></li>
            <li><Link to="/portal/client" className="hover:text-accent transition-colors">Student Portal</Link></li>
            <li><Link to="/portal/admin" className="hover:text-accent transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-display font-semibold mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-accent" />
              <span>hello@skillabs.edu</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-accent" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-accent" />
              <span>123 Skill St, Education City</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-display font-semibold mb-6">Newsletter</h4>
          <p className="text-white/60 text-sm mb-4">Subscribe to get the latest updates and course news.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent w-full"
            />
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:row justify-between items-center gap-4 text-white/40 text-xs">
        <p>© 2026 Skillabs. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
