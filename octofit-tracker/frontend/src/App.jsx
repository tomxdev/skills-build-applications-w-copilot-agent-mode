import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { apiBaseUrl } from './lib/api.js'
import './App.css'

const sections = [
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Teams', path: '/teams' },
  { label: 'Users', path: '/users' },
  { label: 'Workouts', path: '/workouts' },
]

function App() {
  const isLocalApi = apiBaseUrl.startsWith('http://localhost:')

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink className="brand-lockup" to="/activities" aria-label="OctoFit Tracker home">
          <img src={logo} alt="" className="brand-logo" />
          <span className="brand-name">OctoFit <span>Tracker</span></span>
        </NavLink>
        <nav className="primary-nav" aria-label="Main navigation">
          {sections.map((section) => (
            <NavLink
              className={({ isActive }) => `primary-nav-link${isActive ? ' is-active' : ''}`}
              key={section.path}
              to={section.path}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
        <div className="connection-status">
          <span className={`connection-dot${isLocalApi ? ' is-local' : ''}`} />
          <span>{isLocalApi ? 'Local API' : 'Codespaces API'}</span>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>OctoFit Tracker</span>
        <span>Move together. Get stronger.</span>
      </footer>
    </div>
  )
}

export default App
