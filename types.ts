export interface Ingredient {
  id: string;
  name: string;
  category: string;
  quantity?: string;
}

export enum RecipeDifficulty {
  Easy = '简单',
  Medium = '中等',
  Hard = '复杂'
}

export interface IngredientItem {
  name: string;
  amount: string;
  isMissing: boolean;
  substitution?: string; // AI suggestion for substitution
}

export interface NutritionInfo {
  calories: number; // kcal
  protein: string;
  carbs: string;
  fat: string;
  tips: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: IngredientItem[];
  steps: string[];
  time: string; // e.g., "30分钟"
  difficulty: RecipeDifficulty;
  cuisine: string; // e.g., "川菜", "粤菜"
  taste: string; // e.g., "麻辣", "清淡"
  nutrition: NutritionInfo;
  imageUrl?: string; // We will use placeholders or generated ones
}

export interface FilterState {
  cuisine: string[];
  taste: string[];
  maxTime: string; // '15', '30', '60', 'all'
  difficulty: string[];
  recipeCount: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
  recipeName?: string;
}

export const CATEGORIES = [
  { id: 'veg', name: '蔬菜', icon: '🥬' },
  { id: 'meat', name: '肉类', icon: '🥩' },
  { id: 'seafood', name: '海鲜', icon: '🦐' },
  { id: 'staple', name: '主食', icon: '🍚' },
  { id: 'seasoning', name: '调料', icon: '🧂' },
  { id: 'other', name: '其他', icon: '🥚' },
];

export const COMMON_INGREDIENTS: Record<string, string[]> = {
  veg: ['土豆', '西红柿', '青菜', '胡萝卜', '西兰花', '茄子', '白菜'],
  meat: ['猪肉', '鸡肉', '牛肉', '排骨', '五花肉'],
  seafood: ['虾', '鱼', '蛤蜊'],
  staple: ['米饭', '面条', '鸡蛋', '豆腐'],
  seasoning: ['酱油', '盐', '葱', '姜', '蒜', '辣椒', '醋', '料酒'],
  other: ['火腿肠', '培根', '芝士']
};