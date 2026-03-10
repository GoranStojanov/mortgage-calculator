# Mortgage Calculator PWA

A progressive web app (PWA) mortgage calculator that works on Android and iOS. Install it to your home screen for quick access.

## Features

- **Principal balance** – Enter your loan amount
- **Interest rate** – Annual interest rate (%)
- **Term** – Loan term in years
- **Monthly payment** – Automatically calculated using standard mortgage formula
- **Total paid & interest** – Summary of what you’ll pay over the life of the loan

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Installation (PWA)

- **Android**: Open in Chrome, tap the menu (⋮) → “Install app” or “Add to Home screen”
- **iOS**: Open in Safari, tap Share → “Add to Home Screen”

The app includes a simple install prompt when supported (e.g. Android Chrome).

## Mortgage Formula

Uses the standard amortization formula:

```
M = P × [r(1+r)^n] / [(1+r)^n − 1]
```

Where:
- **M** = monthly payment
- **P** = principal
- **r** = monthly interest rate (annual rate ÷ 12)
- **n** = number of payments (term × 12)
