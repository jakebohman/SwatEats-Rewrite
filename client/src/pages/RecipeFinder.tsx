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

  // Handle ingredient input
  const onInput = (value: string) => {
    setQuery(value)
    if (debounceRef.current) 
      clearTimeout(debounceRef.current)
    if (value.trim().length < 1) 
      return setDropdown([])
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await run(() => searchIngredient(value))
        setDropdown(items.map((i: any) => i.strIngredient))
      } catch (err) {}
    }, 300)
  }

  // Enter key to add first dropdown item
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

  // Add ingredient to list
  const addIngredient = (name: string) => {
    if (!added.includes(name)) setAdded(prev => [...prev, name])
    setDropdown([])
    setQuery('')
  }

  // Submit form
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
    <div>
    <div style={{ paddingLeft: 16 }}>
      <h2 style={{ color: '#B86A6A', fontWeight: 300 }}>Find recipes</h2>
      <h1 style={{ color: 'var(--accent)' }}>Find recipes using your ingredients</h1>
    </div>
    <main id="main" className="container">
      <form id="recipe-form" onSubmit={submit}>
        <div className="search-panel">
        <div className="form-section input-with-dropdown" style={{ position: 'relative' }}>
          <label className="form-label" htmlFor="ingredient-input">Enter Ingredients</label>
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
        <br />
        <div className="form-section">
          <label className="form-label" style={{ marginLeft: '8px' }}>Dietary Restrictions</label>
          <div className="option-row">
            <label className="option-label"><span className="option-text">Vegetarian</span><input type="checkbox" value="vegetarian" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /></label>
          </div>
          <div className="option-row">
            <label className="option-label"><span className="option-text">Vegan</span><input type="checkbox" value="vegan" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /></label>
          </div>
          <div className="option-row">
            <label className="option-label"><span className="option-text">Gluten-Free</span><input type="checkbox" value="gluten_free" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /></label>
          </div>
          <div className="option-row">
            <label className="option-label"><span className="option-text">Dairy-Free</span><input type="checkbox" value="dairy_free" onChange={e => setDietary(prev => e.target.checked ? [...prev, e.target.value] : prev.filter(x => x !== e.target.value))} /></label>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label" style={{ marginLeft: '8px' }}>Sort Recipes By</label>
          <div>
            <label className="option-label"><span className="option-text">Most Ingredients Used</span><input type="radio" name="method" value={0} checked={method === 0} onChange={() => setMethod(0)} /></label>
          </div>
          <div className="option-row">
            <label className="option-label"><span className="option-text">Fewest Extra Ingredients</span><input type="radio" name="method" value={1} checked={method === 1} onChange={() => setMethod(1)} /></label>
          </div>
        </div>

        <input className="find-btn" type="submit" value="Find Recipes" />
        </div>
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
    </div>
  )
}