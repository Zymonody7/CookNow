'use client'

import React, { useState, useEffect } from 'react'
import {
  Ingredient,
  Recipe,
  FilterState,
  ShoppingItem,
  IngredientItem
} from '../../types'
import IngredientInput from '../../components/IngredientInput'
import RecipeCard from '../../components/RecipeCard'
import RecipeModal from '../../components/RecipeModal'
import ShoppingListView from '../../components/ShoppingListModal'
import {
  ChefHat,
  Heart,
  Loader2,
  Sparkles,
  Home,
  ListChecks
} from 'lucide-react'

export default function HomePage() {
  // --- State ---
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // Persistence
  const [favorites, setFavorites] = useState<string[]>([])
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [savedCombos, setSavedCombos] = useState<
    { name: string; ingredients: Ingredient[] }[]
  >([])

  // UI State
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'shopping'>(
    'home'
  )
  const [showLogoTooltip, setShowLogoTooltip] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    cuisine: [],
    taste: [],
    maxTime: 'all',
    difficulty: [],
    recipeCount: 3
  })

  // Load Data
  useEffect(() => {
    const loadedFavs = localStorage.getItem('mszf_favorites')
    const loadedSavedRecipes = localStorage.getItem('mszf_saved_recipes')
    const loadedShopping = localStorage.getItem('mszf_shopping_list')
    const loadedCombos = localStorage.getItem('mszf_combos')

    if (loadedFavs) setFavorites(JSON.parse(loadedFavs))
    if (loadedSavedRecipes) setSavedRecipes(JSON.parse(loadedSavedRecipes))
    if (loadedShopping) setShoppingList(JSON.parse(loadedShopping))
    if (loadedCombos) setSavedCombos(JSON.parse(loadedCombos))
  }, [])

  // Save Data
  useEffect(() => {
    localStorage.setItem('mszf_favorites', JSON.stringify(favorites))
    localStorage.setItem('mszf_saved_recipes', JSON.stringify(savedRecipes))
  }, [favorites, savedRecipes])

  useEffect(() => {
    localStorage.setItem('mszf_shopping_list', JSON.stringify(shoppingList))
  }, [shoppingList])

  useEffect(() => {
    localStorage.setItem('mszf_combos', JSON.stringify(savedCombos))
  }, [savedCombos])

  // --- Handlers ---

  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      alert('请先添加一些食材！')
      return
    }
    setLoading(true)
    setRecipes([])
    try {
      const ingredientNames = ingredients.map(
        (i: Ingredient) => i.name + (i.quantity ? '(' + i.quantity + ')' : '')
      )

      // Call Next.js API endpoint instead of direct service
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: ingredientNames,
          filters: filters
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes || [])

      // Auto scroll to results
      setTimeout(() => {
        document
          .getElementById('results-section')
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    } catch (error) {
      alert('生成食谱失败，请检查网络或稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFav = favorites.includes(recipe.id)
    if (isFav) {
      setFavorites((prev: string[]) =>
        prev.filter((id: string) => id !== recipe.id)
      )
      setSavedRecipes((prev: Recipe[]) =>
        prev.filter((r: Recipe) => r.id !== recipe.id)
      )
    } else {
      setFavorites((prev: string[]) => [...prev, recipe.id])
      setSavedRecipes((prev: Recipe[]) => [...prev, recipe])
    }
  }

  const addToShoppingList = (items: IngredientItem[], recipeName: string) => {
    const newItems: ShoppingItem[] = items.map((item) => ({
      id: Date.now() + Math.random().toString(),
      name: item.name,
      amount: item.amount,
      category: '未分类',
      checked: false,
      recipeName: recipeName
    }))
    setShoppingList((prev: ShoppingItem[]) => [...prev, ...newItems])
    // Optional: Switch to shopping tab to show user
    // setActiveTab('shopping');
    setSelectedRecipe(null)
  }

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev: ShoppingItem[]) =>
      prev.map((item: ShoppingItem) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const clearShoppingList = () =>
    setShoppingList((prev: ShoppingItem[]) => prev.filter((i) => !i.checked))

  const saveCurrentCombo = () => {
    const name = prompt(
      '为当前食材组合起个名字：',
      '常用组合 ' + (savedCombos.length + 1)
    )
    if (name) {
      setSavedCombos([...savedCombos, { name, ingredients }])
    }
  }

  const deleteCombo = (index: number) => {
    const newCombos = [...savedCombos]
    newCombos.splice(index, 1)
    setSavedCombos(newCombos)
  }

  const handleLogoClick = () => {
    console.log('Logo clicked! showLogoTooltip:', showLogoTooltip)
    setShowLogoTooltip(true)
    setTimeout(() => setShowLogoTooltip(false), 2000)
  }

  const handleToggleFavorite = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFav = favorites.includes(recipe.id)
    if (isFav) {
      setFavorites((prev: string[]) =>
        prev.filter((id: string) => id !== recipe.id)
      )
      setSavedRecipes((prev: Recipe[]) =>
        prev.filter((r: Recipe) => r.id !== recipe.id)
      )
    } else {
      setFavorites((prev: string[]) => [...prev, recipe.id])
      setSavedRecipes((prev: Recipe[]) => [...prev, recipe])
    }
  }

  const handleLoadCombo = (combo: any) => {
    setIngredients(combo)
  }

  const handleShoppingListToggle = (item: { id: string; checked: boolean }) => {
    setShoppingList((prev: ShoppingItem[]) => prev.filter((i) => !i.checked))
  }

  // --- Views ---

  const renderHome = () => (
    <div className='pb-24 opacity-100 transition-opacity duration-500'>
      {/* Ingredient Section */}
      <section className='mb-8'>
        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
          onSaveCombo={saveCurrentCombo}
          savedCombos={savedCombos}
          onLoadCombo={handleLoadCombo}
          onDeleteCombo={deleteCombo}
        />
      </section>

      {/* Action Bar */}
      <section className='sticky top-4 z-30 mb-8'>
        <div className='bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-float border border-white/50 flex flex-col sm:flex-row gap-4 items-center'>
          <div className='flex gap-2 w-full sm:w-auto overflow-x-auto scrollbar-hide'>
            <select
              className='bg-gray-100 border-none text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cny-gold/50'
              value={filters.recipeCount}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  recipeCount: parseInt(e.target.value)
                })
              }
            >
              <option value='1'>1道菜 (尝鲜)</option>
              <option value='3'>3道菜 (标配)</option>
              <option value='5'>5道菜 (盛宴)</option>
            </select>
            <select
              className='bg-gray-100 border-none text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cny-gold/50'
              value={filters.difficulty[0] || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  difficulty: e.target.value ? [e.target.value] : []
                })
              }
            >
              <option value=''>全部难度</option>
              <option value='简单'>新手</option>
              <option value='中等'>进阶</option>
              <option value='复杂'>大厨</option>
            </select>
            <select
              className='bg-gray-100 border-none text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cny-gold/50'
              value={filters.maxTime}
              onChange={(e) =>
                setFilters({ ...filters, maxTime: e.target.value })
              }
            >
              <option value='all'>不限时</option>
              <option value='15'>15分钟</option>
              <option value='30'>30分钟</option>
              <option value='60'>1小时</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || ingredients.length === 0}
            className='w-full sm:w-auto sm:ml-auto bg-gradient-to-r from-cny-gold to-cny-accent text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg'
          >
            {loading ? (
              <Loader2 className='w-5 h-5 animate-spin mr-2' />
            ) : (
              <Sparkles className='w-5 h-5 mr-2' />
            )}
            {loading ? '大厨思考中...' : '马上开火'}
          </button>
        </div>
      </section>

      {/* Results Section */}
      <section id='results-section'>
        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Array.from({ length: filters.recipeCount || 3 }).map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-2xl h-72 shadow-card p-4 animate-pulse flex flex-col'
              >
                <div className='h-32 bg-gray-200 rounded-xl mb-4'></div>
                <div className='h-6 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2 mb-auto'></div>
                <div className='h-10 bg-gray-100 rounded'></div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                isFavorite={favorites.includes(recipe.id)}
                onToggleFavorite={(e) => handleToggleFavorite(recipe, e)}
              />
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className='text-center py-10 opacity-60'>
            <div className='inline-block p-6 rounded-full bg-cny-lightGold mb-4'>
              <ChefHat className='w-12 h-12 text-cny-gold' />
            </div>
            <p className='text-gray-500 font-medium'>
              添加食材，点击按钮，见证奇迹
            </p>
          </div>
        )}
      </section>
    </div>
  )

  const renderFavorites = () => (
    <div className='pb-24 opacity-100 transition-all duration-300'>
      <div className='bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100'>
        <h2 className='text-2xl font-bold text-cny-darkRed font-serif'>
          我的收藏夹
        </h2>
        <p className='text-gray-400 text-xs mt-1'>记录每一次的心动美味</p>
      </div>

      {savedRecipes.length === 0 ? (
        <div className='text-center py-20 text-gray-400'>
          <Heart className='w-16 h-16 mx-auto mb-4 text-gray-200' />
          <p>暂无收藏，去首页看看吧</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {savedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              isFavorite={favorites.includes(recipe.id)}
              onToggleFavorite={(e) => handleToggleFavorite(recipe, e)}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className='min-h-screen bg-cny-bg font-sans text-gray-800'>
      {/* Top Brand Bar */}
      <header className='bg-gradient-to-r from-cny-red to-cny-darkRed text-white pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-40 h-40 bg-cny-gold opacity-10 rounded-full blur-3xl translate-x-10 -translate-y-10'></div>
        <div className='relative z-10 flex justify-between items-end'>
          <div>
            <h1 className='text-4xl font-cursive tracking-widest text-cny-lightGold drop-shadow-md'>
              马上开饭
            </h1>
            <p className='text-cny-lightGold/70 text-xs font-serif mt-1 tracking-wider'>
              马年团圆 · 智能烹饪
            </p>
          </div>
          <div
            className='w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 active:scale-95 transition-transform relative'
            onClick={handleLogoClick}
          >
            <img
              src='/logo.png'
              alt='马上开饭'
              className='w-8 h-8 object-contain pointer-events-none'
            />
            {showLogoTooltip && (
              <div className='absolute top-1/2 -translate-y-1/2 right-full mr-2 bg-white text-cny-red px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap z-[100]'>
                <div className='text-xs font-medium'>
                  别戳我了，马上开饭啦～
                </div>
                <div className='absolute top-1/2 -translate-y-1/2 -right-1.5 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[6px] border-transparent border-l-white'></div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className='container mx-auto px-4 -mt-4 relative z-20 max-w-3xl'>
        {activeTab === 'home' && renderHome()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'shopping' && (
          <ShoppingListView
            items={shoppingList}
            onToggleItem={toggleShoppingItem}
            onClearList={clearShoppingList}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 safe-bottom'>
        <div className='flex justify-around items-center h-16 max-w-3xl mx-auto'>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'home' ? 'text-cny-red' : 'text-gray-400'}`}
          >
            <Home
              className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'fill-cny-red/10' : ''}`}
            />
            <span className='text-[10px] font-bold'>首页</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'favorites' ? 'text-cny-red' : 'text-gray-400'}`}
          >
            <Heart
              className={`w-6 h-6 mb-1 ${activeTab === 'favorites' ? 'fill-cny-red/10' : ''}`}
            />
            <span className='text-[10px] font-bold'>收藏</span>
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${activeTab === 'shopping' ? 'text-cny-red' : 'text-gray-400'}`}
          >
            <ListChecks
              className={`w-6 h-6 mb-1 ${activeTab === 'shopping' ? 'fill-cny-red/10' : ''}`}
            />
            <span className='text-[10px] font-bold'>清单</span>
          </button>
        </div>
      </nav>

      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onAddToShoppingList={addToShoppingList}
      />
    </div>
  )
}
