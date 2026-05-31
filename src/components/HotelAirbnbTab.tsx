import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hotel, 
  Home, 
  MapPin, 
  Star, 
  Sparkles, 
  Wifi, 
  Coffee, 
  Tv, 
  Compass, 
  ShieldCheck, 
  DollarSign, 
  SlidersHorizontal,
  BookmarkCheck,
  Plane,
  X,
  CreditCard,
  CheckCircle2,
  Receipt,
  Car,
  ChevronRight
} from 'lucide-react';
import { Trip } from '../types';

interface HotelAirbnbProps {
  trip: Trip;
  showToast: (text: string) => void;
  onPlotHotel?: (coordinates: { x: number; y: number }, title: string, locationName: string) => void;
}

interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'airbnb';
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  imageUrl: string;
  locationName: string;
  description: string;
  amenities: string[];
  coordinates: { x: number; y: number };
  tagLine: string;
  roomTypes: { name: string; price: number; desc: string }[];
}

const ACCOMMODATIONS_DATABASE: Record<string, Accommodation[]> = {
  "云南大理与丽江": [
    {
      id: "dal-1",
      name: "大理双廊·安之若宿精品设计酒店",
      type: 'hotel',
      rating: 4.9,
      reviewsCount: 384,
      pricePerNight: 1280,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQs7t16uWzkBYewBtx678HSMz2Dr5HnegDZ5y4OUbUyTHNE3u9YzN6tGzHLw23byjO_9Bzf2sU5vPuPRuci9jWhVCxnpaTDgDKHtJRr85TUfvyhKxyZ4SlMfIn3a7FKxsXRwHkVc5LZ47rt4UY4_qAPKKWfIqdWZU2tQcguQHMw2WlL357LpUnAxrMtSqZqht06E860Ww3XZMsrTYrtHDPJJcuqEuzPb1lN_WqA1lBMuwLdo95AKklZgjPbFrKqSa_gCaLrn12X6I",
      locationName: "大理双廊景区环海路152号",
      description: "屡获大奖的艺术感地标酒店，采用极简几何建筑设计。每间客房均能独享270度超大落地窗，将碧水苍山完美框入您的慵懒时光，配有原声黑胶音乐播放器及白族古法花果茶。",
      amenities: ["免费Wifi", "独立浴缸", "多源蓝牙音响", "手冲咖啡台", "恒温海景泳池"],
      coordinates: { x: 42, y: 52 },
      tagLine: "艺术建筑 / 苍山环湖首选",
      roomTypes: [
        { name: "苍山怀抱·经典海景大床房", price: 1280, desc: "包含双人白草畔有机早餐，独立亲水浴缸" },
        { name: "浮光掠影·星空复式挑高套房", price: 1880, desc: "顶楼透明玻璃穹顶，附带超声波恒温海景露台" }
      ]
    },
    {
      id: "dal-2",
      name: "喜洲古镇·稼穑院传统白族艺术民宿",
      type: 'airbnb',
      rating: 4.8,
      reviewsCount: 142,
      pricePerNight: 890,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1dOBMWDxHr2bik_ZwVf6U7laJXaagSv4kfwrNTz8XBiVx93psuk-E5bzgcgbxkVeXjkb8o7CIDceNMTJw4BEfKdTMfxzbn3WOehrHHm2PkcaWqYQDLI2ZvIjQrYmFOYKzzf7B0_B_dyZtJYzMYN1Yf8QNG4tRiVuUxKPtQd-cmgpy69xaGA2jQPtaX3mBSI1FPuZWFlGjqbvDsntP1uSjFEmsktqFb8AbVl0rllHeWUj3tmlP1_bGAtRZpG2FPnzDdl3x9gDyb9M",
      locationName: "喜洲大院麦田东侧100米",
      description: "这是一栋由民国白族大户人家私邸精心改建的传统染坊院落。保留了典型的“三坊一照壁”榫卯结构，床品皆采用国家级非遗草木扎染手作。推开门便是一望无际的沙沙作响的麦浪。",
      amenities: ["免费Wifi", "中式红木茶室", "手作扎染体验", "苍山泉茶泉水", "榻榻米"],
      coordinates: { x: 62, y: 38 },
      tagLine: "非遗扎染体验 / 窗含万亩麦浪",
      roomTypes: [
        { name: "静心小坐·榻榻米田园雅居", price: 890, desc: "含传统柴火阿妈清粥小菜，全套手工真丝床品" },
        { name: "三坊合围·百年雕阁主位套房", price: 1450, desc: "独立回廊套房，白族金木微雕收藏真迹成套" }
      ]
    },
    {
      id: "dal-3",
      name: "苍山半山隐宿·云海禅意林中庄园",
      type: 'hotel',
      rating: 4.9,
      reviewsCount: 95,
      pricePerNight: 1450,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG9F7dTV9tyGNjLUQWAUwfWPdJ2llLGI1CZE3d6Sro6vDUznFSvyoe1GvbRXvMw7q9lu9n4CErOLgBweX_oGKT-NVPVHcDQn2KJJ0Vh-SwBmibf00530aM-LPxwa87oy5yQ8NPJ5JHy5zIwEOJc4JOFiLQy7cVSvZsAZM99FvBXD4m8sHy2F6UN0PGwxfT_eruwmh1gUaO2K1r1Yt9JR7ZxfcUitEsAz2PdbE2d6izt1X_iBcLFINlOoBB1_UVl-bVJu-CWyHSCrk",
      locationName: "苍山保护区中和索道附近半山",
      description: "掩映在古老松柏竹林间的幽雅庄园，宛如浮卧在半空中鸟瞰洱海。配备了地热恒温加湿，山里清晨云雾飘进前庭，能在古朴的石槽温泉中感受最彻底的天地静躺。",
      amenities: ["免费Wifi", "私密石槽温泉", "瑜伽静坐台", "山水温奶暖阁", "苍山松针燃香"],
      coordinates: { x: 32, y: 28 },
      tagLine: "半山云海 / 温泉洗心隐居",
      roomTypes: [
        { name: "听泉观竹·禅坐观景浴池房", price: 1450, desc: "附带户外小温泉泡池，赠精选普洱一饼" },
        { name: "浮云独尊·天幕独立林间庄园", price: 2300, desc: "整栋一进小院连体，主卧室俯瞰整晚洱海灯火" }
      ]
    }
  ],
  "海南三亚": [
    {
      id: "san-1",
      name: "三亚太阳湾·柏悦奢华度假酒店",
      type: 'hotel',
      rating: 4.9,
      reviewsCount: 520,
      pricePerNight: 2800,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQs7t16uWzkBYewBtx678HSMz2Dr5HnegDZ5y4OUbUyTHNE3u9YzN6tGzHLw23byjO_9Bzf2sU5vPuPRuci9jWhVCxnpaTDgDKHtJRr85TUfvyhKxyZ4SlMfIn3a7FKxsXRwHkVc5LZ47rt4UY4_qAPKKWfIqdWZU2tQcguQHMw2WlL357LpUnAxrMtSqZqht06E860Ww3XZMsrTYrtHDPJJcuqEuzPb1lN_WqA1lBMuwLdo95AKklZgjPbFrKqSa_gCaLrn12X6I",
      locationName: "三亚亚龙湾国家旅游度假区太阳湾路5号",
      description: "由国际设计巨匠一手打造的神仙居所。整座湾区由一条绝美的壮阔山海公路相连，独家私密。静谧的深海珊瑚环绕，配有柏悦著名的超长艺术无边海景长滩泳池。",
      amenities: ["免费Wifi", "私家海湾", "顶级艺术长廊", "私人露台浴缸", "尊贵奔驰接机"],
      coordinates: { x: 22, y: 75 },
      tagLine: "独家秘境湾区 / 极简几何巨制",
      roomTypes: [
        { name: "碧浪连天·至尊亲海景观房", price: 2800, desc: "落地180度看海，特设专属戴森吹风机和Le Labo洗护" },
        { name: "山海一色·全景露台行政泳池房", price: 3950, desc: "含私人露台超大热带凉亭及温水出水口泡池" }
      ]
    },
    {
      id: "san-2",
      name: "后海「极简白色」慢生活海滨冲浪民宿",
      type: 'airbnb',
      rating: 4.7,
      reviewsCount: 218,
      pricePerNight: 650,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1dOBMWDxHr2bik_ZwVf6U7laJXaagSv4kfwrNTz8XBiVx93psuk-E5bzgcgbxkVeXjkb8o7CIDceNMTJw4BEfKdTMfxzbn3WOehrHHm2PkcaWqYQDLI2ZvIjQrYmFOYKzzf7B0_B_dyZtJYzMYN1Yf8QNG4tRiVuUxKPtQd-cmgpy69xaGA2jQPtaX3mBSI1FPuZWFlGjqbvDsntP1uSjFEmsktqFb8AbVl0rllHeWUj3tmlP1_bGAtRZpG2FPnzDdl3x9gDyb9M",
      locationName: "滕海渔村冲浪客栈集中街4号",
      description: "位于冲浪胜地后海的小巧白色乌托邦。出门5步即可踏进柔软温暖的阳光沙滩。顶楼露台一到傍晚放着清浅的乡村民谣与微风，老板提供自酿香椰百香果精酿啤酒，极其适合躺平放空。",
      amenities: ["免费Wifi", "顶楼夕阳沙龙", "免费冲浪初体验", "自制冷调椰子奶", "宠物友好"],
      coordinates: { x: 50, y: 80 },
      tagLine: "浪人聚集地 / 独立艺术极简风",
      roomTypes: [
        { name: "海风轻吟·阳台白色大床房", price: 650, desc: "含美味的手工拿铁与本地阿妈清心水果捞" },
        { name: "踏浪拾贝·首层直通沙滩三人复式", price: 980, desc: "下旋门推开直连沙湾，提供双人高品质桨板体验" }
      ]
    }
  ]
};

