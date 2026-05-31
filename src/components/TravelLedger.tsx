import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  ChevronRight, 
  Check, 
  Percent, 
  HelpCircle,
  Coffee,
  Car,
  Palmtree,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Info
} from 'lucide-react';
import { Trip } from '../types';

interface TravelLedgerProps {
  trip: Trip;
  showToast: (text: string) => void;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: 'food' | 'transport' | 'activity' | 'hotel' | 'gift' | 'other';
  amount: number;
  isPaid: boolean;
  date: string;
}

// Destination-specific typical preset expenses to make the tool immediately alive & interesting!
const DESTINATION_PRESETS: Record<string, Omit<ExpenseItem, 'id' | 'date'>[]> = {
  "云南大理与丽江": [
    { title: "双廊洱海手摇木船泛舟", category: 'activity', amount: 180, isPaid: true },
    { title: "喜洲阿妈手工草木扎染DIY", category: 'activity', amount: 80, isPaid: false },
    { title: "寂照庵多肉禅意斋饭(2人份)", category: 'food', amount: 40, isPaid: true },
    { title: "沙溪古镇四方街手冲玫瑰咖啡", category: 'food', amount: 38, isPaid: false },
    { title: "白族特色酸木瓜野生鱼晚餐", category: 'food', amount: 168, isPaid: true },
    { title: "丽江古城私人专车接机单程", category: 'transport', amount: 150, isPaid: true },
  ],
  "海南三亚": [
    { title: "太阳湾椰林树下手工清补凉", category: 'food', amount: 28, isPaid: true },
    { title: "私人豪华游艇桨板3小时出海", category: 'activity', amount: 1200, isPaid: false },
    { title: "海湾公路奔驰专车接机", category: 'transport', amount: 300, isPaid: true },
    { title: "崖州古城手工红豆椰椰冻", category: 'food', amount: 32, isPaid: true },
    { title: "免税店手工海南黄花梨手串手作礼品", category: 'gift', amount: 380, isPaid: false },
  ]
};

const DEFAULT_PRESETS: Omit<ExpenseItem, 'id' | 'date'>[] = [
  { title: "景区专属特色手账纪念册", category: 'gift', amount: 58, isPaid: true },
  { title: "本地居民特色风味午餐餐标", category: 'food', amount: 120, isPaid: false },
  { title: "全天备用景区接驳电瓶车套票", category: 'transport', amount: 45, isPaid: true },
];

