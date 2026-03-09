import { useState } from 'react'
import { MortgageCalculator, type MortgageState } from './MortgageCalculator'
import { InstallPrompt } from './InstallPrompt'
import './App.css'

const STORAGE_KEY = 'mortgage-calculator:saved'

function loadSavedCalculations(): Record<string, MortgageState> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, MortgageState>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveCalculations(data: Record<string, MortgageState>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function App() {
  const [state, setState] = useState<MortgageState>({
    propertyValue: '450,000',
    downPayment: '90,000',
    rate: '6.5',
    term: '30',
    taxes: '0',
    insurance: '0',
  })

  const [showInfo, setShowInfo] = useState(false)
  const [loadList, setLoadList] = useState<string[] | null>(null)
  const [savedMap, setSavedMap] = useState<Record<string, MortgageState>>({})

  const handleSave = () => {
    const name = window.prompt('Save this calculation as:')
    if (!name) return
    const key = name.trim()
    if (!key) return
    const existing = loadSavedCalculations()
    existing[key] = state
    saveCalculations(existing)
    window.alert(`Saved as "${key}".`)
  }

  const handleLoad = () => {
    const saved = loadSavedCalculations()
    const names = Object.keys(saved)
    if (names.length === 0) {
      window.alert('No saved calculations yet.')
      return
    }
    setSavedMap(saved)
    setLoadList(names.sort((a, b) => a.localeCompare(b)))
    setShowInfo(false)
  }

  const handleSelectSaved = (key: string) => {
    const found = savedMap[key]
    if (!found) {
      window.alert(`No calculation named "${key}" found.`)
      return
    }
    setState(found)
    setLoadList(null)
  }

  const handleCancelLoad = () => {
    setLoadList(null)
  }

  const handleShare = () => {
    const text = [
      'Mortgage calculation',
      `Property value: ${state.propertyValue}`,
      `Down payment: ${state.downPayment}`,
      `Rate: ${state.rate}%`,
      `Term: ${state.term} years`,
      `Taxes: ${state.taxes}`,
      `Insurance: ${state.insurance}`,
      '',
      'Created with Mortgage Calculator PWA',
    ].join('\n')

    if (navigator.share) {
      navigator
        .share({
          title: 'Mortgage Calculator',
          text,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      void navigator.clipboard?.writeText(text)
      window.alert('Calculation copied so you can paste and share it.')
    }
  }

  return (
    <div className="app">
      <InstallPrompt />
      <div className="app-content">
        {loadList ? (
          <div className="load-panel">
            <h2>Saved calculations</h2>
            <p className="load-panel-subtitle">Tap a name to load it.</p>
            <div className="load-list">
              {loadList.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="load-item"
                  onClick={() => handleSelectSaved(name)}
                >
                  <span className="load-item-name">{name}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="load-cancel"
              onClick={handleCancelLoad}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {showInfo && (
              <div className="info-panel">
                <h2>About this app</h2>
                <p>
                  This app is dedicated to Marija, Alyssa and Matt, to help
                  them find their first home.
                </p>
              </div>
            )}
            <MortgageCalculator state={state} onChange={setState} />
          </>
        )}
      </div>
      <nav className="bottom-nav" aria-label="Main navigation">
        <button
          type="button"
          className="bottom-nav-button"
          onClick={() => setShowInfo((v) => !v)}
        >
          {/* Info */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="7" r="1.3" fill="currentColor" />
          </svg>
          <span>Info</span>
        </button>
        <button
          type="button"
          className="bottom-nav-button"
          onClick={handleSave}
        >
          {/* Save */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="4" width="14" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 4v5h6V4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="9" y="13" width="6" height="5" rx="1" ry="1" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span>Save</span>
        </button>
        <button
          type="button"
          className="bottom-nav-button"
          onClick={handleLoad}
        >
          {/* Load */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="5" width="16" height="14" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 3h8l2 2H6l2-2z" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 10v6m0 0-3-3m3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Load</span>
        </button>
        <button
          type="button"
          className="bottom-nav-button"
          onClick={handleShare}
        >
          {/* Share */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 12v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M12 5v10m0-10L8.5 8.5M12 5l3.5 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Share</span>
        </button>
      </nav>
    </div>
  )
}

export default App
