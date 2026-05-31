import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, RefreshCw, Layers, CheckCircle2, Bot, Sliders } from 'lucide-react';
import { Message, Trip } from '../types';
import MascotTurtle from './MascotTurtle';

interface ChatTabProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onAdjustDay3: () => void;
  setActiveTab: (tab: string) => void;
}

export default function ChatTab({
  trip,
  onUpdateTrip,
  messages,
  setMessages,
  onAdjustDay3,
  setActiveTab,
}: ChatTabProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when receiving new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // 2. Simulate AI response with high coastal relevance after 1 second
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';
      let suggestions: string[] = [];
      let action: any = undefined;

      const normText = text.toLowerCase();
      if (normText.includes('慵懒') || normText.includes('放松') || normText.includes('慢') || normText.includes('relax') || normText.includes('lazy')) {
        replyText = "最完美的决定。在大理慢生活自古崇尚惬意闲逸。我推荐您将第 2 天清晨 9:00 的泛舟洱海项目推迟到 10:30。清晨可以在客栈的海景大露台吹着微风享用手冲玫瑰小粒咖啡与烤鲜花饼。需要我帮您在时间表里重拍吗？";
        suggestions = ["一键推迟泛舟活动", "是的，帮我记录", "想要慵懒的早餐推荐"];
        action = {
          type: 'reschedule',
          label: '一键推迟泛舟至 10:30 AM',
          description: '自动微调您第 2 天上午的时间，为早晨惬意留白。',
        };
      } else if (normText.includes('调整') || normText.includes('第3天') || normText.includes('第三天') || normText.includes('太赶') || normText.includes('累')) {
        replyText = "第 3 天确实有点消耗体力！上午马车畅游喜洲绿麦田，下午又要去亲手学非遗扎染，活动连在一块。我建议进行慢节奏调整，将【草木扎染手工课堂】挪到第 4 天上午，给第 3 天下午留出充裕的一整个洱海湖畔观海听风发懒发呆的下午。您意下如何？";
        suggestions = ["是的，帮我优化第 3 天", "保持原样不动", "推荐几个安静适合看落日的码头"];
        action = {
          type: 'adjust_day3',
          label: '是的，优化第 3 天排程',
          description: '重组喜洲漫游和非遗手工扎染课堂，降低节奏密度。',
        };
      } else if (normText.includes('酸木瓜鱼') || normText.includes('美食') || normText.includes('餐厅') || normText.includes('吃什么') || normText.includes('野生菌') || normText.includes('鱼')) {
        replyText = "想要在大理双廊享用一顿极具格调又不踩坑的慢晚餐：强烈推荐避开主干道喧嚣的【双廊静谧听涛阁】（主打当日古法泡制的野生洱海酸木瓜鱼和清炒野生鸡枞菌，风味绝伦！）。此外，喜洲老铺子里阿妈守着碳炉烤出的【手工红糖喜洲粑粑】也千万不可错过。";
        suggestions = ["帮我把酸木瓜鱼私房菜写入第 2 天", "怎么找到手烤喜洲粑粑？", "有不贵的街头下午茶推荐吗？"];
      } else if (normText.includes('行李') || normText.includes('带什么') || normText.includes('打包') || normText.includes('鞋')) {
        replyText = "大理和沙溪全是由起伏的中世纪老石板古路铺成，且高原温差较大，请决情地把高细跟便鞋留在家里！一双耐穿厚底运动皮鞋、防晒渔夫帽、透气棉麻衬衫和保暖斗篷是惬意游玩的标配。需要查看小慢编写的【避世防坑贴士】吗？";
        suggestions = ["前往 避世防坑信条", "如果突然降温下雨怎么办？"];
      } else if (normText.includes('推迟') || normText.includes('出海') || normText.includes('接驳') || normText.includes('泛舟')) {
        // Trigger boat reschedule
        const updated = trip.activities.map((a) => {
          if (a.id === 'a2-1') {
            return { ...a, time: '10:30 AM', description: a.description + " (小慢自动为您顺延推迟，保证早晨睡足，惬意万分！)" };
          }
          return a;
        });
        onUpdateTrip({ ...trip, activities: updated });

        replyText = "顺延成功！我已经将您的【洱海私人汎舟】推迟至上午 10:30。您的第 2 天早晨现在空空如也，可以穿着拖鞋在湖景阳台上慢慢品尝热乎乎的烤乳扇。☕🌅";
        suggestions = ["太棒了，谢谢！", "推荐一家绝美海景咖啡馆", "第 2 天晚上吃什么？"];
      } else {
        replyText = "这听起来想法非常赞！我可以为您在日程中插入该活动，并推荐避开人潮的清凉小众去处，帮您微调这几天的行程。您看如何？";
        suggestions = ["寻找余晖特调悬崖酒吧", "放慢第 4 天节奏", "推荐一些避匿海滩"];
      }

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions,
        action,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 1200);
  };

  const executeAction = (actionType: string) => {
    if (actionType === 'adjust_day3') {
      onAdjustDay3();
      // Add a success confirmation from assistant
      const confirmMsg: Message = {
        id: 'cfg-' + Date.now(),
        sender: 'assistant',
        text: "✨ 日程优化完毕！我已将您的“柠檬露台手工面课堂”轻挪到了第 4 天，为您第 3 天下午挪出了长达 3 小时的绝对留自空白！这下可以安心在福罗瑞峡湾晒着日光发呆了。快看看左侧时间表吧！",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["太棒了，带我去看看！", "第 3 天下午适合喝点什么？"]
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (actionType === 'reschedule') {
      const updated = trip.activities.map((a) => {
        if (a.id === 'a2-1') {
          return { ...a, time: '10:30 AM', description: a.description + " (管管自动重设出海时间点，慢度至上。)" };
        }
        return a;
      });
      onUpdateTrip({ ...trip, activities: updated });

      const confirmMsg: Message = {
        id: 'cfg-' + Date.now(),
        sender: 'assistant',
        text: "⛵ 出海时间已顺延！推迟波西塔诺游船至 10:30 AM。现在您有大把清晨时光可以去主教广场寻觅一块刚出炉的贝壳酥了。",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ["前往第 2 天查看", "早上面包店推荐"]
      };
      setMessages((prev) => [...prev, confirmMsg]);
    }
  };

  return (
    <div className="flex flex-col h-[520px] glass-panel rounded-3xl overflow-hidden shadow-lg shadow-primary/5">
      {/* Thread Header */}
      <div className="bg-primary/5 px-5 py-4 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-50 border border-emerald-100 flex items-center justify-center text-primary overflow-hidden">
            <MascotTurtle pose="avatar" size={32} />
          </div>
          <div>
            <h4 className="font-headline font-bold text-xs.5 md:text-sm text-primary tracking-tight">
              慢慢游 · 龟小旅
            </h4>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-sans flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>龟小旅在线规划</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'm1',
                sender: 'assistant',
                text: "Ciao！我是您的慢慢游伙伴——龟小旅 🐢。让我们使这次大理慢旅行彻底放松、毫无阻碍防踩坑。有什么我可以为您微调的吗？说‘让我第三天闲下来’试试！",
                timestamp: "刚刚",
                suggestions: ["可以更慵懒更松弛！", "推荐不踩坑的本地风味", "草木扎染体验有推荐的吗？"]
              }
            ]);
          }}
          className="p-1 px-2 hover:bg-primary/10 text-primary rounded-lg transition-colors flex items-center space-x-1 text-[10px] font-sans font-bold cursor-pointer"
          title="重置对话"
        >
          <RefreshCw className="w-3 h-3" />
          <span>重置会话</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAssistant ? '' : 'flex-row-reverse'}`}
            >
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden ${
                  isAssistant ? 'bg-emerald-50 border border-emerald-100' : 'bg-primary text-white'
                }`}
              >
                {isAssistant ? (
                  <MascotTurtle pose="avatar" size={28} />
                ) : (
                  '👤'
                )}
              </div>

              <div className="flex flex-col max-w-[82%]">
                <div
                  className={`p-3.5 rounded-[20px] text-xs font-medium leading-relaxed shadow-sm text-left ${
                    isAssistant
                      ? 'bg-slate-50 text-slate-800 rounded-tl-sm'
                      : 'bg-primary text-white rounded-tr-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Render Mutation Action Card if present inside Assistant Message */}
                  {isAssistant && msg.action && (
                    <div className="mt-3.5 p-3 rounded-xl bg-white border border-primary/20 shadow-sm flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Sliders className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">
                            {msg.action.label}
                          </p>
                          <p className="text-[9px] text-slate-500 leading-tight">
                            {msg.action.description}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => executeAction(msg.action!.type)}
                        className="w-full bg-primary hover:bg-primary/95 text-white text-[10px] font-bold font-sans py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary-container" />
                        <span>确认一键调整</span>
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-400 font-sans mt-1 self-start">
                  {msg.timestamp}
                </span>

                {/* Suggestions display */}
                {isAssistant && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.suggestions.map((sug) => {
                      return (
                        <button
                          key={sug}
                          onClick={() => {
                            if (sug.includes('Tips') || sug.includes('贴士')) {
                              setActiveTab('tips');
                            } else {
                              handleSendMessage(sug);
                            }
                          }}
                          className="bg-white/40 backdrop-blur-md hover:bg-[#1a4231]/10 border border-[#1a4231]/15 text-[#1a4231] px-2.5 py-1.5 rounded-full text-[10px] font-bold font-sans shadow-sm transition-all duration-200 cursor-pointer"
                        >
                          {sug}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs">
              🛶
            </div>
            <div className="bg-slate-50 p-3 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1 border border-slate-100 shadow-sm">
              <span className="w-1.5 h-1.5 bg-primary/45 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form Box */}
      <div className="p-3 border-t border-[#1a4231]/10 bg-transparent flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder="给小慢发送口令，如 '帮我推迟出海活动' 或 '推荐饭馆'..."
          className="flex-1 bg-white/35 px-4 py-2.5 rounded-full text-xs font-semibold text-[#10251c] border border-primary/10 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all pr-4 placeholder:text-slate-400"
        />
        <button
          onClick={() => handleSendMessage(inputText)}
          className="bg-primary hover:bg-primary/95 text-white p-2.5 rounded-full shadow-md shadow-primary/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
