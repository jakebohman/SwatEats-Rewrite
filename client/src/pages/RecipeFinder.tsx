import React, { useState, useRef, useEffect } from 'react'
import { searchIngredient, findRecipes } from '../services/api'
import useAsync from '../hooks/useAsync'
import RecipeCard from '../components/RecipeCard'

export default function RecipeFinder() {
  const [query, setQuery] = useState('')
  const [dropdown, setDropdown] = useState<string[]>([])
  const [added, setAdded] = useState<string[]>([])
  const [recipes, setRecipes] = useState<any[]>([])
  const [method, setMethod] = useState(0)
  const [dietary, setDietary] = useState<string[]>([])

  const { loading, error, run } = useAsync()

  const debounceRef = useRef<any>()
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const onInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim().length < 1) return setDropdown([])
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await run(() => searchIngredient(value))
        setDropdown(items.map((i: any) => i.strIngredient))
      } catch (err) {
        // handled
      }
    }, 300)
  }

  // allow Enter to pick the first dropdown option
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && dropdown.length > 0 && document.activeElement?.id === 'ingredient-input') {
        e.preventDefault()
        addIngredient(dropdown[0])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dropdown])

  // handle keyboard navigation for dropdown
  useEffect(() => {
    const el = dropdownRef.current
    let idx = -1
    const onKey = (e: KeyboardEvent) => {
      if (!el || dropdown.length === 0) return
      if (e.key === 'ArrowDown') {
        idx = Math.min(idx + 1, dropdown.length - 1)
        const child = el.children[idx] as HTMLElement
        child?.focus()
      } else if (e.key === 'ArrowUp') {
        idx = Math.max(idx - 1, 0)
        const child = el.children[idx] as HTMLElement
        child?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dropdown])

  const addIngredient = (name: string) => {
    if (!added.includes(name)) setAdded(prev => [...prev, name])
    setDropdown([])
    setQuery('')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await run(() => findRecipes({ ingredients: added, method, dietary }))
      setRecipes(res)
      // show a small success state
      // keep added list so user can refine
    } catch (err) {
      // handled
    }
  }

  return (
    <main id="main" className="container">
      <h2>Find Recipes</h2>
      <form id="recipe-form" onSubmit={submit}>
        <div className="form-section input-with-dropdown" style={{ position: 'relative' }}>
          <label htmlFor="ingredient-input">Enter Ingredients</label>
          <input className="ingredient-input" autoComplete="off" id="ingredient-input" aria-label="Ingredient input" value={query} onChange={e => onInput(e.target.value)} placeholder="Type an ingredient" />
          <div id="ingredient-dropdown" ref={dropdownRef} role="listbox" aria-label="Ingredient suggestions" aria-expanded={dropdown.length > 0}>
            {dropdown.map((d, idx) => (
              <div key={d} role="option" aria-selected={false} className="dropdown-option" onClick={() => addIngredient(d)} tabIndex={0} data-index={idx}>{d}</div>
            ))}
          </div>
          <div id="added-ingredients">
            {added.map(a => (
              <div className="ingredient-tag" key={a}>{a}<button type="button" aria-label={`Remove ${a}`} onClick={() => setAdded(prev => prev.filter(x => x !== a))} className="tag-remove">✕</button></div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Dietary Restrictions</label>
          <label><input type="checkbox" value="vegetarian" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /> Vegetarian</label>
          <label><input type="checkbox" value="vegan" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /> Vegan</label>
          <label><input type="checkbox" value="gluten_free" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /> Gluten-Free</label>
          <label><input type="checkbox" value="dairy_free" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /> Dairy-Free</label>
        </div>

        <div className="form-section">
          <label>Sort Recipes By</label>
          <label><input type="radio" name="method" value={0} checked={method === 0} onChange={() => setMethod(0)} /> Most Ingredients Used</label>
          <label><input type="radio" name="method" value={1} checked={method === 1} onChange={() => setMethod(1)} /> Fewest Extra Ingredients</label>
        </div>

        <input className="find-btn" type="submit" value="Find Recipes" />
      </form>

      <div className="results" id="recipe-results" aria-live="polite">
        <h2>Recipe Results</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && recipes.length === 0 && <p>No matching recipes found.</p>}
        {recipes.length > 0 && (
          <div className="recipe-grid">
            {recipes.map(r => (
              <RecipeCard key={r.idMeal || r.strMeal} recipe={r} highlighted={added} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
