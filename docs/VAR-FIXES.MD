Instructie voor Claude lokaal                                                                                                                                                                           

  Bestanden: index.client.tsx en NavigationBar.tsx

  Actie: Alle CSS variable referenties moeten het --color- prefix krijgen:

  ┌────────────────────────────────┬──────────────────────────────────────┐
  │           Nu (fout)            │             Moet worden              │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--primary, #00897B)        │ var(--color-primary, #00897B)        │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--secondary, #0A1628)      │ var(--color-secondary, #0A1628)      │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--border, #e5e7eb)         │ var(--color-border, #e5e7eb)         │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--surface, #f9fafb)        │ var(--color-surface, #f9fafb)        │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--text-primary, #0A1628)   │ var(--color-text-primary, #0A1628)   │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--text-secondary, #64748b) │ var(--color-text-secondary, #64748b) │
  ├────────────────────────────────┼──────────────────────────────────────┤
  │ var(--text-muted, #94a3b8)     │ var(--color-text-muted, #94a3b8)     │
  └────────────────────────────────┴──────────────────────────────────────┘

  Simpele find-and-replace in beide bestanden.