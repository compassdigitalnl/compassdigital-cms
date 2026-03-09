export interface QuoteStep {
  number: number
  title: string
  description: string
}

export interface QuoteStepsProps {
  steps?: QuoteStep[]
}
