export const puneLocalities = [
  "Kothrud", "Pune Camp", "Viman Nagar", "Kalyani Nagar", "Hinjewadi", 
  "Wakad", "Aundh", "Baner", "Kharadi", "Hadapsar"
];

export const mockRequests = [
  {
    id: "req-1",
    title: "Food distribution needed",
    urgency: "High",
    location: "Kothrud",
    description: "Need volunteers to distribute food packets for 50 people.",
    skillsNeeded: ["Distribution", "Driving"],
    status: "Open",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "req-2",
    title: "Emergency medicine delivery",
    urgency: "Critical",
    location: "Viman Nagar",
    description: "Urgent delivery of essential medicines for elderly residents.",
    skillsNeeded: ["Medical", "Driving"],
    status: "Open",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), 
  },
  {
    id: "req-3",
    title: "Flood debris cleanup",
    urgency: "Medium",
    location: "Pune Camp",
    description: "Need help clearing debris from local community hall after heavy rains.",
    skillsNeeded: ["Physical Labor"],
    status: "Open",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
  },
  {
    id: "req-4",
    title: "Free Tutoring for primary kids",
    urgency: "Low",
    location: "Kalyani Nagar",
    description: "Looking for volunteers to teach basic English and Math.",
    skillsNeeded: ["Teaching"],
    status: "Assigned",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  }
];

export const mockVolunteers = [
  {
    id: "vol-1",
    name: "Aarav Patil",
    location: "Kothrud",
    skills: ["Driving", "Distribution"],
    available: true,
    rating: 4.8
  },
  {
    id: "vol-2",
    name: "Sneha Joshi",
    location: "Viman Nagar",
    skills: ["Medical", "Teaching"],
    available: true,
    rating: 4.9
  },
  {
    id: "vol-3",
    name: "Rohan Desai",
    location: "Pune Camp",
    skills: ["Physical Labor", "Driving"],
    available: false,
    rating: 4.5
  },
  {
    id: "vol-4",
    name: "Priya Sharma",
    location: "Kharadi",
    skills: ["Teaching", "Counseling"],
    available: true,
    rating: 5.0
  }
];
