import React, { useState, useEffect } from 'react';
import { 
  User, 
  Play, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ShieldAlert, 
  CheckCircle, 
  Award, 
  Briefcase,
  BrainCircuit,
  Users
} from 'lucide-react';

// --- CONFIGURATION & DATA ---

const IMAGES = {
  officeBlurred: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920",
  meetingRoom: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=1920",
  character: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=1920"
};

const INITIAL_METRICS = {
  trust: 50,
  accountability: 50,
  morale: 50,
  transparency: 50
};

const PATH_1_DATA = {
  A: {
    id: 'A',
    dialogue: "I thought I could handle it… I didn’t expect this reaction.",
    visualCue: "Rahul's expression becomes defensive. He leans back slightly.",
    overlayColor: "bg-red-900/30",
    deltas: { trust: -15, accountability: 15, morale: -20, transparency: -10 },
    feedback: [
      { label: "Trust", change: "down", value: "↓" },
      { label: "Accountability", change: "up", value: "↑" },
      { label: "Team Morale", change: "down", value: "↓" }
    ]
  },
  B: {
    id: 'B',
    dialogue: "Actually, I’ve been juggling multiple priorities and wasn’t sure how to escalate.",
    visualCue: "Rahul relaxes his posture and makes eye contact.",
    overlayColor: "bg-green-900/20",
    deltas: { trust: 25, accountability: 5, morale: 15, transparency: 25 },
    feedback: [
      { label: "Trust", change: "up", value: "↑" },
      { label: "Transparency", change: "up", value: "↑" },
      { label: "Problem Clarity", change: "up", value: "↑" }
    ]
  },
  C: {
    id: 'C',
    dialogue: "I understand… I’ll try to improve.",
    visualCue: "Rahul looks frustrated and avoids engagement. His tone is disengaged.",
    overlayColor: "bg-red-900/40",
    deltas: { trust: -25, accountability: -5, morale: -30, transparency: -20 },
    feedback: [
      { label: "Morale", change: "down", value: "↓↓" },
      { label: "Engagement", change: "down", value: "↓" },
      { label: "Attrition Risk", change: "up", value: "↑" } // Treated as negative impact on our score
    ]
  }
};

const PATH_2_DATA = {
  A: {
    id: 'A',
    deltas: { trust: 10, accountability: -10, morale: 20, transparency: 5 }
  },
  B: {
    id: 'B',
    deltas: { trust: -5, accountability: 25, morale: -15, transparency: 5 }
  },
  C: {
    id: 'C',
    deltas: { trust: -30, accountability: 10, morale: -25, transparency: -10 }
  }
};

// --- COMPONENTS ---

