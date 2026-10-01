const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

export function normalizeCollection(payload, collectionName) {
  let current = payload

  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return current
    if (!current || typeof current !== 'object') return []

    const candidates = [
      current[collectionName],
      current.results,
      current.items,
      current.data?.[collectionName],
      current.data?.results,
      current.data?.items,
      current.data,
    ]
    const next = candidates.find(Array.isArray)
      ?? candidates.find((value) => value && typeof value === 'object')

    if (!next || next === current) return []
    current = next
  }

  return Array.isArray(current) ? current : []
}

export async function fetchCollection(collectionName, { signal } = {}) {
  const response = await fetch(`${apiBaseUrl}/${collectionName}/`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const body = await response.json()
      if (body.error) message = body.error
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new Error(message)
  }

  return normalizeCollection(await response.json(), collectionName)
}