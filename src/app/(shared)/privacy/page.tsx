import { Shield } from 'lucide-react'
import { LegalLayout } from '@/branches/shared/components/layout/LegalLayout'
import '../legal.css'

export const metadata = {
  title: 'Privacybeleid - Plastimed',
  description: 'Ons privacybeleid conform AVG/GDPR wetgeving.',
}

const tocItems = [
  { id: 'p1', label: '1. Verantwoordelijke' },
  { id: 'p2', label: '2. Welke gegevens' },
  { id: 'p3', label: '3. Doeleinden' },
  { id: 'p4', label: '4. Bewaartermijn' },
  { id: 'p5', label: '5. Derden' },
  { id: 'p6', label: '6. Cookies' },
  { id: 'p7', label: '7. Uw rechten' },
  { id: 'p8', label: '8. Beveiliging' },
  { id: 'p9', label: '9. Contact' },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacybeleid"
      lastUpdated="1 januari 2026"
      badge={{
        icon: <Shield className="w-3.5 h-3.5" />,
        label: 'AVG / GDPR compliant',
      }}
      tocItems={tocItems}
      breadcrumbItems={[{ label: 'Home', href: '/' }, { label: 'Privacybeleid' }]}
    >
      <h2 id="p1">1. Verantwoordelijke</h2>
      <p>
        Plastimed B.V. (KvK 12345678) is verantwoordelijk voor de verwerking van
        persoonsgegevens zoals beschreven in dit privacybeleid. Wij nemen de bescherming
        van uw gegevens serieus en handelen conform de Algemene Verordening
        Gegevensbescherming (AVG/GDPR).
      </p>

      <h2 id="p2">2. Welke gegevens verzamelen wij?</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Categorie</th>
            <th>Gegevens</th>
            <th>Grondslag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Accountgegevens</td>
            <td>Naam, e-mail, telefoon, bedrijfsgegevens, KVK</td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>Bestelgegevens</td>
            <td>Bestelhistorie, aflever-/factuuradres, betaalgegevens</td>
            <td>Uitvoering overeenkomst</td>
          </tr>
          <tr>
            <td>Websitegebruik</td>
            <td>IP-adres, browsertype, paginabezoeken, zoektermen</td>
            <td>Gerechtvaardigd belang</td>
          </tr>
          <tr>
            <td>Communicatie</td>
            <td>E-mails, chat, telefoonnotities</td>
            <td>Gerechtvaardigd belang</td>
          </tr>
        </tbody>
      </table>

      <h2 id="p3">3. Doeleinden</h2>
      <p>
        Wij gebruiken uw gegevens voor het verwerken en leveren van bestellingen, het
        beheren van uw account, het versturen van facturen, het verbeteren van onze
        website en dienstverlening, en — met uw toestemming — voor het sturen van
        relevante productaanbiedingen.
      </p>

      <h2 id="p4">4. Bewaartermijn</h2>
      <p>
        Wij bewaren uw gegevens niet langer dan noodzakelijk. Accountgegevens worden
        bewaard zolang uw account actief is. Factuurgegevens worden 7 jaar bewaard
        (wettelijke verplichting). Websitegegevens worden na 26 maanden geanonimiseerd.
      </p>

      <h2 id="p5">5. Delen met derden</h2>
      <p>
        Wij delen uw gegevens uitsluitend met partijen die noodzakelijk zijn voor onze
        dienstverlening:
      </p>
      <ul>
        <li>PostNL — voor de bezorging van uw bestelling</li>
        <li>Betaalprovider (Mollie) — voor de verwerking van betalingen</li>
        <li>Hosting (Hetzner) — voor het hosten van onze website, servers in de EU</li>
      </ul>
      <p>Wij verkopen nooit persoonsgegevens aan derden.</p>

      <h2 id="p6">6. Cookies</h2>
      <p>
        Onze website gebruikt cookies voor functionele doeleinden (essentieel),
        websiteanalyse (analytisch, Google Analytics 4) en, met uw toestemming,
        marketing. U kunt uw voorkeuren aanpassen via de cookie-instellingen onderaan de
        website.
      </p>

      <h2 id="p7">7. Uw rechten</h2>
      <p>
        Op grond van de AVG heeft u het recht op inzage, rectificatie, verwijdering en
        overdracht van uw gegevens. Ook kunt u bezwaar maken tegen verwerking of uw
        toestemming intrekken. U kunt een verzoek indienen via uw contactformulier of
        privacy@uwbedrijf.nl. Wij reageren binnen 30 dagen.
      </p>

      <h2 id="p8">8. Beveiliging</h2>
      <p>
        Wij nemen passende technische en organisatorische maatregelen om uw gegevens te
        beschermen tegen ongeautoriseerde toegang, verlies of misbruik. Onze website
        maakt gebruik van SSL-encryptie. Toegang tot persoonsgegevens is beperkt tot
        geautoriseerd personeel.
      </p>

      <h2 id="p9">9. Contact</h2>
      <p>
        Voor vragen over dit privacybeleid of het uitoefenen van uw rechten kunt u
        contact opnemen via privacy@uwbedrijf.nl of telefonisch via uw contactgegevens.
        U heeft altijd het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.
      </p>
    </LegalLayout>
  )
}
