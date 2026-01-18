"use client";

import React from 'react';
import { Menu, X, Camera, Home, Lock, UserCircle, LayoutGrid } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, useClerk, UserButton } from "../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { openSignIn, user, getDashboardUrl } = useClerk();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      onClick={() => setIsMenuOpen(false)}
      className={`text-sm font-medium transition-colors duration-200 ${isActive(to) ? 'text-brand-green font-bold' : 'text-slate-600 hover:text-brand-green'
        }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-purpleLight font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shadow-md">
                <Home className="text-white" size={24} />
              </div>
              <span className="font-serif text-2xl font-bold text-brand-green tracking-tight hidden lg:block">
                Show House Property
              </span>
              <span className="font-serif text-2xl font-bold text-brand-green tracking-tight lg:hidden">
                SHP
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/" label="Home" />
              <NavLink to="/agents" label="Top Area Agents" />
              <NavLink to="/listings" label="Listings" />
              <NavLink to="/conveyancing" label="Conveyancers" />
              <NavLink to="/maintenance" label="Maintenance" />
              <SignedIn>
                <Link
                  to="/tour-creator"
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${isActive('/tour-creator') ? 'text-brand-green font-bold' : 'text-slate-600 hover:text-brand-green'
                    }`}
                >
                  <Camera size={14} /> AI Studio
                </Link>
              </SignedIn>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <SignedIn>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center text-xs text-brand-green font-bold px-3 py-2 border border-brand-green/20 bg-brand-green/5 rounded-md uppercase tracking-wider mr-2"
                  >
                    <Lock size={12} className="mr-2" />
                    Admin
                  </Link>
                )}
                <Link
                  to={getDashboardUrl()}
                  className="flex items-center text-xs text-brand-green font-bold px-3 py-2 border border-brand-green/20 bg-brand-green/5 rounded-md uppercase tracking-wider mr-2"
                >
                  <LayoutGrid size={12} className="mr-2" />
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => openSignIn()}
                  className="flex items-center bg-brand-green hover:bg-brand-green/90 text-white px-5 py-2.5 rounded-md font-medium text-sm transition-colors shadow-sm"
                >
                  <UserCircle size={18} className="mr-2" />
                  Sign In
                </button>
              </SignedOut>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {
          isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl z-50">
              <div className="px-4 py-4 space-y-4 flex flex-col">
                <NavLink to="/" label="Home" />
                <NavLink to="/agents" label="Top Area Agents" />
                <NavLink to="/listings" label="Listings" />
                <NavLink to="/conveyancing" label="Conveyancers" />
                <NavLink to="/maintenance" label="Maintenance" />
                <SignedIn>
                  <NavLink to="/tour-creator" label="AI Tour Studio" />
                  {user?.role === 'ADMIN' && <NavLink to="/admin" label="Admin Panel" />}
                  <NavLink to={getDashboardUrl()} label="Dashboard" />
                  <div className="flex items-center gap-2 py-2">
                    <UserButton /> <span className="text-sm font-bold text-slate-600">My Account</span>
                  </div>
                </SignedIn>
                <SignedOut>
                  <hr className="border-gray-100" />
                  <button
                    onClick={() => openSignIn()}
                    className="flex items-center bg-brand-green text-white justify-center px-4 py-3 rounded-md font-medium w-full"
                  >
                    <UserCircle size={18} className="mr-2" /> Sign In / Register
                  </button>
                </SignedOut>
              </div>
            </div>
          )
        }
      </header >

      {/* Main Content */}
      < main className="flex-grow" >
        {children}
      </main >

      {/* Footer */}
      < footer className="bg-brand-purpleDark text-white pt-16 pb-8" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center">
                  <Home className="text-white" size={18} />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">Show House Property</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                South Africa's easiest Real Estate Platform to find your perfect property. Connect with top agents, conveyancers, and maintenance contractors.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-brand-purple hover:bg-brand-green transition-colors cursor-pointer flex items-center justify-center">
                  <span className="font-bold text-xs">f</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-purple hover:bg-brand-green transition-colors cursor-pointer flex items-center justify-center">
                  <span className="font-bold text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="hover:text-brand-green cursor-pointer">Contact Us</li>
                <li className="hover:text-brand-green cursor-pointer">About Us</li>
                <li><Link to="/conveyancing" className="hover:text-brand-green">Find Your Conveyancer</Link></li>
                <li className="hover:text-brand-green cursor-pointer">Calculators</li>
                <li><Link to="/maintenance" className="hover:text-brand-green">Maintenance Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Our Services</h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li><Link to="/services/show-property" className="hover:text-brand-green">On Show Property</Link></li>
                <li><Link to="/services/top-area-agent" className="hover:text-brand-green">Top Area Agent</Link></li>
                <li><Link to="/services/maintenance" className="hover:text-brand-green">Maintenance Contractors</Link></li>
                <li><Link to="/services/conveyancing" className="hover:text-brand-green">Conveyancing Services</Link></li>
                <li><Link to="/services/partner-portal" className="hover:text-brand-green">Partner Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Get In Touch</h4>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start">
                  <span className="text-brand-green mr-3">📞</span>
                  +27 11 555 0123
                </li>
                <li className="flex items-start">
                  <span className="text-brand-green mr-3">✉️</span>
                  info@showhouseproperty.co.za
                </li>
                <li className="mt-4">
                  <p className="text-xs text-slate-400 uppercase font-bold mb-2">Business Hours</p>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 4:00 PM</p>
                  <p>Sunday: 10:00 AM - 2:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>© {new Date().getFullYear()} Show House Property. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              <Link to="/popia" className="hover:text-white">POPIA Act Compliance</Link>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
};