export default function TravelLedger({ trip, showToast }: TravelLedgerProps) {
  // Budget State
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem(`manman_ledger_budget_${trip.id}`);
    return saved ? parseFloat(saved) : 5000;
  });

  // Expense Items list state
  const [items, setItems] = useState<ExpenseItem[]>([]);

  // Add Item form states
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseItem['category']>('food');
  const [newAmount, setNewAmount] = useState('');
  const [newIsPaid, setNewIsPaid] = useState(false);

  // Load items from localStorage based on current trip UUID
  useEffect(() => {
    const key = `manman_ledger_items_${trip.id}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        loadDefaultPresets();
      }
    } else {
      loadDefaultPresets();
    }

    // Load budget limit
    const savedBudget = localStorage.getItem(`manman_ledger_budget_${trip.id}`);
    setBudgetLimit(savedBudget ? parseFloat(savedBudget) : 5000);
  }, [trip.id]);

  // Save budget changes
  useEffect(() => {
    localStorage.setItem(`manman_ledger_budget_${trip.id}`, budgetLimit.toString());
  }, [budgetLimit, trip.id]);

  // Helper to load presets
  const loadDefaultPresets = () => {
    const matchedPresets = DESTINATION_PRESETS[trip.destination] || DEFAULT_PRESETS;
    const formatted: ExpenseItem[] = matchedPresets.map((p, index) => ({
      ...p,
      id: `preset-${index}-${Date.now()}`,
      date: `Day ${Math.min(index + 1, trip.daysCount)}`
    }));
    setItems(formatted);
    localStorage.setItem(`manman_ledger_items_${trip.id}`, JSON.stringify(formatted));
  };

  // Sync items to localStorage
  const saveItems = (updatedItems: ExpenseItem[]) => {
    setItems(updatedItems);
    localStorage.setItem(`manman_ledger_items_${trip.id}`, JSON.stringify(updatedItems));
  };

  // Form Submit Action
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('⚠️ 请输入记账支出项的名称');
      return;
    }
    
    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('⚠️ 请输入正确的支出金额（需大于 0）');
      return;
    }

    const newItem: ExpenseItem = {
      id: `item-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      amount: amt,
      isPaid: newIsPaid,
      date: `Day ${Math.floor(Math.random() * trip.daysCount) + 1}`
    };

    const newItems = [newItem, ...items];
    saveItems(newItems);
    
    // Clear form
    setNewTitle('');
    setNewAmount('');
    setNewIsPaid(false);
    setIsAdding(false);
    showToast(`📝 已成功入账：“${newItem.title}” ¥${newItem.amount}`);
  };

  // Toggle paid status
  const togglePaidStatus = (itemId: string) => {
    const updated = items.map(itm => {
      if (itm.id === itemId) {
        const nextState = !itm.isPaid;
        showToast(nextState ? `✅ 已核销："${itm.title}" 标记为已支付` : `⏳ 挂起："${itm.title}" 标记为还款待结`);
        return { ...itm, isPaid: nextState };
      }
      return itm;
    });
    saveItems(updated);
  };

  // Remove Item
  const handleDeleteItem = (itemId: string, title: string) => {
    const updated = items.filter(itm => itm.id !== itemId);
    saveItems(updated);
    showToast(`🗑️ 已移除账目: "${title}"`);
  };

  // Fast-import single preset clicker
  const handleImportSinglePreset = (preset: Omit<ExpenseItem, 'id' | 'date'>) => {
    const newItem: ExpenseItem = {
      ...preset,
      id: `item-${Date.now()}-${Math.random()}`,
      date: `Day ${Math.floor(Math.random() * trip.daysCount) + 1}`
    };
    saveItems([newItem, ...items]);
    showToast(`⚡ 快速记账: "${newItem.title}" ¥${newItem.amount}`);
  };

  // Calculations for Ledger Widget Panel
  const totalExpenses = items.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = items.reduce((sum, item) => sum + (item.isPaid ? item.amount : 0), 0);
  const totalUnpaid = totalExpenses - totalPaid;
  const budgetProgressPercent = Math.min(Math.round((totalExpenses / budgetLimit) * 100), 100);

  // Category Colors Map
  const categoryMeta = {
    food: { label: '膳食赏味 🍱', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    transport: { label: '交通接驳 🚗', color: 'bg-sky-100 text-sky-800 border-sky-200' },
    activity: { label: '惬意玩娱 🎨', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    hotel: { label: '慢奢雅居 🏨', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    gift: { label: '慢手信物 🎁', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    other: { label: '日常杂散 🛍️', color: 'bg-slate-100 text-slate-800 border-slate-200' }
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Banner - Slow Living inspired aesthetics */}
      <div className="bg-gradient-to-r from-[#eff5f3] to-amber-50/50 dark:from-slate-900/60 dark:to-emerald-950/20 p-6 rounded-3xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-primary text-on-primary-container rounded-2xl shadow-md shrink-0">
            <Wallet className="w-6 h-6 text-[#1a4231]" />
          </div>
          <div>
            <h3 className="font-headline font-black text-slate-850 dark:text-slate-100 text-base md:text-lg flex items-center gap-1.5 leading-snug">
              <span>慢活小账本 (Slow Living Ledger)</span>
              <Sparkles className="w-4.5 h-4.5 text-primary fill-primary/30" />
            </h3>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
              用于记录和核对当前「{trip.name}」的非包价自费开支。在这里理清每一份闲适所付，保持旅居宁静。
            </p>
          </div>
        </div>

        {/* Reset ledger database helper */}
        <button
          onClick={() => {
            if (window.confirm('确定要清空并重置当前行程的账目数据吗？')) {
              loadDefaultPresets();
              showToast('🔄 已重新加载默认推荐支出预设项！');
            }
          }}
          className="text-xs font-mono font-black border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-500 hover:text-slate-800 px-3.5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
        >
          重置默认预设
        </button>
      </div>

      {/* Main Stats Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        {/* Total Cost & Budget progress tracker */}
        <div className="bg-white/95 backdrop-blur shadow-sm rounded-3xl border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-[900] uppercase text-slate-400 font-sans tracking-larger">累计自费预算盘点</span>
              <span className={`text-[10.5px] font-black px-2 py-0.5 rounded-full ${totalExpenses > budgetLimit ? 'bg-red-100 text-red-700' : 'bg-primary-container text-[#1a4231]'}`}>
                {budgetProgressPercent}%
              </span>
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-mono font-black text-slate-800">¥{totalExpenses.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-semibold font-sans">
                / 额度 ¥
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => {
                    const l = parseFloat(e.target.value);
                    if (!isNaN(l) && l > 0) setBudgetLimit(l);
                  }}
                  className="w-16 bg-slate-50 text-slate-700 font-bold border-none underline px-1 py-0.5 focus:ring-1 focus:ring-primary rounded"
                  title="点击修改最大预算额度"
                />
              </span>
            </div>
          </div>

          <div className="mt-4">
            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${totalExpenses > budgetLimit ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${budgetProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] font-sans text-slate-400 font-medium">
              {totalExpenses > budgetLimit ? (
                <span className="text-red-600 font-bold">⚠️ 额外开支已超出设定的 ¥{budgetLimit} 预算预警额度</span>
              ) : (
                <span>离预算上限还可余裕记录支出 ¥{(budgetLimit - totalExpenses).toLocaleString()} 元</span>
              )}
            </p>
          </div>
        </div>

        {/* Paid and Cleaned Account panel */}
        <div className="bg-white/95 backdrop-blur shadow-sm rounded-3xl border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-[900] uppercase text-slate-400 font-sans tracking-larger">已当场结清费用 (核销)</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-mono font-black text-emerald-600">¥{totalPaid.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-semibold font-sans">全额已付</span>
            </div>
          </div>
          <div className="mt-4 bg-emerald-50/50 border border-emerald-100/50 p-2 rounded-xl text-left">
            <p className="text-[10px] font-sans text-emerald-800 font-semibold leading-relaxed">
              💡 随拿随付有助于减少长线旅行的集中财务压力。大部分惬意手款已用微信/支付宝支付结清。
            </p>
          </div>
        </div>

        {/* Unpaid / Pending Account panel */}
        <div className="bg-white/95 backdrop-blur shadow-sm rounded-3xl border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-[900] uppercase text-slate-400 font-sans tracking-larger">离店待结或记账尾款</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-mono font-black text-amber-600">¥{totalUnpaid.toLocaleString()}</span>
              <span className="text-xs text-slate-400 font-semibold font-sans">待结余额</span>
            </div>
          </div>
          <div className="mt-4 bg-amber-50/50 border border-amber-100/50 p-2 rounded-xl text-left">
            <p className="text-[10px] font-sans text-amber-800 font-semibold leading-relaxed">
              🛎️ 包含即将退房时的特聘导向费、预订押金等。单击明细即可标记为已支付。
            </p>
          </div>
        </div>
      </div>

      {/* Grid containing Ledger List vs Fast preset additions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
        {/* Left main: Ledger List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/95 shadow-sm border border-slate-100 rounded-3xl p-5">
            {/* Header section inside lists panel */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
              <div>
                <h4 className="text-sm font-headline font-black text-slate-800">记账支出项列表</h4>
                <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">
                  共有 {items.length} 笔自费项目 • 支持点击左侧圆形图标核对结款状态
                </p>
              </div>

              {/* Toggle Form Expansion Button */}
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="bg-primary hover:bg-[#6bd40f] text-on-primary-container border-b-[2px] border-on-primary-container text-xs font-black p-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isAdding ? '收起面板' : '记一笔支出'}
                <Plus className={`w-3.5 h-3.5 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
              </button>
            </div>

            {/* Quick form for adding single expense inline inside list */}
            <AnimatePresence>
              {isAdding && (
                <motion.form
                  onSubmit={handleAddItem}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 p-4 mb-4 space-y-4 shadow-inner"
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    ✍️ 录入单笔账单开销
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">支出事项名称</label>
                      <input
                        type="text"
                        placeholder="如: 古树茶、手作纪念礼品..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 block"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">支出金额 (元 ¥)</label>
                      <input
                        type="number"
                        placeholder="金额，如 120"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 block"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 mb-1">消费类别</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as ExpenseItem['category'])}
                        className="w-full bg-white text-slate-800 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 block"
                      >
                        <option value="food">膳食尝味 🍱</option>
                        <option value="transport">交通出行 🚗</option>
                        <option value="activity">惬意娱娱 🎨</option>
                        <option value="hotel">慢宿算费 🏨</option>
                        <option value="gift">慢慢心意 🎁</option>
                        <option value="other">日常支出 🛍️</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-600 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newIsPaid}
                        onChange={(e) => setNewIsPaid(e.target.checked)}
                        className="rounded border-slate-350 text-primary focus:ring-primary/40 w-4 h-4"
                      />
                      <span>当场一键已付 (标记为已结付)</span>
                    </label>

                    <button
                      type="submit"
                      className="bg-[#1a4231] hover:bg-[#123023] text-white text-xs font-black py-2 px-5 rounded-xl cursor-pointer shadow"
                    >
                      录入账簿 ✓
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Expenses List */}
            {items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Coffee className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-bold tracking-wider">当前账簿空空如也</p>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  快点击右上角“记一笔支出”，或者右侧的“一键预设推荐导入”，将大理慢游的各路小开支填入其中吧。
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {items.map((item) => {
                    const meta = categoryMeta[item.category] || categoryMeta.other;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                          item.isPaid 
                            ? 'bg-emerald-50/20 border-slate-100 hover:border-emerald-100/50' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {/* Left side: check, title and tag */}
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                          {/* Checkbox button */}
                          <button
                            type="button"
                            onClick={() => togglePaidStatus(item.id)}
                            className="p-1 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-primary cursor-pointer shrink-0"
                            title={item.isPaid ? '标记为待付款' : '标记为已付款'}
                          >
                            {item.isPaid ? (
                              <CheckCircle className="w-5.5 h-5.5 text-emerald-500 fill-emerald-100/30" />
                            ) : (
                              <Circle className="w-5.5 h-5.5 text-slate-300 stroke-[2px]" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <p className={`text-xs font-extrabold text-slate-750 truncate ${item.isPaid ? 'line-through text-slate-400' : ''}`}>
                              {item.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${meta.color}`}>
                                {meta.label}
                              </span>
                              <span className="text-[9.5px] font-mono text-slate-400 font-bold">
                                {item.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right side: Amount and delete action */}
                        <div className="flex items-center space-x-4 shrink-0">
                          <div className="text-right">
                            <p className={`text-sm font-mono font-black ${item.isPaid ? 'text-slate-400' : 'text-slate-800'}`}>
                              ¥{item.amount.toLocaleString()}
                            </p>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-wider">
                              {item.isPaid ? (
                                <span className="text-emerald-600">已付清</span>
                              ) : (
                                <span className="text-amber-600">待结付款</span>
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                            title="删除此笔账目"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Presets Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick presets list for active destinations */}
          <div className="bg-white/95 backdrop-blur shadow-sm rounded-3xl border border-slate-100 p-5">
            <h4 className="text-xs font-headline font-black text-slate-800 mb-1 flex items-center gap-1">
              <span>一键导入推荐开销</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
            </h4>
            <p className="text-[10px] text-slate-450 font-sans mb-3 font-semibold leading-relaxed">
              基于「<strong>{trip.destination}</strong>」推荐的本地民俗活动/必吃美食的经典开支参考：
            </p>

            <div className="space-y-2">
              {((DESTINATION_PRESETS[trip.destination] || DEFAULT_PRESETS)).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleImportSinglePreset(preset)}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-150 transition-all flex items-center justify-between text-xs font-bold group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-slate-700 truncate group-hover:text-primary transition-colors text-[11px]">{preset.title}</p>
                    <span className="text-[9px] text-slate-400 mt-0.5 inline-block capitalize font-black">
                      {preset.category === 'food' ? '🍱 食' : preset.category === 'activity' ? '🎨 玩' : preset.category === 'transport' ? '🚗 途' : '🎁 信'}建议
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="font-mono font-black text-slate-700 text-xs shrink-0">¥{preset.amount}</span>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-transform group-hover:scale-125" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Useful Tips for slow budget management */}
          <div className="bg-[#1a4231] text-white rounded-3xl p-5 border border-[#1a4231] shadow-md">
            <div className="flex items-center space-x-2 pb-2.5 border-b border-white/10 mb-3">
              <Info className="w-4 h-4 text-amber-200" />
              <h4 className="text-xs font-headline font-black text-white">龟小旅的慢慢理财箴言</h4>
            </div>
            <ul className="text-[11px] font-sans text-emerald-100 space-y-2.5 font-medium leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-200 font-extrabold select-none">🐢</span>
                <span><strong>不徐不忙</strong>：慢生活的真谛不仅体现在日程中，也应该体现在消费上。多购买非遗与民俗体验，比起纯打卡式买门票，更能滋养灵魂。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-200 font-extrabold select-none">🐢</span>
                <span><strong>落笔清晰</strong>：每当租借自行车、洱海摇橹或享用酸瓜鱼后，随手点一点，避免回家核算产生“不知钱去何方”的焦虑。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
