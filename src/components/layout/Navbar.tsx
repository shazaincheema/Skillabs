import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from '../ui/Logo';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Courses', href: '#courses' },
    { name: 'Hybrid Learning', href: '#hybrid' },
    { name: 'Why Us', href: '#why' },
    { name: 'How It Works', href: '#how' },
  ];

  const isPortal = location.pathname.startsWith('/portal');

  if (isPortal) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-primary/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo size={48} showText={true} textColor="text-white" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/portal/client"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Client Portal
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-primary shadow-xl p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-white"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/portal/client"
            className="w-full py-3 bg-primary text-white text-center font-semibold rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            Client Portal
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