// Fallback for missing locations
const DEFAULT_ACCOMMODATIONS: Accommodation[] = [
  {
    id: "gen-1",
    name: "本港悠居·龟跑跑慵懒漫游精选美宿",
    type: 'airbnb',
    rating: 4.9,
    reviewsCount: 88,
    pricePerNight: 750,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQs7t16uWzkBYewBtx678HSMz2Dr5HnegDZ5y4OUbUyTHNE3u9YzN6tGzHLw23byjO_9Bzf2sU5vPuPRuci9jWhVCxnpaTDgDKHtJRr85TUfvyhKxyZ4SlMfIn3a7FKxsXRwHkVc5LZ47rt4UY4_qAPKKWfIqdWZU2tQcguQHMw2WlL357LpUnAxrMtSqZqht06E860Ww3XZMsrTYrtHDPJJcuqEuzPb1lN_WqA1lBMuwLdo95AKklZgjPbFrKqSa_gCaLrn12X6I",
    locationName: "目的地最灵气避静处",
    description: "由龟小旅推荐的本地精选安逸宿处，没有催促的名胜与行程拉练。周围极静谧，能极佳地恢复元气与深层次心理按摩。",
    amenities: ["免费Wifi", "阳光玻璃茶房", "龟跑跑伴手礼", "慢炖汤羹", "瑜伽垫"],
    coordinates: { x: 45, y: 45 },
    tagLine: "自然避世 / 慵懒空白大师甄选",
    roomTypes: [
      { name: "慵懒半日小筑", price: 750, desc: "含龟小旅调配香气香薰精油及热带晨光早餐" }
    ]
  }
];

