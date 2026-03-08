import { MortgageCalculator } from './MortgageCalculator'
import { InstallPrompt } from './InstallPrompt'
import './App.css'

function App() {
  return (
    <div className="app">
      <InstallPrompt />
      <MortgageCalculator />
    </div>
  )
}

export default App
