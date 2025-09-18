import React from 'react'

type Props = {
  recipe: any,
  highlighted?: string[]
}

export default function RecipeCard({ recipe, highlighted = [] }: Props) {
  return (
    <article className="recipe-card" aria-labelledby={`title-${recipe.idMeal || recipe.strMeal}`}>
      <h3 id={`title-${recipe.idMeal || recipe.strMeal}`}>{recipe.strMeal}</h3>
      {recipe.strMealThumb && (
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      )}
      <p><strong>Category:</strong> {recipe.strCategory}</p>
      <p><strong>Cuisine:</strong> {recipe.strArea}</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients && recipe.ingredients.map((ing: string, i: number) => {
          const normalized = (ing || '').toLowerCase()
          const isUser = highlighted.some(h => normalized.includes(h.toLowerCase()))
          return (
            <li key={i}><span className={isUser ? 'user-ingredient' : ''}>{recipe.measures?.[i] ? recipe.measures[i] + ' ' : ''}{isUser ? <strong>{ing}</strong> : ing}</span></li>
          )
        })}
      </ul>
      <p><strong>Instructions:</strong></p>
      <p>{recipe.strInstructions}</p>
    </article>
  )
}