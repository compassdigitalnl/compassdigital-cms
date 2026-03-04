export interface AlphabetNavProps {
  availableLetters: string[]
  activeLetter?: string | null
  onLetterClick: (letter: string) => void
  className?: string
}
