Instructies voor Claude (lokaal): Fix ProductTemplate1.tsx mobile-first                                                                        

  Context                                                                                                                                        
                                                                                                                                                 
  ProductTemplate1.tsx is kapot door een slechte automatische refactoring. De backup (ProductTemplate1.backup.tsx) bevat de werkende originele   
  versie met inline styles.                                                                                                                      
                                                                                                                                                 
  Het probleem
                                                                                                                                                 
  1. 37x dubbele className props - React negeert de eerste, dus klassen worden niet toegepast. Bijvoorbeeld:
  // BUG: eerste className wordt genegeerd
  <Heart className="w-[18px] h-[18px]" className="text-[var(--color-text-primary)]" />
  // FIX:
  <Heart className="w-[18px] h-[18px] text-[var(--color-text-primary)]" />
  2. Desktop layout zichtbaar op mobiel door dubbele className (regel 341-343):
  // BUG: "hidden" wordt overschreven door de tweede className
  <div className="hidden" className="lg:grid lg:grid-cols-[480px_1fr]...">
  // FIX:
  <div className="hidden lg:grid lg:grid-cols-[480px_1fr]...">
  3. Kapotte CSS variable syntax op meerdere plekken:
  bg-[var(--color-surface]     → bg-[var(--color-surface)]
  rounded-[var(--border-radiuspx]  → rounded-xl
  border-bottom-[1px]  → border-b
  max-width-full  → max-w-full
  max-height-full  → max-h-full
  leading-1.2  → leading-tight
  4. 27 resterende inline styles die nog geconverteerd moeten worden naar Tailwind

  Wat te doen

  Stap 1: Revert naar backup en begin opnieuw
  cp src/app/(app)/shop/[slug]/ProductTemplate1.backup.tsx src/app/(app)/shop/[slug]/ProductTemplate1.tsx

  Stap 2: Maak de originele template mobile-first
  De backup werkt op desktop maar heeft 284 inline styles. Converteer ze naar responsive Tailwind classes:

  - Voeg aan de root wrapper toe: className="max-w-[100vw] overflow-x-hidden"
  - Alle style={{ padding: 'Xpx' }} → responsive className="px-4 md:px-6 lg:px-8"
  - Alle style={{ fontSize: 'Xpx' }} → responsive Tailwind text classes
  - Alle style={{ color: '#hex' }} → className="text-[#hex]"
  - Alle style={{ background: '#hex' }} → className="bg-[#hex]"
  - Desktop 2-kolom layout: className="hidden lg:grid lg:grid-cols-[480px_1fr] lg:gap-12"
  - Zorg dat elke className maar 1x per element voorkomt (merge ze!)
  - Gebruik mobile-first: basis = mobiel, md: = tablet, lg: = desktop

  Stap 3: Verifieer
  - npm run build moet slagen zonder errors
  - Check dat er 0x dubbele className props zijn: grep -c 'className.*className' ProductTemplate1.tsx moet 0 zijn
  - Check op mobiel: geen horizontal scroll, tekst past op scherm

  ShopArchiveTemplate1.tsx

  Deze lijkt OK (0 dubbele classNames, 2 inline styles). Controleer wel op mobiel.