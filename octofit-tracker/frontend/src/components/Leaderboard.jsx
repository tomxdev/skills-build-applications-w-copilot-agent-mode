import CollectionTable from './CollectionTable.jsx'

const columns = [
  { label: 'Rank', key: 'rank', className: 'rank-cell', render: (entry) => `#${entry.rank ?? '—'}` },
  { label: 'Member', key: 'username', className: 'primary-cell' },
  { label: 'Points', key: 'points', className: 'primary-cell' },
  { label: 'Activities', key: 'activityCount' },
]

export default function Leaderboard() {
  return (
    <CollectionTable
      collection="leaderboard"
      eyebrow="Friendly competition"
      title="Leaderboard"
      description="A running total of points earned through logged activity."
      columns={columns}
    />
  )
}