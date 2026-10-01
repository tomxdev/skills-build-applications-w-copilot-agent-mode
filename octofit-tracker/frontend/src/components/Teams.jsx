import CollectionTable from './CollectionTable.jsx'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function renderMembers(members) {
  if (!Array.isArray(members) || members.length === 0) return 'No members'
  return (
    <span className="members-list">
      {members.map((member, index) => {
        const name = typeof member === 'string' ? member : member.displayName || member.username || 'Member'
        return <span className="member-chip" key={member._id ?? member.id ?? `${name}-${index}`}>{name}</span>
      })}
    </span>
  )
}

const columns = [
  { label: 'Team', key: 'name', className: 'primary-cell' },
  { label: 'About', key: 'description', className: 'subtle-cell' },
  { label: 'Members', render: (team) => renderMembers(team.members) },
]

export default function Teams() {
  return (
    <CollectionTable
      collection="teams"
      endpoint={endpoint}
      eyebrow="Find your crew"
      title="Teams"
      description="Training groups and the members who make them stronger."
      columns={columns}
    />
  )
}