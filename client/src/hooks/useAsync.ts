import { useState, useCallback } from 'react'

export default function useAsync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async (fn: () => Promise<any>) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn()
      setLoading(false)
      return res
    } catch (err: any) {
      setError(err?.message || String(err))
      setLoading(false)
      throw err
    }
  }, [])

  return { loading, error, run }
}
