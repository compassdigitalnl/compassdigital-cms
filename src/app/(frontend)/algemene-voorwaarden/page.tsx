import { FileText } from 'lucide-react'
import { LegalLayout } from '@/components/LegalLayout'

export const metadata = {
  title: 'Algemene voorwaarden - Plastimed',
  description: 'Onze algemene voorwaarden voor B2B verkoop van medische producten.',
}

const tocItems = [
  { id: 'art1', label: '1. Definities' },
  { id: 'art2', label: '2. Toepasselijkheid' },
  { id: 'art3', label: '3. Aanbiedingen & prijzen' },
  { id: 'art4', label: '4. Bestellen & overeenkomst' },
  { id: 'art5', label: '5. Betaling' },
  { id: 'art6', label: '6. Levering' },
  { id: 'art7', label: '7. Herroepingsrecht' },
  { id: 'art8', label: '8. Garantie' },
  { id: 'art9', label: '9. Aansprakelijkheid' },
  { id: 'art10', label: '10. Privacy' },
]

export default function TermsPage() {
  return (
    <LegalLayout
      title="Algemene voorwaarden"
      lastUpdated="1 januari 2026"
      badge={{
        icon: <FileText className="w-3.5 h-3.5" />,
        label: 'Versie 3.2',
      }}
      tocItems={tocItems}
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Algemene voorwaarden' }]}
    >
      <style jsx global>{`
        .legal-body h2 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin: 32px 0 10px;
          padding-top: 16px;
          border-top: 1px solid #e8ecf1;
        }
        .legal-body h2:first-of-type {
          border-top: none;
          margin-top: 0;
          padding-top: 0;
        }
        .legal-body p {
          font-size: 15px;
          color: #64748b;
          line-height: 1.75;
          margin-bottom: 12px;
        }
        .legal-body ol {
          font-size: 15px;
          color: #64748b;
          line-height: 1.75;
          margin: 0 0 12px 20px;
        }
        .legal-body li {
          margin-bottom: 4px;
        }
      `}</style>

      <h2 id="art1">Artikel 1 — Definities</h2>
      <p>In deze algemene voorwaarden wordt verstaan onder:</p>
      <ol>
        <li>
          <strong>Plastimed:</strong> Plastimed B.V., gevestigd te Parallelweg 124, 1948
          NN Beverwijk, ingeschreven bij de KvK onder nummer 12345678.
        </li>
        <li>
          <strong>Klant:</strong> de natuurlijke persoon of rechtspersoon die een
          overeenkomst aangaat met Plastimed.
        </li>
        <li>
          <strong>Producten:</strong> alle door Plastimed aangeboden medische
          disposables, diagnostische apparatuur en aanverwante artikelen.
        </li>
        <li>
          <strong>Overeenkomst:</strong> elke afspraak tussen Plastimed en de Klant
          waarop deze voorwaarden van toepassing zijn.
        </li>
      </ol>

      <h2 id="art2">Artikel 2 — Toepasselijkheid</h2>
      <p>
        Deze algemene voorwaarden zijn van toepassing op elk aanbod van Plastimed en op
        elke tot stand gekomen overeenkomst op afstand tussen Plastimed en de Klant.
        Afwijkingen zijn alleen geldig indien schriftelijk overeengekomen.
      </p>

      <h2 id="art3">Artikel 3 — Aanbiedingen & prijzen</h2>
      <p>
        Alle prijzen op de website zijn in euro's en exclusief BTW, tenzij anders
        vermeld. Plastimed behoudt zich het recht voor prijzen te wijzigen. Aanbiedingen
        zijn geldig zolang de voorraad strekt en tenzij anders aangegeven.
      </p>
      <p>
        Staffelprijzen worden automatisch berekend op basis van het bestelde aantal. De
        getoonde staffelprijzen zijn indicatief; voor specifieke volumes kunt u een
        offerte op maat aanvragen.
      </p>

      <h2 id="art4">Artikel 4 — Bestellen & overeenkomst</h2>
      <p>
        Een overeenkomst komt tot stand op het moment dat Plastimed de bestelling per
        e-mail bevestigt. Plastimed behoudt zich het recht voor bestellingen te weigeren
        bij gegronde redenen, waaronder betalingsachterstand of fraudeverdenking.
      </p>

      <h2 id="art5">Artikel 5 — Betaling</h2>
      <p>
        Betaling geschiedt via iDEAL, bankoverschrijving, creditcard of op rekening
        (uitsluitend voor goedgekeurde B2B-klanten). Bij betaling op rekening geldt een
        betalingstermijn van 14 of 30 dagen na factuurdatum. Bij overschrijding van de
        betalingstermijn is de Klant van rechtswege in verzuim.
      </p>

      <h2 id="art6">Artikel 6 — Levering</h2>
      <p>
        Plastimed streeft ernaar bestellingen die voor 16:00 op werkdagen worden
        geplaatst, de volgende werkdag te leveren. Leveringstermijnen zijn indicatief en
        overschrijding geeft geen recht op schadevergoeding of ontbinding. Het risico van
        beschadiging of verlies gaat over op de Klant op het moment van levering.
      </p>

      <h2 id="art7">Artikel 7 — Herroepingsrecht</h2>
      <p>
        Zakelijke klanten (B2B) hebben geen wettelijk herroepingsrecht. Plastimed biedt
        echter een coulanceregeling: ongebruikte producten in originele verpakking kunnen
        binnen 14 dagen na ontvangst worden geretourneerd. Steriele en hygiëne-gevoelige
        producten zijn uitgesloten. Retourkosten zijn voor rekening van de Klant, tenzij
        sprake is van een foutieve levering.
      </p>

      <h2 id="art8">Artikel 8 — Garantie</h2>
      <p>
        Op medische apparatuur geldt de garantie van de fabrikant. Plastimed bemiddelt
        bij garantieclaims. Disposable producten zijn van garantie uitgesloten. Garantie
        vervalt bij onjuist gebruik, onbevoegde reparatie of externe schade.
      </p>

      <h2 id="art9">Artikel 9 — Aansprakelijkheid</h2>
      <p>
        De aansprakelijkheid van Plastimed is beperkt tot het factuurbedrag van de
        betreffende bestelling. Plastimed is niet aansprakelijk voor indirecte schade,
        gevolgschade of schade door onjuist gebruik van producten. De Klant is
        verantwoordelijk voor het juiste gebruik van medische producten conform de
        instructies van de fabrikant.
      </p>

      <h2 id="art10">Artikel 10 — Privacy</h2>
      <p>
        Plastimed verwerkt persoonsgegevens conform de Algemene Verordening
        Gegevensbescherming (AVG). Zie ons privacybeleid voor een volledig overzicht van
        hoe wij uw gegevens verzamelen, gebruiken en beschermen.
      </p>
    </LegalLayout>
  )
}
