import { NextRequest, NextResponse } from 'next/server'

// Doubao API configuration
const DOUBAO_API_ENDPOINT =
  'https://ark.cn-beijing.volces.com/api/v3/chat/completions'

// Helper function to call Doubao API
async function callDoubaoAPI(
  messages: any[],
  model: string = 'doubao-seed-1-8-251228',
  temperature: number = 0.7
) {
  const apiKey = process.env.DOUBAO_API_KEY

  if (!apiKey) {
    throw new Error('Doubao API key not configured')
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 1200000) // 1200 second timeout

  try {
    const response = await fetch(DOUBAO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Doubao API error: ${error}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error(
        'Request timeout: Unable to connect to Doubao API. Please check your network connection.'
      )
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients, filters } = body

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: 'Invalid ingredients' },
        { status: 400 }
      )
    }

    // Prepare prompt for Doubao
    const ingredientList = ingredients.join(', ')
    const filterContext = `
    Preferred Cuisine: ${filters.cuisine?.length > 0 ? filters.cuisine.join(', ') : 'Any'}.
    Preferred Taste: ${filters.taste?.length > 0 ? filters.taste.join(', ') : 'Any'}.
    Max Time: ${filters.maxTime !== 'all' ? filters.maxTime + ' minutes' : 'No limit'}.
    Difficulty: ${filters.difficulty?.length > 0 ? filters.difficulty.join(', ') : 'Any'}.
  `

    const count = filters.recipeCount || 3

    const prompt = `
你是一位专业的中餐厨师，专门为马年团圆饭设计菜谱。
用户有以下食材: ${ingredientList}

请根据这些食材生成${count}个创意菜谱。你可以假设用户有基本的调味料（油、盐、酱油等），但其他重要食材如果缺失请标记为missing。

用户偏好: ${filterContext}

主题: "马上开饭" (立即烹饪)。尽量给菜品起吉祥的名字，适合春节团圆饭（例如：与马、成功、财富、团圆相关）。

请以JSON格式返回，严格遵循以下结构：
{
  "recipes": [
    {
      "id": "unique-id",
      "name": "菜名",
      "description": "简短的诱人描述",
      "ingredients": [
        {
          "name": "食材名",
          "amount": "数量",
          "isMissing": false,
          "substitution": "替代建议（如果missing为true）"
        }
      ],
      "steps": ["步骤1", "步骤2", ...],
      "time": "30分钟",
      "difficulty": "简单",
      "cuisine": "川菜",
      "taste": "麻辣",
      "nutrition": {
        "calories": 350,
        "protein": "25g",
        "carbs": "30g",
        "fat": "15g",
        "tips": "营养建议"
      }
    }
  ]
}

注意：
1. 尽量使用用户提供的食材
2. 步骤要详细清晰
3. difficulty必须是"简单"、"中等"或"复杂"之一
4. 营养信息要合理
5. 只返回JSON，不要有其他文字
    `

    const messages = [
      {
        role: 'system',
        content:
          '你是一位专业的中餐厨师和营养师，擅长根据现有食材创作美味菜谱。始终以JSON格式返回结果，不要添加任何其他文字。'
      },
      { role: 'user', content: prompt }
    ]

    // Call Doubao API
    const responseText = await callDoubaoAPI(
      messages,
      'doubao-seed-1-8-251228',
      0.8
    )

    // Parse response - extract JSON from markdown code blocks if present
    let jsonText = responseText.trim()

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
    }

    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in response:', responseText)
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])
    const recipes = result.recipes || []

    // Add unique IDs if missing
    const processedRecipes = recipes.map((recipe: any, index: number) => ({
      ...recipe,
      id: recipe.id || `gen-${Date.now()}-${index}`
    }))

    return NextResponse.json({ recipes: processedRecipes })
  } catch (error: any) {
    console.error('Error generating recipes:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recipes' },
      { status: 500 }
    )
  }
}
