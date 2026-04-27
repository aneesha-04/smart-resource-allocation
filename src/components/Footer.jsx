import React from 'react';
import { HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-2">
          <HeartHandshake className="w-6 h-6 text-primary-500" />
          <span className="text-lg font-bold text-white">SevaConnect</span>
        </div>
        <p className="text-sm text-slate-400 text-center md:text-left">
          Connecting Volunteers to Communities That Need Them Most.
        </p>
        <div className="flex space-x-6 text-sm">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}
