import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Award, Check } from 'lucide-react';
import { mockRequests } from '../lib/mockData';
import toast from 'react-hot-toast';

export default function VolDashboard() {
  const [availability, setAvailability] = useState(true);
  const userSkills = ["Driving", "Distribution", "Physical Labor"]; // Hardcoded for prototype
  const [acceptedTasks, setAcceptedTasks] = useState(new Set());
  const [stats, setStats] = useState({ hours: 42, completed: 12, communities: 4, rate: 87 });

  const handleToggle = () => {
    setAvailability(!availability);
    toast.success(`Availability set to ${!availability ? 'Available' : 'Unavailable'}`);
  };

  const handleAccept = (task) => {
    if (!acceptedTasks.has(task.id)) {
      const newAccepted = new Set(acceptedTasks);
      newAccepted.add(task.id);
      setAcceptedTasks(newAccepted);
      setStats(s => ({ 
        ...s, 
        hours: s.hours + 3, 
        completed: s.completed + 1, 
        rate: Math.min(100, s.rate + 1) 
      }));
      toast.success(`Accepted task: ${task.title}`);
    }
  };

  const myTasks = mockRequests.filter(r => r.skillsNeeded.some(s => userSkills.includes(s)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Volunteer Dashboard</h1>
          <p className="text-slate-600 mt-1">Hello Aarav, here are nearby opportunities.</p>
        </div>
        <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
           <span className="text-sm font-medium text-slate-700">Status: {availability ? 'Available' : 'Off Duty'}</span>
           <button 
             onClick={handleToggle}
             className={`w-12 h-6 rounded-full transition-colors relative ${availability ? 'bg-green-500' : 'bg-slate-300'}`}
           >
             <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${availability ? 'left-7' : 'left-1'}`} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-primary-500" /> Tasks Matching Your Skills
          </h2>
          
          <div className="space-y-4">
            {myTasks.map(task => (
              <motion.div whileHover={{ y: -2 }} key={task.id} className="glass p-6 rounded-2xl border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                       <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          task.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                          task.urgency === 'High' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.urgency}
                        </span>
                        <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                          {task.skillsNeeded.join(', ')}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                    <p className="text-slate-600 text-sm mt-1 mb-4">{task.description}</p>
                    
                    <div className="flex items-center text-sm text-slate-500">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {task.location} (2.5 km away)
                    </div>
                  </div>
                  {acceptedTasks.has(task.id) ? (
                    <button className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-xl font-medium transition-colors shadow-sm min-w-[110px]">
                      <Check className="w-4 h-4 mr-2" />
                      Accepted
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAccept(task)}
                      className="flex items-center justify-center px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-xl font-medium transition-colors border border-primary-200 min-w-[110px]"
                    >
                      <Heart className="w-4 h-4 mr-2 text-primary-500" />
                      Accept
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-amber-500" /> Your Impact
             </h3>
             <div className="space-y-4">
                <div className="py-2">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 text-sm font-medium">Hours Volunteered</span>
                     <span className="font-bold text-slate-900">{stats.hours} hrs</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5">
                     <div className="bg-primary-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.hours / 60) * 100)}%` }}></div>
                   </div>
                </div>
                <div className="py-2">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 text-sm font-medium">Tasks Completed</span>
                     <span className="font-bold text-slate-900">{stats.completed}</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5">
                     <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.completed / 20) * 100)}%` }}></div>
                   </div>
                </div>
                <div className="py-2">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 text-sm font-medium">Communities Helped</span>
                     <span className="font-bold text-slate-900">{stats.communities}</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5">
                     <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (stats.communities / 10) * 100)}%` }}></div>
                   </div>
                </div>
                <div className="py-2">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-600 text-sm font-medium">Acceptance Rate</span>
                     <span className="font-bold text-slate-900">{stats.rate}%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-1.5">
                     <div className="bg-green-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${stats.rate}%` }}></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
