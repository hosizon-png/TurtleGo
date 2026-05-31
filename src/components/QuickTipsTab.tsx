import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bus, 
  Anchor, 
  ChefHat, 
  Coins, 
  Shirt, 
  Search,
  Compass,
  Sunset
} from 'lucide-react';
import { QuickTip } from '../types';
import { QUICK_TIPS } from '../data/defaultData';

export default function QuickTipsTab() {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const getTipIcon = (icon: string) => {
    switch (icon) {
      case 'bus':
        return <Bus className="w-5 h-5 text-indigo-600" />;
      case 'anchor':
        return <Anchor className="w-5 h-5 text-blue-600" />;
      case 'chef-hat':
        return <ChefHat className="w-5 h-5 text-amber-600" />;
      case 'coins':
        return <Coins className="w-5 h-5 text-emerald-600" />;
      case 'shirt':
        return <Shirt className="w-5 h-5 text-rose-600" />;
      default:
        return <Compass className="w-5 h-5 text-primary" />;
    }
  };

  const categories = ['全部', '避热绝密', '交通防挤', '地道美食', '金钱与雇佣', '行囊穿搭'];

  const getCategoryEnglishKey = (chineseCat: string) => {
    switch(chineseCat) {
      case '避热绝密': return 'Local secrets';
      case '交通防挤': return 'Transport';
      case '地道美食': return 'Food &';
      case '金钱与雇佣': return 'Budget';
      case '行囊穿搭': return 'Packing';
      default: return 'All';
    }
  };

  const filteredTips = QUICK_TIPS.filter((tip) => {
    const engKey = getCategoryEnglishKey(activeCategory);
    const matchesCategory = engKey === 'All' || tip.category.toLowerCase().includes(engKey.toLowerCase().slice(0, 4));
    
    const matchesSearch = 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryChineseLabel = (engCat: string) => {
    switch(engCat) {
      case 'Local secrets': return '避热绝密';
      case 'Transport': return '交通防挤';
      case 'Food &': return '地道美食';
      case 'Budget': return '金钱与雇佣';
      case 'Packing': return '行囊穿搭';
      default: return engCat;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜罗本港资深慢游生存指南..."
            className="w-full bg-white/45 backdrop-blur-md px-9 py-2.5 rounded-full text-xs font-semibold text-[#10251c] border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-left"
          />
        </div>

        {/* Filters Row */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-sans whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white/40 backdrop-blur-md hover:bg-[#1a4231]/10 text-on-surface-variant border border-primary/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTips.map((tip) => (
          <motion.div
            layout
            key={tip.id}
            className="glass-panel p-5 rounded-3xl transition-all flex items-start gap-4 text-left hover:scale-[1.01]"
          >
            {/* Round Icon box based on category */}
            <div className="w-11 h-11 rounded-full bg-white/35 backdrop-blur-md flex items-center justify-center shrink-0 border border-primary/10">
              {getTipIcon(tip.icon)}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] uppercase font-extrabold font-sans">
                  {getCategoryChineseLabel(tip.category)}
                </span>
                <span className="text-[10px] text-secondary font-extrabold flex items-center gap-0.5">
                  <Sunset className="w-3 h-3 animate-pulse" /> 慢生活忠告
                </span>
              </div>
              <h4 className="font-headline font-bold text-sm text-on-surface">
                {tip.title}
              </h4>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {tip.content}
              </p>
            </div>
          </motion.div>
        ))}

        {filteredTips.length === 0 && (
          <div className="md:col-span-2 py-12 text-center text-slate-400">
            <Compass className="w-8 h-8 mx-auto mb-2.5 animate-spin-slow opacity-60 text-primary" />
            <p className="text-xs font-semibold">未搜罗到符合条件的慢游信条。</p>
            <p className="text-[11px] text-slate-400 mt-0.5">可以尝试搜索 “柠檬”、“渡轮”、“巴士” 或 “现金” 看看。</p>
          </div>
        )}
      </div>

      {/* Interactive CTA bottom card */}
      <div className="p-5 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="space-y-1 text-center md:text-left flex-1">
          <p className="text-xs font-extrabold text-on-primary-container flex items-center justify-center md:justify-start gap-1">
            ✨ 本地金牌规划师 龟小旅 诚挚献言
          </p>
          <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-lg">
            “请不要试图把您宝贵的假期塞得滴水不漏。苍山洱海的极致魔力在于体会那种无拘无束、悠游自在的纯正质感，去喜洲老槐树旁坐下喝茶，或者躺在双廊湖畔客栈晒太阳，享用一下午没有电话、无人催促的温存时光。”
          </p>
        </div>
        <button 
          onClick={() => {
            if (window.parent) {
              window.parent.postMessage({ type: 'toast', message: "已在聊天页开通大理非遗体验与野生菌火锅推荐板块！" }, '*');
            }
          }}
          className="bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 transition-transform hover:scale-[1.02] shadow-sm select-none cursor-pointer"
        >
          帮我安排松弛午后
        </button>
      </div>
    </div>
  );
}
