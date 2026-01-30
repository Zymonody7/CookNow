import React from 'react';
import { Recipe, RecipeDifficulty } from '../types';
import { Clock, ChefHat, Flame, ChevronRight } from 'lucide-react';

interface Props {
  recipe: Recipe;
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const RecipeCard: React.FC<Props> = ({ recipe, onClick, isFavorite, onToggleFavorite }) => {
  const missingCount = recipe.ingredients.filter(i => i.isMissing).length;

  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-card overflow-hidden cursor-pointer transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg border border-transparent hover:border-cny-gold/30 flex flex-col h-full relative"
    >
      {/* Favorite Button (Absolute) */}
       <button 
          onClick={onToggleFavorite}
          className="absolute top-0 right-4 z-20 w-8 h-10 bg-cny-red text-white rounded-b-lg shadow-md flex items-center justify-center transition-transform hover:scale-110"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2" 
            className={`w-5 h-5 ${isFavorite ? 'text-cny-gold' : 'text-white/80'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>

      {/* Decorative Header Area */}
      <div className="h-24 bg-gradient-to-r from-cny-red to-cny-darkRed relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')]"></div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="p-4 pt-6">
            <h3 className="text-white text-xl font-cursive truncate pr-8 drop-shadow-md">
            {recipe.name}
            </h3>
            <div className="text-white/80 text-xs font-serif flex items-center mt-1">
                {recipe.cuisine} · {recipe.taste}
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        
        {/* Info Tags */}
        <div className="flex gap-2 mb-4 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> {recipe.time}
            </span>
             <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 flex items-center">
                <Flame className="w-3 h-3 mr-1" /> {recipe.nutrition.calories} kcal
            </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
            {recipe.nutrition.tips || recipe.description || "适合全家享用的美味佳肴。"}
        </p>

        {/* Footer Status */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
             {missingCount > 0 ? (
                <span className="text-xs font-bold text-cny-accent">
                   需补 {missingCount} 样食材
                </span>
            ) : (
                <span className="text-xs font-bold text-green-600">
                    食材齐全
                </span>
            )}
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-cny-gold group-hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
