import React from 'react';
import { Recipe, IngredientItem } from '../types';
import { X, Clock, BarChart, ChefHat, ShoppingCart, ArrowRight } from 'lucide-react';

interface Props {
  recipe: Recipe | null;
  onClose: () => void;
  onAddToShoppingList: (items: IngredientItem[], recipeName: string) => void;
}

const RecipeModal: React.FC<Props> = ({ recipe, onClose, onAddToShoppingList }) => {
  if (!recipe) return null;

  const missingIngredients = recipe.ingredients.filter(i => i.isMissing);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-cny-red text-white p-4 sm:p-6 flex justify-between items-start relative">
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')]"></div>
             <div className="z-10 pr-8">
                 <h2 className="text-2xl sm:text-3xl font-bold font-cursive mb-2">{recipe.name}</h2>
                 <div className="flex gap-4 text-sm opacity-90">
                     <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {recipe.time}</span>
                     <span className="flex items-center"><ChefHat className="w-4 h-4 mr-1"/> {recipe.difficulty}</span>
                     <span className="flex items-center"><BarChart className="w-4 h-4 mr-1"/> {recipe.nutrition.calories} kcal</span>
                 </div>
             </div>
             <button 
                onClick={onClose} 
                className="z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
             >
                 <X className="w-6 h-6" />
             </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
            
            {/* Ingredients Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center border-l-4 border-cny-gold pl-2">
                    🛒 食材清单
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ing, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border ${ing.isMissing ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                            <div className="flex flex-col">
                                <span className={`font-medium ${ing.isMissing ? 'text-red-700' : 'text-green-700'}`}>{ing.name}</span>
                                {ing.substitution && ing.isMissing && (
                                    <span className="text-xs text-gray-500 mt-0.5">💡 替代建议: {ing.substitution}</span>
                                )}
                            </div>
                            <span className="text-sm text-gray-600 font-mono">{ing.amount}</span>
                        </div>
                    ))}
                </div>
                {missingIngredients.length > 0 && (
                     <button
                        onClick={() => onAddToShoppingList(missingIngredients, recipe.name)}
                        className="mt-3 w-full py-2 bg-cny-gold/20 text-yellow-800 border border-cny-gold rounded-lg hover:bg-cny-gold hover:text-white transition-colors flex items-center justify-center text-sm font-bold"
                     >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        将 {missingIngredients.length} 个缺货食材加入购物清单
                     </button>
                )}
            </div>

            {/* Steps Section */}
            <div>
                 <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center border-l-4 border-cny-red pl-2">
                    🔥 烹饪步骤
                </h3>
                <div className="space-y-4">
                    {recipe.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cny-red text-white flex items-center justify-center text-xs font-bold mt-0.5">
                                {idx + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Nutrition Section */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">营养分析 & 建议</h3>
                <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                    <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-xs text-gray-400">蛋白质</div>
                        <div className="font-bold text-gray-800">{recipe.nutrition.protein}</div>
                    </div>
                     <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-xs text-gray-400">碳水</div>
                        <div className="font-bold text-gray-800">{recipe.nutrition.carbs}</div>
                    </div>
                     <div className="bg-white p-2 rounded shadow-sm">
                        <div className="text-xs text-gray-400">脂肪</div>
                        <div className="font-bold text-gray-800">{recipe.nutrition.fat}</div>
                    </div>
                </div>
                <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-3">
                    "{recipe.nutrition.tips}"
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
