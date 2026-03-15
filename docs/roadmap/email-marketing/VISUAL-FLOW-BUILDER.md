# Visuele Flow Builder

**Status:** Roadmap
**Prioriteit:** Hoog (verkoopargument)
**Geschatte effort:** 25-35 uur (met AI)

---

## Huidige situatie

Er zijn al automation flows aanwezig in het email marketing systeem, maar deze werken lineair: een reeks stappen die achter elkaar worden uitgevoerd. Er is geen visuele editor om flows te ontwerpen. Flows worden nu geconfigureerd via formulieren in de admin, wat onoverzichtelijk wordt bij complexere scenario's met vertakkingen en condities. Concurrenten zoals Mailchimp en ActiveCampaign bieden wel een visuele drag-and-drop builder.

## Wat het doet

Een visuele drag-and-drop flow builder waarmee marketeers automation flows ontwerpen als een flowchart:

- **Visuele canvas** — Flows ontwerpen door nodes te slepen en te verbinden
- **Node types** — Triggers, acties, condities, vertakkingen, wachttijden, A/B splits
- **Drag-and-drop** — Nodes toevoegen vanuit een zijpaneel, verbindingen slepen tussen nodes
- **Live preview** — Real-time visualisatie van de flow logica
- **Validatie** — Automatische controle op fouten (ontbrekende verbindingen, lege condities)
- **Statistieken overlay** — Per node zien hoeveel contacts er doorheen zijn gegaan

## Waarom waardevol

- **Verkoopargument** — Een visuele flow builder is de verwachting bij moderne email marketing tools; zonder is het platform moeilijker te verkopen
- **Gebruiksvriendelijkheid** — Marketeers zonder technische kennis kunnen complexe flows ontwerpen
- **Overzicht** — Visuele weergave maakt het direct duidelijk wat een flow doet
- **Complexere flows** — Vertakkingen, A/B splits en conditionele paden worden haalbaar
- **Minder fouten** — Visuele validatie voorkomt logische fouten in flows
- **Multi-tenant** — Elke tenant kan eigen flows ontwerpen zonder technische hulp

## Implementatiestappen

1. **React Flow integratie** (4-6 uur)
   - React Flow (of vergelijkbare library) installeren en configureren
   - Custom canvas component met zoom, pan en grid
   - Integratie als custom view in Payload CMS admin
   - State management voor flow-data (nodes + edges)
   - Undo/redo functionaliteit

2. **Node systeem** (6-8 uur)
   - Base node component met consistente styling
   - Trigger nodes: formulier ingevuld, tag toegevoegd, aankoop gedaan, datum bereikt
   - Actie nodes: email verzenden, tag toevoegen/verwijderen, wachten, webhook
   - Conditie nodes: if/else op basis van subscriber attributen, email interactie, aankoophistorie
   - Vertakking nodes: A/B split met percentages
   - Node configuratie via zijpaneel (klik op node om instellingen te bewerken)

3. **Verbindingen & flow logica** (4-6 uur)
   - Drag-to-connect tussen node poorten
   - Validatie van verbindingen (juiste typen)
   - Ja/nee paden bij conditie nodes
   - Samenvoegen van vertakkingen
   - Automatische layout (dagre of elkjs) voor nette positionering

4. **Persistentie & migratie** (3-5 uur)
   - Flow opslaan als JSON (nodes, edges, configuratie)
   - Mapping van visuele flow naar bestaande automation flow structuur
   - Migratie van bestaande lineaire flows naar visueel formaat
   - Versiebeheer (vorige versies bekijken en herstellen)

5. **Validatie & testing** (3-4 uur)
   - Automatische flow-validatie (geen dode einden, verplichte velden ingevuld)
   - Visuele foutmarkeringen op nodes met problemen
   - Test-modus: flow doorlopen met een test-subscriber
   - Preview van emails binnen de flow builder

6. **Statistieken overlay** (3-5 uur)
   - Per node weergeven: aantal contacts, conversiepercentage
   - Visuele heatmap op verbindingen (dikkere lijn = meer traffic)
   - Klikbare statistieken (doorklikken naar contactlijst per node)
   - Tijdlijn-weergave van een individuele contact door de flow

7. **Templates & kopieren** (2-3 uur)
   - Voorgedefinieerde flow templates (welkomstreeks, abandoned cart, re-engagement)
   - Flow dupliceren en aanpassen
   - Flow exporteren/importeren (JSON)
   - Template galerij met beschrijvingen en previews
