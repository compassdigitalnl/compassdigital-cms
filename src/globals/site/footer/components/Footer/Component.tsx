import Link from 'next/link'
import { Linkedin, Instagram, Facebook, Phone, Mail, MapPin, Clock, Check } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="bg-navy-900 rounded-3xl overflow-hidden text-gray-400 mt-12">
      {/* Top Section */}
      <div className="p-12 grid grid-cols-4 gap-9 border-b border-white/5">
        {/* Brand */}
        <div>
          <div className="text-2xl font-extrabold text-white mb-2.5">
            plasti<span className="text-[var(--color-primary-light)]">med</span>
          </div>
          <p className="text-sm leading-relaxed mb-3.5">
            Sinds 1994 leverancier van professionele medische disposables, diagnostiek en
            praktijkbenodigdheden voor de zorgprofessional.
          </p>
          <div className="flex gap-1.5">
            <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all">
              <Linkedin className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all">
              <Instagram className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all">
              <Facebook className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3.5">Categorieën</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Handschoenen
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Diagnostiek
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Verbandmiddelen
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Injectiemateriaal
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Desinfectie
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Alle categorieën
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3.5">Klantenservice</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/faq/" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Veelgestelde vragen
              </Link>
            </li>
            <li>
              <Link href="/shipping/" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Verzending & retour
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/quote/" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Offerte aanvragen
              </Link>
            </li>
            <li>
              <Link href="/auth/register/" className="text-sm hover:text-[var(--color-primary-light)] transition-colors">
                Klant worden
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-extrabold text-sm mb-3.5">Contact</h4>
          <div className="space-y-2">
            {/* TODO: Make dynamic - get from Settings global */}
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[var(--color-primary-light)]" />
              +31 20 123 4567
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-[var(--color-primary-light)]" />
              info@example.com
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[var(--color-primary-light)]" />
              Voorbeeldstraat 123, Amsterdam
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[var(--color-primary-light)]" />
              Ma-Vr 08:30-17:00
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-12 py-5 border-b border-white/5 flex flex-wrap gap-6">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          ISO 13485 gecertificeerd
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          Alle producten CE-gemarkeerd
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          AVG/GDPR compliant
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          Veilig betalen via iDEAL
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Check className="w-3.5 h-3.5 text-green-500" />
          Verzending door PostNL
        </div>
      </div>

      {/* Bottom */}
      <div className="px-12 py-4 flex justify-between items-center text-xs">
        <span>© 2026 Plastimed B.V. — Alle rechten voorbehouden</span>
        <div className="flex gap-4">
          <Link href="/terms/" className="hover:text-[var(--color-primary-light)] transition-colors">
            Algemene voorwaarden
          </Link>
          <Link href="/privacy/" className="hover:text-[var(--color-primary-light)] transition-colors">
            Privacybeleid
          </Link>
          <Link href="/cookies/" className="hover:text-[var(--color-primary-light)] transition-colors">
            Cookiebeleid
          </Link>
        </div>
      </div>
    </footer>
  )
}
