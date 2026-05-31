import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  History, 
  Lightbulb, 
  Settings as SettingsIcon, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  Compass, 
  Palmtree,
  Heart,
  ChevronDown,
  Info,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  ArrowLeft,
  CheckCircle,
  QrCode,
  Share2,
  Copy,
  Download,
  GripVertical,
  Coffee,
  CheckSquare,
  Square,
  Clock,
  Hotel,
  Wallet
} from 'lucide-react';
import { Trip, Activity, Message } from './types';
import { INITIAL_TRIPS, INITIAL_CHAT, EX_WAVE_IMAGE, EX_POSITANO_IMAGE } from './data/defaultData';
import ItineraryTimeline from './components/ItineraryTimeline';
import MapPlaceholder from './components/MapPlaceholder';
import ChatTab from './components/ChatTab';
import QuickTipsTab from './components/QuickTipsTab';
import MyProfile from './components/MyProfile';
import ExploreHome from './components/ExploreHome';
import LoginScreen from './components/LoginScreen';
import MascotTurtle from './components/MascotTurtle';
import HotelAirbnbTab from './components/HotelAirbnbTab';
import TravelLedger from './components/TravelLedger';

export default function App() {
  // Visitor user session
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('manman_user_name') || '');

  // State management
  const [trips, setTrips] = useState<Trip[]>(() => {
    const local = localStorage.getItem('manman_trips');
    if (local && (local.includes('阿马尔菲') || local.includes('Amalfi') || local.includes('Sorrento'))) {
      return INITIAL_TRIPS;
    }
    return local ? JSON.parse(local) : INITIAL_TRIPS;
  });
  
  const [activeTripId, setActiveTripId] = useState<string>('amalfi-5day');
  const [dayId, setDayId] = useState<number>(1);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('itinerary'); // 'itinerary' | 'chat' | 'tips'
  const [activeView, setActiveView] = useState<'explore' | 'planner' | 'profile' | 'edit_day' | 'share_card'>('explore');

  const [messages, setMessages] = useState<Message[]>(() => {
    const local = localStorage.getItem('manman_chat');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text && (/Ciao.*Lazy|engaged|schedule/i.test(parsed[0].text) || /Ciao！我是您的/i.test(parsed[0].text) === false && /Ciao/i.test(parsed[0].text))) {
          return INITIAL_CHAT;
        }
        return parsed;
      } catch (e) {
        return INITIAL_CHAT;
      }
    }
    return INITIAL_CHAT;
  });

  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Custom dialog controllers as requested by the user
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Day Editing form states (for Image 2 Day-2 editing flow)
  const [editDayNumber, setEditDayNumber] = useState<number>(2);
  const [editDayActivities, setEditDayActivities] = useState<Activity[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('manman_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('manman_chat', JSON.stringify(messages));
  }, [messages]);

  // Find active items
  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0];

  // Set default highlighted activity for current day if none is selected
  useEffect(() => {
    const dayActs = activeTrip.activities.filter((a) => a.dayId === dayId);
    if (dayActs.length > 0) {
      setActiveActivityId(dayActs[0].id);
    } else {
      setActiveActivityId(null);
    }
  }, [dayId, activeTripId]);

  // Trigger notifications
  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch between other trips
  const handleSelectTrip = (id: string) => {
    setActiveTripId(id);
    setDayId(1);
    setActiveActivityId(null);
    const tripName = id === 'amalfi-5day' ? '大理双廊惬意5日游' : (id === 'capri-weekend' ? '三亚太阳湾周末逃离' : '川西九寨星空与水疗之旅');
    showToast(`🧳 已为您切换至 "${tripName}" 行程！`);
  };

  // Helper: optimize/reshuffle day 3 activities
  const handleOptimizeDay3 = () => {
    const updated = activeTrip.activities.map((act) => {
      // If pasta school was on Day 3, shift to Day 4 morning
      if (act.id === 'a3-2') {
        return { ...act, dayId: 4, time: '09:30 AM', tags: ['地道美食', '慢生活优化'] };
      }
      return act;
    });
    
    setTrips(
      trips.map((t) => {
        if (t.id === activeTripId) {
          return { ...t, activities: updated };
        }
        return t;
      })
    );
    showToast("✨ 日程优化成功！柠檬意面制作已顺延推迟至第 4 天早晨。");
  };

  // Trigger quick adjust from recommendation widget
  const handleNotificationAdjust = () => {
    handleOptimizeDay3();
    setNotificationDismissed(true);
    
    // Append conversation text confirmation
    const newMsg: Message = {
      id: 'usr-adj-' + Date.now(),
      sender: 'assistant',
      text: "⚡ 搞定！我已经重洗了第 3 天日程，柠檬通心粉烹饪调到了第 4 天早晨（09:30 AM）。现在您第 3 天下午没有任何行程，可以安心在翡翠泻湖晒着太阳打盹了！",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Switch into edit day mode for Image 2 style interactive view
  const openEditDayInterface = (dayNum: number) => {
    setEditDayNumber(dayNum);
    // filter and deep copy specific activities to prevent state contamination
    const dayActs = activeTrip.activities.filter(a => a.dayId === dayNum)
                     .sort((a,b) => a.time.localeCompare(b.time));
    setEditDayActivities(JSON.parse(JSON.stringify(dayActs)));
    setActiveView('edit_day');
    showToast(`🛠️ 正在进入第 ${dayNum} 天精细微调交互沙盒...`);
  };

  // Handle edit activity title/time/notes in real-time in the editing panel
  const handleUpdateEditDayActivityField = (idx: number, field: string, value: any) => {
    setEditDayActivities(prev => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        [field]: value
      };
      return copy;
    });
  };

  // Reorder index shift
  const handleShiftActivityOrder = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === editDayActivities.length - 1) return;
    
    setEditDayActivities(prev => {
      const copy = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      // swap times
      const tempTime = copy[idx].time;
      copy[idx].time = copy[targetIdx].time;
      copy[targetIdx].time = tempTime;
      
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
    showToast("🔄 时间轴顺利置换排序");
  };

  // Save the custom interactive edited day array back to main activeTrip activities list
  const handleSaveDayEditChanges = () => {
    // substitute elements
    const otherActs = activeTrip.activities.filter(a => a.dayId !== editDayNumber);
    const updated = [...otherActs, ...editDayActivities];
    
    setTrips(prevTrips => prevTrips.map(t => {
      if (t.id === activeTripId) {
        return {
          ...t,
          activities: updated
        };
      }
      return t;
    }));

    setActiveView('planner');
    setShowSaveSuccess(true); // Trigger Image 3 saved success view instantly!
    showToast(`🎉 第 ${editDayNumber} 天编辑成功已暂存！已为您打包生成慢行攻略。`);
  };

  // AI auto optimize button inside Image 2 view
  const handleAIAutoOptimizeDay = () => {
    // Check if we've already added a rest break to prevent repeating infinitely
    const hasRest = editDayActivities.some(a => a.title.includes("惬憩") || a.title.includes("休息"));
    if (hasRest) {
      showToast("📝 当前一天的节奏非常匀称合理，状态松弛，无需再度调整啦！");
      return;
    }

    // Insert a restorative afternoon tea rest break dynamically at 03:30 PM!
    const restAct: Activity = {
      id: "ai-auto-rest-" + Date.now(),
      dayId: editDayNumber,
      time: "03:30 PM",
      title: "🍋 悬崖椰影余晖下午茶 (修复空隙)",
      description: "自动错峰调整。在蔚蓝海浪微波与芬芳橄榄树下享用冰镇咖啡或手工柠檬冰沙，放空思绪，享受惬意姿态。",
      type: "leisure",
      tags: ["专属建议", "放松身心", "必体验"],
      locationName: "波西塔诺峭壁阳台 Caffe",
      coordinates: { x: 40, y: 50 },
      isCompleted: false
    };

    setEditDayActivities(prev => {
      // insert and sort by simulated time
      const combined = [...prev, restAct];
      return combined.sort((a,b) => a.time.localeCompare(b.time));
    });
    showToast("✨ 日程优化成功！已在下午的活动与晚餐间插入了一段【悬崖椰影下午茶】休养时间。");
  };

  // Add dummy activity
  const handleAddNewChat = () => {
    setMessages([
      {
        id: 'new-' + Date.now(),
        sender: 'assistant',
        text: "Ciao！我是您的慢慢游规划师——龟小旅 🐢。希望这次的大理小憩充满惬意与充足的午休。您有什么想要了解微调的吗？",
        timestamp: "刚刚",
        suggestions: ["推荐波西塔诺最美的发呆小酒吧", "帮我把出行推迟一个小时"]
      }
    ]);
    setActiveTab('chat');
    showToast("已成功连接及重设慢旅客制 龟小旅 会话。");
  };

  if (!userName) {
    return (
      <LoginScreen 
        onLogin={(name) => {
          setUserName(name);
          localStorage.setItem('manman_user_name', name);
          showToast(`✨ 慢慢：欢迎你，${name}。让生活慢一点。`);
        }} 
      />
    );
  }

  return (
    <div className="ambient-bg text-on-surface font-sans min-h-screen relative pb-28 md:pb-16">
      
      {/* Toast Alert Indicator */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 bg-[#1a4231] text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center space-x-2.5 max-w-sm font-sans text-left animate-bounce"
          >
            <div className="bg-white/20 p-1.5 rounded-full shrink-0">
              <Sparkles className="w-4 h-4 text-primary-container" />
            </div>
            <p className="text-xs font-semibold leading-snug">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Floating Utility Bar for Saving & Profile Entry */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-secondary/15 shadow-sm">
        {activeView === 'planner' && (
          <button 
            onClick={() => {
              setShowSaveSuccess(true);
              showToast("正在检验并生成您的行程单...");
            }}
            className="bg-secondary hover:brightness-105 text-white border-b-2 border-on-secondary-container rounded-full px-4.5 py-1.5 text-xs font-extrabold transition-all shadow-md hover:scale-[1.02] active:scale-95 select-none cursor-pointer"
          >
            保存方案
          </button>
        )}

        <button
          onClick={() => {
            setActiveView('profile');
            showToast("已打开您的专属个人主页！");
          }}
          className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 hover:ring-2 hover:ring-primary/25 cursor-pointer transition-all shrink-0"
          title="查看慢慢个人主页"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlP9IXELBiNNd4SnBqGLXZOSEgPo_WOpjaH44-YlhdW1ah8ouDp60J77WRhdr1L2TkO8_z2316Kr-fSQTp64KYKh2ADV_e_CSS9TIa2LQJSC76Exvv2fzbWsOqVczKdvEL57l_kp_dtcIQYawOcOkdGJ4JaVXDZ6URIpeQV8wn__nE5oou7emps7bBuGlwHcZvOdUs0FbTSQyDx1-ih08O2c5aWgooITEO2WRrJhKYd0aFDGJWiDf54TMEFYFvoZLGoKBsjBvmeNw"
            alt="Profile Avatar"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="hidden md:block bg-white/55 dark:bg-slate-900/55 backdrop-blur-2xl fixed bottom-0 left-0 w-full z-45 shadow-lg shadow-black/5 border-t border-secondary/10">
        <div className="max-w-2xl mx-auto px-4 py-2.5 grid grid-cols-3 gap-6">
          <button 
            onClick={() => {
              setActiveView('explore');
              showToast("欢迎开启全新避世探索旅途！");
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer ${
              activeView === 'explore' 
                ? 'text-on-primary-container bg-primary-container border border-primary/45 font-extrabold shadow-sm' 
                : 'text-on-surface-variant hover:text-primary hover:bg-primary/5 border border-transparent font-medium'
            }`}
          >
            <Compass className="w-5.5 h-5.5 mb-1" />
            <span className="text-xs md:text-sm tracking-wide">探索</span>
          </button>

          <button 
            onClick={() => {
              setActiveView('planner');
              showToast("正在步入时间线日程...");
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer ${
              activeView === 'planner' 
                ? 'text-on-secondary-container bg-secondary-container border border-secondary/45 font-extrabold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 font-semibold'
            }`}
          >
            <Compass className="w-5.5 h-5.5 mb-1" />
            <span className="text-xs md:text-sm tracking-wide">日程</span>
          </button>

          <button 
            onClick={() => {
              setActiveView('profile');
              showToast("打卡档案。");
            }}
            className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer ${
              activeView === 'profile' 
                ? 'text-on-tertiary-container bg-tertiary-container border border-tertiary/65 font-extrabold shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 font-semibold'
            }`}
          >
            <User className="w-5.5 h-5.5 mb-1" />
            <span className="text-xs md:text-sm tracking-wide">我的</span>
          </button>
        </div>
      </nav>
      <aside className="hidden xl:flex bg-white w-80 fixed left-0 top-0 z-30 rounded-r-[32px] border-r-2 border-[#e5e5e5]/80 flex-col h-full py-8 space-y-4 pt-12 text-left shadow-[4px_0_12px_rgba(0,0,0,0.01)]">
        <div className="px-6 mb-4 flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary-container border-2 border-primary flex items-center justify-center overflow-hidden shadow-sm anim-float-mascot pb-1">
            <MascotTurtle pose="avatar" size={42} />
          </div>
          <div>
            <h2 className="font-headline font-black text-sm tracking-wide text-slate-800">慢慢 / Manman 🐢</h2>
            <p className="font-sans text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">在线避世领航小绿龟</p>
          </div>
        </div>

        {/* Side Control Buttons */}
        <nav className="flex-1 px-4 space-y-2.5">
          <button
            onClick={() => {
              setActiveView('explore');
              showToast("打卡目的地探索大厅。 🗺️");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'explore' 
                ? 'border-2 border-primary bg-primary-container text-on-primary-container shadow-[0_4px_0_0_var(--color-on-primary-container)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Sparkles className={`w-4.5 h-4.5 ${activeView === 'explore' ? 'text-on-primary-container' : 'text-slate-400'}`} />
            <span>探索避世好去处</span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              setActiveTab('itinerary');
              showToast("查看极筒每日时间线。 📅");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'planner' && activeTab === 'itinerary' 
                ? 'border-2 border-secondary bg-secondary-container text-on-secondary-container shadow-[0_4px_0_0_var(--color-on-secondary-container)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Compass className={`w-4.5 h-4.5 ${activeView === 'planner' && activeTab === 'itinerary' ? 'text-on-secondary-container' : 'text-slate-400'}`} />
            <span>极简每日日程</span>
          </button>
          
          <button
            onClick={() => {
              setActiveView('planner');
              setActiveTab('chat');
              showToast("连线AI伙伴 龟小旅！ 💬");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'planner' && activeTab === 'chat' 
                ? 'border-2 border-tech bg-tech-container text-on-tech-container shadow-[0_4px_0_0_var(--color-on-tech-container)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Bot className={`w-4.5 h-4.5 ${activeView === 'planner' && activeTab === 'chat' ? 'text-on-tech-container' : 'text-slate-400'}`} />
            <span>龟小旅在线会话</span>
            <span className="bg-red-500 text-white font-sans text-[8.5px] font-black px-2 py-0.5 rounded-full ml-auto animate-pulse">
              LIVE
            </span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              setActiveTab('tips');
              showToast("龟小旅硬核避坑信条。 💡");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'planner' && activeTab === 'tips' 
                ? 'border-2 border-tertiary bg-tertiary-container text-on-tertiary-container shadow-[0_4px_0_0_var(--color-on-tertiary-container)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Lightbulb className={`w-4.5 h-4.5 ${activeView === 'planner' && activeTab === 'tips' ? 'text-on-tertiary-container' : 'text-slate-400'}`} />
            <span>慢慢游港湾信条</span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              setActiveTab('hotels');
              showToast("浏览龟小旅特调的精奢酒店与美学民宿。 🏨");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'planner' && activeTab === 'hotels' 
                ? 'border-2 border-rose-500 bg-rose-50 text-rose-700 shadow-[0_4px_0_0_rgba(244,63,94,0.15)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Hotel className={`w-4.5 h-4.5 ${activeView === 'planner' && activeTab === 'hotels' ? 'text-rose-500 font-extrabold' : 'text-slate-400'}`} />
            <span>慢居预订与算费</span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              setActiveTab('ledger');
              showToast("打开慢活账本，追踪您的旅行额外支出。 🪙");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'planner' && activeTab === 'ledger' 
                ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_4px_0_0_rgba(16,185,129,0.15)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <Wallet className={`w-4.5 h-4.5 ${activeView === 'planner' && activeTab === 'ledger' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`} />
            <span>慢活旅行账簿</span>
          </button>

          <button
            onClick={() => {
              setActiveView('profile');
              showToast("打开我的慢慢档案。 👤");
            }}
            className={`w-full flex items-center space-x-3.5 rounded-2xl px-4 py-3.5 text-xs font-black uppercase tracking-wider select-none transition-all duration-100 cursor-pointer ${
              activeView === 'profile' 
                ? 'border-2 border-tertiary bg-tertiary-container text-on-tertiary-container shadow-[0_4px_0_0_var(--color-on-tertiary-container)] translate-y-0' 
                : 'border-2 border-transparent text-slate-500 hover:bg-slate-50 hover:border-[#e5e5e5] active:translate-y-[2px]'
            }`}
          >
            <User className={`w-4.5 h-4.5 ${activeView === 'profile' ? 'text-on-tertiary-container' : 'text-slate-400'}`} />
            <span>我的 (My Page)</span>
          </button>
        </nav>


        {/* Dynamic Context Widget - Real Estate Info card */}
        <div className="px-6 mt-auto">
          <AnimatePresence>
            {!notificationDismissed && activeTripId === 'amalfi-5day' && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: 15 }}
                className="glass-panel p-4 rounded-3xl ai-gradient mb-5 relative overflow-hidden text-left border border-primary/10 shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-secondary-container" />
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-extrabold text-primary uppercase tracking-wide">慢节奏微调建议</h5>
                    <p className="font-sans text-[11px] text-[#2c3a37] leading-relaxed mt-1 font-semibold">
                      第 3 天漫游后行程密度略大，过于紧凑。想让龟小旅一键优化时间线吗？
                    </p>
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={handleNotificationAdjust}
                        className="bg-primary hover:bg-primary/95 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        一键松绑
                      </button>
                      <button 
                        onClick={() => setNotificationDismissed(true)}
                        className="text-on-surface hover:text-primary font-sans text-[10px] font-bold px-2.5 py-1.5 cursor-pointer"
                      >
                        忽略
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={handleAddNewChat}
            className="w-full bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container font-black rounded-full py-3 text-xs.5 shadow-md flex items-center justify-center space-x-1.5 select-none cursor-pointer"
          >
            <Plus className="w-4 h-4 text-on-primary-container" />
            <span>开启新代谈</span>
          </button>
        </div>
      </aside>

      {/* Drawer Dialog Sidebar for Mobile & Tablets */}
      <AnimatePresence>
        {showMobileSidebar && (
          <div className="fixed inset-0 z-50 flex">
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileSidebar(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-72 bg-[#f5fbf8] h-full p-6 shadow-2xl flex flex-col z-10 text-left"
            >
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
                <div className="flex items-center space-x-2">
                  <Palmtree className="w-5 h-5 text-primary" />
                  <span className="font-headline font-extrabold text-base text-primary tracking-widest">慢慢</span>
                </div>
                <button onClick={() => setShowMobileSidebar(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Navigation in Drawer */}
              <div className="flex-1 space-y-2 mt-6">
                <button
                  onClick={() => {
                    setActiveView('explore');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'explore' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>探索避世主版区</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('planner');
                    setActiveTab('itinerary');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'planner' && activeTab === 'itinerary' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>极简每日日程表</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('planner');
                    setActiveTab('chat');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'planner' && activeTab === 'chat' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>与专属龟小旅聊聊</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('planner');
                    setActiveTab('tips');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'planner' && activeTab === 'tips' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>南意避坑防拐信条</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('planner');
                    setActiveTab('hotels');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'planner' && activeTab === 'hotels' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Hotel className="w-4 h-4 text-rose-500" />
                  <span>慢居预订与算费</span>
                </button>

                <button
                  onClick={() => {
                    setActiveView('planner');
                    setActiveTab('ledger');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeView === 'planner' && activeTab === 'ledger' ? 'bg-[#4fd1c5] text-[#005750]' : 'text-on-surface'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-emerald-500" />
                  <span>慢活旅行账簿</span>
                </button>
                
                <div className="pt-6 border-t border-slate-200 mt-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans px-2">
                    活跃行囊企划：
                  </span>
                  <div className="space-y-1 mt-2">
                    <button
                      onClick={() => {
                        handleSelectTrip('amalfi-5day');
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold ${
                        activeTripId === 'amalfi-5day' ? 'bg-primary/10 text-primary' : 'text-slate-600'
                      }`}
                    >
                      🗺️ 大理双廊慢游 (5天)
                    </button>
                    <button
                      onClick={() => {
                        handleSelectTrip('capri-weekend');
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold ${
                        activeTripId === 'capri-weekend' ? 'bg-primary/10 text-primary' : 'text-slate-600'
                      }`}
                    >
                      🌴 三亚太阳湾逃离 (3天)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button 
                  onClick={() => {
                    handleAddNewChat();
                    setShowMobileSidebar(false);
                  }}
                  className="w-full bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container py-2.5 rounded-xl text-xs font-black text-center cursor-pointer"
                >
                  + 重启漫步对话
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Workspace Layout */}
      <main className="pt-8 pb-28 md:pb-32 px-4 md:px-10 xl:ml-80 max-w-[1400px] mx-auto">
        
        {activeView === 'explore' ? (
          <ExploreHome 
            onSelectTrip={(tripId) => {
              setActiveTripId(tripId);
              setActiveView('planner');
              setActiveTab('itinerary');
              setDayId(1);
            }}
            onAddTrip={(newTrip) => {
              setTrips([newTrip, ...trips]);
            }}
            showToast={showToast}
          />
        ) : activeView === 'profile' ? (
          <MyProfile 
            onSwitchToTrip={(tripId) => {
              setActiveTripId(tripId);
              setActiveView('planner');
              setActiveTab('itinerary');
              setDayId(1);
            }}
            onAddTrip={(newTrip) => {
              setTrips([...trips, newTrip]);
            }}
            showToast={showToast}
            userName={userName}
            onRetakeTest={() => {
              localStorage.removeItem('manman_user_name');
              setUserName('');
              showToast("🧼 已开启趣味性格诊断关卡，开启您的个性化避世标签与欢迎语定制吧！");
            }}
          />
        ) : activeView === 'edit_day' ? (
          /* ================= IMAGE 2 STYLE INTERACTIVE EVENT REORDER WORKSPACE ================= */
          <div className="space-y-8 max-w-4xl mx-auto text-left">
            {/* Top Back Action strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-5">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setActiveView('planner');
                    showToast("已返还原行程单。");
                  }}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                  title="返回行程列表"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-sans font-bold uppercase tracking-wider">
                    <span>行程精确精修中</span>
                    <span>•</span>
                    <span className="text-secondary">{activeTrip.name}</span>
                  </div>
                  <h1 className="font-headline font-bold text-lg md:text-xl text-on-surface flex items-center gap-2">
                    编辑第 {editDayNumber} 天 • 2024年9月14日
                  </h1>
                </div>
              </div>

              {/* Top Control Triggers */}
              <div className="flex items-center space-x-2.5">
                <button 
                  onClick={handleAIAutoOptimizeDay}
                  className="bg-primary-container/65 hover:bg-primary-container border border-primary/20 text-on-primary-container font-sans text-xs font-black px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span>一键优化</span>
                </button>
                <button 
                  onClick={handleSaveDayEditChanges}
                  className="bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container font-sans text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-1"
                >
                  <CheckSquare className="w-4 h-4 text-on-primary-container" />
                  <span>完成编辑</span>
                </button>
              </div>
            </div>

            {/* Split layout: Sidebar notes & central editing blocks list */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left sidebar: Tip reminder block */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 shadow-sm text-left relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sky-200/20 rounded-full blur-xl" />
                  <div className="flex items-start space-x-3 relative z-10">
                    <div className="p-2 bg-sky-100 rounded-xl text-sky-600 shrink-0">
                      <Lightbulb className="w-4.5 h-4.5 text-sky-600 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-xs.5 font-bold text-sky-800 font-sans tracking-wide">龟小旅建议</h4>
                      <p className="text-[11px] font-medium text-sky-700/90 leading-relaxed mt-1.5">
                        温馨提示：您今天一共安排了 <span className="font-extrabold text-sky-900">{editDayActivities.length} 个</span>活动。考虑在下午的特色体验后，预留出 1 至 2 个小时的完全静止放空时段，以防大理节奏过挤。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#eff5f3] border border-primary/10 rounded-3xl p-5 text-left text-xs space-y-2">
                  <span className="font-bold text-primary block uppercase tracking-widest text-[9.5px]">交互操作小沙盒：</span>
                  <p className="text-on-surface-variant leading-relaxed">
                    您可以在右侧点击上下箭头轻松置换时间轴秩序，并可以双击输入框或者修改文本说明。点击顶部的【一键优化】，龟小旅会为您寻找空档推荐下午茶惊喜之选。
                  </p>
                </div>
              </div>

              {/* Right Side list: Draggable & editable visual cards resembling mockup 2 */}
              <div className="lg:col-span-8 space-y-3.5">
                {editDayActivities.length === 0 ? (
                  <div className="text-center p-12-r bg-white/45 border border-dashed rounded-3xl border-slate-200">
                    <p className="text-xs font-semibold text-slate-500">这一天被删空啦，点击上方一键返回或添加日程。</p>
                  </div>
                ) : (
                  editDayActivities.map((act, idx) => {
                    return (
                      <motion.div 
                        key={act.id}
                        layoutId={`edit-card-${act.id}`}
                        className="bg-white/85 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow group pl-2"
                      >
                        {/* Drag and Reorder side visual trigger */}
                        <div className="flex flex-col items-center self-stretch justify-center pr-2 border-r border-slate-150 gap-2 text-slate-400">
                          <button 
                            onClick={() => handleShiftActivityOrder(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1 rounded hover:bg-slate-100 hover:text-slate-600 cursor-pointer disabled:opacity-20 disabled:pointer-events-none`}
                            title="向前换时间轴"
                          >
                            ▲
                          </button>
                          <GripVertical className="w-4 h-4 text-slate-300" />
                          <button 
                            onClick={() => handleShiftActivityOrder(idx, 'down')}
                            disabled={idx === editDayActivities.length - 1}
                            className={`p-1 rounded hover:bg-slate-100 hover:text-slate-600 cursor-pointer disabled:opacity-20 disabled:pointer-events-none`}
                            title="向后换时间轴"
                          >
                            ▼
                          </button>
                        </div>

                        {/* Miniature thumbnail preview if available */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-100 self-center">
                          <img 
                            src={act.imageUrl || EX_POSITANO_IMAGE} 
                            alt={act.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Custom editable form details inline */}
                        <div className="flex-1 space-y-2.5 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            {/* Title edit inputs */}
                            <input 
                              type="text"
                              value={act.title}
                              onChange={(e) => handleUpdateEditDayActivityField(idx, 'title', e.target.value)}
                              className="font-headline font-bold text-xs.5 text-on-surface bg-transparent border-b border-transparent focus:border-primary hover:border-slate-200 focus:outline-none py-0.5 w-full sm:max-w-xs font-semibold"
                            />
                            {/* Duration / metadata tag */}
                            <div className="flex items-center space-x-1 shrink-0">
                              <span className="text-[10px] bg-slate-100 text-slate-500 font-mono font-bold px-2 py-0.5 rounded-full">
                                {idx === 0 ? '约 3.5小时' : idx === 1 ? '约 2小时' : '约 1小时'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <input 
                                type="text"
                                value={act.time}
                                onChange={(e) => handleUpdateEditDayActivityField(idx, 'time', e.target.value)}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] font-sans font-bold text-slate-600"
                              />
                            </div>
                            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <input 
                                type="text"
                                value={act.locationName}
                                onChange={(e) => handleUpdateEditDayActivityField(idx, 'locationName', e.target.value)}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] font-sans font-bold text-slate-600"
                              />
                            </div>
                          </div>

                          {/* Description box */}
                          <textarea 
                            rows={2}
                            value={act.description}
                            onChange={(e) => handleUpdateEditDayActivityField(idx, 'description', e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl p-2.5 text-[11px] text-slate-500 font-medium leading-relaxed resize-none focus:ring-1 focus:ring-primary/30"
                            placeholder="为本活动补充慵懒细节..."
                          />
                        </div>

                        {/* Inline delete visual element */}
                        <button 
                          onClick={() => {
                            setEditDayActivities(prev => prev.filter((_,i) => i !== idx));
                            showToast("🗑️ 已安全剔除该高压日程。");
                          }}
                          className="p-1 px-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors self-center cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </div>

            </div>
          </div>
        ) : activeView === 'share_card' ? (
          /* ================= IMAGE 4 STYLE TWILIGHT DARK GORGEOUS SHARE CARD ================= */
          <div className="max-w-lg mx-auto py-6 space-y-8 text-center flex flex-col items-center">
            
            {/* Header prompt */}
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-primary uppercase tracking-widest font-sans inline-block bg-primary/10 px-3 py-1 rounded-full">
                ✨ 行程分享卡片
              </span>
              <h2 className="font-headline font-bold text-lg text-on-surface">您的海岛假期随时随地可共享</h2>
            </div>

            {/* Gorgeous Dark-Themes Digital Pass Card matching Image 4 identically */}
            <div 
              id="tripsy-twilight-pass"
              style={{
                background: 'linear-gradient(135deg, #091316 0%, #152d35 50%, #061113 100%)'
              }}
              className="w-full aspect-[4/5] rounded-[36px] overflow-hidden p-8 shadow-2xl relative border border-white/10 flex flex-col justify-between text-left group"
            >
              {/* Backlit Ambient Sunset Sunset Glow */}
              <div className="absolute top-1/4 right-0 w-48 h-48 bg-secondary/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute bottom-1/8 left-1/4 w-36 h-36 bg-tech/15 rounded-full blur-2xl" />

              {/* Top Row: Crest and Pill */}
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-md">
                    <Palmtree className="w-4.5 h-4.5 text-tech animate-pulse" />
                  </div>
                  <span className="font-headline font-black text-sm text-white tracking-widest uppercase">
                    憩旅尊享
                  </span>
                </div>

                <div className="bg-tech/12 border border-tech/40 text-tech px-3.5 py-1 rounded-full font-sans text-[10px] font-bold tracking-widest shadow-inner">
                  专属游线定制
                </div>
              </div>

              {/* Center Vibe Blurb */}
              <div className="relative z-10 my-4 space-y-2">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
                <p className="font-sans text-[10px] text-[#79f7ea] uppercase font-bold tracking-widest text-[#79f7ea]/80">意大利南部海岸线度假通关卡</p>
                <blockquote className="text-sm.5 italic text-white/90 leading-relaxed font-sans max-w-sm pl-4 border-l-2 border-[#79f7ea]/65">
                  “生活不在别处，而在那座开满粉红小花的崖畔。租一叶扁舟在湛蓝中游动，柠檬是这里长开不谢的太阳。”
                </blockquote>
              </div>

              {/* Footer Section: Title Metadatas (Left) + High Contrast QR Square (Right) */}
              <div className="flex justify-between items-end gap-4 relative z-10 border-t border-white/10 pt-5">
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-lg md:text-xl text-white tracking-normal leading-tight font-extrabold max-w-[240px]">
                    {activeTrip.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-white/70">
                    <span className="bg-white/5 border border-white/10 font-sans px-2.5 py-0.8 rounded">
                      📅 {activeTrip.dateRange}
                    </span>
                    <span className="bg-white/5 border border-white/15 px-2.5 py-0.8 rounded text-[#79f7ea]">
                      👤 双人慵懒至上
                    </span>
                  </div>
                </div>

                {/* Highly structured Simulated QR grid resembling Image 4 perfectly */}
                <div className="flex flex-col items-center gap-1 shrink-0 p-2.5 rounded-2xl bg-white text-slate-900 border border-white/10 shadow-lg relative overflow-hidden ring-4 ring-[#79f7ea]/20">
                  <QrCode className="w-11 h-11 text-slate-900" />
                  <span className="text-[8px] font-extrabold tracking-widest text-slate-800 font-sans uppercase">
                    扫码探索
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row to download / copy */}
            <div className="flex items-center space-x-2.5 w-full">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("📋 分享链接已成功同步到剪贴板！快发给你的老友吧！");
                }}
                className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>复制卡片链接</span>
              </button>
              <button 
                onClick={() => {
                  showToast("💾 专属卡片制作成功！高清 PNG 长图已保存到您的本地相册中。");
                }}
                className="flex-1 bg-primary hover:bg-primary/95 text-white font-sans text-xs font-bold py-3 rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>保存高清长图</span>
              </button>
            </div>

            <button
              onClick={() => {
                setActiveView('planner');
                showToast("已关注日程安排时间线。");
              }}
              className="text-secondary hover:text-secondary/80 font-sans text-xs font-black underline cursor-pointer mt-2"
            >
              返回我的漫游行程 (Planner)
            </button>
          </div>
        ) : (
          <>
            {/* Banner Header Section with Generous Spacing and wave picture overlay */}
            <header className="mb-10 relative">
              <div className="glass-panel rounded-3xl p-6 md:p-10 relative overflow-hidden border border-white">
                
                {/* Visual background image component with referendum metadata policy */}
                <div className="absolute right-0 top-0 w-full md:w-5/12 h-full opacity-10 md:opacity-30 pointer-events-none">
                  <img
                    src={EX_WAVE_IMAGE}
                    alt="Abstract gentle ocean waves rolling lazily onto pristine Amalfi coast sand shore."
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover md:rounded-r-3xl"
                  />
                </div>

                <div className="relative z-10 max-w-2xl text-left">
                  <div className="inline-flex items-center space-x-2 bg-[#bae6fd]/50 text-[#3d687c] px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold mb-4 border border-[#bae6fd]/80">
                    <Calendar className="w-3.5 h-3.5 text-primary-container fill-primary-container/10 animate-pulse" />
                    <span>{activeTrip.dateRange}</span>
                  </div>
                  <h1 className="font-headline font-bold text-3xl md:text-4.5xl text-on-surface tracking-tight mb-3">
                    {activeTrip.name}
                  </h1>
                  <p className="font-sans text-[13px] md:text-sm text-on-surface-variant leading-relaxed max-w-xl font-medium">
                    {activeTrip.description}
                  </p>
                  
                  <div className="mt-5 flex flex-wrap gap-2 text-xs">
                    <span className="bg-[#eff5f3] text-primary px-3.5 py-1.5 rounded-full font-bold border border-primary/15 shadow-sm">
                      📍 {activeTrip.destination}
                    </span>
                    <span className="bg-amber-50 text-amber-800 px-3.5 py-1.5 rounded-full font-bold border border-amber-200 shadow-sm flex items-center gap-1">
                      🐢 悠闲慢节奏 Pacing
                    </span>
                    <span className="bg-sky-50 text-sky-800 px-3.5 py-1.5 rounded-full font-bold border border-sky-150 shadow-sm">
                      ⛵ 慢旅路线定制
                    </span>
                  </div>
                </div>

                {/* Responsive Edit Day & Share Card entry links to prevent absolute overlap on mobile */}
                <div className="mt-6 flex flex-wrap gap-2 md:absolute md:right-6 md:bottom-6 md:mt-0 z-10">
                  <button 
                    onClick={() => openEditDayInterface(2)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-[#1a4231] rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm flex items-center space-x-1 cursor-pointer transition-all active:scale-95 hover:border-[#1a4231]/30"
                  >
                    <SettingsIcon className="w-3.5 h-3.5" />
                    <span>微调重排 Day 2 (Edit)</span>
                  </button>
                  <button 
                    onClick={() => {
                      setActiveView('share_card');
                      showToast("正在渲染高级行程海报...");
                    }}
                    className="bg-[#1a4231] hover:bg-[#123023] text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                    <span>分享这张卡片</span>
                  </button>
                </div>
              </div>
            </header>

            {/* Triple/Quad Switch Tab strip on Tablet/Mobile to allow viewing timeline vs chat vs hotels booked vs tips */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-8 w-full xl:hidden">
              <button
                onClick={() => {
                  setActiveView('planner');
                  setActiveTab('itinerary');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap px-1 ${
                  activeView === 'planner' && activeTab === 'itinerary' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                🗓️ 时间线 ({activeTrip.activities.length})
              </button>
              <button
                onClick={() => {
                  setActiveView('planner');
                  setActiveTab('chat');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap px-1 ${
                  activeView === 'planner' && activeTab === 'chat' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                💬 咨询
              </button>
              <button
                onClick={() => {
                  setActiveView('planner');
                  setActiveTab('hotels');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap px-1 ${
                  activeView === 'planner' && activeTab === 'hotels' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                🏨 慢居
              </button>
              <button
                onClick={() => {
                  setActiveView('planner');
                  setActiveTab('tips');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap px-1 ${
                  activeView === 'planner' && activeTab === 'tips' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                💡 防坑
              </button>
              <button
                onClick={() => {
                  setActiveView('planner');
                  setActiveTab('ledger');
                }}
                className={`flex-1 text-center py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap px-1 ${
                  activeView === 'planner' && activeTab === 'ledger' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                🪙 账记
              </button>
            </div>

            {/* Grid Sandbox Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Main workspace (always interactive daily itinerary) */}
              <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                
                <AnimatePresence mode="wait">
                  {activeTab === 'itinerary' && (
                    <motion.div
                      key="itinerary"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ItineraryTimeline
                        trip={activeTrip}
                        activeActivityId={activeActivityId}
                        onSelectActivity={(id) => {
                          setActiveActivityId(id);
                          // Autofocus map highlights inside viewport
                          const match = activeTrip.activities.find((a) => a.id === id);
                          if (match) {
                            setDayId(match.dayId);
                            showToast(`已为您对定位活动: "${match.title}"`);
                          }
                        }}
                        onUpdateTrip={(updatedTrip) => {
                          setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
                        }}
                        dayId={dayId}
                        setDayId={setDayId}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/40 rounded-2xl p-4 border border-dashed border-primary/20 text-xs text-left">
                        <p className="font-extrabold text-primary mb-1">💡 随心聊轻调提示</p>
                        <p className="text-on-surface-variant leading-relaxed font-semibold">
                          您可以在下方叙述或直接打出 <span className="font-mono text-primary font-bold">“让明天的日程更松弛一些”</span> 或 <span className="font-mono text-primary font-bold">“微调第三天日程”</span>，龟小旅会迅速为您微调时间轴！
                        </p>
                      </div>
                      <ChatTab
                        trip={activeTrip}
                        onUpdateTrip={(updatedTrip) => {
                          setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
                        }}
                        messages={messages}
                        setMessages={setMessages}
                        onAdjustDay3={handleOptimizeDay3}
                        setActiveTab={setActiveTab}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'hotels' && (
                    <motion.div
                      key="hotels"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <HotelAirbnbTab
                        trip={activeTrip}
                        showToast={showToast}
                        onPlotHotel={(coords, title, locName) => {
                          showToast(`📍 已在右侧地图标示慢宿: "${title}"`);
                          // We append or update a simulated stay activity to draw the beautiful connecting travel path!
                          const existsYn = activeTrip.activities.some(act => act.id === 'booked-stay');
                          if (!existsYn) {
                            const hotelActivity: Activity = {
                              id: 'booked-stay',
                              dayId: dayId,
                              time: '08:30 AM',
                              title: `🏨 【慢居】${title}`,
                              description: `极美高能静享庄园，位于: ${locName}。已一键确认支付锁房，免房客服务费。`,
                              type: 'hotel',
                              tags: ['我的慢居', '已同步航线'],
                              locationName: locName,
                              coordinates: coords
                            };
                            const updatedActivities = [...activeTrip.activities, hotelActivity];
                            setTrips(trips.map((t) => (t.id === activeTrip.id ? { ...t, activities: updatedActivities } : t)));
                          } else {
                            const updatedActivities = activeTrip.activities.map(act => {
                              if (act.id === 'booked-stay') {
                                return {
                                  ...act,
                                  title: `🏨 【慢居】${title}`,
                                  locationName: locName,
                                  coordinates: coords
                                };
                              }
                              return act;
                            });
                            setTrips(trips.map((t) => (t.id === activeTrip.id ? { ...t, activities: updatedActivities } : t)));
                          }
                          setActiveActivityId('booked-stay');
                        }}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'tips' && (
                    <motion.div
                      key="tips"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <QuickTipsTab />
                    </motion.div>
                  )}

                  {activeTab === 'ledger' && (
                    <motion.div
                      key="ledger"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <TravelLedger trip={activeTrip} showToast={showToast} />
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>

              {/* Persistent Side Maps & Supportive Chat widget column */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6 xl:sticky xl:top-24">
                
                {/* Visual Vector Interactive Map Layer */}
                <div className="h-[28rem] rounded-3xl overflow-hidden relative">
                  <MapPlaceholder
                    activities={activeTrip.activities}
                    activeActivityId={activeActivityId}
                    onSelectActivity={(id) => {
                      setActiveActivityId(id);
                      const act = activeTrip.activities.find((a) => a.id === id);
                      if (act) {
                        setDayId(act.dayId);
                      }
                    }}
                    dayId={dayId}
                  />
                </div>

                {/* AI Assistant Chat card widget (Shown alongside Itinerary for robust UX on desktop screens) */}
                <div className="hidden xl:block">
                  <ChatTab
                    trip={activeTrip}
                    onUpdateTrip={(updatedTrip) => {
                      setTrips(trips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
                    }}
                    messages={messages}
                    setMessages={setMessages}
                    onAdjustDay3={handleOptimizeDay3}
                    setActiveTab={setActiveTab}
                  />
                </div>

              </div>

            </div>
          </>
        )}
      </main>

      {/* ================= IMAGE 3 STYLE SAVED SUCCESS MODAL DIALOG OVERLAY ================= */}
      <AnimatePresence>
        {showSaveSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-[32px] max-w-lg w-full p-8 shadow-2xl relative border border-slate-100 text-center space-y-6"
            >
              {/* Green pulsing circle check icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-500 shadow-md animate-bounce">
                  <CheckCircle className="w-9 h-9 text-emerald-500" />
                </div>
              </div>

              {/* Success metadata descriptions */}
              <div className="space-y-2">
                <h3 className="font-headline font-bold text-xl md:text-2xl text-on-surface">
                  您的惬意假期计划已准备就绪！
                </h3>
                <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  所有行程已经稳妥保存至您的专属账户中。带上您的好奇心，准备开启无忧无虑的悠闲假期吧！ ☕🌊
                </p>
              </div>

              {/* Nested informational subcard */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 flex gap-4 text-left items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 bg-slate-100">
                  <img src={EX_POSITANO_IMAGE} alt="Positano ocean waves view" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-headline font-bold text-xs.5 text-on-surface leading-snug">{activeTrip.name}</h4>
                  <p className="font-sans text-[11px] text-slate-500 font-semibold mt-1">地理目的地：{activeTrip.destination}</p>
                  <p className="font-sans text-[11px] text-primary font-bold mt-0.5">日期：{activeTrip.dateRange} • 共计 {activeTrip.daysCount} 天</p>
                </div>
              </div>

              {/* Primary Dialog Command buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button 
                  onClick={() => {
                    setShowSaveSuccess(false);
                    setActiveView('planner');
                    setActiveTab('itinerary');
                    showToast("进入分时日历。");
                  }}
                  className="flex-1 bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container font-sans text-xs font-black py-3.5 rounded-xl cursor-pointer shadow-md active:scale-95 transition-all text-center"
                >
                  查看我的日程表 (Planner)
                </button>
                <button 
                  onClick={() => {
                    setShowSaveSuccess(false);
                    setActiveView('share_card');
                    showToast("正在渲染精美高级长图海报...");
                  }}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-sans text-xs font-bold py-3.5 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5"
                >
                  <Share2 className="w-4 h-4 text-primary" />
                  <span>与好友分享 (Share Card)</span>
                </button>
              </div>

              {/* Optional footer hyperlink */}
              <div>
                <button 
                  onClick={() => {
                    setShowSaveSuccess(false);
                    setActiveView('explore');
                  }}
                  className="font-sans text-[11.5px] text-slate-400 hover:text-primary underline cursor-pointer inline-block"
                >
                  返回计划主板区 (Home)
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 grid grid-cols-3 gap-2 px-2 pb-5 pt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-outline-variant/20 shadow-lg">
        <button 
          onClick={() => {
            setActiveView('explore');
            showToast("正在前往探索发现...");
          }}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 py-1 ${
            activeView === 'explore' ? 'text-primary font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px] font-sans tracking-tight">探索</span>
        </button>

        <button 
          onClick={() => {
            setActiveView('planner');
            showToast("正在打开行程助手 龟小旅...");
          }}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 py-1 ${
            activeView === 'planner' ? 'text-primary font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px] font-sans tracking-tight">龟小旅</span>
        </button>

        <button 
          onClick={() => {
            setActiveView('profile');
            showToast("正在前往慢游个人主页...");
          }}
          className={`flex flex-col items-center justify-center transition-all active:scale-90 py-1 ${
            activeView === 'profile' ? 'text-primary font-bold' : 'text-slate-500 font-medium'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10.5px] font-sans tracking-tight">我的</span>
        </button>
      </nav>

    </div>
  );
}
