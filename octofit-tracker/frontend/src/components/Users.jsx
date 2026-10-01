import CollectionTable from './CollectionTable.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

const columns = [
  { label: 'Member', key: 'displayName', className: 'primary-cell', render: (user) => user.displayName || user.username || '—' },
  { label: 'Username', key: 'username' },
  { label: 'Email', key: 'email', className: 'subtle-cell', render: (user) => user.email || '—' },
]

export default function Users() {
  return (
    <CollectionTable
      collection="users"
      endpoint={endpoint}
      eyebrow="Community"
      title="Members"
      description="People building consistent movement habits together."
      columns={columns}
    />
  )
}