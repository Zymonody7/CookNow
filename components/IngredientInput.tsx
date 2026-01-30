import React, { useState } from 'react';
import { CATEGORIES, COMMON_INGREDIENTS, Ingredient } from '../types';
import { Plus, X, Search, Save, CookingPot, Scroll, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  onSaveCombo: () => void;
  savedCombos: { name: string; ingredients: Ingredient[] }[];
  onLoadCombo: (combo: Ingredient[]) => void;
  onDeleteCombo: (index: number) => void;
}

const FORTUNES = [
  "大吉：今日下厨，如有神助，调味一气呵成！",
  "宜：尝试一道从未做过的菜，会有意外惊喜。",
  "财运：多吃生菜（生财），多吃腐竹（富足）。",
  "桃花：做一道甜品，甜蜜蜜，旺桃花。",
  "适宜：大火爆炒，日子红红火火！",
  "灶神提示：记得少放盐，健康第一。",
  "上上签：今晚的肉会炖得特别软烂入味。",
  "宜：与家人分享美食，团团圆圆。",
  "马年大吉：马不停蹄吃大餐，马上发财！",
  "运势：厨房是你今日的聚宝盆。"
];

const IngredientInput: React.FC<Props> = ({ ingredients, setIngredients, onSaveCombo, savedCombos, onLoadCombo, onDeleteCombo }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [customInput, setCustomInput] = useState('');
  
  // Fortune Game State
  const [fortune, setFortune] = useState<string>("");
  const [isShaking, setIsShaking] = useState(false);

  const addIngredient = (name: string, category: string) => {
    if (ingredients.some(i => i.name === name)) return;
    const newIngredient: Ingredient = {
      id: Date.now().toString() + Math.random(),
      name,
      category,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleCustomAdd = () => {
    if (!customInput.trim()) return;
    addIngredient(customInput.trim(), 'other');
    setCustomInput('');
  };

  const handleDrawFortune = () => {
    setIsShaking(true);
    setFortune("求签中...");
    setTimeout(() => {
        const random = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        setFortune(random);
        setIsShaking(false);
    }, 800);
  };

  const filteredCommon = COMMON_INGREDIENTS[activeCategory].filter(item => 
    item.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Kitchen God's Fortune (Mini Game) */}
      <div className="bg-cny-lightGold border border-cny-gold/50 rounded-xl p-4 flex items-center justify-between relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
              <Sparkles className="w-24 h-24 text-cny-gold" />
          </div>
          
          <div className="flex items-center z-10 flex-grow pr-2">
             <div className={`bg-cny-red text-white p-2.5 rounded-full mr-3 border-2 border-cny-gold shadow-sm ${isShaking ? 'animate-bounce' : ''}`}>
                <Scroll className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-cny-darkRed font-serif">灶神灵签</h3>
                <p className={`text-xs text-yellow-800 transition-opacity duration-300 ${isShaking ? 'opacity-50' : 'opacity-100'}`}>
                    {fortune || "今日宜忌，抽签便知..."}
                </p>
             </div>
          </div>
          
          <button 
             onClick={handleDrawFortune}
             disabled={isShaking}
             className="z-10 flex-shrink-0 px-4 py-1.5 bg-cny-red text-white text-xs font-bold rounded-full shadow-md active:scale-95 transition-all hover:bg-cny-darkRed border border-cny-gold/30"
          >
             {fortune ? "再抽一次" : "求签"}
          </button>
       </div>

      {/* 2. Ingredient Treasure Pot (Replaces Fridge) */}
      <div className="relative transform transition-all hover:scale-[1.01]">
        {/* Pot Visuals */}
        <div className="bg-gradient-to-b from-cny-red to-cny-darkRed rounded-b-[2rem] rounded-t-lg shadow-card relative overflow-hidden">
           {/* Gold Rim */}
           <div className="h-3 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#BF953F] rounded-t-lg shadow-md z-20 relative"></div>
           
           {/* Decorative Background Pattern inside Pot */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')] z-0"></div>

           <div className="p-4 pt-5 relative z-10 min-h-[140px] flex flex-col">
                {/* Header inside Pot */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white font-bold flex items-center text-lg font-cursive tracking-wide drop-shadow-md">
                        <CookingPot className="w-6 h-6 mr-2 text-cny-gold fill-cny-gold/20" /> 
                        食材聚宝盆
                    </h2>
                    
                    <div className="flex items-center gap-2">
                        {ingredients.length > 0 && (
                            <button onClick={onSaveCombo} className="text-xs text-cny-lightGold hover:text-white flex items-center bg-black/20 px-2 py-1 rounded-full transition-colors">
                                <Save className="w-3 h-3 mr-1" /> 存组合
                            </button>
                        )}
                        <span className="text-xs bg-cny-gold text-cny-darkRed px-2 py-1 rounded-full font-bold shadow-sm border border-white/20">
                            {ingredients.length} 味珍馐
                        </span>
                    </div>
                </div>
                
                {/* Ingredients Area */}
                <div className="flex flex-wrap gap-2 mb-2">
                     {ingredients.length === 0 ? (
                         <div className="w-full py-6 text-center text-white/40 text-sm flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                             <CookingPot className="w-10 h-10 mb-2 opacity-50" />
                             <p>快往盆里加点好吃的，坐等开饭~</p>
                         </div>
                     ) : (
                        ingredients.map(ing => (
                          <div key={ing.id} className="animate-in zoom-in duration-300 bg-white/10 backdrop-blur-sm border border-white/20 text-white pl-3 pr-2 py-1.5 rounded-xl shadow-sm flex items-center text-sm hover:bg-white/20 transition-colors">
                            <span className="drop-shadow-sm">{ing.name}</span>
                            <button onClick={() => removeIngredient(ing.id)} className="ml-2 text-white/60 hover:text-white rounded-full hover:bg-red-900/50 p-0.5">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                     )}
                </div>
           </div>
           
           {/* Bottom auspicious text */}
           <div className="bg-black/10 py-1 text-center">
               <span className="text-[10px] text-cny-gold/60 font-serif tracking-[0.3em]">日进斗金 · 马上开饭</span>
           </div>
        </div>
        
        {/* Saved Combos Hanging Tags */}
        {savedCombos.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide px-1">
                {savedCombos.map((combo, idx) => (
                    <div key={idx} className="flex-shrink-0 relative group">
                        <div className="bg-cny-lightGold border border-cny-gold text-cny-darkRed text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center cursor-pointer hover:bg-yellow-100 transition-colors">
                            <span onClick={() => onLoadCombo(combo.ingredients)} className="font-bold mr-1">🔖 {combo.name}</span>
                            <button onClick={() => onDeleteCombo(idx)} className="opacity-40 hover:opacity-100 ml-1"><X className="w-3 h-3"/></button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* 3. Market Selection (Input Area) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
        <h2 className="text-lg font-bold text-gray-800 mb-4 font-serif flex items-center">
            <span className="w-1 h-5 bg-cny-red rounded-full mr-2"></span>
            逛菜市场
        </h2>

        {/* Custom Input */}
        <div className="relative mb-5 group">
            <input
                type="text"
                value={customInput}
                onChange={(e) => {
                    setCustomInput(e.target.value);
                    setSearchTerm(e.target.value);
                }}
                placeholder="搜索或输入食材..."
                className="w-full bg-gray-50 border-none rounded-xl py-3 pl-11 pr-14 text-gray-700 focus:ring-2 focus:ring-cny-gold/50 transition-all shadow-inner group-hover:bg-gray-100 focus:bg-white"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-hover:text-cny-gold transition-colors" />
            <button 
                onClick={handleCustomAdd}
                disabled={!customInput}
                className="absolute right-2 top-2 p-1.5 bg-cny-gold text-white rounded-lg disabled:opacity-30 disabled:bg-gray-300 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {/* Categories Tab */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl transition-all duration-300 border ${
                        activeCategory === cat.id
                            ? 'bg-cny-red text-white shadow-md transform scale-105 border-cny-red'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border-gray-100'
                    }`}
                >
                    <span className="text-xl mb-1 filter drop-shadow-sm">{cat.icon}</span>
                    <span className="text-xs font-medium">{cat.name}</span>
                </button>
            ))}
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
            {filteredCommon.map(item => {
                const isSelected = ingredients.some(i => i.name === item);
                return (
                    <button
                        key={item}
                        onClick={() => addIngredient(item, activeCategory)}
                        disabled={isSelected}
                        className={`py-2 px-1 rounded-lg text-sm text-center transition-all ${
                            isSelected
                                ? 'bg-gray-100 text-gray-300 cursor-default scale-95'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-cny-gold hover:text-cny-darkRed hover:shadow-md hover:-translate-y-0.5'
                        }`}
                    >
                        {item}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;
