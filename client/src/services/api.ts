const BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) 
  ? import.meta.env.VITE_API_BASE : ''

async function handleResponse(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}

const jsonPost = async (path: string, body: any) => {
  const url = BASE ? `${BASE}${path}` : path
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const data = await handleResponse(res)
    throw new Error(data?.error || `Request failed: ${res.status}`)
  }
  return handleResponse(res)
}

export const searchIngredient = (query: string) => jsonPost('/searchIngredient', { query })
export const findRecipes = (payload: any) => jsonPost('/findRecipes', payload)
export const getComments = async () => {
  const url = BASE ? `${BASE}/getComments` : '/getComments'
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load comments: ${res.status}`)
  return handleResponse(res)
}
export const addComment = (data: any) => jsonPost('/addComment', data)
export const deleteComment = (data: any) => jsonPost('/deleteComment', data)