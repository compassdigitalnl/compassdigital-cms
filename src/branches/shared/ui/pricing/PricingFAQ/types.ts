export interface FAQItem {
  question: string
  answer: string
}

export interface PricingFAQProps {
  title?: string
  items: FAQItem[]
  className?: string
}
