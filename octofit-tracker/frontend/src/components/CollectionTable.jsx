import useApiCollection from './useApiCollection.js'

export default function CollectionTable({ collection, eyebrow, title, description, columns }) {
  const { items, status, error } = useApiCollection(collection)

  return (
    <section aria-labelledby={`${collection}-title`}>
      <div className="collection-heading">
        <div>
          <p className="collection-eyebrow">{eyebrow}</p>
          <h1 className="collection-title" id={`${collection}-title`}>{title}</h1>
          <p className="collection-description">{description}</p>
        </div>
        {status === 'ready' && (
          <span className="record-count" aria-live="polite">
            {items.length} {items.length === 1 ? 'record' : 'records'}
          </span>
        )}
      </div>

      <div className="table-frame">
        {status === 'loading' && (
          <div className="load-state" role="status">
            <span className="spinner-border" aria-hidden="true" />
            <span>Loading {collection}…</span>
          </div>
        )}
        {status === 'error' && (
          <div className="error-state" role="alert">
            Could not load {collection}: {error}
          </div>
        )}
        {status === 'ready' && items.length === 0 && (
          <div className="load-state">
            <span className="empty-mark" aria-hidden="true" />
            <span>No {collection} yet.</span>
          </div>
        )}
        {status === 'ready' && items.length > 0 && (
          <div className="table-scroll">
            <table className="table table-hover data-table">
              <thead>
                <tr>
                  {columns.map((column) => <th key={column.label} scope="col">{column.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item._id ?? item.id ?? `${collection}-${index}`}>
                    {columns.map((column) => (
                      <td className={column.className ?? ''} key={column.label}>
                        {column.render ? column.render(item) : item[column.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}