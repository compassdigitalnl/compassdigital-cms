Wat er lokaal moet gebeuren                                                                                                                    
                                                                                                                                                 
  1. Template selectors — NIETS te doen                                                                                                          
                                                                                                                                                 
  Die code staat er al. Alleen een deploy nodig, geen code changes.

  2. Inline styles fixen — WEL lokaal werk

  Twee bestanden moeten gerefactord worden:

  A. src/app/(app)/shop/[slug]/ProductTemplate1.tsx
  - 284x style={{}} vervangen door responsive Tailwind classes
  - Doel: mobiel-vriendelijk maken (tekst/content past nu niet op klein scherm)

  B. src/app/(app)/shop/ShopArchiveTemplate1.tsx
  - 114x style={{}} vervangen door responsive Tailwind classes
  - Zelfde probleem als hierboven

  Wat de refactor concreet inhoudt

  Per bestand: elke inline style omzetten naar Tailwind. Bijvoorbeeld:

  ┌───────────────────────────────────────────────┬────────────────────────────────────────────────┐
  │                 Inline style                  │              Wordt Tailwind class              │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ padding: '16px' }}                   │ className="p-4"                                │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ fontSize: '22px', fontWeight: 800 }} │ className="text-xl md:text-2xl font-extrabold" │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ color: '#00897B' }}                  │ className="text-[#00897B]"                     │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ background: '#F5F7FA' }}             │ className="bg-[#F5F7FA]"                       │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ gap: '12px' }}                       │ className="gap-3"                              │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ borderRadius: '12px' }}              │ className="rounded-xl"                         │
  ├───────────────────────────────────────────────┼────────────────────────────────────────────────┤
  │ style={{ boxShadow: '0 4px 20px ...' }}       │ className="shadow-lg"                          │
  └───────────────────────────────────────────────┴────────────────────────────────────────────────┘

  En overal responsive breakpoints toevoegen waar nodig (md:, lg:), zodat het op mobiel goed past.