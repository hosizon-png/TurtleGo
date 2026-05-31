import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MascotTurtle from './MascotTurtle';
import { 
  Palmtree, 
  ArrowRight, 
  User, 
  Sparkles, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  Coffee, 
  ShieldCheck, 
  Smile, 
  RefreshCw,
  Compass,
  Volume2
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userName: string) => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: "醒来的瞬间，什么起床仪式最能拂去你的精神疲惫？",
    assistantText: "Ciao！慢游第一步，让我们聊聊清晨。苏醒的那一刻，什么最得你心？",
    options: [
      {
        key: 'A',
        emoji: "🧘‍♀️",
        title: "无闹钟自然醒，松弛睡满十个饱觉",
        subtitle: "生活已经够累了，旅行必须彻底放松，不设置任何紧巴巴的计划。",
        effects: { anti_hustle: 3, cafe: 1 }
      },
      {
        key: 'B',
        emoji: "🌅",
        title: "趁薄露林海，在窗边看太阳徐徐升起",
        subtitle: "清晨那份无人的寂静与林间鸟啼，是消除都市焦虑的最棒良药。",
        effects: { wild: 2, blue: 1 }
      },
      {
        key: 'C',
        emoji: "🍲",
        title: "去寻一笼冒着白汽、锅气十足的早茶",
        subtitle: "用古法手制风味和本地大宗师烟火，唤醒身体沉睡的一朝一夕。",
        effects: { foodie: 2, heritage: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "步入一处生疏而安静的外地小镇，你感官雷达会优先定位哪里？",
    assistantText: "绝妙的避世地都有自己的治愈信号。告诉我，哪种美景能让你的心神立马安稳？",
    options: [
      {
        key: 'A',
        emoji: "🌊",
        title: "听涛发呆的离岛沙滩或温润水间",
        subtitle: "重度蓝色依赖！只要看着波光粼粼的水面，就能安静躺上一整天。",
        effects: { blue: 3, anti_hustle: 1 }
      },
      {
        key: 'B',
        emoji: "🏺",
        title: "陶艺古铺、老青砖街街角和非遗工坊",
        subtitle: "指尖抚摸民间泥胎与老木桩的温度，喜欢听斑驳时光沉淀下来的旧调。",
        effects: { heritage: 3, foodie: 1 }
      },
      {
        key: 'C',
        emoji: "🌲",
        title: "两旁郁郁葱葱、不闻汽车尾气的山林小径",
        subtitle: "换上惬意的厚底鞋，深深吸几口饱含露水的新鲜空气，回归林间暮鼓。",
        effects: { wild: 3, cafe: 1 }
      }
    ]
  },
  {
    id: 3,
    question: "如果要在明天的日程表强制留白一个下午，你最渴望怎么虚度？",
    assistantText: "‘纯白防线’是慢生活的精髓。当下午整整4个小时完全没有DDL时，你会...",
    options: [
      {
        key: 'A',
        emoji: "🍷",
        title: "钻进僻静弄堂里的复古黑胶留声机咖啡馆",
        subtitle: "喝一杯自酿果酒特调，看着树影在实木桌面上慢慢挪移。说闲就闲！",
        effects: { cafe: 3, anti_hustle: 1 }
      },
      {
        key: 'B',
        emoji: "🛶",
        title: "租一艘小木船，在无人的澄澈湖湾随波浮荡",
        subtitle: "收起浆，平躺下，闭眼静听湖水拍打船帮的声息，任微风把思绪吹到无涯处。",
        effects: { blue: 2, wild: 1, anti_hustle: 1 }
      },
      {
        key: 'C',
        emoji: "🍢",
        title: "穿街过巷寻找阿妈手工焙制的古法点心",
        subtitle: "执迷于挖掘野生小馆，排上半小时长队和当地爷爷奶奶一起津津有味地品尝。",
        effects: { foodie: 3, heritage: 1 }
      }
    ]
  },
  {
    id: 4,
    question: "旅伴提议“两日完成15处打卡点”的特种兵拉练游，你的本能态度是...",
    assistantText: "买糕的！听起来简直像是军训拉练。诚实面对灵魂，你真的想要旅行变成快餐吗？",
    options: [
      {
        key: 'A',
        emoji: "🐢",
        title: "坚决抵制！我宁可整天趴在客栈藤椅晒太阳",
        subtitle: "绝不沦为景点打卡狂。旅行的真谛在于有充足的午休与极其舒缓的自我松弛度。",
        effects: { anti_hustle: 3, cafe: 1 }
      },
      {
        key: 'B',
        emoji: "🐚",
        title: "最多只逛两处，且必须安排在亲水舒适区",
        subtitle: "水和阳光最能润人心神，强行拖着疲惫去扫描景点是对优雅假日的最大挑衅。",
        effects: { blue: 2, wild: 1 }
      },
      {
        key: 'C',
        emoji: "🏮",
        title: "去伪存真：只对极为深邃的名录遗迹留步寻古",
        subtitle: "与其把时间割裂得支离破碎，更愿将一整个晌午留在一个浸透历史的小院里。",
        effects: { heritage: 3, foodie: 1 }
      }
    ]
  },
  {
    id: 5,
    question: "你认为一次理想慢假日最震撼你精神、彻底洗褪疲惫的“灵魂高光”是？",
    assistantText: "最后一个关卡啦！当合上行李箱，你觉得什么样的终极定格最能让你治愈满格？",
    options: [
      {
        key: 'A',
        emoji: "☕",
        title: "暮色半醺、黑胶慵懒、生活完全被防打扰的一瞬",
        subtitle: "没有群聊，无须妥协社交。世界彻底回归沉静，那一刻我只与呼吸同枕。",
        effects: { cafe: 2, anti_hustle: 2 }
      },
      {
        key: 'B',
        emoji: "🌊",
        title: "倚靠在苍茫的水天交接处，只留下一副蓝色剪影",
        subtitle: "浩渺、平静的蓝色和遥远的涛音，那一刻似乎任何多余的委屈都被静静包容。",
        effects: { blue: 3, wild: 1 }
      },
      {
        key: 'C',
        emoji: "🥢",
        title: "在幽风竹帘下，品尝到古法手制风味时的感动",
        subtitle: "风物饱含着大理或南意的阳光与淳朴爱意，舌尖微温，万事皆安。",
        effects: { foodie: 3, heritage: 1 }
      }
    ]
  }
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(false);
  // 🌟 [自定义图像配置接口] 默认为 false 来首选显示您精美的 SVG 矢量龟小旅 (原生代码绘制)。
  // 如果您需要完全启用并替换为自己上传的本地画好的图片（已在 /public/turtle_mascot.png 预备好），
  // 可以把这里的 false 直接修改为 true。
  const [useCustomImg, setUseCustomImg] = useState(false);
  
  // Custom Flow Step System:
  // -1: Intro screen (Nickname capture, hammock illustration)
  // 0 to 4: Diagnostic questions 1 to 5 (Duolingo Style!)
  // 5: Loading/Calculating transition view
  // 6: Personality Reveal Screen!
  const [step, setStep] = useState(-1);
  
  // Test Selection Tracking
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([null, null, null, null, null]);
  
  // Scoreboard
  const [scores, setScores] = useState<{ [tagId: string]: number }>({
    blue: 0,
    anti_hustle: 0,
    heritage: 0,
    cafe: 0,
    wild: 0,
    foodie: 0
  });

  // Calculate results states
  const [calcProgress, setCalcProgress] = useState(0);
  const [calcText, setCalcText] = useState("正在接入龟小旅的舒适算法...");
  const [revealedResult, setRevealedResult] = useState<{
    title: string;
    description: string;
    badgeEmoji: string;
    descriptionDetail: string;
    matchedTags: string[];
  } | null>(null);

  // Check name entry and start diagnostic
  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError(true);
      return;
    }
    setError(false);
    // Move to step 0 (Question 1)
    setStep(0);
  };

  // Skip options / Quick profile setup directly without diagnostic
  const handleDirectStart = () => {
    if (!userName.trim()) {
      setError(true);
      return;
    }
    setError(false);
    // Set default tags and start
    const defaultTags = ['blue', 'anti_hustle', 'heritage', 'cafe'];
    localStorage.setItem('manman_user_name', userName.trim());
    localStorage.setItem('manman_labels', JSON.stringify(defaultTags));
    onLogin(userName.trim());
  };

  // Option selection handler
  const handleSelectOption = (questionIdx: number, optionKey: string) => {
    const updated = [...selectedAnswers];
    updated[questionIdx] = optionKey;
    setSelectedAnswers(updated);
  };

  // Next Question / Calculate handler
  const handleContinue = () => {
    if (step >= 0 && step < 4) {
      setStep(prev => prev + 1);
    } else if (step === 4) {
      // Diagnostics completed, execute scorer!
      setStep(5);
    }
  };

  // Calculate algorithm
  useEffect(() => {
    if (step === 5) {
      // Accumulate scores from selected responses
      const newScores = { blue: 0, anti_hustle: 0, heritage: 0, cafe: 0, wild: 0, foodie: 0 };
      
      selectedAnswers.forEach((key, qIdx) => {
        if (!key) return;
        const q = QUESTIONS[qIdx];
        const opt = q.options.find(o => o.key === key);
        if (opt) {
          Object.entries(opt.effects).forEach(([tagId, val]) => {
            newScores[tagId as keyof typeof newScores] += val;
          });
        }
      });
      setScores(newScores);

      // Loading texts
      const tips = [
        "正在接入龟小旅的舒适算法...",
        "为您隔离特种兵拼命打卡选项中...",
        "将‘睡到自然醒’列入行程首要纲领...",
        "正在搜寻避世海风、古宅古窑和微醺黑胶小道...",
        "算法调试成功！慢慢游性格勋章正在解锁中..."
      ];

      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        setCalcProgress(progress);
        
        // Dynamic tip shifting
        const tipIdx = Math.min(Math.floor(progress / 22), tips.length - 1);
        setCalcText(tips[tipIdx]);

        if (progress >= 100) {
          clearInterval(interval);
          
          // Determine matching tags (Tags with score >= 2, minimum 2 tags, max 4 tags)
          const sortedTags = Object.entries(newScores)
            .sort((a, b) => b[1] - a[1]) // highest score first
            .map(entry => entry[0]);
          
          // Select topmost items as matching characteristics (at least top 3)
          const matchedTags = sortedTags.slice(0, 4); 

          // Formulate personalized Title & Description based on prominent scores
          let finalTitle = "山海绝密避世神仙";
          let badgeEmoji = "🌊🐢";
          let bioDesc = "向往纯净湖海，热爱自然空旷，信奉无拘无束的纯享主义。";
          let detail = "你是一个极具洞察力的 TurtleGo 守护者。对水天低吟、绿肺徒步和彻底发呆有一等一的狂热。龟小旅已在系统里全权锁定了亲水风景和充足午休！";

          const primaryTag = sortedTags[0];
          const secondaryTag = sortedTags[1];

          if (primaryTag === 'anti_hustle' || secondaryTag === 'anti_hustle') {
            finalTitle = "慵懒界至高无上大宗师";
            badgeEmoji = "🐢💤";
            bioDesc = "绝对拒绝大运动、拒绝走马拉松式旅游、狂热极简空白行程的放空隐者。";
            detail = "在生活和假期之间，你设立了绝不动摇的‘懒散护城河’。睡到自然醒与大段的静止发呆是你的底色。龟小旅会强制把旅行活动编排在每天下午两点后，给足你睡眠自由！";
          } else if (primaryTag === 'heritage' && (secondaryTag === 'foodie' || secondaryTag === 'cafe')) {
            finalTitle = "古风老街慢味寻香大客群";
            badgeEmoji = "🏺🍲";
            bioDesc = "热爱探店和文化底蕴，对非遗老手艺、古老门窗和本地人秘藏风味极度敏感的人文名宿。";
            detail = "你不仅是为了换个地方睡觉，而是真正带着一双有历史厚度的眼睛。对古镇早茶、斑驳磨损的旧石板路和民间作坊怀有温热的敬意。龟小旅已经向行程里大量嵌入了喜洲古法手制和老宅听曲行程！";
          } else if (primaryTag === 'wild' || secondaryTag === 'wild') {
            finalTitle = "原野吸氧山水秘境隐隐者";
            badgeEmoji = "🏔️🌲";
            bioDesc = "穿最耐磨的厚底运动鞋，回归晨钟暮鼓、风餐露宿在大自然纯净没有噪音之地的隐修者。";
            detail = "比起钢筋水泥的装饰品，你更爱泥土、林涛 and 苍山吹拂下来的原野晨风。你渴望一次全身洗心、流汗与静止吸氧的假日。龟小旅已经为您保留了苍水清晨与沙溪幽雅远足体验！";
          } else if (primaryTag === 'foodie' || secondaryTag === 'foodie') {
            finalTitle = "风味人间大宗师食客";
            badgeEmoji = "🍲🥢";
            bioDesc = "舌尖雷达终身开启，对藏在市井陋街、阿妈手焙点心及本地字号秘传吃食爱得深沉的饕餮之神。";
            detail = "对于你，未曾吃透一方水土，假期便是不完整的。对锅气、阿妈砂锅、古法早膳充满了真挚好奇。龟小旅已为您将地道大理木瓜鱼与特焙粑粑精心排在重头戏位置，准备大快朵颐吧！";
          } else if (primaryTag === 'cafe' || secondaryTag === 'cafe') {
            finalTitle = "美酒唱片发呆资深生活客";
            badgeEmoji = "🍷☕";
            bioDesc = "钟爱在夕阳暮色中喝一杯果酿、塞入黑胶耳机、听唱机悠然旋转，极度松弛的探店小憩专家。";
            detail = "你是个无可救药的闲情美学拥护者。在咖啡因、精酿、黑胶留声机和慵懒光影里虚度时间，是你绝无仅有的浪漫。龟小旅已在午后为你保留了整块暖调夕阳下午茶时间！";
          }

          setRevealedResult({
            title: finalTitle,
            description: bioDesc,
            badgeEmoji,
            descriptionDetail: detail,
            matchedTags: matchedTags
          });

          // Move to results slide screen!
          setStep(6);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Final Action: complete login with results saved to localStorage
  const handleCompleteOnboardingResult = () => {
    if (!revealedResult) return;
    
    // Save nickname, profile summary, matching calculated tags
    localStorage.setItem('manman_user_name', userName.trim());
    localStorage.setItem('manman_profile_bio', `"${revealedResult.badgeEmoji} 作为【${revealedResult.title}】的你，${revealedResult.description}"`);
    localStorage.setItem('manman_labels', JSON.stringify(revealedResult.matchedTags));
    
    // Proceed inside!
    onLogin(userName.trim());
  };

  const currentQ = step >= 0 && step < 5 ? QUESTIONS[step] : null;
  const currentSelected = step >= 0 && step < 5 ? selectedAnswers[step] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col items-center justify-center ambient-bg px-4 py-8 select-none font-sans">
      
      {/* 3D thick-shadow utility CSS */}
      <style>{`
        .duo-button-shadow {
          box-shadow: 0 4px 0 0 rgba(46,126,89,0.2);
        }
        .duo-card-shadow {
          box-shadow: 0 4px 0 0 rgba(46,126,89,0.1);
        }
        .duo-card-shadow-active {
          box-shadow: 0 4px 0 0 rgba(109,219,75,0.22);
        }
        @keyframes swayTree1 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-3deg); }
        }
        @keyframes swayTree2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2.5deg); }
        }
        @keyframes gentleHammock {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(1px, 4px) rotate(1deg); }
        }
        @keyframes slowFloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-8px, -6px); }
        }
        @keyframes softPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes mascotBreatheFloat {
          0%, 100% {
            transform: translateY(4px) scale(1.02) rotate(-0.5deg);
            filter: drop-shadow(0 10px 15px rgba(109, 219, 75, 0.16)) drop-shadow(0 4px 6px rgba(45, 139, 255, 0.1));
          }
          50% {
            transform: translateY(-6px) scale(1.06) rotate(1deg);
            filter: drop-shadow(0 22px 25px rgba(109, 219, 75, 0.28)) drop-shadow(0 10px 10px rgba(45, 139, 255, 0.18));
          }
        }
        .anim-mascot-breathe {
          animation: mascotBreatheFloat 4.6s ease-in-out infinite;
        }
        .anim-sway-tree1 {
          animation: swayTree1 8s ease-in-out infinite;
          transform-origin: 100px 250px;
        }
        .anim-sway-tree2 {
          animation: swayTree2 10s ease-in-out infinite;
          transform-origin: 300px 260px;
        }
        .anim-hammock {
          animation: gentleHammock 5s ease-in-out infinite;
          transform-origin: 200px 180px;
        }
        .anim-float-cloud {
          animation: slowFloat 15s ease-in-out infinite;
        }
        .anim-pulse-glow {
          animation: softPulse 6s ease-in-out infinite;
        }
      `}</style>

      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#6DDB4B]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#2D8BFF]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full flex flex-col items-center space-y-6 relative z-10">
        
        <AnimatePresence mode="wait">
          
          {/* ================= STEP -1: NICKNAME & LANDING COZY SCREEN ================= */}
          {step === -1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center space-y-6"
            >
              {/* Header Info */}
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="inline-flex items-center space-x-2 bg-[#6DDB4B]/10 px-4 py-1.8 rounded-full border border-[#6DDB4B]/20 shadow-xs">
                  <Palmtree className="w-3.5 h-3.5 text-[#2E7E59] animate-bounce" />
                  <span className="font-sans text-[10px] text-[#2E7E59] font-black tracking-widest uppercase">
                    AI 旅行规划助手 · 龟小旅
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 justify-center">
                  <span className="font-headline font-black text-4.5xl text-[#6DDB4B] tracking-tight drop-shadow-sm">Turtle</span>
                  <span className="font-headline font-black text-4.5xl text-[#2D8BFF] tracking-tight drop-shadow-sm">Go</span>
                </div>
              </div>

              {/* Central Mascot Artwork */}
              <div className="w-full relative aspect-[4/3] glass-panel rounded-[32px] p-2 overflow-hidden shadow-md bg-gradient-to-b from-[#eaf8e4] to-[#fcfdfc] flex items-center justify-center border-2 border-[#6DDB4B]/20">
                {/* Back glowing light disk with dual brand colors */}
                <div className="absolute w-44 h-44 bg-[#6DDB4B]/12 rounded-full blur-3xl pointer-events-none anim-pulse-glow" style={{ animationDelay: '1s' }} />
                <div className="absolute w-44 h-44 bg-[#2D8BFF]/8 rounded-full blur-3xl pointer-events-none anim-pulse-glow" style={{ animationDelay: '3s' }} />
                
                {/* High-fidelity Mascot display (Custom Image with SVG Vector Fallback) */}
                <div className="relative z-10 pointer-events-none flex items-center justify-center">
                  {useCustomImg ? (
                    <img 
                      src="/turtle_mascot.png" 
                      alt="龟小旅 Mascot" 
                      className="mx-auto select-none max-h-[190px] w-auto object-contain anim-mascot-breathe" 
                      referrerPolicy="no-referrer"
                      onError={() => {
                        console.log("Custom image /turtle_mascot.png not found or empty, falling back to SVG...");
                        setUseCustomImg(false);
                      }}
                    />
                  ) : (
                    <div className="anim-mascot-breathe pb-1">
                       <MascotTurtle pose="hologram" size={210} className="mx-auto" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title texts */}
              <div className="space-y-2 text-center">
                <div className="flex justify-center items-center space-x-1">
                  {["慢", "一", "点", "，", "发", "现", "更", "多"].map((letter, idx) => {
                    const isKeyword = ["慢", "多"].includes(letter);
                    return (
                      <span 
                        key={idx}
                        className={`font-headline font-black tracking-widest ${
                          isKeyword 
                            ? 'text-[#6DDB4B] text-3.5xl scale-110 drop-shadow-xs' 
                            : 'text-[#2E7E59] text-2.5xl'
                        }`}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
                <p className="font-sans text-[11px] text-[#2E7E59] font-bold tracking-wider leading-relaxed px-4">
                  生活在别处。在这里，和智能小伙伴 <span className="text-[#6DDB4B] font-extrabold">龟小旅</span> 一起，<br />
                  寻找你深藏的避世灵魂，拒绝紧缺打卡，定制惬意游。☕🌅
                </p>
              </div>

              {/* Username Input Form */}
              <form onSubmit={handleStartTest} className="w-full max-w-xs space-y-3.5 pt-2">
                <div className="relative rounded-2xl bg-white/95 shadow-sm border border-[#6DDB4B]/25 px-4 py-1.5 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#6DDB4B]/30 focus-within:border-[#6DDB4B] transition-all bg-white">
                  <User className="w-4 h-4 text-[#2E7E59] shrink-0" />
                  <input 
                    type="text" 
                    maxLength={15}
                    required
                    placeholder="怎么称呼您？(如：苏苏)" 
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (e.target.value.trim()) setError(false);
                    }}
                    className="w-full py-2 bg-transparent border-none text-xs text-[#2E7E59] font-extrabold focus:outline-none focus:ring-0 placeholder:text-slate-400"
                  />
                </div>

                {error && (
                  <p className="text-[10px] text-[#ff9600] font-black animate-pulse text-center pl-1">
                    ⚠️ 龟小旅需要知晓您的尊姓大名，才能开始定制。
                  </p>
                )}

                <div className="flex flex-col space-y-2 pt-1">
                  <button
                    type="submit"
                    className="w-full bg-[#6DDB4B] hover:bg-[#5bc23d] text-white border-b-4 border-[#2E7E59] font-sans text-xs font-black py-4 rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:translate-y-[4px] active:border-b-0 transition-all uppercase tracking-wider"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-pulse animate-spin-slow" />
                    <span>开启趣味性格诊断 (Turtle-Test)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectStart}
                    className="w-full bg-white/40 hover:bg-white/60 border border-slate-200 text-slate-500 font-sans text-[10px] font-bold py-2.5 rounded-2xl transition-all active:scale-98"
                  >
                    跳过测试，直接进入主页 (默认配置)
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ================= STEPS 0-4: DUOLINGO DIAGNOSTIC QUESTIONS ================= */}
          {step >= 0 && step < 5 && currentQ && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="w-full flex flex-col space-y-5 pb-24"
            >
              {/* Duolingo progress header bar */}
              <div className="w-full flex items-center space-x-3.5 border-b border-slate-150 pb-4">
                <button 
                  onClick={() => setStep(step - 1)} // resets back to prev slide or landing
                  className="p-1 px-3 bg-white/80 hover:bg-slate-100 rounded-lg text-xs font-black text-slate-400 border border-slate-200 cursor-pointer active:translate-y-[1px]"
                >
                  ✕
                </button>
                
                {/* Progress wrapper */}
                <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden relative border border-slate-300">
                  <motion.div 
                    initial={{ width: `${(step / 5) * 100}%` }}
                    animate={{ width: `${((step + 1) / 5) * 100}%` }}
                    className="bg-emerald-500 h-full rounded-full relative"
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    {/* Gloss shine overlay */}
                    <div className="absolute top-0.5 inset-x-0 h-1 bg-white/20 rounded-full" />
                  </motion.div>
                </div>
                
                {/* Level / XP Pill */}
                <div className="bg-amber-100 border border-amber-300 text-amber-700 font-mono text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 flex items-center space-x-1">
                  <span>✨</span>
                  <span>{(step + 1) * 20} XP</span>
                </div>
              </div>

              {/* Character Mascot & Cartoon speech bubble */}
              <div className="flex items-start gap-4 text-left py-2">
                {/* Waving mascot avatar */}
                <div className="w-14 h-14 bg-white border border-primary/20 rounded-2xl shrink-0 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-300">
                  <MascotTurtle pose="waving" size={54} className="translate-y-1.5" />
                </div>
                
                {/* Speech Bubble with triangle */}
                <div className="relative flex-1 bg-white border border-slate-150 rounded-2xl p-3.5 shadow-sm">
                  <div className="absolute top-4 -left-2.5 w-4 h-4 bg-white border-l border-b border-slate-150 rotate-45" />
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    龟小旅悄悄话：
                  </p>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed font-sans select-text">
                    {currentQ.assistantText}
                  </p>
                </div>
              </div>

              {/* Static Question Heading */}
              <div className="text-left space-y-1.5 pl-1.5 border-l-4 border-secondary">
                <p className="text-[10px] text-secondary font-black uppercase tracking-widest leading-none">诊断关卡 {currentQ.id} / 5</p>
                <h3 className="font-headline text-sm md:text-base font-black text-slate-900 tracking-tight leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Dynamic choices list */}
              <div className="grid grid-cols-1 gap-3 pt-1">
                {currentQ.options.map((option) => {
                  const isChosen = currentSelected === option.key;
                  return (
                    <div
                      key={option.key}
                      onClick={() => handleSelectOption(step, option.key)}
                      className={`group rounded-2xl p-4 cursor-pointer text-left transition-all duration-100 flex items-start gap-4 relative select-none border-2 ${
                        isChosen
                          ? 'border-[#1cb0f6] bg-[#ddf4ff] shadow-[0_4px_0_0_#1899d6] translate-y-[2px]'
                          : 'border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] hover:border-[#cccccc] shadow-[0_4px_0_0_#e5e5e5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#e5e5e5]'
                      }`}
                    >
                      {/* Left circular Emoji placeholder */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-inner transition-all ${
                        isChosen ? 'bg-[#1cb0f6] text-white scale-105' : 'bg-slate-100 group-hover:bg-slate-200'
                      }`}>
                        {option.emoji}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className={`text-xs font-extrabold tracking-tight leading-none mb-1 transition-colors ${
                          isChosen ? 'text-[#0079b0]' : 'text-[#3c3c3c]'
                        }`}>
                          {option.title}
                        </p>
                        <p className={`text-[10px] font-semibold leading-relaxed tracking-normal ${
                          isChosen ? 'text-[#0079b0]/80' : 'text-slate-400'
                        }`}>
                          {option.subtitle}
                        </p>
                      </div>

                      {/* Tick or key Indicator circle right */}
                      <div className={`w-6 h-6 rounded-full border text-[10px] font-bold flex items-center justify-center shrink-0 transition-all ${
                        isChosen 
                          ? 'border-[#1cb0f6] bg-[#1cb0f6] text-white scale-110 shadow-sm' 
                          : 'border-[#e5e5e5] text-slate-400 bg-slate-50'
                      }`}>
                        {isChosen ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : option.key}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fixed bottom bar for continue (exactly like Duolingo!) */}
              <div className="fixed bottom-0 left-0 right-0 py-4 bg-white border-t-2 border-[#e5e5e5] flex justify-between items-center px-5 max-w-md mx-auto rounded-t-3xl shadow-xl z-50">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                  已完成 {step * 20}% 进度
                </span>
                
                <button
                  onClick={handleContinue}
                  disabled={!currentSelected}
                  className={`px-8 py-3.5 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 text-center justify-center cursor-pointer select-none ${
                    currentSelected
                      ? 'bg-[#4ca614] hover:bg-[#439612] text-white border-b-4 border-[#3c850f] active:border-b-0 active:translate-y-[4px]'
                      : 'bg-[#e5e5e5] text-[#afafaf] cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>继续解锁</span>
                  <ChevronRight className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>

            </motion.div>
          )}

          {/* ================= STEP 5: LOADER SCREEN / CHUNKING PREFERENCES ================= */}
          {step === 5 && (
            <motion.div
              key="calc"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center justify-center py-6 space-y-5 text-center"
            >
              {/* Confused Turtle Mascot looking at a Map */}
              <div className="pointer-events-none scale-105">
                <MascotTurtle pose="confused" size={150} className="mx-auto" />
              </div>

              {/* Circular loader with active percent count */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                
                {/* SVG Progress circle */}
                <svg className="w-full h-full -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#eff5f3" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="56" 
                    cy="56" 
                    r="48" 
                    stroke="#4ca614" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - calcProgress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-100 ease-out"
                  />
                </svg>

                <div className="absolute text-center space-y-0.5">
                  <span className="text-xl font-headline font-black text-[#3c850f] block tracking-tight">
                    {calcProgress}%
                  </span>
                  <span className="text-[8.5px] uppercase font-black tracking-widest text-[#fcb913]">CALC</span>
                </div>
              </div>

              {/* Rotating funny status texts */}
              <div className="space-y-4 max-w-xs mx-auto">
                <div className="text-center">
                  <RefreshCw className="w-5 h-5 text-[#4ca614] animate-spin mx-auto mb-1 opacity-70" />
                  <p className="text-xs font-black text-slate-800 leading-relaxed font-sans">{calcText}</p>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  慢慢正将您的起床偏好、发呆渴望与老弄堂探香雷达无缝翻译。绝无特种兵行军打卡！
                </p>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 6: PERSONALITY REVEAL DEEPER ENGINE ================= */}
          {step === 6 && revealedResult && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="w-full flex flex-col space-y-6 pt-1 text-left"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-[#eff5f3] px-3.5 py-1.2 rounded-full border border-primary/20 text-[#3c850f] font-bold text-[10.5px]">
                  <span>🏆 灵魂避世诊断勋章解锁！</span>
                </div>
                <h2 className="font-headline font-black text-xl md:text-2xl text-slate-900 tracking-tight leading-snug">
                  慢慢游性格画像已诞生
                </h2>
              </div>

              {/* Celebrating jumping turtle mascot (Pose 4) */}
              <div className="flex justify-center -my-3 pointer-events-none scale-105">
                <MascotTurtle pose="joy" size={170} />
              </div>

              {/* Reveal Gold Medal Card block */}
              <div className="glass-panel text-left p-5.5 rounded-3xl border-2 border-[#1a4231]/15 bg-white relative overflow-hidden shadow-sm">
                
                {/* Abstract corner graphics */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/8 rounded-full blur-xl pointer-events-none" />
                <div className="absolute top-2 right-3 focus:outline-none select-none text-2xl filter drop-shadow-sm">
                  {revealedResult.badgeEmoji}
                </div>

                <div className="space-y-4">
                  
                  {/* Nickname pill */}
                  <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-[#9c6c40] block">Slow Traveler Title</span>
                    <h3 className="font-headline font-extrabold text-lg text-primary leading-none mt-1 flex items-center gap-1.5">
                      <span>{userName || '慵懒客'}</span>
                      <span className="text-xs font-normal text-slate-400">的避世尊号</span>
                    </h3>
                  </div>

                  {/* Gigantic Title box */}
                  <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center relative pointer-events-none">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest">慢慢帝国大宗师授予：</p>
                    <p className="font-headline text-lg.5 md:text-xl font-black text-secondary mt-1.5 tracking-wide drop-shadow-sm">
                      {revealedResult.title}
                    </p>
                  </div>

                  {/* Summary bullet text */}
                  <div className="space-y-2">
                    <span className="text-[9.5px] uppercase font-black tracking-widest text-slate-400 block pb-0.5">性格解读与宿命风格</span>
                    
                    <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">
                      “{revealedResult.description}”
                    </p>
                    
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                      {revealedResult.descriptionDetail}
                    </p>
                  </div>

                  {/* Calculated Active Tags */}
                  <div className="pt-2">
                    <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-2">一键激活的慢节奏勋章：</p>
                    <div className="flex flex-wrap gap-1.5">
                      {revealedResult.matchedTags.map(tagId => {
                        const allTags = [
                          { id: 'blue', label: '🌊 山海避世家' },
                          { id: 'anti_hustle', label: '🐢 慵懒大宗师' },
                          { id: 'heritage', label: '🏺 非遗文化客' },
                          { id: 'cafe', label: '🍷 美酒与庄园' },
                          { id: 'wild', label: '🏔️ 山野寻林客' },
                          { id: 'foodie', label: '🍲 风味本真客' }
                        ];
                        const single = allTags.find(t => t.id === tagId);
                        if (!single) return null;
                        return (
                          <div key={tagId} className="bg-primary-container/50 opacity-95 text-on-primary-container border border-primary/20 text-[10.5px] font-black px-2.5 py-1 rounded-full flex items-center shadow-xs">
                            {single.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom informative tips */}
              <div className="bg-sky-50 border border-sky-150 rounded-2xl p-4 text-xs text-slate-700 font-semibold space-y-1.5">
                <p className="text-[#008BE3] font-black block text-[10px] uppercase tracking-wider">💡 慢生活提醒 (Local Rule)：</p>
                <p className="leading-relaxed text-[11px] text-blue-900">
                  These custom tags are fully integrated into your profile. 龟小旅 will automatically optimize the itinerary timeline, AI Chatbot rooms, and recommendations based on your desired slow-travel pace. Easily adjust these in the Profile tab anytime!
                </p>
              </div>

              {/* Submit to complete */}
              <button
                type="button"
                onClick={handleCompleteOnboardingResult}
                className="w-full bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[4px] border-on-primary-container font-sans text-xs.5 font-black py-4 rounded-2xl flex items-center justify-center space-x-1 cursor-pointer shadow-lg active:translate-y-[2px] duo-button-shadow transition-all"
              >
                <span>踏入我的避世留白之旅 (Enter Game)</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
