import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { summarizeReport } from '../lib/aiHelpers';
import { Loader2, Sparkles, TrendingUp, PieChart as PieChartIcon, MapPin, Activity, Clock, CheckCircle, Navigation } from 'lucide-react';

const data = [
  { name: 'Mon', requests: 12, resolved: 8 },
  { name: 'Tue', requests: 19, resolved: 15 },
  { name: 'Wed', requests: 15, resolved: 12 },
  { name: 'Thu', requests: 25, resolved: 20 },
  { name: 'Fri', requests: 22, resolved: 22 },
  { name: 'Sat', requests: 30, resolved: 25 },
  { name: 'Sun', requests: 18, resolved: 17 },
];

const categoryData = [
  { name: 'Medical', value: 35 },
  { name: 'Food', value: 28 },
  { name: 'Cleanup', value: 20 },
  { name: 'Education', value: 17 },
];
const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

const localityData = [
  { name: 'Viman Nagar', requests: 24 },
  { name: 'Kothrud', requests: 18 },
  { name: 'Pune Camp', requests: 15 },
  { name: 'Hadapsar', requests: 12 },
  { name: 'Baner', requests: 9 },
];

export default function Insights() {
  const [summary, setSummary] = useState('');
  const [dateFilter, setDateFilter] = useState('This Week');
  
  useEffect(() => {
    summarizeReport(data).then(setSummary);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Community Insights</h1>
        <p className="text-slate-600 mt-1 mb-4">Data-driven overviews of local needs and responses.</p>
        <div className="flex space-x-2">
          {['Today', 'This Week', 'This Month'].map(f => (
            <button
              key={f}
              onClick={() => setDateFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                dateFilter === f ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border-primary-200 bg-primary-50/50 mb-8 flex items-start space-x-4">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <Sparkles className="w-6 h-6 text-primary-500" />
        </div>
        <div>
           <div className="mb-2">
             <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider">AI Executive Summary</h3>
           </div>
           {summary ? (
             <p className="text-slate-700 leading-relaxed font-medium">{summary}</p>
           ) : (
             <div className="flex items-center space-x-2 text-slate-500">
               <Loader2 className="w-4 h-4 animate-spin" /> <span>Generating insights with Gemini...</span>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-primary-500" />
             Weekly Request Trend
           </h3>
           <div className="h-80 pb-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="requests" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Fulfillment Rate</h3>
           <div className="h-80 pb-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                 <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Legend iconType="circle" />
                 <Bar dataKey="requests" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="resolved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
             <PieChartIcon className="w-5 h-5 mr-2 text-primary-500" /> Requests by Category
           </h3>
           <div className="h-80 pb-4">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={categoryData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value" stroke="none">
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
             <MapPin className="w-5 h-5 mr-2 text-amber-500" /> Top High-Need Localities
           </h3>
           <div className="h-80 pb-4">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart layout="vertical" data={localityData} margin={{ top: 10, right: 30, left: 30, bottom: 20 }}>
                 <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                 <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} width={90} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="requests" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm flex items-center space-x-4">
           <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><Activity className="w-6 h-6" /></div>
           <div><p className="text-sm font-medium text-slate-500">Total Requests</p><p className="text-2xl font-bold text-slate-900">149</p></div>
        </div>
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm flex items-center space-x-4">
           <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><Clock className="w-6 h-6" /></div>
           <div><p className="text-sm font-medium text-slate-500">Avg Response Time</p><p className="text-2xl font-bold text-slate-900">18 min</p></div>
        </div>
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm flex items-center space-x-4">
           <div className="p-3 rounded-xl bg-green-100 text-green-600"><CheckCircle className="w-6 h-6" /></div>
           <div><p className="text-sm font-medium text-slate-500">Matching Rate</p><p className="text-2xl font-bold text-slate-900">85%</p></div>
        </div>
        <div className="glass p-6 rounded-2xl border-slate-200 shadow-sm flex items-center space-x-4">
           <div className="p-3 rounded-xl bg-purple-100 text-purple-600"><Navigation className="w-6 h-6" /></div>
           <div><p className="text-sm font-medium text-slate-500">Localities Covered</p><p className="text-2xl font-bold text-slate-900">12</p></div>
        </div>
      </div>
    </div>
  );
}
