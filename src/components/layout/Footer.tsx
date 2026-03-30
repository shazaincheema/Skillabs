import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const iconMap: Record<string, any> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  youtube: Youtube,
};

export default function Footer({ content, isEditing, onUpdate }: { content?: any, isEditing?: boolean, onUpdate?: (data: any) => void }) {
  const description = content?.description || "Empowering individuals with lifelong skills through expert-led hybrid learning. Learn. Achieve. Become.";
  const email = content?.email || "hello@skillabs.edu";
  const phone = content?.phone || "+1 (555) 123-4567";
  const address = content?.address || "123 Skill St, Education City";
  
  const defaultSocials = [
    { id: 'instagram', platform: 'instagram', url: '#' },
    { id: 'twitter', platform: 'twitter', url: '#' },
    { id: 'linkedin', platform: 'linkedin', url: '#' }
  ];
  const socialLinks = Array.isArray(content?.socialLinks) ? content.socialLinks : defaultSocials;

  const defaultQuickLinks = [
    { label: 'Courses', href: '#courses' },
    { label: 'Hybrid Learning', href: '#hybrid' },
    { label: 'Why Skillabs', href: '#why' },
    { label: 'How It Works', href: '#how' },
    { label: 'Admin Portal', href: '/portal/admin' }
  ];
  const quickLinks = Array.isArray(content?.quickLinks) ? content.quickLinks : defaultQuickLinks;

  const [editingSocial, setEditingSocial] = useState<string | null>(null);

  const handleBlur = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({ ...content, [field]: value });
    }
  };

  const updateSocial = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const newSocials = [...socialLinks];
      newSocials[index] = { ...newSocials[index], [field]: value };
      onUpdate({ ...content, socialLinks: newSocials });
    }
  };

  const addSocial = () => {
    if (onUpdate) {
      const newSocials = [...socialLinks, { id: Date.now().toString(), platform: 'instagram', url: '#' }];
      onUpdate({ ...content, socialLinks: newSocials });
    }
  };

  const removeSocial = (index: number) => {
    if (onUpdate) {
      const newSocials = socialLinks.filter((_: any, i: number) => i !== index);
      onUpdate({ ...content, socialLinks: newSocials });
    }
  };

  const updateQuickLink = (index: number, field: string, value: string) => {
    if (onUpdate) {
      const newLinks = [...quickLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      onUpdate({ ...content, quickLinks: newLinks });
    }
  };

  return (
    <footer className="bg-primary text-white pt-20 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size={40} showText={true} textColor="text-white" />
          </Link>
          <div 
            className={cn(
              "text-white/60 text-sm leading-relaxed outline-none",
              isEditing && "focus:ring-2 focus:ring-accent rounded-lg px-2"
            )}
            contentEditable={isEditing}
            onBlur={(e) => handleBlur('description', e.currentTarget.textContent || '')}
            suppressContentEditableWarning
          >
            {description}
          </div>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((social: any, index: number) => {
              const Icon = iconMap[social.platform] || Instagram;
              return (
                <div key={social.id} className="relative group">
                  <a 
                    href={isEditing ? undefined : social.url} 
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer"
                    onClick={(e) => {
                      if (isEditing) {
                        e.preventDefault();
                        setEditingSocial(editingSocial === social.id ? null : social.id);
                      }
                    }}
                  >
                    <Icon size={18} />
                  </a>
                  
                  {isEditing && editingSocial === social.id && (
                    <div className="absolute bottom-full left-0 mb-2 p-4 bg-white rounded-xl shadow-2xl z-50 w-64 text-primary">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">Platform</label>
                          <select 
                            value={social.platform}
                            onChange={(e) => updateSocial(index, 'platform', e.target.value)}
                            className="w-full p-2 bg-gray-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-accent"
                          >
                            {Object.keys(iconMap).map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-gray-400 mb-1 block">URL</label>
                          <input 
                            type="text"
                            value={social.url}
                            onChange={(e) => updateSocial(index, 'url', e.target.value)}
                            className="w-full p-2 bg-gray-100 rounded-lg text-sm border-none focus:ring-2 focus:ring-accent"
                            placeholder="https://..."
                          />
                        </div>
                        <button 
                          onClick={() => removeSocial(index)}
                          className="w-full p-2 bg-red-50 text-red-500 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove Icon
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {isEditing && (
              <button 
                onClick={addSocial}
                className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all border border-accent/20"
              >
                <Plus size={18} />
              </button>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-display font-semibold mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            {quickLinks.map((link: any, index: number) => (
              <li key={index} className="flex items-center gap-2 group">
                <span 
                  className={cn(
                    "hover:text-accent transition-colors outline-none",
                    isEditing && "focus:ring-2 focus:ring-accent px-1 rounded"
                  )}
                  contentEditable={isEditing}
                  onBlur={(e) => updateQuickLink(index, 'label', e.currentTarget.textContent || '')}
                  suppressContentEditableWarning
                >
                  {link.label}
                </span>
                {isEditing && (
                  <input 
                    type="text"
                    value={link.href}
                    onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] w-24 focus:outline-none focus:border-accent"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-display font-semibold mb-6">Contact Us</h4>
          <ul className="flex flex-col gap-4 text-white/60 text-sm">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-accent" />
              <span 
                className={cn("outline-none", isEditing && "focus:ring-2 focus:ring-accent px-1")}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur('email', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {email}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-accent" />
              <span 
                className={cn("outline-none", isEditing && "focus:ring-2 focus:ring-accent px-1")}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur('phone', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {phone}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-accent" />
              <span 
                className={cn("outline-none", isEditing && "focus:ring-2 focus:ring-accent px-1")}
                contentEditable={isEditing}
                onBlur={(e) => handleBlur('address', e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {address}
              </span>
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

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p>© 2026 Skillabs. All rights reserved.</p>
          <p className="text-accent/60 font-medium">Designed and Developed by Shazain Tanveer Cheema</p>
          <p className="text-accent/60 font-medium">shazaincheemaac30@gmail.com</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>

  );
}
