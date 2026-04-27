import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-slate-200/50 shadow-sm transition-all h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between h-full items-center">
          <Link to="/" className="flex items-center space-x-2">
            <HeartHandshake className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-500">
              SevaConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Home</Link>
            <Link to="/ngo" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">NGO Admin</Link>
            <Link to="/volunteer" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Volunteer</Link>
            <Link to="/insights" className="text-slate-600 hover:text-primary-600 transition-colors font-medium">Insights</Link>
            <div className="flex space-x-4 ml-4 pl-4 border-l border-slate-200">
              <Link to="/auth" className="px-4 py-2 text-primary-600 border border-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                Login
              </Link>
              <Link to="/auth?signup=true" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium shadow-md shadow-primary-500/30 transition-all hover:-translate-y-0.5">
                Join Now
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-primary-600 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-slate-200/50 absolute w-full"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
              <Link to="/" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Home</Link>
              <Link to="/ngo" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">NGO Admin</Link>
              <Link to="/volunteer" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Volunteer</Link>
              <Link to="/auth" onClick={() => setIsOpen(false)} className="px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 mt-2 border border-primary-100 inline-block text-center">Login / Join</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
