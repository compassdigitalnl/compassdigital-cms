# AI Klantinzichten & Analyse

**Status:** Roadmap (toekomstig)
**Prioriteit:** Middel
**Datum:** Maart 2026

---

## Huidige Situatie

Klantdata is beschikbaar in de database (orders, accountgegevens, browse-gedrag via chatbot), maar wordt niet geanalyseerd. Er is geen inzicht in welke klanten dreigen af te haken, wat de lifetime value per klant is, of welke segmenten het meest waardevol zijn. Email marketing (Listmonk) segmentatie gebeurt handmatig.

## Wat het doet

- **Churn prediction** — Voorspel welke klanten dreigen af te haken op basis van bestelfrequentie, laatste activiteit en gedragspatronen
- **Customer Lifetime Value (CLV)** — Bereken en voorspel de verwachte waarde per klant over tijd
- **Automatische klantsegmentatie** — Cluster klanten in groepen (VIP, at-risk, nieuw, slapend) op basis van RFM-analyse (Recency, Frequency, Monetary)
- **Actionable insights dashboard** — Visueel overzicht met concrete aanbevelingen ("15 klanten dreigen af te haken, stuur win-back campagne")
- **Listmonk-integratie** — Segmenten automatisch synchroniseren als Listmonk-lijsten voor gerichte email campagnes

## Waarom waardevol

- **Klantbehoud** — Churn voorkomen is 5-7x goedkoper dan nieuwe klanten werven
- **Slimmere marketing** — Stop met one-size-fits-all campagnes, target de juiste klant met de juiste boodschap
- **B2B essentieel** — B2B-klanten hebben hoge CLV; een verloren B2B-klant kost tienduizenden euro's
- **Data-gedreven beslissingen** — Van onderbuikgevoel naar inzichten gebaseerd op werkelijke klantdata
- **Email marketing ROI** — Automatische segmentatie verhoogt open rates en conversie van Listmonk campagnes significant

## Geschatte Inspanning

**25-35 uur** (met AI-assistentie)

## Implementatiestappen

1. **Data-aggregatie laag** — Verzamel en normaliseer klantdata uit orders, accounts, en chatbot-interacties in een analytics-tabel
2. **RFM-analyse engine** — Bereken Recency (laatste bestelling), Frequency (bestelfrequentie) en Monetary (totale besteding) scores per klant
3. **Klantsegmentatie** — Automatische clustering op basis van RFM-scores: VIP (hoog-hoog-hoog), at-risk (was actief, nu stil), nieuw, slapend, verloren
4. **Churn prediction model** — Logistic regression of gradient boosting model dat op basis van gedragspatronen een churn-kans per klant berekent
5. **CLV berekening** — Historische CLV + predictief model dat verwachte toekomstige waarde voorspelt per klant
6. **Insights dashboard** — Admin pagina met KPI's: totaal actieve klanten, churn rate trend, CLV verdeling, segment-overzicht
7. **Alerts & aanbevelingen** — Automatische notificaties: "12 VIP-klanten hebben 30+ dagen niet besteld", "Segment X reageert goed op kortingen"
8. **Listmonk sync** — Cron job die klantsegmenten als lijsten synchroniseert naar Listmonk, zodat campagnes direct op segmenten kunnen targeten
9. **Geautomatiseerde campagne-triggers** — Bij churn-risico automatisch een win-back email flow starten via Listmonk
10. **Rapportage** — Maandelijkse automatische rapportage per tenant: klantontwikkeling, cohort-analyse, segment-verschuivingen
