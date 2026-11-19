// Voice accessibility utility for low-literacy users
export const speakHindi = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  try {
    window.speechSynthesis.cancel() // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Try finding a Hindi voice if available
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'))
    if (hindiVoice) {
      utterance.voice = hindiVoice
    }

    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.warn('Speech synthesis error:', err)
  }
}
