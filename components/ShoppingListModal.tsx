import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2, Share2, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onClearList: () => void;
}

const ShoppingListView: React.FC<Props> = ({ items, onToggleItem, onClearList }) => {
  const groupedItems = items.reduce((acc, item) => {
    const key = item.recipeName || '通用';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const completedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (items.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 animate-in fade-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">清单空空如也</h3>
              <p className="text-gray-500">在生成食谱后，将缺少的食材加入这里。</p>
          </div>
      )
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 sticky top-4 z-10 border border-gray-100">
         <div className="flex justify-between items-end mb-2">
             <div>
                 <h2 className="text-2xl font-bold text-cny-darkRed font-serif">采购清单</h2>
                 <p className="text-gray-400 text-xs mt-1">马年团圆饭，一样都不能少</p>
             </div>
             <div className="text-right">
                 <span className="text-3xl font-bold text-cny-gold">{completedCount}</span>
                 <span className="text-gray-400 text-sm">/{items.length}</span>
             </div>
         </div>
         {/* Progress Bar */}
         <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
             <div 
                className="bg-gradient-to-r from-cny-gold to-cny-accent h-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
             ></div>
         </div>
      </div>

      <div className="space-y-6">
        {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).map(([category, categoryItems]) => (
            <div key={category} className="bg-white rounded-2xl p-5 shadow-card border-l-4 border-cny-red">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-cny-red mr-2"></span>
                    {category}
                </h3>
                <div className="space-y-3">
                    {categoryItems.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => onToggleItem(item.id)}
                            className="flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center">
                                <button className={`mr-3 transition-colors ${item.checked ? 'text-green-500' : 'text-gray-300 group-hover:text-cny-gold'}`}>
                                    {item.checked ? <CheckCircle2 className="w-6 h-6 fill-green-50" /> : <Circle className="w-6 h-6" />}
                                </button>
                                <div>
                                    <p className={`font-medium transition-all ${item.checked ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-400">{item.amount}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
          <button 
            onClick={onClearList}
            className="flex items-center px-6 py-3 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors text-sm font-bold"
          >
              <Trash2 className="w-4 h-4 mr-2" /> 清空已完成
          </button>
      </div>
    </div>
  );
};

export default ShoppingListView;