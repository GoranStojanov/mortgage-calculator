import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // The custom beforeinstallprompt flow is unreliable on some Android browsers
  // and can appear to get "stuck". Let Android users use the built‑in
  // "Add to Home screen" / "Install app" menu instead.
  const isAndroid =
    typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '')

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    const installed = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (installed) setIsInstalled(true)

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (isAndroid || isInstalled || !showPrompt || !deferredPrompt) return null

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <span>Install this app for quick access</span>
        <div className="install-prompt-actions">
          <button onClick={handleInstall} className="install-btn">Install</button>
          <button onClick={handleDismiss} className="dismiss-btn">Not now</button>
        </div>
      </div>
    </div>
  )
}
