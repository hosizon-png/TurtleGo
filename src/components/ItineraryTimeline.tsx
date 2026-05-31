import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  MapPin, 
  Clock, 
  Calendar,
  Utensils,
  Coffee,
  Ship,
  Car,
  Tent,
  X,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Activity, ActivityType, Trip } from '../types';

interface ItineraryTimelineProps {
  trip: Trip;
  activeActivityId: string | null;
  onSelectActivity: (id: string) => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
  dayId: number;
  setDayId: (dayId: number) => void;
}

export default function ItineraryTimeline({
  trip,
  activeActivityId,
  onSelectActivity,
  onUpdateTrip,
  dayId,
  setDayId,
}: ItineraryTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [expandedDays, setExpandedDays] = useState<number[]>([1, 2]); // default expand Days 1 and 2

  // Fields for adding / editing
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('12:00 PM');
  const [formType, setFormType] = useState<ActivityType>('activity');
  const [formLocation, setFormLocation] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTags, setFormTags] = useState('');

  // Handle open Add activity
  const openAddActivity = (targetDay: number) => {
    setDayId(targetDay);
    setFormTitle('');
    setFormTime('12:00 PM');
    setFormType('activity');
    setFormLocation('');
    setFormDesc('');
    setFormTags('');
    setEditingActivity(null);
    setShowAddForm(true);
  };

  // Handle open Edit Activity
  const openEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormTitle(activity.title);
    setFormTime(activity.time);
    setFormType(activity.type);
    setFormLocation(activity.locationName);
    setFormDesc(activity.description);
    setFormTags(activity.tags.join(', '));
    setShowAddForm(true);
  };

  // Switch completion
  const toggleComplete = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedActivities = trip.activities.map((act) => {
      if (act.id === activityId) {
        return { ...act, isCompleted: !act.isCompleted };
      }
      return act;
    });
    onUpdateTrip({ ...trip, activities: updatedActivities });
  };

  // Delete Activity
  const handleDeleteActivity = (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedActivities = trip.activities.filter((act) => act.id !== activityId);
    onUpdateTrip({ ...trip, activities: updatedActivities });
  };

  // Submit Activity (Add or Edit)
  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Simulate coordinates on the map based on location hints, or place randomly
    let coords = { x: 40 + Math.random() * 20, y: 35 + Math.random() * 20 };
    const locLower = formLocation.toLowerCase();
    if (locLower.includes('大理') || locLower.includes('洱海')) coords = { x: 58, y: 44 };
    else if (locLower.includes('双廊')) coords = { x: 38, y: 48 };
    else if (locLower.includes('喜洲') || locLower.includes('苍山')) coords = { x: 63, y: 36 };
    else if (locLower.includes('沙溪') || locLower.includes('寂照庵')) coords = { x: 44, y: 36 };
    else if (locLower.includes('太阳湾') || locLower.includes('三亚')) coords = { x: 18, y: 72 };
    else if (locLower.includes('五花海') || locLower.includes('九寨沟')) coords = { x: 50, y: 40 };
    else if (locLower.includes('拉韦洛')) coords = { x: 63, y: 36 };
    else if (locLower.includes('那不勒斯')) coords = { x: 34, y: 18 };

    if (editingActivity) {
      // Edit
      const updatedActivities = trip.activities.map((act) => {
        if (act.id === editingActivity.id) {
          return {
            ...act,
            title: formTitle,
            time: formTime,
            type: formType,
            locationName: formLocation,
            description: formDesc,
            tags: parsedTags.length > 0 ? parsedTags : [formType === 'transit' ? '出行接驳' :
                                                      formType === 'food' ? '地道美食' :
                                                      formType === 'activity' ? '核心体验' :
                                                      formType === 'leisure' ? '躺平发呆' : '舒心酒店'],
            coordinates: act.coordinates || coords,
          };
        }
        return act;
      });
      onUpdateTrip({ ...trip, activities: updatedActivities });
    } else {
      // Add New
      const newAct: Activity = {
        id: 'new-' + Date.now(),
        dayId: dayId,
        time: formTime,
        title: formTitle,
        description: formDesc,
        type: formType,
        tags: parsedTags.length > 0 ? parsedTags : [formType === 'transit' ? '出行接驳' :
                                                  formType === 'food' ? '地道美食' :
                                                  formType === 'activity' ? '核心体验' :
                                                  formType === 'leisure' ? '躺平发呆' : '舒心酒店'],
        locationName: formLocation,
        coordinates: coords,
      };
      onUpdateTrip({ ...trip, activities: [...trip.activities, newAct] });
    }

    setShowAddForm(false);
    setEditingActivity(null);
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'transit':
        return <Car className="w-5 h-5" />;
      case 'food':
        return <Coffee className="w-5 h-5" />;
      case 'activity':
        return <Ship className="w-5 h-5" />;
      case 'leisure':
        return <Tent className="w-5 h-5" />;
      case 'hotel':
        return <Compass className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  const getActivityStyles = (type: ActivityType, isSelected: boolean) => {
    switch (type) {
      case 'transit':
        return isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300';
      case 'food':
        return isSelected
          ? 'bg-amber-600 text-white'
          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300';
      case 'activity':
        return isSelected
          ? 'bg-primary text-on-primary-container font-extrabold border-b-[3px] border-on-primary-container'
          : 'bg-primary-container/60 text-on-primary-container dark:bg-primary-container/20 dark:text-primary-container';
      case 'leisure':
        return isSelected
          ? 'bg-emerald-600 text-white'
          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300';
      case 'hotel':
        return isSelected
          ? 'bg-rose-600 text-white'
          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300';
    }
  };

  // Toggle expanded days
  const toggleDayExpansion = (dayNum: number) => {
    if (expandedDays.includes(dayNum)) {
      setExpandedDays(expandedDays.filter((d) => d !== dayNum));
    } else {
      setExpandedDays([...expandedDays, dayNum]);
    }
  };

  // Group activities by Day
  const daysArray = Array.from({ length: trip.daysCount }, (_, i) => i + 1);

  return (
    <div className="relative">
      {/* Day Quick Navigation Header */}
      <div className="flex items-center space-x-2 pb-6 mb-8 overflow-x-auto no-scrollbar border-b border-outline-variant/30">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-sans flex items-center shadow-sm px-3.5 py-1.5 bg-white/45 backdrop-blur-md rounded-full mr-2 shrink-0 border border-primary/5">
          <Calendar className="w-3.5 h-3.5 text-primary mr-1" /> 日程天数排序
        </span>
        {daysArray.map((num) => {
          const isActive = dayId === num;
          const actsForDay = trip.activities.filter((a) => a.dayId === num);
          return (
            <button
              key={num}
              onClick={() => {
                setDayId(num);
                if (!expandedDays.includes(num)) {
                  setExpandedDays([...expandedDays, num]);
                }
              }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all duration-200 shrink-0 select-none cursor-pointer ${
                isActive
                  ? 'bg-primary text-on-primary-container shadow-sm border border-on-primary-container'
                  : 'bg-white/45 backdrop-blur-md hover:bg-white/60 text-on-surface hover:text-primary border border-primary/10'
              }`}
            >
              <span>第 {num} 天</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-primary-container text-on-primary-container font-extrabold' : 'bg-primary-container text-on-primary-container'
              }`}>
                {actsForDay.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Timeline Vector Line */}
      <div className="absolute left-[20px] top-[102px] bottom-0 w-[2px] bg-gradient-to-b from-primary/30 to-slate-200 pointer-events-none hidden sm:block" />

      <div className="space-y-10">
        {daysArray.map((dayNum) => {
          const isCurrentDay = dayId === dayNum;
          const isExpanded = expandedDays.includes(dayNum);
          const dayActivities = trip.activities
            .filter((act) => act.dayId === dayNum)
            .sort((a, b) => a.time.localeCompare(b.time)); // sorting is fine since we enter standard times

          return (
            <section
              id={`day-section-${dayNum}`}
              key={dayNum}
              className={`relative sm:pl-16 transition-all duration-300 ${
                isCurrentDay ? 'opacity-100' : 'opacity-85'
              }`}
            >
              {/* Timeline Day Circle Indicator */}
              <button
                onClick={() => {
                  setDayId(dayNum);
                  toggleDayExpansion(dayNum);
                }}
                className={`absolute left-0 top-1.5 w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-sm z-10 hidden sm:flex shadow-sm transition-all duration-300 cursor-pointer ${
                  isCurrentDay
                    ? 'bg-primary text-on-primary-container border-2 border-on-primary-container font-extrabold ring-4 ring-primary-container/30'
                    : 'bg-white/35 backdrop-blur-md text-on-surface border border-[#1a4231]/15'
                }`}
              >
                {dayNum}
              </button>

              {/* Day Header */}
              <div 
                className="flex items-center justify-between mb-4 group cursor-pointer" 
                onClick={() => toggleDayExpansion(dayNum)}
              >
                <div className="text-left">
                  <h2 className="font-headline font-bold text-[17px] md:text-lg text-on-surface flex items-center space-x-2">
                    <span className="sm:hidden text-primary font-bold">第 {dayNum} 天. </span>
                    <span>
                      {dayNum === 1 && "抵达与湖畔初相识 (Arrival & Lakeside)"}
                      {dayNum === 2 && "风情双廊与洱海湖光 (Lake & Mountain)"}
                      {dayNum === 3 && "喜洲田园与草木扎染 (Village Artisan)"}
                      {dayNum === 4 && "古刹多肉与沙溪斜阳 (Zen Zen Moments)"}
                      {dayNum === 5 && "山泉养心作别洱海 (Farewell Deep Rest)"}
                      {dayNum > 5 && `自定义慢行行程 第 ${dayNum} 天`}
                    </span>
                  </h2>
                  <p className="font-sans text-xs text-on-surface-variant font-medium mt-0.5 max-w-lg">
                    {dayNum === 1 && "办理安顿入住，融入柔美轻灵的洱海湖畔缓慢时光。"}
                    {dayNum === 2 && "从宁谧湖面上亲身体体味生态廊道的悠然视觉震颤。"}
                    {dayNum === 3 && "碧绿纯净的麦田马车慢行与最地道的手艺民俗风情。"}
                    {dayNum === 4 && "幽雅禅院里的多肉洗心，静享沙溪古镇的斜阳与民谣。"}
                    {dayNum === 5 && "汲一掬苍山清泉温养身心，收拾行装，重掌充满能量的心灵。"}
                    {dayNum > 5 && "AI 龟小旅专属调配的隐秘探索空间。"}
                  </p>
                </div>

                <div className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddActivity(dayNum);
                    }}
                    className="p-1 px-2.5 text-primary hover:bg-primary/5 border border-primary/25 rounded-full transition-colors flex items-center gap-1 text-[11px] font-sans font-bold cursor-pointer"
                    title="为此天添加活动"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>添加活动</span>
                  </button>
                  <span className="text-xs text-secondary font-bold font-sans px-2.5 py-0.5 rounded-full bg-[#eff5f3]">
                    {dayActivities.length} 项
                  </span>
                </div>
              </div>

              {/* Expandable Activities Animation */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden space-y-4 pr-1"
                  >
                    {dayActivities.length === 0 ? (
                      <div className="bg-white/20 border border-dashed border-primary/20 p-6 rounded-2xl text-center">
                        <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-500">
                          这一天龟小旅还没有给您安排任何行程。
                        </p>
                        <button
                          onClick={() => openAddActivity(dayNum)}
                          className="mt-2 text-[11px] font-sans font-bold text-primary hover:underline cursor-pointer"
                        >
                          + 马上添置几项，开启无阻之旅！
                        </button>
                      </div>
                    ) : (
                      dayActivities.map((act) => {
                        const isSelected = activeActivityId === act.id;
                        return (
                          <motion.div
                            layoutId={`card-${act.id}`}
                            key={act.id}
                            onClick={() => onSelectActivity(act.id)}
                            className={`glass-panel p-5 rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 group relative border text-left ${
                              isSelected
                                ? 'ring-2 ring-primary ring-offset-2 scale-[1.01]'
                                : 'border-transparent hover:border-[#1a4231]/10'
                            } ${act.isCompleted ? 'opacity-60 bg-[#eff5f3]/50' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                                {/* Activity Type Round Icon Box */}
                                <div
                                  onClick={(e) => toggleComplete(act.id, e)}
                                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${getActivityStyles(
                                    act.type,
                                    act.isCompleted || false
                                  )}`}
                                  title="点击图标打勾取消或重启事件"
                                >
                                  {act.isCompleted ? (
                                    <Check className="w-5 h-5 stroke-[3px]" />
                                  ) : (
                                    getActivityIcon(act.type)
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Time block */}
                                  <div className="flex items-center space-x-2 text-primary font-bold text-[11px] uppercase tracking-wider mb-0.5">
                                    <Clock className="w-3 w-3 inline text-primary-container fill-primary-container/10" />
                                    <span>{act.time}</span>
                                    {act.locationName && (
                                      <span className="text-slate-500 font-medium normal-case flex items-center max-w-[180px] sm:max-w-none truncate">
                                        <span className="mx-1.5 opacity-60">•</span>
                                        <MapPin className="w-2.5 h-2.5 mr-0.5 inline" />
                                        {act.locationName}
                                      </span>
                                    )}
                                  </div>

                                  <h3
                                    className={`font-headline font-bold text-[15px] md:text-[16px] text-on-surface truncate group-hover:text-primary transition-colors ${
                                      act.isCompleted ? 'line-through text-slate-400' : ''
                                    }`}
                                  >
                                    {act.title}
                                  </h3>

                                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed mt-1.5 pr-4 line-clamp-3 md:line-clamp-none font-medium">
                                    {act.description}
                                  </p>

                                  {/* Optional Hotlinked Image render */}
                                  {act.imageUrl && (
                                    <div className="mt-3.5 mb-2 max-w-sm rounded-xl overflow-hidden shadow-sm relative group/img">
                                      <img
                                        src={act.imageUrl}
                                        alt={act.title}
                                        referrerPolicy="no-referrer"
                                        className="h-28 w-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                      />
                                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                                        <span className="text-[10px] text-white/95 font-sans font-medium flex items-center gap-1">
                                          📸 索伦托风光：彩房崖壁
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Custom Tags */}
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {act.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="bg-secondary-container/45 text-on-secondary-container px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase select-none"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* CRUD Action Buttons */}
                              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditActivity(act);
                                  }}
                                  className="p-1 px-1.5 text-on-surface-variant hover:text-primary hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                  title="修改活动"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteActivity(act.id, e)}
                                  className="p-1 px-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                  title="删除活动"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>

      {/* Days 3-5 Expander button inside lists if collapsed */}
      {!expandedDays.includes(3) && !expandedDays.includes(4) && !expandedDays.includes(5) && (
        <div className="text-center sm:pl-16 pt-6">
          <button
            onClick={() => {
              setExpandedDays([...expandedDays, 3, 4, 5]);
              setDayId(3);
            }}
            className="text-primary font-sans font-bold text-xs bg-primary/5 border border-primary/20 hover:bg-primary-container/20 px-6 py-3 rounded-full transition-all inline-flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>显示第 3-5 天的深度探秘日程</span>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
              +7 项事件
            </span>
          </button>
        </div>
      )}

      {/* Dynamic Pop-up Form Dialog modal for Add / Edit activity */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-headline font-bold text-base text-on-surface flex items-center gap-1.5">
                  <Tag className="w-4.5 h-4.5 text-primary" />
                  {editingActivity ? '修改慢调事件细节' : `配设新行程 (新添至第 ${dayId} 天)`}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveActivity} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                    活动主题
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="例如：落日余晖柠檬汁慢品"
                    className="w-full bg-[#f5fbf8] px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-left"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                      时段 / 刻度
                    </label>
                    <input
                      type="text"
                      required
                      value={formTime}
                      onChange={(e) => setFormTime(e.target.value)}
                      placeholder="例如：05:00 PM 或 10:30 AM"
                      className="w-full bg-[#f5fbf8] px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-left"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                      所属氛围 / 分类
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as ActivityType)}
                      className="w-full bg-[#f5fbf8] px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    >
                      <option value="activity">🚢 核心活动 / 私人包船</option>
                      <option value="food">🍽️ 地道美食 / 意面课堂</option>
                      <option value="leisure">🏖️ 散步放空 / 海滩休憩</option>
                      <option value="transit">🚗 尊贵接驳车 / 轮渡</option>
                      <option value="hotel">🏨 海景庄园精品酒店</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                    精确地点名称
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="例如：双廊镇洱海生态廊道 1 号栈口"
                    className="w-full bg-[#f5fbf8] px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                    龟小旅慵懒小备忘 / 心得
                  </label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    rows={3}
                    placeholder="在这里记录您想提醒自己、或是写给旅伴的惬心放松指南、拍照避坑点..."
                    className="w-full bg-[#f5fbf8] px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none text-left font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 font-sans mb-1 text-left">
                    特色标签 (逗号隔开)
                  </label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="如：必体验, 极美落日, 拒绝匆忙"
                    className="w-full bg-[#f5fbf8] px-3 py-2.5 rounded-xl text-xs font-medium text-slate-800 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-left"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs font-bold font-sans text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    取消取消
                  </button>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[3px] border-on-primary-container text-xs font-black px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {editingActivity ? '修改保存' : '一键配置'}
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
