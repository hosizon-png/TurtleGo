import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  Award, 
  Utensils, 
  Activity as RelaxIcon, 
  Plus, 
  Heart, 
  Clock, 
  Bookmark, 
  User, 
  Camera, 
  Edit3, 
  Check, 
  X,
  CreditCard,
  Settings,
  HelpCircle,
  TrendingUp,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Trip } from '../types';
import MascotTurtle from './MascotTurtle';

interface MyProfileProps {
  onSwitchToTrip: (tripId: string) => void;
  onAddTrip: (newTrip: Trip) => void;
  showToast: (text: string) => void;
  userName?: string;
  onRetakeTest?: () => void;
}

export const ALL_TAGS = [
  { id: 'blue', label: '🌊 山海避世家', badge: '山海避世家', desc: '向往水色、碧波与离岛徐行，寻找最避匿温润的亲水角落（重度蓝色依赖）' },
  { id: 'anti_hustle', label: '🐢 慵懒大宗师', badge: '慵懒大宗师', desc: '坚拒走马观花踩点的拉练式速游，狂热于睡到自然醒和大量日程留白（特种兵绝缘体）' },
  { id: 'heritage', label: '🏺 非遗文化客', badge: '非遗文化客', desc: '钟情于非遗早茶、瓷艺历史和窄巷深处的老宅故事（人文底蕴追寻者）' },
  { id: 'cafe', label: '🍷 美酒与庄园', badge: '美酒与庄园', desc: '偏爱流连于暮色低吟的湖畔酒馆和暖调黑胶唱片咖啡馆（小憩探店大宗师）' },
  { id: 'wild', label: '🏔️ 山野寻林客', badge: '山野寻林客', desc: '用脚掌丈量山川秘境，在没有噪音的山野宿营中聆听晨钟（山林吸氧隐逸客）' },
  { id: 'foodie', label: '🍲 风味本真客', badge: '风味本真客', desc: '执迷寻访百年老店、市井风味和阿妈手作的风物饕餮（舌尖寻味家）' }
];

