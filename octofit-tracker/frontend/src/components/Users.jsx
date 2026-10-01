import CollectionTable from './CollectionTable.jsx'

const columns = [
  { label: 'Member', key: 'displayName', className: 'primary-cell', render: (user) => user.displayName || user.username || '—' },
  { label: 'Username', key: 'username' },
  { label: 'Email', key: 'email', className: 'subtle-cell', render: (user) => user.email || '—' },
]

export default function Users() {
  return (
    <CollectionTable
      collection="users"
      eyebrow="Community"
      title="Members"
      description="People building consistent movement habits together."
      columns={columns}
    />
  )
}