export default function HotelAirbnbTab({ trip, showToast, onPlotHotel }: HotelAirbnbProps) {
  // Filters state
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'airbnb'>('all');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [ratingsOnly, setRatingsOnly] = useState<boolean>(false);

  // States for Booking flow
  const [selectedAcc, setSelectedAcc] = useState<Accommodation | null>(null);
  const [activeRoomType, setActiveRoomType] = useState<number>(0);
  const [guestName, setGuestName] = useState('慵懒避世客');
  const [phoneNo, setPhoneNo] = useState('188 8888 8888');
  const [stayNights, setStayNights] = useState(trip.daysCount - 1 > 0 ? trip.daysCount - 1 : 1);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Determine local list based on destination
  const accommodations = useMemo(() => {
    let list = DEFAULT_ACCOMMODATIONS;
    for (const key of Object.keys(ACCOMMODATIONS_DATABASE)) {
      if (trip.destination.toLowerCase().includes(key.substring(0, 3).toLowerCase()) || 
          key.toLowerCase().includes(trip.destination.substring(0, 2).toLowerCase())) {
        list = ACCOMMODATIONS_DATABASE[key];
        break;
      }
    }
    return list;
  }, [trip.destination]);

  // Filter list
  const filteredList = useMemo(() => {
    return accommodations.filter((acc) => {
      const matchesType = filterType === 'all' || acc.type === filterType;
      const matchesPrice = acc.pricePerNight <= priceRange;
      const matchesRating = !ratingsOnly || acc.rating >= 4.9;
      return matchesType && matchesPrice && matchesRating;
    });
  }, [accommodations, filterType, priceRange, ratingsOnly]);

  const handleOpenBookingDetails = (acc: Accommodation) => {
    setSelectedAcc(acc);
    setActiveRoomType(0);
    setIsBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcc) return;

    const room = selectedAcc.roomTypes[activeRoomType] || selectedAcc.roomTypes[0];
    const totalCost = room.price * stayNights;
    const trackingCode = `TRP-${Math.floor(100000 + Math.random() * 900000)}`;

    const details = {
      trackingCode,
      hotelName: selectedAcc.name,
      roomName: room.name,
      totalCost,
      stayNights,
      guestName,
      phoneNo,
      coordinates: selectedAcc.coordinates,
      locationName: selectedAcc.locationName,
      dateRange: trip.dateRange
    };

    setBookingDetails(details);
    setIsBookingSuccess(true);
    showToast(`🎉 预订成功！您的慢游美宿已锁定：${selectedAcc.name}`);

    // If callback present, project on Map right away to let users preview navigation distance!
    if (onPlotHotel) {
      onPlotHotel(selectedAcc.coordinates, selectedAcc.name, selectedAcc.locationName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-slate-900/60 dark:to-rose-950/20 p-6 rounded-3xl border border-rose-100/60 dark:border-rose-900/10 flex flex-col md:flex-row items-center gap-4 text-left">
        <div className="p-3.5 bg-rose-500 text-white rounded-2xl shadow-md shrink-0">
          <Hotel className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-headline font-black text-slate-800 dark:text-slate-100 text-base md:text-lg flex items-center gap-1.5 leading-snug">
            <span>慢活安宿：订酒店与美学民宿集</span>
            <Sparkles className="w-4.5 h-4.5 text-rose-500 fill-rose-100" />
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed max-w-2xl">
            根据大理苍山洱海及三亚悠缓度假节奏，龟小旅特调了白族百年庭院、悬崖海景以及高能静养庄园。可在前端立刻模拟算费并一键下订，体验与 <span className="font-mono text-rose-600 font-bold">embabel/tripper</span> 一致的地图联动联动。
          </p>
        </div>
      </div>

      {/* Modern Horizontal Interactive Controls Layout */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`p-2 px-4 rounded-xl text-xs font-bold transition-all ${filterType === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
          >
            全部慢居
          </button>
          <button
            onClick={() => setFilterType('hotel')}
            className={`p-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'hotel' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
          >
            <Hotel className="w-3.5 h-3.5" />
            艺术奢享
          </button>
          <button
            onClick={() => setFilterType('airbnb')}
            className={`p-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${filterType === 'airbnb' ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'}`}
          >
            <Home className="w-3.5 h-3.5" />
            特色Airbnb
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 font-sans">一晚限额:</span>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-28 md:w-36 accent-rose-500 cursor-pointer"
            />
            <span className="text-xs font-black text-slate-800 font-mono">¥{priceRange}</span>
          </div>

          <label className="flex items-center gap-1.5 select-none text-[11px] font-bold text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={ratingsOnly}
              onChange={(e) => setRatingsOnly(e.target.checked)}
              className="rounded text-rose-500 accent-rose-500 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span>至臻高分 (≥4.9)</span>
          </label>
        </div>
      </div>

      {/* Grid List displaying accommodations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredList.map((acc, idx) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100/80 hover:border-rose-100 hover:shadow-lg transition-all duration-300 group flex flex-col text-left justify-between"
            >
              {/* Cover Photo */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={acc.imageUrl}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float-badge representing Airbnb vs Hotel */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm ${
                    acc.type === 'hotel' ? 'bg-slate-900/90 text-white' : 'bg-rose-500/95 text-white'
                  }`}>
                    {acc.type === 'hotel' ? '🏨 品牌庄园' : '🏡 特色民宿'}
                  </span>
                  <span className="bg-white/95 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    {acc.rating.toFixed(1)}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-slate-100 p-1.5 px-3 rounded-full shadow-sm">
                  <span className="text-[10px] text-slate-400 font-sans font-bold">每晚起价 </span>
                  <span className="text-sm font-black text-rose-600 font-mono">¥{acc.pricePerNight}</span>
                </div>
              </div>

              {/* Text Information Panel */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-black text-rose-500 tracking-wider uppercase mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{acc.tagLine}</span>
                  </div>
                  
                  <h4 className="font-headline font-black text-slate-800 text-[15px] group-hover:text-rose-600 transition-colors">
                    {acc.name}
                  </h4>
                  
                  <p className="font-sans text-[11px] text-slate-400 font-semibold mb-3 flex items-center mt-1">
                    <MapPin className="w-3 h-3 text-rose-500 mr-0.5 shrink-0" />
                    <span className="truncate">{acc.locationName}</span>
                  </p>

                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3 mb-4">
                    {acc.description}
                  </p>

                  {/* Amenities badges */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {acc.amenities.map((item, idy) => (
                      <span
                        key={idy}
                        className="bg-slate-50 border border-slate-100/50 text-slate-500 font-sans font-bold text-[9.5px] px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        {idy % 3 === 0 && <Wifi className="w-2.5 h-2.5 text-rose-400" />}
                        {idy % 3 === 1 && <Coffee className="w-2.5 h-2.5 text-rose-400" />}
                        {idy % 3 === 2 && <Tv className="w-2.5 h-2.5 text-rose-400" />}
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking Interactive Action Button */}
                <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => onPlotHotel && onPlotHotel(acc.coordinates, acc.name, acc.locationName)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-slate-500 font-sans font-bold text-xs p-2.5 rounded-xl transition-all border border-slate-100 flex items-center justify-center gap-1Cursor font-black cursor-pointer"
                    title="在右侧交互矢量地图上绘制酒店/民宿位置"
                  >
                    <Compass className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" />
                    <span>测距与对齐地图</span>
                  </button>

                  <button
                    onClick={() => handleOpenBookingDetails(acc)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-sans font-black text-xs p-2.5 px-4 rounded-xl transition-all border border-rose-100 shadow-sm shadow-rose-100/30 text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>按天算费并锁定</span>
                    <ChevronRight className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredList.length === 0 && (
            <div className="col-span-full bg-slate-50 border border-dashed border-slate-200 p-12 rounded-3xl text-center">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">
                暂时没有搜索到此限额内的慢居。请略微调大一晚限额滑块吧！
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Modal representing booking calculations and Success invoices */}
      <AnimatePresence>
        {selectedAcc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/4 w-full h-full bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 p-6 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <BookmarkCheck className="w-5 h-5 text-rose-500" />
                  <h3 className="font-headline font-black text-[#1e293b] text-base">
                    {!isBookingSuccess ? '慢度奢享·美学居住预订' : '预订成功·取房电子凭证'}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAcc(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!isBookingSuccess ? (
                /* Step 1: Booking Forms and Calc */
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Small preview */}
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center space-x-3">
                    <img
                      src={selectedAcc.imageUrl}
                      alt={selectedAcc.name}
                      className="w-16 h-16 object-cover rounded-xl shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-headline font-bold text-slate-800 truncate">{selectedAcc.name}</h4>
                      <p className="text-[10px] font-sans text-slate-400 truncate mt-0.5">{selectedAcc.locationName}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] bg-rose-50 text-rose-500 border border-rose-100 px-1.5 py-0.2 rounded font-black font-sans">
                          {selectedAcc.type === 'hotel' ? '大理奢享' : '精品Airbnb'}
                        </span>
                        <span className="text-[10.5px] text-slate-500 font-mono font-bold">★ {selectedAcc.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Select Room Type */}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase text-slate-500 font-sans mb-1">
                      选择舒心房型 / 套房
                    </label>
                    <div className="space-y-2">
                      {selectedAcc.roomTypes.map((room, idx) => {
                        const isSelected = activeRoomType === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setActiveRoomType(idx)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                              isSelected 
                                ? 'border-rose-500 bg-rose-50/40 shadow-sm' 
                                : 'border-slate-100 hover:border-slate-200 bg-white'
                            }`}
                          >
                            <div className="min-w-0 pr-4">
                              <p className="text-xs font-bold text-slate-800">{room.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{room.desc}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-slate-450 text-[10px]">每晚 </span>
                              <span className="text-sm font-black text-rose-600 font-mono">¥{room.price}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Guest details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-slate-500 font-sans mb-1">
                        住客姓名
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-[#fbf5f5] px-3 py-2 rounded-xl text-xs font-medium text-slate-800 border border-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase text-slate-500 font-sans mb-1">
                        联系电话
                      </label>
                      <input
                        type="text"
                        required
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        className="w-full bg-[#fbf5f5] px-3 py-2 rounded-xl text-xs font-medium text-slate-800 border border-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                      />
                    </div>
                  </div>

                  {/* Stay nights slider count */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10.5px] font-bold uppercase text-slate-500 font-sans">
                        入住晚数
                      </label>
                      <span className="text-xs font-black text-rose-600 font-mono">{stayNights} 晚</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="7"
                        value={stayNights}
                        onChange={(e) => setStayNights(Number(e.target.value))}
                        className="flex-1 accent-rose-500 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 font-sans font-bold">最长预定 7 晚</span>
                    </div>
                  </div>

                  {/* Cost Calculator Section */}
                  <div className="bg-rose-500/5 border border-rose-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 font-sans flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-rose-500" />
                        <span>预订账单明细</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        ¥{(selectedAcc.roomTypes[activeRoomType] || selectedAcc.roomTypes[0]).price} × {stayNights} 晚 + 免服务费
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-rose-500 font-black font-sans block">全包价总额</span>
                      <span className="text-lg font-black text-rose-600 font-mono">
                        ¥{((selectedAcc.roomTypes[activeRoomType] || selectedAcc.roomTypes[0]).price * stayNights).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Submit button with animated spring effect */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedAcc(null)}
                      className="px-4 py-2.5 text-xs font-bold font-sans text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                    >
                      我再想想
                    </button>
                    <button
                      type="submit"
                      className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-md shadow-rose-200/50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>模拟确认支付 ¥{((selectedAcc.roomTypes[activeRoomType] || selectedAcc.roomTypes[0]).price * stayNights).toLocaleString()}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Animated Boarding Ticket success voucher */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 py-2"
                >
                  <div className="text-center pb-2">
                    <div className="inline-flex p-3 bg-emerald-50 rounded-full text-emerald-500 mb-2 border border-emerald-100">
                      <CheckCircle2 className="w-8 h-8 animate-bounce text-emerald-600" />
                    </div>
                    <h4 className="font-headline font-black text-slate-800 text-lg">预订已被安全确认！</h4>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">已与大理/三亚慢生活系统实时同步登记</p>
                  </div>

                  {/* The boarding pass / invoice card */}
                  <div className="relative rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/30 p-5 overflow-hidden">
                    {/* Circle punch holes on sides to simulate actual paper tickets */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-rose-200" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-rose-200" />

                    <div className="flex justify-between items-start border-b border-rose-100/60 pb-3 mb-3">
                      <div>
                        <span className="text-[9.5px] font-black text-rose-500 bg-rose-100/50 px-2 py-0.5 rounded-full font-sans uppercase">
                          SLOW STAY VOUCHER
                        </span>
                        <h5 className="font-headline font-black text-slate-800 text-sm mt-1">{bookingDetails.hotelName}</h5>
                      </div>
                      <span className="font-mono text-xs font-black text-slate-700 bg-white/80 select-user px-2 py-1 rounded border border-rose-200/50">
                        {bookingDetails.trackingCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[10px] text-slate-400 font-sans">预约主客 (Guest)</p>
                        <p className="font-bold text-slate-800 mt-0.5">{bookingDetails.guestName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-sans">留驻时间 (Dates)</p>
                        <p className="font-bold text-rose-600 mt-0.5 font-mono">{bookingDetails.dateRange}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-sans">选配客房 (Suite Category)</p>
                        <p className="font-bold text-slate-800 mt-0.5">{bookingDetails.roomName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-sans">住店天数 (Nights)</p>
                        <p className="font-bold text-slate-800 mt-0.5 font-mono">{bookingDetails.stayNights} 晚奢享</p>
                      </div>
                    </div>

                    <div className="border-t border-rose-100/60 pt-3 mt-3 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-slate-400 font-sans">本期应付全包款额</p>
                        <p className="text-xs font-medium text-slate-400 font-sans">免订房手续费、退房保障中</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-rose-650 font-mono text-rose-600">
                          ¥{bookingDetails.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Simple barcode simulation just as specified in premium visual goals */}
                    <div className="mt-4 flex flex-col items-center gap-1">
                      <div className="flex gap-0.5 h-6 opacity-60">
                        {[2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3, 2, 1, 3, 2, 4, 2].map((w, i) => (
                          <div key={i} className="bg-slate-800 h-full" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                        AUTHENTIC TRAVEL AGENT VOUCHER
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-2xl flex items-start gap-2">
                    <Car className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                      <strong>🐢 龟小旅出行对齐：</strong>已通过 API 自动接入我们在右侧对齐的地图。您可点击下方对齐地图查看，系统已估算出此居所与您的慢调行程第一天接驳点相距约 <span className="font-mono font-bold text-primary">3.2 km</span>。
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedAcc(null)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-sans font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      签发收据并关闭
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