const BackgroundContainer = ({ image, blurred = false, overlay = "bg-black/40", children }) => (
  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#121212] text-white font-sans">
    <div 
      className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ${blurred ? 'blur-md scale-105' : 'scale-100'}`}
      style={{ backgroundImage: `url(${image})` }}
    />
    <div className={`absolute inset-0 z-10 ${overlay} transition-colors duration-700`} />
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 animate-[fadeIn_0.5s_ease-out]">
      {children}
    </div>
  </div>
);

const Button = ({ onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = "px-6 py-3 rounded-md font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto";
  const variants = {
    primary: "bg-[#4A90E2] hover:bg-[#357ABD] text-white shadow-lg hover:shadow-blue-500/25",
    outline: "border border-gray-500 hover:border-[#4A90E2] bg-black/50 hover:bg-[#4A90E2]/10 backdrop-blur-sm text-gray-200",
    option: "border border-gray-700 bg-[#1E1E1E]/80 hover:bg-[#2A2A2A] hover:border-[#4A90E2] text-left px-6 py-4 rounded-lg w-full transition-all duration-200 text-gray-200 hover:text-white"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function App() {
  const [screen, setScreen] = useState(1);
  const [userName, setUserName] = useState('');
  const [metrics, setMetrics] = useState(INITIAL_METRICS);
  const [choices, setChoices] = useState({ 1: null, 2: null });

  // Update metrics helper
  const applyDeltas = (deltas) => {
    setMetrics(prev => {
      const newMetrics = { ...prev };
      Object.keys(deltas).forEach(key => {
        if (newMetrics[key] !== undefined) {
          newMetrics[key] = Math.max(0, Math.min(100, newMetrics[key] + deltas[key]));
        }
      });
      return newMetrics;
    });
  };

  const handleChoice1 = (choiceId) => {
    setChoices(prev => ({ ...prev, 1: choiceId }));
    applyDeltas(PATH_1_DATA[choiceId].deltas);
    setScreen(5);
  };

  const handleChoice2 = (choiceId) => {
    setChoices(prev => ({ ...prev, 2: choiceId }));
    applyDeltas(PATH_2_DATA[choiceId].deltas);
    setScreen(7);
  };

  const resetSimulation = () => {
    setMetrics(INITIAL_METRICS);
    setChoices({ 1: null, 2: null });
    setScreen(1);
  };

  // --- SCREENS ---

  const renderScreen = () => {
    switch (screen) {
      case 1: // LOGIN
        return (
          <BackgroundContainer image={IMAGES.officeBlurred} blurred>
            <div className="bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#4A90E2]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#4A90E2]/30">
                <BrainCircuit className="text-[#4A90E2] w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Leadership Simulation Lab</h1>
              <p className="text-gray-400 text-sm mb-8">Experience real-world leadership scenarios in a risk-free environment.</p>
              
              <div className="w-full mb-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Enter your name (optional)" 
                    className="w-full bg-black/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#4A90E2] transition-colors"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={() => setScreen(2)} className="w-full">
                Start Simulation <Play className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </BackgroundContainer>
        );

      case 2: // BRIEFING
        return (
          <BackgroundContainer image={IMAGES.officeBlurred} overlay="bg-[#121212]/90">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center h-full">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-[#4A90E2] text-sm font-semibold border border-blue-500/20 w-fit">
                  <Briefcase className="w-4 h-4" />
                  Module 1
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">Scenario Brief</h1>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed bg-[#1E1E1E]/50 p-6 rounded-xl border border-white/5">
                  <p>
                    You are a Team Manager leading a high-performing unit. Recently, one of your key team members, <strong className="text-white">Rahul</strong>, has been missing deadlines and showing signs of disengagement.
                  </p>
                  <p>
                    You are about to enter a one-on-one meeting to address the situation. Your objective is to uncover the root cause and align on a path forward while maintaining team morale.
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={() => setScreen(3)}>
                    Enter Simulation <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="hidden md:block h-96 rounded-2xl overflow-hidden relative shadow-2xl border border-white/10">
                <img src={IMAGES.meetingRoom} alt="Meeting Room" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <p className="text-sm font-medium text-gray-300">Virtual Environment: Conference Room B</p>
                </div>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 3: // IMMERSIVE ENTRY
        return (
          <BackgroundContainer image={IMAGES.meetingRoom} overlay="bg-black/60">
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
              <div className="bg-[#1E1E1E]/80 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-xl shadow-2xl">
                <p className="text-xl sm:text-2xl font-light leading-relaxed mb-6 italic text-gray-200">
                  "You enter the meeting room. Rahul is already seated. He looks slightly disengaged, staring at his notebook and avoiding eye contact."
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setScreen(4)} variant="outline">
                    Take a seat <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 4: // FIRST DECISION POINT
        return (
          <BackgroundContainer image={IMAGES.character} overlay="bg-black/70">
            <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-5xl mx-auto w-full">
              
              {/* Character Dialogue */}
              <div className="bg-[#1E1E1E]/90 backdrop-blur-xl border border-gray-700 p-6 rounded-t-2xl shadow-2xl relative mb-4">
                <div className="absolute -top-4 left-6 bg-[#4A90E2] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Rahul
                </div>
                <p className="text-xl text-gray-100 mt-2">
                  "I've been overloaded lately... I couldn't manage all the deadlines."
                </p>
              </div>

              {/* Choices */}
              <div className="flex flex-col space-y-3">
                <Button variant="option" onClick={() => handleChoice1('A')}>
                  <span className="font-semibold text-gray-400 mr-3">A.</span>
                  "You should have informed me earlier. We can't let client deliverables slip."
                </Button>
                <Button variant="option" onClick={() => handleChoice1('B')}>
                  <span className="font-semibold text-gray-400 mr-3">B.</span>
                  "I see. Let’s break down your current tasks and understand what’s blocking you."
                </Button>
                <Button variant="option" onClick={() => handleChoice1('C')}>
                  <span className="font-semibold text-gray-400 mr-3">C.</span>
                  "This level of performance is unacceptable for someone at your level."
                </Button>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 5: // FEEDBACK PATH
        const currentPath = PATH_1_DATA[choices[1]];
        return (
          <BackgroundContainer image={IMAGES.character} overlay={currentPath.overlayColor + " backdrop-blur-sm"}>
            
            {/* VR HUD Feedback Overlay */}
            <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-xl shadow-2xl min-w-[200px] animate-[slideInRight_0.5s_ease-out]">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Impact Analytics</h3>
              </div>
              <div className="space-y-3">
                {currentPath.feedback.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-300">{item.label}</span>
                    <span className={`flex items-center gap-1 ${item.change === 'up' && item.label !== 'Attrition Risk' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.value} {item.change === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
              <div className="bg-[#1E1E1E]/90 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-xl shadow-2xl">
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10 shrink-0">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#4A90E2] font-semibold mb-1 uppercase tracking-wider">Visual Cue</p>
                    <p className="text-gray-300 italic">{currentPath.visualCue}</p>
                  </div>
                </div>

                <div className="bg-black/30 p-5 rounded-lg border-l-4 border-[#4A90E2] mb-6">
                  <p className="text-lg font-medium">"{currentPath.dialogue}"</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setScreen(6)}>
                    Continue Conversation <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 6: // SECOND DECISION POINT
        return (
          <BackgroundContainer image={IMAGES.character} overlay="bg-black/70">
            <div className="absolute inset-0 flex flex-col justify-end pb-8 px-4 sm:px-8 max-w-5xl mx-auto w-full">
              
              <div className="bg-[#1E1E1E]/90 backdrop-blur-xl border border-gray-700 p-6 rounded-t-2xl shadow-2xl relative mb-4">
                 <div className="absolute -top-4 left-6 bg-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  System Prompt
                </div>
                <p className="text-xl text-gray-100 mt-2 font-medium">
                  "How would you like to resolve this situation and move forward?"
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Button variant="option" onClick={() => handleChoice2('A')}>
                  <span className="font-semibold text-gray-400 mr-3">A.</span>
                  Temporarily redistribute his workload across the team to give him breathing room.
                </Button>
                <Button variant="option" onClick={() => handleChoice2('B')}>
                  <span className="font-semibold text-gray-400 mr-3">B.</span>
                  Set strict daily deadlines and monitor his progress closely until performance improves.
                </Button>
                <Button variant="option" onClick={() => handleChoice2('C')}>
                  <span className="font-semibold text-gray-400 mr-3">C.</span>
                  Escalate the issue to HR and put him on a formal Performance Improvement Plan (PIP).
                </Button>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 7: // OUTCOME
        const overallScore = Math.round((metrics.trust + metrics.accountability + metrics.morale + metrics.transparency) / 4);
        
        let narrative = "";
        if (choices[1] === 'B' && choices[2] === 'A') {
          narrative = "You demonstrated strong empathy and created psychological safety. However, shifting workload might cause resentment in the broader team without a long-term plan.";
        } else if (choices[1] === 'B' && choices[2] === 'B') {
          narrative = "Excellent balance. You listened empathetically to uncover the issue, but maintained accountability through structured monitoring. High leadership effectiveness.";
        } else if (choices[1] === 'C' || choices[2] === 'C') {
          narrative = "Your approach was overly punitive. While accountability was enforced, trust and morale have severely degraded. Flight risk for this employee is currently high.";
        } else {
          narrative = "You maintained baseline functioning, but missed opportunities to deeply engage the employee or set up sustainable structural improvements.";
        }

        return (
          <BackgroundContainer image={IMAGES.officeBlurred} overlay="bg-[#121212]/95">
            <div className="w-full max-w-3xl bg-[#1E1E1E] border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-[#4A90E2]/20 to-transparent p-8 border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Simulation Complete</h2>
                    <p className="text-gray-400">Manager: {userName || 'Participant'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Effectiveness Score</p>
                    <div className="text-5xl font-bold text-[#4A90E2]">{overallScore}<span className="text-xl text-gray-500">/100</span></div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-500" />
                  Narrative Feedback
                </h3>
                <div className="bg-black/30 p-5 rounded-lg border border-white/5 text-gray-300 leading-relaxed mb-8 text-lg">
                  {narrative}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-lg text-center border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Empathy</div>
                    <div className={`font-semibold ${choices[1] === 'B' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {choices[1] === 'B' ? 'High' : (choices[1] === 'A' ? 'Medium' : 'Low')}
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg text-center border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Accountability</div>
                    <div className={`font-semibold ${['A','B'].includes(choices[2]) ? 'text-green-400' : 'text-yellow-400'}`}>
                      {choices[2] === 'B' ? 'High' : 'Medium'}
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg text-center border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Team Impact</div>
                    <div className={`font-semibold ${metrics.morale > 50 ? 'text-green-400' : 'text-red-400'}`}>
                      {metrics.morale > 60 ? 'Positive' : (metrics.morale < 40 ? 'Negative' : 'Neutral')}
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg text-center border border-white/5">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Risk Bias</div>
                    <div className="font-semibold text-blue-400">
                      {choices[2] === 'C' ? 'Escalation' : 'Resolution'}
                    </div>
                  </div>
                </div>

                <Button onClick={() => setScreen(8)} className="w-full">
                  View Detailed Analytics Dashboard <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </BackgroundContainer>
        );

      case 8: // ANALYTICS DASHBOARD
        const finalScore = Math.round((metrics.trust + metrics.accountability + metrics.morale + metrics.transparency) / 4);
        
        // Helper to render metric bars
        const MetricBar = ({ label, value, colorClass }) => (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 font-medium">{label}</span>
              <span className="text-gray-400">{value}%</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div 
                className={`h-2.5 rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        );

        return (
          <BackgroundContainer image={IMAGES.officeBlurred} overlay="bg-[#121212]/95">
             <div className="w-full max-w-5xl h-[85vh] flex flex-col bg-[#1E1E1E] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Dashboard Header */}
                <div className="flex items-center justify-between p-6 bg-black/40 border-b border-gray-700 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#4A90E2]/20 rounded-lg">
                      <BarChart3 className="w-6 h-6 text-[#4A90E2]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Manager Performance Analytics</h2>
                      <p className="text-xs text-gray-400">Comprehensive simulation review</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={resetSimulation} className="py-2 text-sm">
                    Restart Simulation
                  </Button>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                      
                      {/* Profile Card */}
                      <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User className="w-4 h-4" /> Participant Profile
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400 text-sm">Leadership Style</span>
                            <span className="text-white text-sm font-medium">{choices[1] === 'B' ? 'Collaborative' : 'Directive'}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400 text-sm">Risk Appetite</span>
                            <span className="text-white text-sm font-medium">{choices[2] === 'C' ? 'Low' : 'Moderate'}</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-gray-400 text-sm">Decision Bias</span>
                            <span className="text-white text-sm font-medium">{['A','C'].includes(choices[1]) ? 'Task-first' : 'People-first'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Benchmark Card */}
                      <div className="bg-gradient-to-br from-[#4A90E2]/20 to-transparent p-5 rounded-xl border border-[#4A90E2]/30 relative overflow-hidden">
                        <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-[#4A90E2]/10" />
                        <h3 className="text-sm font-semibold text-[#4A90E2] uppercase tracking-wider mb-2 relative z-10">Global Benchmark</h3>
                        <p className="text-3xl font-bold text-white relative z-10 mb-1">Top {finalScore > 75 ? '15%' : (finalScore > 50 ? '45%' : '80%')}</p>
                        <p className="text-xs text-gray-300 relative z-10">You scored higher than {finalScore > 75 ? '85%' : (finalScore > 50 ? '55%' : '20%')} of participants in handling disengaged employees.</p>
                      </div>

                    </div>

                    {/* Right Column (Metrics) */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                      
                      {/* Core Metrics */}
                      <div className="bg-black/30 p-6 rounded-xl border border-white/5 sm:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Core Attribute Progression
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                          <MetricBar label="Trust Building" value={metrics.trust} colorClass={metrics.trust > 50 ? "bg-green-500" : "bg-red-500"} />
                          <MetricBar label="Accountability" value={metrics.accountability} colorClass={metrics.accountability > 50 ? "bg-[#4A90E2]" : "bg-yellow-500"} />
                          <MetricBar label="Team Morale" value={metrics.morale} colorClass={metrics.morale > 50 ? "bg-green-500" : "bg-red-500"} />
                          <MetricBar label="Transparency" value={metrics.transparency} colorClass="bg-purple-500" />
                        </div>
                      </div>

                      {/* Competency Map (Simulated Radar/Bar) */}
                      <div className="bg-black/30 p-6 rounded-xl border border-white/5 sm:col-span-2">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Specific Competencies
                        </h3>
                        
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs mb-1 text-gray-400 uppercase">
                              <span>Conflict Handling</span>
                              <span>{choices[1] === 'B' ? 'Excellent' : 'Needs Work'}</span>
                            </div>
                            <div className="w-full flex h-3 bg-black/50 rounded overflow-hidden">
                              <div className={`h-full ${choices[1] === 'B' ? 'bg-green-500 w-[85%]' : 'bg-red-500 w-[35%]'}`}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs mb-1 text-gray-400 uppercase">
                              <span>Strategic Execution</span>
                              <span>{choices[2] === 'B' ? 'Strong' : 'Moderate'}</span>
                            </div>
                            <div className="w-full flex h-3 bg-black/50 rounded overflow-hidden">
                              <div className={`h-full ${choices[2] === 'B' ? 'bg-[#4A90E2] w-[90%]' : 'bg-yellow-500 w-[60%]'}`}></div>
                            </div>
                          </div>

                           <div>
                            <div className="flex justify-between text-xs mb-1 text-gray-400 uppercase">
                              <span>Psychological Safety</span>
                              <span>{metrics.trust > 60 ? 'High' : 'Low'}</span>
                            </div>
                            <div className="w-full flex h-3 bg-black/50 rounded overflow-hidden">
                              <div className={`h-full ${metrics.trust > 60 ? 'bg-green-500 w-[80%]' : 'bg-red-500 w-[30%]'}`}></div>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
             </div>
          </BackgroundContainer>
        );

      default:
        return <div>Error: Unknown Screen</div>;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        body { margin: 0; overflow-x: hidden; background-color: #121212; }
      `}} />
      {renderScreen()}
    </>
  );
}