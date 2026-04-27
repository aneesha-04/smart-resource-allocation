import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Users, Activity, Map } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5 }}
    className="p-6 glass rounded-2xl hover:shadow-lg transition-all"
  >
    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
    <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-primary-50 to-slate-50 pt-24 pb-32">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] bg-[bottom_1px_center]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full glass border-primary-100 text-primary-700 text-sm font-semibold tracking-wide"
          >
            🚀 AI-Powered Smart Resource Allocation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 max-w-4xl"
          >
            Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600">Volunteers</span> to<br className="hidden md:block"/> Communities That Need Them Most.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Detect urgent issues, intelligently match volunteers based on skills and location, and coordinate local social impact effortlessly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/auth" className="inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-1">
              Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Intelligent Coordination for NGOs</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our platform uses AI to optimize the entire volunteer lifecycle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="AI Priority Detection"
              desc="Automatically classify requests as Low, Medium, High, or Critical using NLP."
              delay={0.1}
            />
            <FeatureCard 
              icon={Users}
              title="Smart Match"
              desc="Match tasks to volunteers based on proximity, availability, and required skills."
              delay={0.2}
            />
            <FeatureCard 
              icon={Activity}
              title="Real-Time Dashboard"
              desc="Live tracking of open requests, volunteer statuses, and resolution timelines."
              delay={0.3}
            />
            <FeatureCard 
              icon={Map}
              title="Community Heatmaps"
              desc="Visualize high-need areas across the city to direct resources preemptively."
              delay={0.4}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
