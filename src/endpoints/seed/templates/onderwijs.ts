import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'
import {
  onderwijsConversationFlows,
  onderwijsSystemPrompt,
  onderwijsTrainingContext,
  onderwijsWelcomeMessage,
} from '@/features/ai/lib/predefined/conversationFlows'

/**
 * Lexical rich-text helper — wraps plain text in a valid Lexical root structure
 */
function richText(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{ text }],
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

/**
 * Seed Onderwijs Content
 *
 * Seeds: 6 course categories, 6 courses, 3 team members (docenten),
 * 4 reviews, chatbot-settings global.
 */
export async function seedOnderwijs(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // ==========================================================================
  // CURSUSCATEGORIEEN (course-categories)
  // ==========================================================================
  payload.logger.info('      Seeding course categories...')

  const categories = [
    {
      name: 'Development',
      slug: 'development',
      icon: 'code',
      description: 'Leer programmeren en software ontwikkelen met de nieuwste technologieën.',
      color: '#3B82F6',
      courseCount: 1,
      featured: true,
    },
    {
      name: 'Business',
      slug: 'business',
      icon: 'briefcase',
      description: 'Ontwikkel je zakelijke vaardigheden en leiderschapskwaliteiten.',
      color: '#10B981',
      courseCount: 1,
      featured: true,
    },
    {
      name: 'Design',
      slug: 'design',
      icon: 'palette',
      description: 'Beheers UX/UI design, grafisch ontwerp en creatieve tools.',
      color: '#8B5CF6',
      courseCount: 1,
      featured: true,
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      icon: 'megaphone',
      description: 'Word expert in digitale marketing, SEO en social media.',
      color: '#F59E0B',
      courseCount: 1,
      featured: true,
    },
    {
      name: 'Data Science',
      slug: 'data-science',
      icon: 'bar-chart-3',
      description: 'Analyseer data, visualiseer inzichten en maak datagedreven beslissingen.',
      color: '#EC4899',
      courseCount: 1,
      featured: true,
    },
    {
      name: 'Persoonlijke Ontwikkeling',
      slug: 'persoonlijke-ontwikkeling',
      icon: 'heart',
      description: 'Werk aan je persoonlijke groei, leiderschap en communicatievaardigheden.',
      color: '#EF4444',
      courseCount: 1,
      featured: true,
    },
  ]

  const categoryIds: Record<string, number> = {}

  for (const cat of categories) {
    if (!(await checkExistingContent(payload, 'course-categories', cat.slug))) {
      try {
        const created = await payload.create({
          collection: 'course-categories',
          data: {
            name: cat.name,
            slug: cat.slug,
            icon: cat.icon,
            description: cat.description,
            color: cat.color,
            courseCount: cat.courseCount,
            featured: cat.featured,
          } as any,
        })
        categoryIds[cat.slug] = created.id as number
        result.collections['course-categories'] = (result.collections['course-categories'] || 0) + 1
        payload.logger.info(`      + ${cat.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create category "${cat.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${cat.name} (exists)`)
      try {
        const existing = await payload.find({
          collection: 'course-categories',
          where: { slug: { equals: cat.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          categoryIds[cat.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // TEAMLEDEN / DOCENTEN (content-team, branch: onderwijs)
  // ==========================================================================
  payload.logger.info('      Seeding onderwijs team members (docenten)...')

  const teamMembers = [
    {
      name: 'Thomas van der Berg',
      slug: 'thomas-van-der-berg-onderwijs',
      role: 'Senior Developer & Trainer',
      bio: 'Thomas is een ervaren software developer en trainer met meer dan 15 jaar ervaring in de IT-industrie. Hij heeft gewerkt bij toonaangevende tech-bedrijven en geeft al 8 jaar cursussen in Python, JavaScript en Machine Learning. Zijn praktijkgerichte aanpak en heldere uitleg maken complexe onderwerpen toegankelijk voor iedereen.',
      specialties: [
        { specialty: 'Python' },
        { specialty: 'JavaScript' },
        { specialty: 'Machine Learning' },
      ],
      qualifications: [
        { name: 'MSc Computer Science', year: 2010 },
      ],
      courseCount: 2,
      totalStudents: 3350,
      avgRating: 4.7,
      certifications: [
        { text: 'AWS Certified' },
        { text: 'Google Cloud Professional' },
      ],
    },
    {
      name: 'Sophie de Groot',
      slug: 'sophie-de-groot-onderwijs',
      role: 'Marketing Strateeg & Docent',
      bio: 'Sophie is een doorgewinterde marketing professional met meer dan 10 jaar ervaring in digitale marketing. Ze heeft campagnes geleid voor zowel startups als Fortune 500 bedrijven. Haar cursussen combineren theoretische kennis met praktische case studies en hands-on opdrachten.',
      specialties: [
        { specialty: 'Digital Marketing' },
        { specialty: 'SEO' },
        { specialty: 'Content Strategy' },
      ],
      qualifications: [
        { name: 'MBA Marketing', year: 2014 },
      ],
      courseCount: 1,
      totalStudents: 890,
      avgRating: 4.6,
      certifications: [
        { text: 'Google Ads Certified' },
        { text: 'HubSpot Academy' },
      ],
    },
    {
      name: 'Emma Jansen',
      slug: 'emma-jansen-onderwijs',
      role: 'UX/UI Designer & Trainer',
      bio: 'Emma is een gepassioneerde UX/UI designer die al meer dan 8 jaar interfaces ontwerpt voor web en mobiel. Ze heeft gewerkt bij internationale design agencies en haar portfolio bevat projecten voor merken als Philips en Booking.com. Emma deelt haar kennis met enthousiasme en begeleidt studenten van concept tot prototype.',
      specialties: [
        { specialty: 'UX Design' },
        { specialty: 'Figma' },
        { specialty: 'Design Thinking' },
      ],
      qualifications: [
        { name: 'BA Industrieel Ontwerpen', year: 2016 },
      ],
      courseCount: 1,
      totalStudents: 1100,
      avgRating: 4.9,
      certifications: [
        { text: 'Nielsen Norman Group' },
        { text: 'Google UX Certificate' },
      ],
    },
  ]

  const teamMemberIds: Record<string, number> = {}

  for (const member of teamMembers) {
    if (!(await checkExistingContent(payload, 'content-team', member.slug))) {
      try {
        const created = await payload.create({
          collection: 'content-team',
          data: {
            name: member.name,
            slug: member.slug,
            branch: 'onderwijs',
            role: member.role,
            bio: richText(member.bio),
            specialties: member.specialties,
            qualifications: member.qualifications,
            courseCount: member.courseCount,
            totalStudents: member.totalStudents,
            avgRating: member.avgRating,
            certifications: member.certifications,
            status: status === 'published' ? 'published' : 'draft',
          } as any,
        })
        teamMemberIds[member.slug] = created.id as number
        result.collections['content-team'] = (result.collections['content-team'] || 0) + 1
        payload.logger.info(`      + ${member.name}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create team member "${member.name}":`, e)
      }
    } else {
      payload.logger.info(`      = ${member.name} (exists)`)
      try {
        const existing = await payload.find({
          collection: 'content-team',
          where: { slug: { equals: member.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          teamMemberIds[member.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // CURSUSSEN (courses)
  // ==========================================================================
  payload.logger.info('      Seeding courses (cursussen)...')

  const courses = [
    {
      title: 'Python voor Beginners',
      slug: 'python-voor-beginners',
      subtitle: 'Leer de basis van Python programmeren en bouw je eerste programma\'s.',
      shortDescription: 'Een complete introductie in Python programmeren. Van de allereerste regel code tot het bouwen van je eigen programma\'s. Inclusief praktische oefeningen en een eindproject.',
      description: 'In deze uitgebreide cursus leer je stap voor stap programmeren in Python, een van de meest populaire programmeertalen ter wereld. Python wordt gebruikt door bedrijven als Google, Netflix en Instagram. Of je nu een carrière in tech ambieert of je dagelijkse werk wilt automatiseren, deze cursus geeft je een solide basis. Je begint met de absolute basis en werkt je op naar het bouwen van complete programma\'s.',
      categorySlug: 'development',
      instructorSlug: 'thomas-van-der-berg-onderwijs',
      level: 'beginner',
      language: 'nederlands',
      duration: 12,
      totalLessons: 45,
      price: 49.95,
      originalPrice: 79.95,
      rating: 4.8,
      reviewCount: 2,
      studentCount: 1250,
      certificate: true,
      featured: true,
      sections: [
        {
          sectionNumber: 1,
          title: 'Introductie',
          lessons: [
            { type: 'video', title: 'Welkom bij de cursus', duration: '5:00', isPreview: true },
            { type: 'video', title: 'Python installeren', duration: '10:00', isPreview: true },
            { type: 'video', title: 'Je eerste Python script', duration: '15:00', isPreview: false },
            { type: 'reading', title: 'Python documentatie overzicht', duration: '8:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Python basis', duration: '5:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Variabelen & Data Types',
          lessons: [
            { type: 'video', title: 'Wat zijn variabelen?', duration: '12:00', isPreview: false },
            { type: 'video', title: 'Strings en tekst', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Getallen en berekeningen', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Lijsten en tuples', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Dictionaries', duration: '16:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Data types oefening', duration: '30:00', isPreview: false },
            { type: 'reading', title: 'Best practices voor variabelen', duration: '10:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Data types', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Functies & Loops',
          lessons: [
            { type: 'video', title: 'Functies schrijven', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Parameters en return values', duration: '18:00', isPreview: false },
            { type: 'video', title: 'For loops', duration: '15:00', isPreview: false },
            { type: 'video', title: 'While loops', duration: '12:00', isPreview: false },
            { type: 'video', title: 'List comprehensions', duration: '16:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Rekenmachine bouwen', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '15:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'Python code schrijven' },
        { text: 'Variabelen en data types begrijpen' },
        { text: 'Functies en loops toepassen' },
        { text: 'Eenvoudige programma\'s bouwen' },
      ],
      requirements: [
        { text: 'Geen programmeerervaring nodig' },
        { text: 'Een computer met internetverbinding' },
      ],
      includes: [
        { text: '12 uur video' },
        { text: '45 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Downloadbare bronnen' },
      ],
    },
    {
      title: 'Digitale Marketing Masterclass',
      slug: 'digitale-marketing-masterclass',
      subtitle: 'Word expert in digitale marketing: SEO, social media en Google Ads.',
      shortDescription: 'Een complete masterclass over digitale marketing. Leer SEO, social media marketing, Google Ads en content strategie van een ervaren professional.',
      description: 'In deze uitgebreide masterclass leer je alle facetten van digitale marketing. Van SEO-optimalisatie tot social media campagnes en Google Ads. Deze cursus is ontworpen voor professionals die hun marketingvaardigheden naar het volgende niveau willen tillen. Met praktische case studies en hands-on opdrachten leer je strategieën die direct toepasbaar zijn in je werk.',
      categorySlug: 'marketing',
      instructorSlug: 'sophie-de-groot-onderwijs',
      level: 'gevorderd',
      language: 'nederlands',
      duration: 16,
      totalLessons: 62,
      price: 79.95,
      originalPrice: undefined,
      rating: 4.6,
      reviewCount: 1,
      studentCount: 890,
      certificate: true,
      featured: true,
      sections: [
        {
          sectionNumber: 1,
          title: 'SEO Fundamentals',
          lessons: [
            { type: 'video', title: 'Wat is SEO?', duration: '12:00', isPreview: true },
            { type: 'video', title: 'Keyword research', duration: '20:00', isPreview: false },
            { type: 'video', title: 'On-page optimalisatie', duration: '25:00', isPreview: false },
            { type: 'video', title: 'Technische SEO', duration: '18:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: SEO-audit uitvoeren', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: SEO basis', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Social Media Marketing',
          lessons: [
            { type: 'video', title: 'Social media strategie', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Instagram marketing', duration: '20:00', isPreview: false },
            { type: 'video', title: 'LinkedIn voor bedrijven', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Content kalender maken', duration: '12:00', isPreview: false },
            { type: 'video', title: 'Analytics en rapportage', duration: '15:00', isPreview: false },
            { type: 'reading', title: 'Case study: Succesvolle campagnes', duration: '20:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Social media plan', duration: '60:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Social media', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Google Ads',
          lessons: [
            { type: 'video', title: 'Google Ads introductie', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Campagnes opzetten', duration: '22:00', isPreview: false },
            { type: 'video', title: 'Advertentieteksten schrijven', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Budgetoptimalisatie', duration: '15:00', isPreview: false },
            { type: 'video', title: 'A/B testen', duration: '12:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Volledige campagne', duration: '90:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '15:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'SEO-strategie ontwikkelen en uitvoeren' },
        { text: 'Social media campagnes opzetten en optimaliseren' },
        { text: 'Google Ads campagnes beheren' },
        { text: 'Marketing ROI meten en rapporteren' },
      ],
      requirements: [
        { text: 'Basiskennis van marketing' },
        { text: 'Toegang tot een website of blog' },
      ],
      includes: [
        { text: '16 uur video' },
        { text: '62 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Praktische templates' },
      ],
    },
    {
      title: 'UX/UI Design Fundamentals',
      slug: 'ux-ui-design-fundamentals',
      subtitle: 'Leer de basis van UX/UI design en bouw professionele interfaces.',
      shortDescription: 'Een hands-on cursus over UX/UI design. Leer design thinking, wireframing en prototyping met Figma. Perfect voor beginners die een carrière in design willen starten.',
      description: 'In deze praktijkgerichte cursus leer je de fundamenten van UX/UI design. Van het begrijpen van gebruikerbehoeften tot het bouwen van interactieve prototypes in Figma. Je leert design thinking toe te passen, wireframes te maken en professionele interfaces te ontwerpen. Na afloop heb je een portfolio met echte projecten.',
      categorySlug: 'design',
      instructorSlug: 'emma-jansen-onderwijs',
      level: 'beginner',
      language: 'nederlands',
      duration: 10,
      totalLessons: 38,
      price: 59.95,
      originalPrice: 89.95,
      rating: 4.9,
      reviewCount: 1,
      studentCount: 1100,
      certificate: true,
      featured: true,
      sections: [
        {
          sectionNumber: 1,
          title: 'Design Thinking',
          lessons: [
            { type: 'video', title: 'Wat is Design Thinking?', duration: '10:00', isPreview: true },
            { type: 'video', title: 'Empathize: Gebruikersonderzoek', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Define: Probleemstelling formuleren', duration: '15:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: User persona maken', duration: '30:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Design Thinking', duration: '8:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Wireframing',
          lessons: [
            { type: 'video', title: 'Low-fidelity wireframes', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Figma introductie', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Layout en grid systemen', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Componenten en patronen', duration: '22:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: App wireframe maken', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Wireframing', duration: '8:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Prototyping',
          lessons: [
            { type: 'video', title: 'Van wireframe naar prototype', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Interacties en animaties', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Kleur en typografie', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Gebruikerstesten', duration: '12:00', isPreview: false },
            { type: 'video', title: 'Design handoff voor developers', duration: '15:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Compleet app design', duration: '90:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '10:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'Design Thinking proces toepassen' },
        { text: 'Wireframes en prototypes maken in Figma' },
        { text: 'Gebruikersonderzoek uitvoeren' },
        { text: 'Professionele UI designs ontwerpen' },
      ],
      requirements: [
        { text: 'Geen design ervaring nodig' },
        { text: 'Figma account (gratis)' },
      ],
      includes: [
        { text: '10 uur video' },
        { text: '38 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Figma templates' },
      ],
    },
    {
      title: 'Business Strategie & Innovatie',
      slug: 'business-strategie-en-innovatie',
      subtitle: 'Leer strategisch denken en innovatie management op expert-niveau.',
      shortDescription: 'Een geavanceerde cursus over business strategie en innovatie. Leer het Business Model Canvas toepassen, strategisch denken en innovatieprocessen leiden. Voor ervaren professionals.',
      description: 'Deze expert-level cursus is ontworpen voor professionals die hun strategische vaardigheden willen aanscherpen. Je leert hoe je een winnende business strategie ontwikkelt, het Business Model Canvas effectief inzet en innovatieprocessen leidt. Met case studies van succesvolle bedrijven en praktische frameworks die je direct kunt toepassen.',
      categorySlug: 'business',
      instructorSlug: 'thomas-van-der-berg-onderwijs',
      level: 'expert',
      language: 'nederlands',
      duration: 20,
      totalLessons: 48,
      price: 99.95,
      originalPrice: undefined,
      rating: 4.7,
      reviewCount: 0,
      studentCount: 650,
      certificate: true,
      featured: false,
      sections: [
        {
          sectionNumber: 1,
          title: 'Strategisch Denken',
          lessons: [
            { type: 'video', title: 'Strategisch denken: een introductie', duration: '15:00', isPreview: true },
            { type: 'video', title: 'SWOT-analyse meesterschap', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Porter\'s Five Forces', duration: '25:00', isPreview: false },
            { type: 'video', title: 'Concurrentie-analyse', duration: '18:00', isPreview: false },
            { type: 'reading', title: 'Case study: Netflix strategie', duration: '20:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Strategische analyse', duration: '60:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Business Model Canvas',
          lessons: [
            { type: 'video', title: 'Het Business Model Canvas', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Value Proposition Design', duration: '25:00', isPreview: false },
            { type: 'video', title: 'Revenue modellen', duration: '18:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Je eigen BMC', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: BMC', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Innovatie Management',
          lessons: [
            { type: 'video', title: 'Innovatieprocessen', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Lean Startup methode', duration: '22:00', isPreview: false },
            { type: 'video', title: 'Design Sprint', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Innovatiecultuur bouwen', duration: '15:00', isPreview: false },
            { type: 'reading', title: 'Case study: Tesla innovatie', duration: '15:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Innovatiestrategie', duration: '90:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '15:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'Strategische analyses uitvoeren' },
        { text: 'Business Model Canvas effectief toepassen' },
        { text: 'Innovatieprocessen leiden' },
        { text: 'Data-gedreven beslissingen nemen' },
      ],
      requirements: [
        { text: 'Minimaal 3 jaar werkervaring' },
        { text: 'Basiskennis van bedrijfsvoering' },
      ],
      includes: [
        { text: '20 uur video' },
        { text: '48 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Strategische frameworks' },
      ],
    },
    {
      title: 'Data Analyse met Excel & SQL',
      slug: 'data-analyse-met-excel-en-sql',
      subtitle: 'Leer data analyseren met Excel en SQL — van basis tot gevorderd.',
      shortDescription: 'Leer data analyseren met Excel en SQL. Van basale spreadsheetvaardigheden tot complexe SQL queries en data visualisatie. Ideaal voor iedereen die datagedreven wil werken.',
      description: 'In deze cursus leer je hoe je data analyseert met twee van de meest gebruikte tools ter wereld: Excel en SQL. Je begint met Excel basis en leert geavanceerde functies zoals VLOOKUP, draaitabellen en dashboards. Vervolgens duik je in SQL en leer je queries schrijven om data uit databases te halen. Tot slot leer je hoe je data visualiseert en inzichtelijk maakt voor stakeholders.',
      categorySlug: 'data-science',
      instructorSlug: 'thomas-van-der-berg-onderwijs',
      level: 'beginner',
      language: 'nederlands',
      duration: 8,
      totalLessons: 32,
      price: 44.95,
      originalPrice: undefined,
      rating: 4.5,
      reviewCount: 0,
      studentCount: 2100,
      certificate: true,
      featured: false,
      sections: [
        {
          sectionNumber: 1,
          title: 'Excel Basis',
          lessons: [
            { type: 'video', title: 'Excel interface en navigatie', duration: '10:00', isPreview: true },
            { type: 'video', title: 'Formules en functies', duration: '20:00', isPreview: false },
            { type: 'video', title: 'VLOOKUP en INDEX/MATCH', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Draaitabellen', duration: '22:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Verkoopdashboard', duration: '30:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Excel functies', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'SQL Queries',
          lessons: [
            { type: 'video', title: 'Wat is SQL?', duration: '10:00', isPreview: false },
            { type: 'video', title: 'SELECT en WHERE', duration: '15:00', isPreview: false },
            { type: 'video', title: 'JOIN operaties', duration: '20:00', isPreview: false },
            { type: 'video', title: 'GROUP BY en aggregaties', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Subqueries', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Indexen en optimalisatie', duration: '12:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Database queries', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: SQL', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Data Visualisatie',
          lessons: [
            { type: 'video', title: 'Principes van data visualisatie', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Grafieken en diagrammen', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Dashboards bouwen', duration: '20:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Data rapport', duration: '60:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '12:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'Geavanceerde Excel functies toepassen' },
        { text: 'SQL queries schrijven' },
        { text: 'Data visualiseren en presenteren' },
        { text: 'Datagedreven beslissingen nemen' },
      ],
      requirements: [
        { text: 'Basiskennis van computers' },
        { text: 'Toegang tot Excel of Google Sheets' },
      ],
      includes: [
        { text: '8 uur video' },
        { text: '32 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Oefenbestanden' },
      ],
    },
    {
      title: 'Leiderschap & Management',
      slug: 'leiderschap-en-management',
      subtitle: 'Ontwikkel je leiderschapsvaardigheden en leer effectief teams aansturen.',
      shortDescription: 'Word een betere leider. Leer over verschillende leiderschapsstijlen, team management en effectieve communicatie. Met praktische oefeningen en case studies.',
      description: 'In deze cursus ontwikkel je de vaardigheden die je nodig hebt om een effectieve leider te zijn. Je leert over verschillende leiderschapsstijlen, hoe je teams aanstuurt en motiveert, en hoe je effectief communiceert op alle niveaus van de organisatie. Met praktische oefeningen, rollenspellen en case studies van succesvolle leiders.',
      categorySlug: 'persoonlijke-ontwikkeling',
      instructorSlug: 'sophie-de-groot-onderwijs',
      level: 'gevorderd',
      language: 'nederlands',
      duration: 14,
      totalLessons: 42,
      price: 69.95,
      originalPrice: 99.95,
      rating: 4.8,
      reviewCount: 0,
      studentCount: 780,
      certificate: true,
      featured: false,
      sections: [
        {
          sectionNumber: 1,
          title: 'Leiderschapsstijlen',
          lessons: [
            { type: 'video', title: 'Wat maakt een goede leider?', duration: '12:00', isPreview: true },
            { type: 'video', title: 'Situationeel leiderschap', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Transformationeel leiderschap', duration: '18:00', isPreview: false },
            { type: 'reading', title: 'Case study: Leiders die inspireren', duration: '15:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Leiderschapsstijlen', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 2,
          title: 'Team Management',
          lessons: [
            { type: 'video', title: 'Teams samenstellen', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Delegeren en vertrouwen', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Conflictmanagement', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Motivatie en betrokkenheid', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Feedback geven en ontvangen', duration: '15:00', isPreview: false },
            { type: 'assignment', title: 'Opdracht: Teamontwikkelingsplan', duration: '45:00', isPreview: false },
            { type: 'quiz', title: 'Quiz: Team management', duration: '10:00', isPreview: false },
          ],
        },
        {
          sectionNumber: 3,
          title: 'Communicatie',
          lessons: [
            { type: 'video', title: 'Effectief communiceren', duration: '15:00', isPreview: false },
            { type: 'video', title: 'Presentatievaardigheden', duration: '20:00', isPreview: false },
            { type: 'video', title: 'Moeilijke gesprekken voeren', duration: '18:00', isPreview: false },
            { type: 'video', title: 'Stakeholder management', duration: '15:00', isPreview: false },
            { type: 'assignment', title: 'Eindproject: Leiderschapsportfolio', duration: '60:00', isPreview: false },
            { type: 'quiz', title: 'Eindtoets', duration: '15:00', isPreview: false },
          ],
        },
      ],
      learningOutcomes: [
        { text: 'Je eigen leiderschapsstijl ontwikkelen' },
        { text: 'Teams effectief aansturen en motiveren' },
        { text: 'Conflicten constructief oplossen' },
        { text: 'Helder en overtuigend communiceren' },
      ],
      requirements: [
        { text: 'Minimaal 2 jaar werkervaring' },
        { text: 'Interesse in leiderschap en management' },
      ],
      includes: [
        { text: '14 uur video' },
        { text: '42 lessen' },
        { text: 'Certificaat' },
        { text: 'Levenslang toegang' },
        { text: 'Leiderschapstemplates' },
      ],
    },
  ]

  // Store course IDs for reviews
  const courseIds: Record<string, number> = {}

  for (const course of courses) {
    if (!(await checkExistingContent(payload, 'courses', course.slug))) {
      try {
        const categoryId = course.categorySlug ? categoryIds[course.categorySlug] : undefined
        const instructorId = course.instructorSlug ? teamMemberIds[course.instructorSlug] : undefined

        const created = await payload.create({
          collection: 'courses',
          data: {
            title: course.title,
            slug: course.slug,
            subtitle: course.subtitle,
            shortDescription: course.shortDescription,
            description: richText(course.description),
            category: categoryId || undefined,
            instructor: instructorId || undefined,
            // Curriculum
            sections: course.sections,
            // Details
            level: course.level,
            language: course.language,
            duration: course.duration,
            totalLessons: course.totalLessons,
            learningOutcomes: course.learningOutcomes,
            requirements: course.requirements,
            includes: course.includes,
            certificate: course.certificate,
            // Prijzen
            price: course.price,
            originalPrice: course.originalPrice || undefined,
            // Statistieken
            rating: course.rating,
            reviewCount: course.reviewCount,
            studentCount: course.studentCount,
            lastUpdated: new Date().toISOString(),
            // Status
            status: 'published',
            _status: status as 'draft' | 'published',
          } as any,
        })
        courseIds[course.slug] = created.id as number
        result.collections['courses'] = (result.collections['courses'] || 0) + 1
        payload.logger.info(`      + ${course.title}`)
      } catch (e) {
        payload.logger.warn(`      ! Could not create course "${course.title}":`, e)
      }
    } else {
      payload.logger.info(`      = ${course.title} (exists)`)
      try {
        const existing = await payload.find({
          collection: 'courses',
          where: { slug: { equals: course.slug } },
          limit: 1,
        })
        if (existing.docs[0]) {
          courseIds[course.slug] = existing.docs[0].id as number
        }
      } catch {}
    }
  }

  // ==========================================================================
  // REVIEWS (content-reviews, branch: onderwijs)
  // ==========================================================================
  payload.logger.info('      Seeding onderwijs reviews...')

  const reviews = [
    {
      authorName: 'Mark Visser',
      authorRole: 'Student',
      authorInitials: 'MV',
      authorColor: 'blue',
      rating: 5,
      quote: 'Uitstekende cursus! Helder uitgelegd en praktische voorbeelden. Thomas legt alles stap voor stap uit en de oefeningen zijn echt nuttig. Na deze cursus kon ik direct Python gebruiken op mijn werk.',
      courseSlug: 'python-voor-beginners',
      verified: true,
      featured: true,
    },
    {
      authorName: 'Lisa de Boer',
      authorRole: 'Student',
      authorInitials: 'LB',
      authorColor: 'teal',
      rating: 4,
      quote: 'Goede basis, had iets meer oefeningen gewild. De uitleg is duidelijk en de cursusopbouw is logisch. Wel had ik graag wat meer geavanceerde opdrachten gehad aan het einde.',
      courseSlug: 'python-voor-beginners',
      verified: true,
      featured: false,
    },
    {
      authorName: 'Nina Bakker',
      authorRole: 'Student',
      authorInitials: 'NB',
      authorColor: 'purple',
      rating: 5,
      quote: 'Fantastisch! Mijn portfolio is enorm verbeterd. Emma is een geweldige docent die je echt inspireert. De Figma tutorials zijn heel praktisch en ik gebruik de geleerde technieken dagelijks.',
      courseSlug: 'ux-ui-design-fundamentals',
      verified: true,
      featured: true,
    },
    {
      authorName: 'Pieter Hendriks',
      authorRole: 'Student',
      authorInitials: 'PH',
      authorColor: 'amber',
      rating: 5,
      quote: 'Heel praktisch. Direct toepasbaar in mijn werk. Sophie deelt echte case studies en strategieën die ik meteen kon inzetten voor onze marketingcampagnes. Zeker de investering waard.',
      courseSlug: 'digitale-marketing-masterclass',
      verified: true,
      featured: true,
    },
  ]

  for (const review of reviews) {
    // Check if review already exists by authorName + branch
    try {
      const existing = await payload.find({
        collection: 'content-reviews' as any,
        where: {
          and: [
            { authorName: { equals: review.authorName } },
            { branch: { equals: 'onderwijs' } },
          ],
        },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        payload.logger.info(`      = ${review.authorName} (exists)`)
        continue
      }
    } catch {}

    try {
      const courseId = review.courseSlug ? courseIds[review.courseSlug] : undefined
      await payload.create({
        collection: 'content-reviews' as any,
        data: {
          authorName: review.authorName,
          authorRole: review.authorRole,
          authorInitials: review.authorInitials,
          authorColor: review.authorColor,
          branch: 'onderwijs',
          rating: review.rating,
          quote: review.quote,
          course: courseId || undefined,
          verified: review.verified,
          featured: review.featured,
          status: status === 'published' ? 'published' : 'draft',
        } as any,
      })
      result.collections['content-reviews'] = (result.collections['content-reviews'] || 0) + 1
      payload.logger.info(`      + ${review.authorName}`)
    } catch (e) {
      payload.logger.warn(`      ! Could not create review "${review.authorName}":`, e)
    }
  }

  // ==========================================================================
  // CHATBOT SETTINGS (global)
  // ==========================================================================
  payload.logger.info('      Seeding chatbot conversation flows...')

  try {
    await payload.updateGlobal({
      slug: 'chatbot-settings',
      data: {
        conversationFlows: onderwijsConversationFlows.map(flow => ({
          label: flow.label,
          icon: flow.icon,
          type: flow.type,
          directMessage: flow.directMessage,
          inputLabel: flow.inputLabel,
          inputPlaceholder: flow.inputPlaceholder,
          contextPrefix: flow.contextPrefix,
          subOptions: flow.subOptions,
        })),
        systemPrompt: onderwijsSystemPrompt,
        trainingContext: onderwijsTrainingContext,
        welcomeMessage: onderwijsWelcomeMessage,
        knowledgeBaseIntegration: {
          searchCollections: ['pages', 'blog-posts', 'courses'],
        },
      } as any,
    })
    result.globals.push('chatbot-settings')
    payload.logger.info('      + Chatbot conversation flows seeded')
  } catch (e) {
    payload.logger.warn('      ! Could not seed chatbot-settings:', e)
  }

  return result
}
