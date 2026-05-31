import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  Star, 
  Leaf, 
  ArrowRight, 
  Palmtree, 
  HelpCircle,
  Clock,
  Navigation,
  CheckCircle,
  Loader
} from 'lucide-react';
import { Trip } from '../types';

interface ExploreHomeProps {
  onSelectTrip: (tripId: string) => void;
  onAddTrip: (newTrip: Trip) => void;
  showToast: (msg: string) => void;
}

export default function ExploreHome({ onSelectTrip, onAddTrip, showToast }: ExploreHomeProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const cardRef1 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: cardRef1,
    offset: ["start end", "end start"]
  });
  const y1 = useTransform(scrollYProgress1, [0, 1], ["-6%", "6%"]);

  const cardRef2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: cardRef2,
    offset: ["start end", "end start"]
  });
  const y2 = useTransform(scrollYProgress2, [0, 1], ["-6%", "6%"]);

  const generationSteps = [
    "正在为您规划合适的行程方案...",
    "正在为您筛选当地经典与小众景点...",
    "正在优化路线接驳与交通时间...",
    "正在合理安排每日活动与空闲时间...",
    "正在生成您的专属旅行清单与注意事项..."
  ];

  const handlePlanIt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      showToast("请输入您想去的旅行目的地！");
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Progressive step-by-step loading simulator
    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1200);

    // Finalize generation after 6 seconds
    setTimeout(() => {
      clearInterval(interval);
      const destinationTitle = searchInput.trim();
      const normalizedDest = destinationTitle.charAt(0).toUpperCase() + destinationTitle.slice(1);
      const customId = 'custom-' + Date.now();

      // Create a dreamy customized 3-day itinerary based on user input
      const draftedTrip: Trip = {
        id: customId,
        name: `${normalizedDest}慢节奏度假计划`,
        dateRange: "下月某个好天 (全程合理规划)",
        destination: `${normalizedDest}`,
        description: `专为您定制的 ${normalizedDest} 悠闲度假行程。专注于轻松的漫步、地道美食体验以及适度的留白，拒绝行色匆匆的打卡，让旅行回归放松。`,
        daysCount: 3,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG9F7dTV9tyGNjLUQWAUwfWPdJ2llLGI1CZE3d6Sro6vDUznFSvyoe1GvbRXvMw7q9lu9n4CErOLgBweX_oGKT-NVPVHcDQn2KJJ0Vh-SwBmibf00530aM-LPxwa87oy5yQ8NPJ5JHy5zIwEOJc4JOFiLQy7cVSvZsAZM99FvBXD4m8sHy2F6UN0PGwxfT_eruwmh1gUaO2K1r1Yt9JR7ZxfcUitEsAz2PdbE2d6izt1X_iBcLFINlOoBB1_UVl-bVJu-CWyHSCrk",
        activities: [
          {
            id: customId + '-a1',
            dayId: 1,
            time: "11:00 AM",
            title: `抵达并在 ${normalizedDest} 放松`,
            description: "安排专车接送，免去行李和交通顾虑。在乘车途中欣赏沿途风光，洗去旅途疲惫，顺利抵达酒店。",
            type: 'transit',
            tags: ['专车接送', '轻松开启'],
            locationName: `${normalizedDest} 抵达地点`,
            coordinates: { x: 30, y: 35 }
          },
          {
            id: customId + '-a2',
            dayId: 1,
            time: "02:30 PM",
            title: "入住酒店与观景露台放松",
            description: "入住当地富有特色的景观精品酒店。您可以在房内稍作整顿，或在露台上眺望风景，喝杯当地饮品，开启一段悠闲的假期。",
            type: 'hotel',
            tags: ['景观酒店', '舒适入住'],
            locationName: "当地舒适观景酒店",
            coordinates: { x: 42, y: 45 }
          },
          {
            id: customId + '-a3',
            dayId: 1,
            time: "06:00 PM",
            title: "傍晚无目的随心慢行",
            description: "不设死板的打卡任务。在当地历史悠久的老街上随心漫步，漫无目的地探索特色店铺，或者在路边的咖啡店坐坐，享受悠闲时光。",
            type: 'leisure',
            tags: ['傍晚散步', '随心探索'],
            locationName: "中央历史步行街",
            coordinates: { x: 45, y: 42 }
          },
          {
            id: customId + '-a4',
            dayId: 2,
            time: "10:30 AM",
            title: "传统手工体验与特色午餐",
            description: "拜访当地知名的传统农家或手工坊，跟着当地大厨参与传统美食的制作，品尝地道风味的午餐，深度感受本土饮食文化。",
            type: 'food',
            tags: ['手工体验', '特色午餐'],
            locationName: "传统熟食与美食体验工坊",
            coordinates: { x: 55, y: 38 }
          },
          {
            id: customId + '-a5',
            dayId: 2,
            time: "03:30 PM",
            title: "理疗水疗与特色桑拿放松",
            description: "安排一次下午的深度热能理疗或水疗按摩。完全基于天然草药熏蒸以及理疗师的手法服务，舒缓身体连日的疲劳。",
            type: 'activity',
            tags: ['特色水疗', '身心放松'],
            locationName: "当地水疗理疗中心",
            coordinates: { x: 62, y: 55 }
          },
          {
            id: customId + '-a6',
            dayId: 3,
            time: "12:00 PM",
            title: "包船游览隐秘海湾与浅海畅泳",
            description: "乘一艘特色游艇或帆船在碧蓝如镜的海面上航行。在只能乘船抵达的避风小海湾稍作停留，畅快沐浴在透亮的水波中，享受自然的宁静。",
            type: 'activity',
            tags: ['乘船出海', '海湾游览'],
            locationName: "自然避风小湾",
            coordinates: { x: 70, y: 65 }
          }
        ]
      };

      onAddTrip(draftedTrip);
      setIsGenerating(false);
      setSearchInput('');
      onSelectTrip(customId);
      showToast(`✨ 定制成功！已为您生成 "${normalizedDest}慢节奏度假计划" 旅行灵感！`);
    }, 6200);
  };

  return (
    <div className="space-y-16">
      
      {/* Loading overlay during generation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/85 backdrop-blur-xl z-50 flex items-center justify-center p-6 text-center text-white"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-slate-900/50 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              {/* Pulsing decorative circle */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-tech/20 rounded-full blur-2xl" />

              <div className="relative z-10 space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-container to-secondary-container flex items-center justify-center shadow-lg relative animate-pulse">
                    <Loader className="w-8 h-8 text-secondary animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase bg-primary-container text-on-primary-container px-3.5 py-1.5 rounded-full font-bold tracking-widest font-sans inline-block">
                    🧭 专属度假顾问
                  </span>
                  <h3 className="text-xl font-bold font-sans tracking-tight text-white mt-1">
                    正在精心设计去往 {searchInput} 的旅行方案...
                  </h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    合理规划每日日程，避免走马观花，为您预留舒适自由的放松时间。
                  </p>
                </div>

                {/* Progress bar and step text */}
                <div className="space-y-3 pt-2">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-tech to-secondary"
                      initial={{ width: "5%" }}
                      animate={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="h-10 flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4 text-primary-container animate-bounce shrink-0" />
                    <span className="text-xs font-semibold text-primary-container tracking-wide leading-snug">
                      {generationSteps[generationStep]}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Welcome banner */}
      <section className="flex flex-col items-center text-center mt-6">
        <h1 className="font-headline font-bold text-4xl md:text-5xl lg:text-5xl text-on-surface mb-6 max-w-2xl tracking-tight leading-tight">
          下一站去哪，{' '}
          <span className="text-secondary relative inline-block">
            享受舒适假期？
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-60" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path d="M0,10 Q50,20 100,10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
          </span>
        </h1>
        
        <p className="text-[#3c4947] text-xs md:text-sm max-w-sm font-medium leading-relaxed mb-4 text-[#3c4947]/80">
          轻松规划您的惬意假期。输入梦想目的地，定制专属悠闲日程。
        </p>

        {/* Input bar matching the design mock perfect glow */}
        <form 
          onSubmit={handlePlanIt}
          className="w-full max-w-3xl relative p-1.5 rounded-full bg-white/45 backdrop-blur-2xl border border-primary/20 shadow-lg hover:shadow-xl hover:border-primary/45 focus-within:ring-2 focus-within:ring-primary/40 transition-all flex items-center pl-4 mt-6"
        >
          <Palmtree className="w-5 h-5 text-secondary shrink-0 mr-1.5 animate-pulse" />
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-xs md:text-sm text-on-surface placeholder:text-slate-400 py-3 px-1"
            placeholder="告诉我想去哪里旅行（例如 '阿马尔菲'、'三亚'、'京都'、'冰岛'）..."
          />
          <button 
            type="submit"
            className="bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container text-xs font-black px-6 py-3 rounded-full transition-all flex items-center space-x-1.5 shadow-md active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>生成方案</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Lazy Curated Getaways Grid section */}
      <section className="space-y-6 text-left">
        <div className="flex justify-between items-end border-b border-secondary/15 pb-4">
          <div>
            <h2 className="font-headline font-bold text-xl md:text-2xl text-on-surface">精心挑选的度假路线</h2>
            <p className="font-sans text-xs text-on-surface-variant mt-1 font-medium">汇集多位旅行达人与专业行程规划师推荐，提供合理、松弛、避开人潮的旅行参考。</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Amalfi Coast */}
          <article 
            onClick={() => onSelectTrip('amalfi-5day')}
            className="group glass-panel rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div ref={cardRef1} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-inner bg-slate-100 border border-primary/5">
                <motion.img 
                  style={{ y: y1 }}
                  alt="Abstract gentle ocean waves rolling lazily onto pristine Amalfi coast sand shore." 
                  className="absolute top-[-7%] left-0 w-full h-[114%] object-cover transition-transform duration-700 ease-out group-hover:scale-105 origin-center" 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAswhROUd_ve54HWz1H6zYmxVoPzrCcgmIVcHPShz4wGcAAW0YEnH6tX88ACcalQRopKLxTZ0N43IbNKcuA7mh1fm6RpG-xJASKdVjMNFd5aTvaGVMoCXV8v_6a_RivsaL0W6FEZEAt1XpWTskDAExuMYEVJ2PyFiyaKWhyF3JgHk-EJYh2qEiw4W23iLkOHqNdP0HQmHJnehWzj8sjyYfkowhN20Xwdkcrn8FGONOQEcRKGPFC0iNB0C8NekuEY5rUF43l0Km1oV8"
                />
                <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 font-sans text-[11px] font-bold text-on-surface shadow-sm">
                  <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  <span>4.9</span>
                </div>
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline font-bold text-base md:text-lg text-on-surface group-hover:text-primary transition-all">
                    大理双廊惬意 5 日慢漫游
                  </h3>
                  <span className="font-sans text-xs font-bold text-primary bg-[#eff5f3] px-2.5 py-1 rounded-full border border-primary/10">
                    精选
                  </span>
                </div>
                
                <p className="font-sans text-xs text-on-surface-variant font-semibold mb-4">
                  5 天 • 云南大理
                </p>
                <p className="font-sans text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  在大理静享松弛生活：泛舟洱海、体验古色古香的白族草木扎染手作、漫步沙溪古镇四方街，给假期适度留白。
                </p>
              </div>
            </div>

            <div className="px-2 pb-2">
              <div className="flex gap-2">
                <span className="bg-secondary-container text-[#002012] font-sans text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  海滨度假
                </span>
                <span className="bg-[#eff5f3] text-primary font-sans text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  深度放松
                </span>
              </div>
            </div>
          </article>

          {/* Card 2: Swiss Alps */}
          <article 
            onClick={() => onSelectTrip('swiss-alpine')}
            className="group glass-panel rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div ref={cardRef2} className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-inner bg-slate-100 border border-primary/5">
                <motion.img 
                  style={{ y: y2 }}
                  alt="Scenic Alpine wellness peaks and clear mountain lakes view." 
                  className="absolute top-[-7%] left-0 w-full h-[114%] object-cover transition-transform duration-700 ease-out group-hover:scale-105 origin-center" 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoHNtyVitavM15l2ChFOmfvqp5gHH1jJNguF6rtRBsOGPTADL-gi624uJSSD1MK94AjNHlgWybC7nxOOqDZQ6sT17qgmYQouQ3vo8NnCa_HNSiHikpDLeTL03FbUGWSSBB5tAxG6_Cfhi7-Mj82rx-adJre81SIxxGlKdnu3JFgeURQ2NnjFcGKtZQxl8jpC8D1lw8j4IWaXHNRmyXIqcTVB4YGY3_3jSAx9dOfShsYycuBuH514AcXs9q8LSGi3vkoagBrFwnKS8"
                />
                <div className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1 font-sans text-[11px] font-bold text-on-surface shadow-sm">
                  <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  <span>4.8</span>
                </div>
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline font-bold text-base md:text-lg text-on-surface group-hover:text-primary transition-all">
                    瑞士阿尔卑斯疗愈与山地温泉
                  </h3>
                  <span className="font-sans text-xs font-bold text-primary bg-[#eff5f3] px-2.5 py-1 rounded-full border border-primary/10">
                    奢享
                  </span>
                </div>
                
                <p className="font-sans text-xs text-on-surface-variant font-semibold mb-4">
                  6 天 • 瑞士卢塞恩与采尔马特
                </p>
                <p className="font-sans text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  搭乘复古齿轨火车登上山顶、在雪山合围的露天温泉池中放松身心、品尝传统的瑞士芝士火锅。
                </p>
              </div>
            </div>

            <div className="px-2 pb-2">
              <div className="flex gap-2">
                <span className="bg-secondary-container text-[#002012] font-sans text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  瑞士山地
                </span>
                <span className="bg-[#eff5f3] text-primary font-sans text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  高端温泉
                </span>
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* Inspirational Quotes Vibe Banner */}
      <section className="glass-panel p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 bg-primary-container/30 border border-primary/20 text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold font-sans">
            <Leaf className="w-3.5 h-3.5 shrink-0 text-on-primary-container" />
            <span>惬意度假 · 回归松弛</span>
          </div>
          <h4 className="font-headline font-bold text-sm md:text-base text-on-surface">
            在这里，给旅程适度留白。
          </h4>
          <p className="font-sans text-xs text-slate-500 leading-relaxed">
            适度的留白下午与动态错峰规划，为您省去长途奔波的繁琐与疲惫，换来惬意的深度放松体验。
          </p>
        </div>
        <div className="shrink-0 relative z-10">
          <button 
            onClick={() => onSelectTrip('capri-weekend')}
            className="bg-secondary hover:brightness-105 text-white border-b-2 border-on-secondary-container rounded-2xl px-4.5 py-2.5 text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center space-x-1.5 cursor-pointer"
          >
            <span>开启卡普里周末逃离</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
}
