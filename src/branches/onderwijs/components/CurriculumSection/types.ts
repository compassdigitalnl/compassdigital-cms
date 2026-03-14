export interface CurriculumLesson {
  id?: string
  type?: 'video' | 'reading' | 'quiz' | 'assignment' | string | null
  title: string
  duration?: string | null
  isPreview?: boolean | null
}

export interface CurriculumSectionData {
  id?: string
  sectionNumber?: number | null
  title: string
  lessons?: CurriculumLesson[] | null
}

export interface CurriculumSectionProps {
  sections: CurriculumSectionData[]
  defaultOpenIndex?: number
}