export default function MyProfile({
  onSwitchToTrip,
  onAddTrip,
  showToast,
  userName,
  onRetakeTest,
}: MyProfileProps) {
  // Local profile states
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('manman_user_name') || userName || '慵懒避世客';
  });

  const [profileBio, setProfileBio] = useState(() => {
    return localStorage.getItem('manman_profile_bio') || '“🐢 慵懒界至高无上大宗师：绝对拒绝大运动、拒绝走马拉松式旅游、狂热极简空白行程的放空隐者。”';
  });

  const [profileAvatar, setProfileAvatar] = useState(() => {
    return localStorage.getItem('manman_user_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlP9IXELBiNNd4SnBqGLXZOSEgPo_WOpjaH44-YlhdW1ah8ouDp60J77WRhdr1L2TkO8_z2316Kr-fSQTp64KYKh2ADV_e_CSS9TIa2LQJSC76Exvv2fzbWsOqVczKdvEL57l_kp_dtcIQYawOcOkdGJ4JaVXDZ6URIpeQV8wn__nE5oou7emps7bBuGlwHcZvOdUs0FbTSQyDx1-ih08O2c5aWgooITEO2WRrJhKYd0aFDGJWiDf54TMEFYFvoZLGoKBsjBvmeNw';
  });
  
  // Drag and Drop uploader state
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast("❌ 请选择有效的图片文件噢！");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      showToast("❌ 外观照片过大，请选择 1.5MB 以内的图片！");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatar(event.target.result as string);
        showToast("✨ 自定义人像上传解析成功！");
      }
    };
    reader.readAsDataURL(file);
  };

  // Tag preference states
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('manman_labels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return ['blue', 'anti_hustle', 'heritage', 'cafe'];
  });
  
  // Dialog controllers
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  
  // Form input bindings
  const [editName, setEditName] = useState(profileName);
  const [editBio, setEditBio] = useState(profileBio);
  const [editAvatar, setEditAvatar] = useState(profileAvatar);
  const [editTagIds, setEditTagIds] = useState<string[]>(selectedTagIds);

  // Sync editing initial values when modal opens
  React.useEffect(() => {
    if (showEditModal) {
      setEditName(profileName);
      setEditBio(profileBio);
      setEditAvatar(profileAvatar);
      setEditTagIds(selectedTagIds);
    }
  }, [showEditModal, profileName, profileBio, profileAvatar, selectedTagIds]);
  
  const [newTripName, setNewTripName] = useState('');
  const [newTripDest, setNewTripDest] = useState('');
  const [newTripDays, setNewTripDays] = useState(3);
  const [newTripDesc, setNewTripDesc] = useState('');

  // Apply profile alterations
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileName(editName);
    setProfileBio(editBio);
    setProfileAvatar(editAvatar);
    setSelectedTagIds(editTagIds);
    
    // Save to localStorage
    localStorage.setItem('manman_user_name', editName);
    localStorage.setItem('manman_profile_bio', editBio);
    localStorage.setItem('manman_user_avatar', editAvatar);
    localStorage.setItem('manman_labels', JSON.stringify(editTagIds));
    
    setShowEditModal(false);
    showToast("个人档案信息与慢选个人标签已同步成功！🌊");
  };

  // Create new active trip from Profile screen
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTripName.trim() || !newTripDest.trim()) return;

    const newTrip: Trip = {
      id: 'custom-' + Date.now(),
      name: newTripName,
      dateRange: `9月${10 + Math.floor(Math.random() * 10)}日 - 9月${15 + Math.floor(Math.random() * 10)}日`,
      destination: newTripDest,
      description: newTripDesc || "慢节奏的休闲自在行企划。",
      daysCount: Number(newTripDays) || 3,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQs7t16uWzkBYewBtx678HSMz2Dr5HnegDZ5y4OUbUyTHNE3u9YzN6tGzHLw23byjO_9Bzf2sU5vPuPRuci9jWhVCxnpaTDgDKHtJRr85TUfvyhKxyZ4SlMfIn3a7FKxsXRwHkVc5LZ47rt4UY4_qAPKKWfIqdWZU2tQcguQHMw2WlL357LpUnAxrMtSqZqht06E860Ww3XZMsrTYrtHDPJJcuqEuzPb1lN_WqA1lBMuwLdo95AKklZgjPbFrKqSa_gCaLrn12X6I',
      activities: []
    };

    onAddTrip(newTrip);
    setShowNewTripModal(false);
    setNewTripName('');
    setNewTripDest('');
    setNewTripDesc('');
    showToast(`新旅行 "${newTripName}" 已初始化完毕，准备设计时间表！`);
    onSwitchToTrip(newTrip.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6 pb-20 flex flex-col gap-10 text-left">
      
      {/* 1. Profile header with Avatar, Bio and Badges */}
      <section className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        
        {/* Avatar Container block */}
        <div className="relative shrink-0 group">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/85 shadow-md bg-white/30 p-1 relative">
            <img 
              className="w-full h-full object-cover rounded-full" 
              src={profileAvatar} 
              alt="Lazy Wanderer portrait photograph" 
              referrerPolicy="no-referrer"
            />
            {/* Edit overlay on hover */}
            <button 
              onClick={() => {
                setEditName(profileName);
                setEditBio(profileBio);
                setEditAvatar(profileAvatar);
                setEditTagIds(selectedTagIds);
                setShowEditModal(true);
              }}
              className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full cursor-pointer"
            >
              <Camera className="w-5 h-5 text-primary-container" />
            </button>
          </div>
          {/* Pro badge sticker */}
          <div className="absolute bottom-0 right-2 bg-primary text-white font-sans text-[10px] font-bold px-3 py-1 rounded-full shadow-md border-2 border-white tracking-widest">
            高星
          </div>
        </div>

        {/* Info detail paragraph & active tags */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3.5 flex-1">
          <div>
            <div className="flex items-center gap-2.5 justify-center md:justify-start">
              <h1 className="font-headline font-bold text-2xl md:text-3xl text-on-surface">
                {profileName}
              </h1>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                12 级慢活大玩家
              </span>
            </div>
            <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-lg mt-2 italic leading-relaxed font-medium">
              {profileBio}
            </p>
          </div>

          {/* Render Badges cloud dynamically connected to tags */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1">
            {selectedTagIds.map(tagId => {
              const tag = ALL_TAGS.find(t => t.id === tagId);
              if (!tag) return null;
              return (
                <div key={tagId} className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 bg-white/60 backdrop-blur-md rounded-full shadow-sm text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors hover:scale-[1.02] transition-transform duration-200" title={tag.desc}>
                  <span>{tag.label}</span>
                </div>
              );
            })}
            {selectedTagIds.length === 0 && (
              <span className="text-xs text-slate-400 italic font-medium">点击编辑档案设置旅行性格标签</span>
            )}
          </div>
        </div>
      </section>

      {/* 2. Glassmorphic Tonal Stats Grid */}
      <section className="grid grid-cols-3 gap-3 md:gap-6 relative z-10">
        <div className="glass-panel rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5 duration-300">
          <span className="font-headline font-bold text-2xl md:text-3xl text-primary mb-1">12</span>
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-500">
            足迹国家
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5 duration-300">
          <span className="font-headline font-bold text-2xl md:text-3xl text-primary mb-1">148</span>
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-500">
            慢行天数
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-0.5 duration-300">
          <span className="font-headline font-bold text-2xl md:text-3xl text-primary mb-1">42</span>
          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-slate-500">
            避坑节省(小时)
          </span>
        </div>
      </section>

      {/* 3. Horizontal Travel Itinerary Cards */}
      <section className="relative z-10">
        <div className="flex justify-between items-end mb-4">
          <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">
            我的慢行足迹
          </h2>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest font-sans">
            横向滑动 ⇆
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-primary/10">
          
          {/* Amalfi Coast (Interactive Switch) */}
          <div 
            onClick={() => onSwitchToTrip('amalfi-5day')}
            className="group relative w-64 shrink-0 snap-start rounded-2xl overflow-hidden shadow-sm bg-slate-100 aspect-[4/5] cursor-pointer border border-[#bae6fd]"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG9F7dTV9tyGNjLUQWAUwfWPdJ2llLGI1CZE3d6Sro6vDUznFSvyoe1GvbRXvMw7q9lu9n4CErOLgBweX_oGKT-NVPVHcDQn2KJJ0Vh-SwBmibf00530aM-LPxwa87oy5yQ8NPJ5JHy5zIwEOJc4JOFiLQy7cVSvZsAZM99FvBXD4m8sHy2F6UN0PGwxfT_eruwmh1gUaO2K1r1Yt9JR7ZxfcUitEsAz2PdbE2d6izt1X_iBcLFINlOoBB1_UVl-bVJu-CWyHSCrk" 
              alt="Positano ocean waves" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="bg-primary text-white font-sans text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Clock className="w-2.5 h-2.5" />
                <span>当前行程</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-headline font-bold text-white text-base leading-tight mb-1">
                大理双廊惬意 5 日漫游
              </h3>
              <p className="font-sans text-[10px] text-white/70 line-clamp-1">
                云南大理洱海 5 日悠闲漫步
              </p>
            </div>
          </div>

          {/* Kyoto Serenity Card */}
          <div 
            onClick={() => {
              showToast("京都探店策划正在由 AI 编辑中，随时可以启动！");
            }}
            className="group relative w-64 shrink-0 snap-start rounded-2xl overflow-hidden shadow-sm bg-slate-100 aspect-[4/5] cursor-pointer border border-transparent"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyw06MfjuXxHKnn84wCbU6GepGR5jVoP0VH3Joh-fuYhfsUPSBTX_LyRTK8hkKVgEXohYe-63YpMPySwhqjA04r-rivIjYzvRIxS8ZgWZCbiHBLrU4rYgdBVZhEExljRq0h9KEIxigYTZOEGokPkP3iBuTb7HbjpcML0B6FUGb_Gjbu7utV8zCWZDSg-oE8CZAKZ53S1Gk8MF9BKZ2P3O0Z4B155DHHeK2_gPhDsUcTAKd1CSqFXkCUj1Xn9BejK27PdJP3lKLBbQ" 
              alt="Kyoto" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-sans text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                <Clock className="w-2.5 h-2.5" />
                <span>备选避世 · 12 日</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="font-headline font-bold text-white text-base leading-tight mb-1">
                京都深秋古泉居
              </h3>
              <p className="font-sans text-[10px] text-white/70 line-clamp-1">
                红枫林与晨钟、抹茶茶禅与散步
              </p>
            </div>
          </div>

          {/* Bali Escapes Card */}
          <div 
            onClick={() => {
              showToast("巴厘岛离岛慵懒日程正在缓存。");
            }}
            className="group relative w-64 shrink-0 snap-start rounded-2xl overflow-hidden shadow-sm bg-slate-100 aspect-[4/5] cursor-pointer border border-transparent"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfclkh77OjPX9zXb5q9onctXfIObTqchERn_ubWMc83ONwK3M81t1CarDqJP7DPbbinn_I2apSizSdHUNx3Qm0u4e4SDXvoct-_ZrUeEM9esAGMM-v4RTlX3MiwD27cAw_qPM7BUDL8cWNC0G1TvHCLocZ_0S9tRirVgyLPybwgnzeyYaJ3wQdH8qwdt-RXoZ3tVjFHBTmbvGfBifIDBW9ISgRee9lPPGerOjg0NraRlkrcg5prDUMuuOYKDjFzqRRD6n378ynJAU" 
              alt="Bali" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute top-3 right-3">
              <div className="bg-white/25 backdrop-blur-md text-white p-1.5 rounded-full shadow-sm">
                <Bookmark className="w-3.5 h-3.5 fill-white" />
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <span className="bg-white/20 backdrop-blur-md text-white font-sans text-[9px] px-2 py-0.5 rounded inline-block mb-1.5 font-semibold">
                灵感收藏
              </span>
              <h3 className="font-headline font-bold text-white text-base leading-tight mb-1">
                巴厘离岸乌布躺
              </h3>
              <p className="font-sans text-[10px] text-white/70 line-clamp-1">
                稻野微风、椰影吊床与无所事事
              </p>
            </div>
          </div>

          {/* Create New Itinerary dashed placeholder button */}
          <div 
            onClick={() => setShowNewTripModal(true)}
            className="w-64 shrink-0 snap-start rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/50 bg-white/20 backdrop-blur-sm aspect-[4/5] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/35 transition-all duration-200 text-center p-6 group"
          >
            <div className="w-11 h-11 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5px]" />
            </div>
            <div>
              <span className="font-headline font-bold text-sm text-slate-700 block">从零设计游记</span>
              <span className="font-sans text-[10px] text-slate-400 mt-1 block max-w-[160px] mx-auto leading-relaxed">
                在我们的自研慢活沙盒中，企划一份独创行程
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. AI Travel Insights */}
      <section className="relative z-10">
        <div className="glass-panel rounded-3xl p-5 md:p-7 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-container/15 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <h2 className="font-headline font-bold text-base md:text-lg text-on-surface">
                旅行性格画像与偏好解析
              </h2>
            </div>
            
            <div className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed space-y-2 bg-[#f5fbf8] dark:bg-emerald-950/20 p-4 rounded-2xl border border-[#4fd1c5]/15 mt-3">
              <span className="font-bold text-primary block text-sm">💡 AI 实时画像演算结果：</span>
              <p>
                {selectedTagIds.length === 0 ? (
                  "您暂未在档案设置中勾选任何性格标签。AI 正在等候您的指令，请点击下方的『编辑个人档案资料』勾选您向往的慢生活习惯，以激活动态画像计算服务！"
                ) : (
                  <span>
                    您是一位深度崇尚心灵松弛的漫游旅行者。结合您的标签选择，您的当前画像特征为：
                    <strong className="text-[#1a4231] font-bold">
                      {selectedTagIds.map((tagId, index) => {
                        const tag = ALL_TAGS.find(t => t.id === tagId);
                        if (!tag) return "";
                        return `【${tag.label.slice(2)}】`;
                      }).join(' & ')}
                    </strong>。
                    本港主推 AI 龟小旅已完全读取您的偏好：
                    <span>
                      {selectedTagIds.includes('blue') && " 🌊我们将为您的旅途优先锁定海风低吟、亲近水色、能看潮起潮落的绝美避世观景点；"}
                      {selectedTagIds.includes('anti_hustle') && " 🐢坚决避免特种兵走马观花式的速游路线，每天最多给您安排 2 处休闲点并留白至少 50% 自由时光；"}
                      {selectedTagIds.includes('heritage') && " 🏺我们将深度为您编排极具本地底蕴的瓷艺工坊研学、非遗早茶和古建秘境，保证人文养分；"}
                      {selectedTagIds.includes('cafe') && " ☕贴心标注沿途静谧湖畔、备有唱片机的暖调小众餐咖啡馆，支持说憩就憩；"}
                      {selectedTagIds.includes('wild') && " 🏔️避开人声鼎沸、优先将路线延伸至山野林涛与洗氧古寺，聆听晨钟暮鼓；"}
                      {selectedTagIds.includes('foodie') && " 🍲将街角胡同不显山不露水的百年老店及本港地道烟火味道无缝嵌进日程；"}
                    </span>
                    点击下方的主推路线即可立即展开为您量身适配的心灵度假行程。
                  </span>
                )}
              </p>
            </div>

            {/* Custom high-contrast profile tags dynamically generated based on selection */}
            <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
              {selectedTagIds.map(tagId => {
                const tag = ALL_TAGS.find(t => t.id === tagId);
                if (!tag) return null;
                return (
                  <span key={tagId} className="bg-primary/20 border border-primary/25 text-[#1b4d00] font-sans text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm hover:scale-[1.02] transition-transform duration-200" title={tag.desc}>
                    {tag.label}
                  </span>
                );
              })}
              {selectedTagIds.length === 0 && (
                <span className="text-xs text-slate-400 italic">您暂未勾选任何性格标签，请打开编辑档案挑选以实现画像关联！🎯</span>
              )}
            </div>

            {/* HIGHLY PROMINENT DUOLINGO-STYLE TEST PORTAL TRIGGER */}
            {onRetakeTest && (
              <div className="bg-[#ddf4ff] border-2 border-[#1cb0f6] border-b-6 rounded-2xl p-4.5 mb-6 flex flex-col sm:flex-row items-center gap-4 transition-all hover:brightness-102">
                <div className="w-12 h-12 bg-white border border-slate-150 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm shrink-0 anim-float-mascot pb-1">
                  <MascotTurtle pose="avatar" size={40} />
                </div>
                <div className="flex-1 text-left">
                  <span className="bg-[#1cb0f6] text-white text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md inline-block mb-1">
                    慢慢 趣味诊断 🐢
                  </span>
                  <h4 className="font-headline font-black text-sm text-[#0079b0] tracking-wide">
                    {selectedTagIds.length === 0 ? "尚未激活您的慢旅行性格？" : "慢慢个性化避世指南已就绪！"}
                  </h4>
                  <p className="font-sans text-[11px] text-[#0079b0]/85 font-semibold mt-0.5 leading-relaxed">
                    绿龟慢慢为您带来多邻国关卡式趣味测试！只需 2 分钟，即可妙测出您深藏底层的慢行习惯与避世头衔。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onRetakeTest}
                  className="w-full sm:w-auto px-6 py-3 bg-[#4ca614] text-white border-b-4 border-[#3c850f] rounded-xl font-extrabold text-[12px] uppercase tracking-wider hover:brightness-105 active:border-b-0 active:translate-y-[4px] transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
                >
                  <span>{selectedTagIds.length === 0 ? "进入测试" : "重新评估性格画像"}</span>
                  <span className="text-[14px]">⚡</span>
                </button>
              </div>
            )}

            {/* Next travel suggestion block */}
            <div className="bg-white/30 border border-[#a2d6b2]/15 backdrop-blur-xl rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-headline font-bold text-[13px] md:text-sm text-on-surface mb-0.5">
                    龟小旅新主推秘境：大理双廊惬意 5 日漫游
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-lg">
                    您对温煦苍山湖风、白族手工体验和完全空白的惬意下午茶有重度向往，大理洱海正是绝妙去处。已为您量身定制好完整的 5 日慢逸旅途。
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => onSwitchToTrip('amalfi-5day')}
                className="bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-sm shrink-0 w-full md:w-auto cursor-pointer"
              >
                立即开始慢游 (Itinerary)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Miscellaneous profile settings & switch to Pro */}
      <section className="glass-panel rounded-3xl overflow-hidden shadow-sm divide-y divide-[#1a4231]/10 relative z-10">
        {onRetakeTest && (
          <button 
            onClick={onRetakeTest}
            className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-[#effbe7]/45 transition-colors group text-left cursor-pointer border-none bg-transparent"
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-[#effbe7] flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-4.5 h-4.5 text-primary shrink-0" />
              </div>
              <div>
                <span className="font-sans text-xs md:text-sm font-extrabold text-[#46a302] block">
                  与绿龟慢慢重新评测旅行性格偏好
                </span>
                <span className="text-[10px] text-slate-400 block font-normal mt-0.5">
                  重置趣味测验，开启多邻国关卡式多维评价，解锁新避世徽章 🌅
                </span>
              </div>
            </div>
            <ChevronRight className="w-4.5 h-4.5 text-primary group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        <button 
          onClick={() => {
            setEditName(profileName);
            setEditBio(profileBio);
            setEditAvatar(profileAvatar);
            setEditTagIds(selectedTagIds);
            setShowEditModal(true);
          }}
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/40 transition-colors group text-left cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Edit3 className="w-4 h-4" />
            </div>
            <span className="font-sans text-xs md:text-sm font-semibold text-slate-700">
              编辑个人档案资料 (Profile Edit)
            </span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => showToast("账号设置与您的谷歌安全网关深度契合绑定。")}
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/40 transition-colors group text-left cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-sans text-xs md:text-sm font-semibold text-slate-700">
              设备与首选项控制 (Account Settings)
            </span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-slate-400 group-hover:text-primary transition-colors" />
        </button>

        <button 
          onClick={() => {
            showToast("✨ 恭喜！您已成功开通 憩旅 PRO尊享 永久特权，省心慢行无极限！");
          }}
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-primary/5 transition-colors group text-left cursor-pointer border-none bg-transparent"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Award className="w-4.5 h-4.5" />
            </div>
            <span className="font-sans text-xs md:text-sm font-extrabold text-primary">
              您当前是 Pro 尊享玩家 (Ultra Lounge Privileges Active)
            </span>
          </div>
          <ChevronRight className="w-4.5 h-4.5 text-primary animate-bounce" />
        </button>
      </section>

      {/* 6. Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="font-headline font-bold text-base text-on-surface">更新个人档案资料</h3>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="p-1 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                    尊号 / 旅行名
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                    慢度宣言 / 简述
                  </label>
                  <textarea 
                    rows={3}
                    required
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-2 text-left">
                    个性化避世头像 (Preset & Upload)
                  </label>
                  
                  {/* Current Avatar & File Upload Choice */}
                  <div className="flex items-center gap-4 mb-3.5">
                    <img 
                      src={editAvatar} 
                      alt="Current select" 
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1 text-left">
                      <p className="text-[10px] text-slate-400 leading-tight mb-1">
                        自定义本地图片 (支持拖拽或选择，1.5MB以内)
                      </p>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/65 hover:bg-primary-container text-on-primary-container border border-primary/30 rounded-lg text-[10px] font-black cursor-pointer transition-colors shadow-sm">
                        <Upload className="w-3 h-3" />
                        <span>上传本地人像</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-3 text-center transition-all ${
                      dragOver 
                        ? 'border-primary bg-primary/5 scale-[0.99]' 
                        : 'border-slate-200 bg-[#f5fbf8] hover:border-slate-300'
                    }`}
                  >
                    <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      <span>{dragOver ? "松开鼠标即可载入..." : "拖拽本地人像图片至此虚线框内"}</span>
                    </p>
                  </div>

                  {/* Preset Avatar Selection Grid */}
                  <div className="mt-3.5">
                    <p className="text-[10px] text-slate-400 font-bold mb-2 text-left">
                      从预设避世艺术家头像中挑选：
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { name: 'Husky', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=120&h=120' },
                        { name: 'Panda', url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&q=80&w=120&h=120' },
                        { name: 'Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=120&h=120' },
                        { name: 'Fox', url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&q=80&w=120&h=120' },
                        { name: 'Bunny', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&q=80&w=120&h=120' },
                        { name: 'Otter', url: 'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&q=80&w=120&h=120' }
                      ].map((preset, pIdx) => {
                        const isPresetSelected = editAvatar === preset.url;
                        return (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setEditAvatar(preset.url)}
                            className={`w-9.5 h-9.5 rounded-full p-0.5 border-2 transition-all overflow-hidden cursor-pointer hover:scale-105 active:scale-95 ${
                              isPresetSelected 
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.name} 
                              className="w-full h-full object-cover rounded-full" 
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-[9px] uppercase font-black tracking-wider text-slate-400 mb-1 text-left">
                      头像图片直连 URL（亦可直接粘贴）
                    </label>
                    <input 
                      type="text" 
                      required
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full bg-[#f5fbf8] px-3.5 py-1.8 rounded-xl text-[11px] font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-2 text-left">
                    慢行性格与个人标签 (Personal Tags)
                  </label>
                  <p className="text-[10px] text-slate-400 mb-2 leading-tight">
                    选择您的旅行标签，这些特征将深度联动生成您的避世徽章、旅行性格与龟小旅主推策划：
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {ALL_TAGS.map(tag => {
                      const isSelected = editTagIds.includes(tag.id);
                      return (
                        <div 
                          key={tag.id}
                          onClick={() => {
                            if (isSelected) {
                              setEditTagIds(editTagIds.filter(id => id !== tag.id));
                            } else {
                              setEditTagIds([...editTagIds, tag.id]);
                            }
                          }}
                          className={`flex items-center gap-1.5 p-2 rounded-xl border text-left cursor-pointer transition-all select-none ${
                            isSelected 
                              ? 'bg-primary/10 border-primary/30 text-primary font-bold' 
                              : 'bg-[#f5fbf8] border-slate-100 hover:bg-slate-50 text-slate-500'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all shrink-0 ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[2.5px]" />}
                          </div>
                          <span className="text-[10px] leading-tight select-none truncate">{tag.label.slice(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-xs font-bold font-sans text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    取消 Keep
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-primary-container/10 cursor-pointer"
                  >
                    保存资料 (Save)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Create New Trip Modal */}
      <AnimatePresence>
        {showNewTripModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <h3 className="font-headline font-bold text-base text-on-surface">全新开启慢调企划</h3>
                <button 
                  onClick={() => setShowNewTripModal(false)}
                  className="p-1 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTrip} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                    行程主题名称 (Itinerary Title)
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newTripName}
                    onChange={(e) => setNewTripName(e.target.value)}
                    placeholder="例如：苏莲托柠檬甜酒与落木小憩"
                    className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                      旅行目的地
                    </label>
                    <input 
                      type="text" 
                      required
                      value={newTripDest}
                      onChange={(e) => setNewTripDest(e.target.value)}
                      placeholder="如：意大利 Sorrento"
                      className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                      游玩总天数
                    </label>
                    <input 
                      type="number" 
                      min={1}
                      max={14}
                      required
                      value={newTripDays}
                      onChange={(e) => setNewTripDays(Number(e.target.value))}
                      className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 font-sans mb-1 text-left">
                    给旅伴与 AI 小慢的画外音 / 微妙主调 (Vibe Notes)
                  </label>
                  <textarea 
                    rows={3}
                    value={newTripDesc}
                    onChange={(e) => setNewTripDesc(e.target.value)}
                    placeholder="描述你期盼的风格（如：大段的睡懒觉时间、漫无目的的沙滩发呆、想尝尝不正宗的海鲜面、绝对不赶景点...）"
                    className="w-full bg-[#f5fbf8] px-3.5 py-2.5 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/45 resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewTripModal(false)}
                    className="px-4 py-2 text-xs font-bold font-sans text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    取消取消
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-md shadow-primary-container/10 cursor-pointer"
                  >
                    立案并开启编辑 (Create)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
