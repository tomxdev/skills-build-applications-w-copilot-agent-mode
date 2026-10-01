import CollectionTable from './CollectionTable.jsx'

const columns = [
  { label: 'Workout', key: 'title', className: 'primary-cell' },
  { label: 'Activity', render: (workout) => <span className="type-label">{workout.activityType ?? '—'}</span> },
  { label: 'Level', render: (workout) => workout.level ?? '—' },
  { label: 'Duration', render: (workout) => `${workout.durationMinutes ?? '—'} min` },
  { label: 'Details', key: 'description', className: 'subtle-cell' },
]

export default function Workouts() {
  return (
    <CollectionTable
      collection="workouts"
      eyebrow="Pick your pace"
      title="Workouts"
      description="Guided sessions matched to different activity types and experience levels."
      columns={columns}
    />
  )
}