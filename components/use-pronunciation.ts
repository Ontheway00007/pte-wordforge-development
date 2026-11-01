'use client'

import { useEffect, useRef, useState } from 'react'

export function usePronunciation() {
  const [audioError, setAudioError] = useState('')
  const voices = useRef<SpeechSynthesisVoice[]>([])
  const active = useRef<SpeechSynthesisUtterance | null>(null)
  const lastWord = useRef('')
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const synth = window.speechSynthesis
    const loadVoices = () => { voices.current = synth.getVoices() }
    loadVoices()
    synth.addEventListener('voiceschanged', loadVoices)
    return () => {
      synth.removeEventListener('voiceschanged', loadVoices)
      active.current = null
      if (watchdog.current) clearTimeout(watchdog.current)
      synth.cancel()
    }
  }, [])

  function speak(word: string) {
    lastWord.current = word
    setAudioError('')
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setAudioError('Pronunciation is not supported in this browser. Try Chrome, Edge or Safari with an English system voice installed.')
      return
    }
    const synth = window.speechSynthesis
    active.current = null
    if (watchdog.current) clearTimeout(watchdog.current)
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(word)
    active.current = utterance
    const available = synth.getVoices()
    if (available.length) voices.current = available
    const voice = voices.current.find(v => /^en[-_]AU$/i.test(v.lang))
      || voices.current.find(v => /^en[-_]GB$/i.test(v.lang))
      || voices.current.find(v => /^en\b/i.test(v.lang))
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang || 'en-US'
    utterance.rate = 0.78
    utterance.volume = 1
    const clearWatchdog = () => { if (watchdog.current) clearTimeout(watchdog.current) }
    utterance.onstart = () => {
      if (active.current !== utterance) return
      clearWatchdog()
      setAudioError('')
    }
    utterance.onend = () => {
      if (active.current !== utterance) return
      clearWatchdog()
      active.current = null
    }
    utterance.onerror = event => {
      if (active.current !== utterance) return
      clearWatchdog()
      active.current = null
      if (event.error === 'canceled' || event.error === 'interrupted') return
      setAudioError('Pronunciation could not play. Tap Retry sound. If it stays silent, check media volume and install an English voice in your device settings, or try another browser.')
    }
    watchdog.current = setTimeout(() => {
      if (active.current === utterance) setAudioError('Sound has not started. Tap Retry sound to enable playback. Check your device media volume and browser sound settings if needed.')
    }, 5000)
    try {
      synth.resume()
      synth.speak(utterance)
    } catch {
      clearWatchdog()
      active.current = null
      setAudioError('Your browser could not start pronunciation. Tap Retry sound or try another browser.')
    }
  }

  return { speak, audioError, retrySound: () => { if (lastWord.current) speak(lastWord.current) } }
}
