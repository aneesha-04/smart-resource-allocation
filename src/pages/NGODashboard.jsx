import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, CheckCircle, Clock, MapPin, Search, Loader2, Sparkles, Plus, ArrowUpDown } from 'lucide-react';
import { mockRequests, mockVolunteers } from '../lib/mockData';
import { matchVolunteers, analyzeUrgency } from '../lib/aiHelpers';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="glass p-6 rounded-2xl border-slate-200">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default function NGODashboard() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedReq, setSelectedReq] = useState(null);
  const [aiMatching, setAiMatching] = useState(false);
  const [matchedVols, setMatchedVols] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortDir, setSortDir] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({ title: '', description: '', location: '', category: '', urgency: 'Low' });
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleMatch = async (req) => {
    setSelectedReq(req);
    setAiMatching(true);
    setMatchedVols([]);
    
    // Simulate AI loading
    const results = await matchVolunteers(req, mockVolunteers);
    setMatchedVols(results);
    setAiMatching(false);
  };

  const handleAssign = (vol) => {
    toast.success(`Assigned ${vol.name} to "${selectedReq.title}"`);
    setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, status: 'Assigned' } : r));
    setSelectedReq(null);
  };

  const handleAutoDetect = async () => {
    if (!newReq.title || !newReq.description) {
      toast.error("Please provide a title and description first.");
      return;
    }
    setIsDetecting(true);
    try {
      const result = await analyzeUrgency(newReq.title, newReq.description);
      setNewReq(prev => ({ ...prev, urgency: result.urgency, category: result.category }));
      setAiSuggested(true);
      toast.success("AI detected urgency and category!");
    } catch (e) {
      toast.error("Failed to detect.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setRequests([...requests, {
      id: `req-${Date.now()}`,
      title: newReq.title,
      urgency: newReq.urgency,
      location: newReq.location,
      description: newReq.description,
      skillsNeeded: [newReq.category],
      status: 'Open',
      timestamp: new Date().toISOString()
    }]);
    setIsAddModalOpen(false);
    toast.success("New request added successfully!");
    setNewReq({ title: '', description: '', location: '', category: '', urgency: 'Low' });
    setAiSuggested(false);
  };

  let filteredRequests = requests.filter(r => filter === 'All' ? true : r.urgency === filter);
  if (sortDir) {
    const urgencyWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
    filteredRequests.sort((a, b) => {
      if (sortDir === 'asc') return urgencyWeight[a.urgency] - urgencyWeight[b.urgency];
      return urgencyWeight[b.urgency] - urgencyWeight[a.urgency];
    });
  }

  const activeReqs = requests.filter(r => r.status === 'Open').length;
  const urgentReqs = requests.filter(r => r.urgency === 'Critical' || r.urgency === 'High').length;
  const completedReqs = requests.filter(r => r.status === 'Resolved').length || 4;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">NGO Dashboard</h1>
          <p className="text-slate-600 mt-1">Manage active requests and coordinate volunteers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Clock} label="Active Requests" value={activeReqs} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={Users} label="Available Volunteers" value={mockVolunteers.filter(v=>v.available).length} colorClass="bg-green-100 text-green-600" />
        <StatCard icon={AlertTriangle} label="Urgent Cases" value={urgentReqs} colorClass="bg-amber-100 text-amber-600" />
        <StatCard icon={CheckCircle} label="Completed Tasks" value={completedReqs} colorClass="bg-primary-100 text-primary-600" />
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-800">Incoming Requests</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search locality..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-primary-500 bg-white/60" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Task</th>
                <th className="p-4 font-medium">Location</th>
                <th 
                  className="p-4 font-medium cursor-pointer hover:bg-slate-200 transition-colors group"
                  onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
                >
                  <div className="flex items-center">
                    Urgency <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/40">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{req.title}</p>
                    <p className="text-xs text-slate-500">{req.skillsNeeded.join(', ')}</p>
                  </td>
                  <td className="p-4 flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {req.location}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      req.urgency === 'Critical' ? 'bg-red-100 text-red-700' :
                      req.urgency === 'High' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      req.status === 'Open' ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                     {req.status === 'Open' ? (
                        <button 
                          onClick={() => handleMatch(req)}
                          className="flex items-center text-sm px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg font-medium transition-colors border border-primary-200"
                        >
                          <Sparkles className="w-4 h-4 mr-1.5 text-primary-500" />
                          Smart Match
                        </button>
                     ) : (
                        <button className="text-sm px-3 py-1.5 text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                          View Details
                        </button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Matching Modal overlay */}
      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full"
            >
              <div className="p-6 border-b border-slate-100">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold flex items-center text-slate-800">
                      <Sparkles className="w-5 h-5 text-primary-500 mr-2" /> AI Matching Panel
                    </h3>
                    <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-600">
                       &times;
                    </button>
                 </div>
                 <p className="text-sm text-slate-600 mt-2">Finding best candidates for: <strong>{selectedReq.title}</strong></p>
              </div>

              <div className="p-6 bg-slate-50 min-h-[200px] flex flex-col justify-center">
                {aiMatching ? (
                  <div className="flex flex-col items-center py-8">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
                    <p className="text-slate-600 font-medium">Analyzing volunteer skills & locations...</p>
                    <p className="text-xs text-purple-600 mt-2 font-medium flex items-center">Powered by Gemini ✦</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-semibold text-slate-700">Top 3 Matches</p>
                      <p className="text-xs text-purple-600 font-medium">Powered by Gemini ✦</p>
                    </div>
                    {matchedVols.map((v, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={v.id} 
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800">{v.name} <span className="text-xs ml-2 text-amber-500">★ {v.rating}</span></p>
                          <p className="text-sm text-green-600 mt-1 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" /> {v.reason}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleAssign(v)}
                          className="px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          Assign
                        </button>
                      </motion.div>
                    ))}
                    {matchedVols.length === 0 && (
                      <p className="text-slate-500 text-center py-4">No available volunteers matched.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 transition-all z-40 hover:scale-105"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Request Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <Plus className="w-5 h-5 text-primary-500 mr-2" /> Add New Request
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  &times;
                </button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                  <input required type="text" placeholder="e.g. Flood debris cleanup" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" value={newReq.title} onChange={e => setNewReq({...newReq, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea required rows="2" placeholder="Describe the task and what is needed..." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" value={newReq.description} onChange={e => {setNewReq({...newReq, description: e.target.value}); setAiSuggested(false);}} />
                </div>
                <div>
                  <button type="button" onClick={handleAutoDetect} disabled={isDetecting} className="text-sm px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium transition-colors border border-purple-200 flex items-center w-full justify-center disabled:opacity-50">
                    {isDetecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-purple-500" />}
                    {isDetecting ? "Analyzing Request..." : "Auto-Detect Urgency & Category with AI"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input required type="text" placeholder="e.g. Pune Camp" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" value={newReq.location} onChange={e => setNewReq({...newReq, location: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      Category {aiSuggested && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-2 font-bold">AI Suggested</span>}
                    </label>
                    <select required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" value={newReq.category} onChange={e => {setNewReq({...newReq, category: e.target.value}); setAiSuggested(false);}}>
                      <option value="">Select...</option>
                      <option value="Medical">Medical</option>
                      <option value="Food">Food</option>
                      <option value="Physical Labor">Physical Labor</option>
                      <option value="Teaching">Teaching</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      Urgency {aiSuggested && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded ml-2 font-bold">AI Suggested</span>}
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 outline-none" value={newReq.urgency} onChange={e => {setNewReq({...newReq, urgency: e.target.value}); setAiSuggested(false);}}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
                {aiSuggested && <p className="text-right text-xs text-purple-600 font-medium mt-1">Powered by Gemini ✦</p>}
                <button type="submit" className="w-full mt-4 bg-primary-500 text-white font-bold py-3 rounded-xl hover:bg-primary-600 transition-colors shadow-sm">
                  Create Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
