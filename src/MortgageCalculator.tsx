import { useMemo } from 'react'

/**
 * Standard mortgage payment formula:
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * M = monthly payment, P = principal, r = monthly rate, n = number of payments
 */
function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0
  const monthlyRate = annualRatePercent / 100 / 12
  const numPayments = termYears * 12
  if (monthlyRate === 0) return principal / numPayments
  const factor = Math.pow(1 + monthlyRate, numPayments)
  return (principal * monthlyRate * factor) / (factor - 1)
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatMoneyInput(value: number, fractionDigits: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

function parseMoneyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return Number.isFinite(num) ? num : 0
}

function sanitizeMoneyKeystroke(value: string): string {
  // Allow digits, commas, and a single decimal point.
  const cleaned = value.replace(/[^\d.,]/g, '')
  const firstDot = cleaned.indexOf('.')
  if (firstDot === -1) return cleaned
  const before = cleaned.slice(0, firstDot + 1)
  const after = cleaned.slice(firstDot + 1).replace(/\./g, '')
  return `${before}${after}`
}

export type MortgageState = {
  propertyValue: string
  downPayment: string
  rate: string
  term: string
  taxes: string
  insurance: string
}

type MortgageCalculatorProps = {
  state: MortgageState
  onChange: (next: MortgageState) => void
}

export function MortgageCalculator({ state, onChange }: MortgageCalculatorProps) {
  const { propertyValue, downPayment, rate, term, taxes, insurance } = state

  const updateField = (field: keyof MortgageState, value: string) => {
    onChange({
      ...state,
      [field]: value,
    })
  }

  const loanAmount = useMemo(() => {
    const value = parseMoneyInput(propertyValue)
    const down = parseMoneyInput(downPayment)
    return Math.max(0, value - down)
  }, [propertyValue, downPayment])

  const monthlyPaymentPI = useMemo(() => {
    const r = parseFloat(rate) || 0
    const t = parseFloat(term) || 0
    return calculateMonthlyPayment(loanAmount, r, t)
  }, [loanAmount, rate, term])

  const monthlyTaxes = useMemo(() => parseMoneyInput(taxes) / 12, [taxes])
  const monthlyInsurance = useMemo(() => parseMoneyInput(insurance) / 12, [insurance])

  const totalMonthlyPayment = useMemo(() => {
    return monthlyPaymentPI + monthlyTaxes + monthlyInsurance
  }, [monthlyPaymentPI, monthlyTaxes, monthlyInsurance])

  const totalPaid = useMemo(() => {
    const t = parseFloat(term) || 0
    return monthlyPaymentPI * t * 12
  }, [monthlyPaymentPI, term])

  const totalInterest = useMemo(() => {
    return Math.max(0, totalPaid - loanAmount)
  }, [totalPaid, loanAmount])

  return (
    <div className="mortgage-calculator">
      <h1>Mortgage Calculator</h1>

      <div className="input-group">
        <label htmlFor="propertyValue">Property Value ($)</label>
        <input
          id="propertyValue"
          type="text"
          inputMode="decimal"
          min="0"
          value={propertyValue}
          onChange={(e) => updateField('propertyValue', sanitizeMoneyKeystroke(e.target.value))}
          onBlur={() => {
            const raw = propertyValue.trim()
            if (!raw) return
            const v = parseMoneyInput(raw)
            updateField('propertyValue', v === 0 ? '0' : formatMoneyInput(v, 0))
          }}
          placeholder="e.g. 450,000"
        />
      </div>

      <div className="input-group">
        <label htmlFor="downPayment">Down Payment ($)</label>
        <input
          id="downPayment"
          type="text"
          inputMode="decimal"
          min="0"
          value={downPayment}
          onChange={(e) => updateField('downPayment', sanitizeMoneyKeystroke(e.target.value))}
          onBlur={() => {
            const raw = downPayment.trim()
            if (!raw) return
            const v = parseMoneyInput(raw)
            updateField('downPayment', v === 0 ? '0' : formatMoneyInput(v, 0))
          }}
          placeholder="e.g. 90,000"
        />
      </div>

      <div className="input-group">
        <label htmlFor="rate">Annual Interest Rate (%)</label>
        <input
          id="rate"
          type="number"
          inputMode="decimal"
          min="0"
          max="30"
          step="0.125"
          value={rate}
          onChange={(e) => updateField('rate', e.target.value)}
          placeholder="e.g. 6.5"
        />
      </div>

      <div className="input-group">
        <label htmlFor="term">Term (years)</label>
        <input
          id="term"
          type="number"
          inputMode="numeric"
          min="1"
          max="50"
          step="1"
          value={term}
          onChange={(e) => updateField('term', e.target.value)}
          placeholder="e.g. 30"
        />
      </div>

      <div className="result-card">
        <div className="result-label">Monthly Payment (Principal + Interest)</div>
        <div className="result-value payment">{formatCurrency(monthlyPaymentPI)}</div>
        <div className="result-subtitle">Loan amount: {formatCurrency(loanAmount)}</div>
      </div>

      <div className="input-group">
        <label htmlFor="taxes">Property Taxes per year ($)</label>
        <input
          id="taxes"
          type="text"
          inputMode="decimal"
          min="0"
          value={taxes}
          onChange={(e) => updateField('taxes', sanitizeMoneyKeystroke(e.target.value))}
          onBlur={() => {
            const raw = taxes.trim()
            if (!raw) return
            const v = parseMoneyInput(raw)
            updateField('taxes', v === 0 ? '0' : formatMoneyInput(v, 2))
          }}
          placeholder="e.g. 4,200"
        />
      </div>

      <div className="input-group">
        <label htmlFor="insurance">Insurance per year ($)</label>
        <input
          id="insurance"
          type="text"
          inputMode="decimal"
          min="0"
          value={insurance}
          onChange={(e) => updateField('insurance', sanitizeMoneyKeystroke(e.target.value))}
          onBlur={() => {
            const raw = insurance.trim()
            if (!raw) return
            const v = parseMoneyInput(raw)
            updateField('insurance', v === 0 ? '0' : formatMoneyInput(v, 2))
          }}
          placeholder="e.g. 1,200"
        />
      </div>

      <div className="result-card total">
        <div className="result-label">Total Monthly Payment</div>
        <div className="result-value payment">{formatCurrency(totalMonthlyPayment)}</div>
      </div>

      <div className="summary">
        <div className="summary-row">
          <span>Total paid over {term || '0'} years (P + I)</span>
          <span>{formatCurrency(totalPaid)}</span>
        </div>
        <div className="summary-row">
          <span>Total interest</span>
          <span>{formatCurrency(totalInterest)}</span>
        </div>
      </div>
    </div>
  )
}
