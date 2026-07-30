import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Settings, 
  Layers, 
  ShoppingBag, 
  Briefcase, 
  GraduationCap, 
  Quote, 
  Image as ImageIcon, 
  Navigation, 
  Mail, 
  Shield,
  LayoutDashboard,
  ExternalLink,
  UserCheck,
  Package
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const links = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Site Settings' },
    { to: '/admin/pages', icon: <Layers size={20} />, label: 'Pages & SEO' },
    { to: '/admin/work', icon: <Briefcase size={20} />, label: 'FUTURE WORK' },
    { to: '/admin/studio', icon: <ImageIcon size={20} />, label: 'FUTURE STUDIO' },
    { to: '/admin/skills', icon: <GraduationCap size={20} />, label: 'FUTURE SKILLS' },
    { to: '/admin/labs', icon: <ShoppingBag size={20} />, label: 'FUTURE LABS' },
    { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { to: '/admin/team', icon: <UserCheck size={20} />, label: 'Team Members' },
    { to: '/admin/testimonials', icon: <Quote size={20} />, label: 'Testimonials' },
    { to: '/admin/media', icon: <ImageIcon size={20} />, label: 'Media Library' },
    { to: '/admin/navigation', icon: <Navigation size={20} />, label: 'Navigation' },
    { to: '/admin/leads', icon: <Mail size={20} />, label: 'Leads & Forms' },
    { to: '/admin/users', icon: <Shield size={20} />, label: 'Users & Roles' },
  ];

  return (
    <aside className="w-full md:w-64 bg-brand-navy border-r border-white/5 p-6 h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10 px-4">
        <h2 className="text-brand-gold font-display font-bold text-xl tracking-tighter italic">Future CMS</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Admin Control Center</p>
        
        <Link 
          to="/" 
          className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-brand-gold hover:text-brand-navy border border-white/10 text-white text-xs font-bold rounded-xl transition-all group"
        >
          View Home <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin'}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-gold text-brand-navy font-bold shadow-lg shadow-brand-gold/10' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {link.icon}
            <span className="text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-20 pt-10 border-t border-white/5 px-4 pb-20">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Version 2.0.0</p>
      </div>
    </aside>
  );
};
