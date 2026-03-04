/**
 * Utility Blocks
 *
 * Extra blokken voor veelvoorkomende email componenten:
 * - Spacer (instelbare hoogte)
 * - Social media iconen
 * - Video placeholder (thumbnail + play knop)
 * - Countdown timer
 */

export function registerUtilityBlocks(editor: any) {
  const blockManager = editor.BlockManager

  // ═══════════════════════════════════════════════════════════
  // SPACER — Instelbare witruimte
  // ═══════════════════════════════════════════════════════════
  blockManager.add('util-spacer', {
    label: 'Witruimte',
    category: 'Basis',
    attributes: { class: 'fa fa-arrows-v' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 0; height: 40px; line-height: 40px; font-size: 1px;">&nbsp;</td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // SOCIAL MEDIA — Iconen met links
  // ═══════════════════════════════════════════════════════════
  blockManager.add('util-social', {
    label: 'Social media',
    category: 'Basis',
    attributes: { class: 'fa fa-share-alt' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="padding: 0 8px;">
                  <a href="https://facebook.com/" style="text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="32" height="32" style="display: block; border: 0;" />
                  </a>
                </td>
                <td style="padding: 0 8px;">
                  <a href="https://instagram.com/" style="text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="32" height="32" style="display: block; border: 0;" />
                  </a>
                </td>
                <td style="padding: 0 8px;">
                  <a href="https://linkedin.com/" style="text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="32" height="32" style="display: block; border: 0;" />
                  </a>
                </td>
                <td style="padding: 0 8px;">
                  <a href="https://x.com/" style="text-decoration: none;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="X" width="32" height="32" style="display: block; border: 0;" />
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin: 12px 0 0; padding: 0; color: #9ca3af; font-family: Arial, sans-serif; font-size: 12px;">
              Volg ons op social media
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // VIDEO PLACEHOLDER — Thumbnail met play knop
  // ═══════════════════════════════════════════════════════════
  blockManager.add('util-video', {
    label: 'Video',
    category: 'Basis',
    attributes: { class: 'fa fa-play-circle' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <a href="#" style="display: block; text-decoration: none; position: relative;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 8px; overflow: hidden; background-color: #111827;">
                <tr>
                  <td style="padding: 0; text-align: center;">
                    <img src="https://via.placeholder.com/600x340/111827/ffffff?text=Video+Thumbnail" alt="Video" style="width: 100%; height: auto; display: block; opacity: 0.7;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0; text-align: center; margin-top: -80px; position: relative;">
                    <div style="position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background-color: rgba(255,255,255,0.95); border-radius: 50%; line-height: 60px; font-size: 24px; color: #111827;">
                      ▶
                    </div>
                  </td>
                </tr>
              </table>
            </a>
            <p style="margin: 12px 0 0; padding: 0; color: #6b7280; font-family: Arial, sans-serif; font-size: 13px; text-align: center;">
              Klik om de video te bekijken
            </p>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // COUNTDOWN TIMER — Urgentie creëren
  // ═══════════════════════════════════════════════════════════
  blockManager.add('util-countdown', {
    label: 'Countdown',
    category: 'Basis',
    attributes: { class: 'fa fa-clock-o' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 8px;">
              <tr>
                <td style="padding: 30px 20px; text-align: center;">
                  <p style="margin: 0 0 15px; padding: 0; color: #fbbf24; font-family: Arial, sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    Aanbieding eindigt over
                  </p>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 10px; text-align: center;">
                        <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; min-width: 60px;">
                          <span style="color: #ffffff; font-family: Arial, sans-serif; font-size: 32px; font-weight: 700; line-height: 1;">02</span>
                        </div>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Dagen</p>
                      </td>
                      <td style="color: #ffffff; font-size: 28px; font-weight: 700; padding: 0 2px;">:</td>
                      <td style="padding: 0 10px; text-align: center;">
                        <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; min-width: 60px;">
                          <span style="color: #ffffff; font-family: Arial, sans-serif; font-size: 32px; font-weight: 700; line-height: 1;">14</span>
                        </div>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Uren</p>
                      </td>
                      <td style="color: #ffffff; font-size: 28px; font-weight: 700; padding: 0 2px;">:</td>
                      <td style="padding: 0 10px; text-align: center;">
                        <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; min-width: 60px;">
                          <span style="color: #ffffff; font-family: Arial, sans-serif; font-size: 32px; font-weight: 700; line-height: 1;">37</span>
                        </div>
                        <p style="margin: 6px 0 0; color: #94a3b8; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Min</p>
                      </td>
                    </tr>
                  </table>
                  <a href="#" style="display: inline-block; margin-top: 20px; padding: 12px 32px; background-color: #fbbf24; color: #1e293b; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px;">
                    Profiteer nu
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  // ═══════════════════════════════════════════════════════════
  // INHOUDSOPGAVE — Table of contents
  // ═══════════════════════════════════════════════════════════
  blockManager.add('util-toc', {
    label: 'Inhoudsopgave',
    category: 'Basis',
    attributes: { class: 'fa fa-list-ol' },
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
          <td style="padding: 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
              <tr>
                <td style="padding: 20px;">
                  <h3 style="margin: 0 0 15px; padding: 0; color: #1e293b; font-family: Arial, sans-serif; font-size: 16px; font-weight: 600;">
                    In deze nieuwsbrief
                  </h3>
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding: 6px 0;">
                        <a href="#" style="color: #3b82f6; font-family: Arial, sans-serif; font-size: 14px; text-decoration: none;">
                          1. Eerste onderwerp →
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0;">
                        <a href="#" style="color: #3b82f6; font-family: Arial, sans-serif; font-size: 14px; text-decoration: none;">
                          2. Tweede onderwerp →
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0;">
                        <a href="#" style="color: #3b82f6; font-family: Arial, sans-serif; font-size: 14px; text-decoration: none;">
                          3. Derde onderwerp →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
  })

  console.log('[Utility Blocks] Registered 5 utility blokken')
}
