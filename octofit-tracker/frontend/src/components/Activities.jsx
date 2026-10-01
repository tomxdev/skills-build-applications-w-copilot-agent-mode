import CollectionTable from './CollectionTable.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function displayName(user) {
  if (typeof user === 'string') return user
  return user?.displayName || user?.username || 'Unknown user'
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString()
}

const columns = [
  { label: 'Member', render: (activity) => displayName(activity.user), className: 'primary-cell' },
  { label: 'Activity', render: (activity) => <span className="type-label">{activity.activityType ?? '—'}</span> },
  { label: 'Duration', render: (activity) => `${activity.durationMinutes ?? '—'} min` },
  { label: 'Distance', render: (activity) => activity.distanceKm ? `${activity.distanceKm} km` : '—' },
  { label: 'Points', key: 'points', className: 'primary-cell' },
  { label: 'Date', render: (activity) => formatDate(activity.date) },
]

export default function Activities() {
  return (
    <CollectionTable
      collection="activities"
      endpoint={endpoint}
      eyebrow="Movement log"
      title="Activities"
      description="Recent movement, effort, and points earned by the community."
      columns={columns}
    />
  )
}