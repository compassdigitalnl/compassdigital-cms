# Unified Content Collections — Voortgang

## Wat we doen

**Probleem:** 78+ collections, veel duplicatie (5x Services, 4x Cases, 4x Reviews, etc.), 16 admin groups, 60+ feature flags.

**Oplossing:** 7 unified collections met `branch` veld + Settings-driven activatie.

## De 7 nieuwe collections

| # | Collection | Vervangt | Slug |
|---|-----------|----------|------|
| 1 | **Content Services** | services, professional-services, construction-services, beautyServices, treatments | `content-services` |
| 2 | **Content Cases** | cases, professional-cases, construction-projects, projects | `content-cases` |
| 3 | **Content Reviews** | testimonials, professional-reviews, construction-reviews, experience-reviews | `content-reviews` |
| 4 | **Content Inquiries** | quotes (B2B), quote-requests, consultation-requests | `content-inquiries` |
| 5 | **Content Bookings** | beautyBookings, appointments, reservations | `content-bookings` |
| 6 | **Content Team** | stylists, practitioners | `content-team` |
| 7 | **Content Activities** | experiences, events, workshops | `content-activities` |

## Sprints

### Sprint A: Foundation (ACTIEF)
- [x] Codebase analyse
- [ ] 7 unified collection definities aanmaken
- [ ] Settings > "Content Modules" tab toevoegen
- [ ] `contentModules.ts` runtime module
- [ ] `shouldHideCollection()` updaten
- [ ] Registratie in `payload.config.ts`
- [ ] Build test

### Sprint B: Data Migratie
- [ ] Migratiescript per archetype
- [ ] Test op dev database

### Sprint C: Blocks Aanpassen
- [ ] Blocks updaten naar unified collections
- [ ] `branchFilter` veld toevoegen

### Sprint D: Deprecate Oude Collections
- [ ] Oude collections hidden maken
- [ ] Imports updaten

### Sprint E: Cleanup
- [ ] Oude collections verwijderen
- [ ] Feature flags opschonen

## Kernprincipe
Eén collection per content-archetype met `branch` veld. Activatie via Settings UI i.p.v. ENV variabelen. Oude collections blijven bestaan als fallback tot alles gemigreerd is.

## Nieuwe bestanden
```
src/branches/shared/collections/ContentServices/index.ts
src/branches/shared/collections/ContentCases/index.ts
src/branches/shared/collections/ContentReviews/index.ts
src/branches/shared/collections/ContentInquiries/index.ts
src/branches/shared/collections/ContentBookings/index.ts
src/branches/shared/collections/ContentTeam/index.ts
src/branches/shared/collections/ContentActivities/index.ts
src/lib/tenant/contentModules.ts
```

## Gewijzigde bestanden
```
src/globals/site/Settings.ts          → + Content Modules tab
src/payload.config.ts                 → + 7 unified collections
src/lib/tenant/shouldHideCollection.ts → + contentModules check
src/lib/tenant/features.ts            → + content module helpers
```
