import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Maximize2, Minimize2, Navigation, Compass, Globe, Home } from 'lucide-react';
import { Activity } from '../types';
import { EX_MAP_IMAGE } from '../data/defaultData';

interface MapPlaceholderProps {
  activities: Activity[];
  activeActivityId: string | null;
  onSelectActivity: (id: string) => void;
  dayId: number;
}

export default function MapPlaceholder({
  activities,
  activeActivityId,
  onSelectActivity,
  dayId,
}: MapPlaceholderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);

  // Filter activities for the current day that have coordinates
  const dayActivities = activities.filter((act) => act.dayId === dayId);
  const activeActivity = activities.find((act) => act.id === activeActivityId);

  // Compute sequential segments for connecting pins chronologically
  const activitiesWithCoords = [...dayActivities]
    .filter((act) => act.coordinates && typeof act.coordinates.x === 'number' && typeof act.coordinates.y === 'number')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const segments = [];
  for (let i = 0; i < activitiesWithCoords.length - 1; i++) {
    const from = activitiesWithCoords[i];
    const to = activitiesWithCoords[i + 1];
    const x1 = from.coordinates!.x;
    const y1 = from.coordinates!.y;
    const x2 = to.coordinates!.x;
    const y2 = to.coordinates!.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const percentDist = Math.sqrt(dx * dx + dy * dy);

    // Realistic scale calibration for Erhai bilateral map (approx 0.18 km per percentage point)
    const distanceKm = percentDist === 0 ? 0 : Math.max(0.1, percentDist * 0.18);
    const isFar = distanceKm > 1.2;
    const travelTimeText = isFar 
      ? `🚗 驾车约 ${Math.ceil(distanceKm * 2.5)} 分钟` 
      : `🚶 步行约 ${Math.ceil(distanceKm * 14)} 分钟`;

    segments.push({
      id: `${from.id}-${to.id}`,
      x1,
      y1,
      x2,
      y2,
      midX: (x1 + x2) / 2,
      midY: (y1 + y2) / 2,
      distanceStr: `${distanceKm.toFixed(1)} km`,
      travelTimeText,
      fromTitle: from.title,
      toTitle: to.title,
    });
  }

  return (
    <div
      className={`glass-panel rounded-3xl overflow-hidden relative shadow-lg transition-all duration-500 ease-in-out ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-white/95 backdrop-blur-md'
          : 'h-full w-full'
      }`}
    >
      {/* Zoomable & Smooth Pannable Viewport Area */}
      <motion.div
        className="absolute inset-0 w-full h-full origin-center"
        animate={{
          x: activeActivity && activeActivity.coordinates
            ? `${(50 - activeActivity.coordinates.x)}%`
            : "0%",
          y: activeActivity && activeActivity.coordinates
            ? `${(50 - activeActivity.coordinates.y)}%`
            : "0%",
          scale: activeActivity && activeActivity.coordinates ? 1.35 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 18,
          mass: 0.9,
        }}
      >
        {/* Background Styled Image */}
        <div className="absolute inset-0 w-full h-full bg-slate-100">
          <img
            src={EX_MAP_IMAGE}
            alt="Map view of Amalfi Coast"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-700 ${
              showSatellite ? 'saturate-150 contrast-110 brightness-90 hue-rotate-15' : 'opacity-85'
            }`}
          />
          {/* Soft elegant vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Dynamic Vector Traveling Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="segment-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          {segments.map((seg) => (
            <g key={`line-group-${seg.id}`}>
              {/* Dynamic glowing shadow path line */}
              <line
                x1={`${seg.x1}%`}
                y1={`${seg.y1}%`}
                x2={`${seg.x2}%`}
                y2={`${seg.y2}%`}
                stroke="var(--color-primary)"
                strokeWidth="4"
                className="opacity-20 blur-xs"
              />
              {/* Actual dash path line */}
              <line
                x1={`${seg.x1}%`}
                y1={`${seg.y1}%`}
                x2={`${seg.x2}%`}
                y2={`${seg.y2}%`}
                stroke="url(#segment-grad)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="opacity-80"
              />
            </g>
          ))}
        </svg>

        {/* Render Distance & Travel Tooltip Info Pills between consecutive nodes */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {segments.map((seg) => (
            <div
              key={`pill-${seg.id}`}
              className="absolute pointer-events-auto select-none"
              style={{
                left: `${seg.midX}%`,
                top: `${seg.midY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="group/pill relative">
                <div className="bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-primary/45 rounded-full px-2 py-0.5 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all flex items-center space-x-1 text-[9.5px] font-black text-secondary cursor-help">
                  <Navigation className="w-2.5 h-2.5 rotate-45 text-primary shrink-0" />
                  <span>{seg.distanceStr}</span>
                </div>
                
                {/* Float-up Tooltip detailing route travel estimation */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[10px] font-bold py-1.5 px-3 rounded-xl shadow-xl pointer-events-none opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-white/10 flex flex-col items-center gap-0.5">
                  <div className="text-[9px] text-slate-300 font-medium">段落路线行程</div>
                  <div className="font-extrabold text-white flex items-center gap-1">
                    <span>{seg.fromTitle}</span>
                    <span className="text-primary">➔</span>
                    <span>{seg.toTitle}</span>
                  </div>
                  <div className="text-primary font-black mt-0.5 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full text-[9px] scale-95">
                    {seg.travelTimeText}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Render Dynamic Animated Map Pins */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {dayActivities.map((act) => {
            const isActive = act.id === activeActivityId;
            return (
              <div
                key={act.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${act.coordinates?.x ?? 50}%`,
                  top: `${act.coordinates?.y ?? 50}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onSelectActivity(act.id)}
              >
                <div className="relative group flex items-center justify-center">
                  {/* Glowing Outer Indicator (Custom ripples with high visibility) */}
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute w-16 h-16 bg-primary/20 rounded-full border border-primary/40"
                        initial={{ scale: 0.4, opacity: 0.8 }}
                        animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.6, 0, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                      <motion.div
                        className="absolute w-10 h-10 bg-secondary/30 rounded-full"
                        animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.3 }}
                      />
                    </>
                  )}

                  {/* Main Marker Tag */}
                  <motion.div
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? {
                      scale: 1.25,
                      y: -6,
                      boxShadow: "0px 12px 24px rgba(244, 63, 94, 0.5)"
                    } : {
                      scale: 1,
                      y: 0,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.08)"
                    }}
                    transition={isActive ? {
                      type: "spring",
                      stiffness: 170,
                      damping: 12
                    } : { duration: 0.3 }}
                    className={`relative p-2.5 rounded-full border transition-all duration-300 ${
                      isActive
                        ? 'bg-rose-500 text-white border-rose-350 z-20 shadow-md scale-110'
                        : act.type === 'hotel'
                          ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fda4af] hover:bg-[#fecdd3] z-15 shadow-sm'
                          : 'bg-white text-secondary border-secondary/20 hover:text-primary hover:border-primary/50 group-hover:bg-primary-container/10 z-10 shadow-sm'
                    }`}
                  >
                    {act.type === 'hotel' ? (
                      <Home className={`w-4 h-4 ${isActive ? 'stroke-[2.5px] scale-105 animate-pulse' : ''}`} />
                    ) : (
                      <MapPin className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                    )}
                  </motion.div>

                  {/* Tiny Label Overlay */}
                  <div className="absolute top-full mt-2 bg-slate-900/95 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md z-30 border border-white/10 flex items-center space-x-1">
                    <span>{act.time}</span>
                    <span className="text-secondary">•</span>
                    <span>{act.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Map Control HUD Badges (Floating on top of the panning layer) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-white/80 backdrop-blur-md text-primary font-semibold px-4 py-2 rounded-full font-label-sm text-xs shadow-sm shadow-secondary/5 flex items-center space-x-1.5 border border-white">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-primary-container" />
          <span>大理双廊漫步雷达</span>
        </div>
        <button
          onClick={() => setShowSatellite(!showSatellite)}
          className="bg-white/90 hover:bg-white backdrop-blur-md text-on-surface-variant font-medium px-4 py-1.5 rounded-full text-[11px] shadow-sm flex items-center gap-1.5 border border-white/50 hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>{showSatellite ? '切换：美学手绘图' : '切换：卫星路况叠加'}</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-white/90 hover:bg-white backdrop-blur-md text-primary p-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-sm border border-white cursor-pointer"
          title={isFullscreen ? "退出全屏" : "全屏地图"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Focus Indicator at the bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none" id="focused-map-overlay">
        <AnimatePresence mode="wait">
          {activeActivity ? (
            <motion.div
              key={activeActivity.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="glass-panel p-4 rounded-2xl flex items-center justify-between pointer-events-auto border border-white"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <Navigation className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-on-surface-variant font-sans">
                    当前选定
                  </p>
                  <p className="font-headline font-bold text-on-surface text-[15px]">
                    {activeActivity.locationName || activeActivity.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-secondary-container/50 text-on-secondary-container font-mono text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full">
                  {activeActivity.type === 'transit' ? '交通' : 
                   activeActivity.type === 'food' ? '地道美食' :
                   activeActivity.type === 'activity' ? '活动行程' :
                   activeActivity.type === 'leisure' ? '散步放空' : '海景酒店'}
                </span>
                <span className="text-[11px] text-primary font-bold">
                  {activeActivity.time}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-focus"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              className="glass-panel p-4 rounded-2xl flex items-center justify-center text-center py-5 pointer-events-auto border border-white/40"
            >
              <p className="text-xs text-on-surface-variant font-semibold">
                📍 提示：在左侧日程表中点击任意卡片可在地图上联动定位
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom stylized scale/compass layout element */}
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-40 text-[9px] text-slate-800 font-mono tracking-widest hidden md:block select-none" id="scale-compass">
        苍山与大理洱海半岛 | 湖域比例尺 1:24,000
      </div>
    </div>
  );
}
