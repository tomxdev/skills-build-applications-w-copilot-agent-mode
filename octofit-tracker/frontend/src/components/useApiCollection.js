import { useEffect, useState } from 'react'
import { fetchCollection } from '../lib/api.js'

export default function useApiCollection(collectionName) {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadItems() {
      setStatus('loading')
      setError('')
      try {
        setItems(await fetchCollection(collectionName, { signal: controller.signal }))
        setStatus('ready')
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message)
          setStatus('error')
        }
      }
    }

    loadItems()
    return () => controller.abort()
  }, [collectionName])

  return { items, status, error }
}