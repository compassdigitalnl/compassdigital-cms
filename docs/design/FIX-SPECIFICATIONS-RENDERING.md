# FIX: Specifications Rendering Crash in Product Templates

## Probleem

Product pages crashen met error:
```
Error: Objects are not valid as a React child (found: object with keys {id, group, attributes})
```

URL voorbeeld: `https://plastimed01.compassdigital.nl/shop/curetape-kinesiotape-5-m-x-5-cm-geel`

## Oorzaak

Na de enterprise upgrade is `product.specifications` een **array van geneste objecten**:
```json
[
  {
    "id": 1,
    "group": "Technische Specificaties",
    "attributes": [
      { "id": 1, "name": "Kleur", "value": "Geel", "unit": "" },
      { "id": 2, "name": "Lengte", "value": "5", "unit": "m" }
    ]
  }
]
```

Maar alle 3 product templates gebruiken `Object.entries(product.specifications)` alsof het een flat key-value object is. `Object.entries()` op een array geeft `["0", {id, group, attributes}]` — en `{value}` probeert een heel object te renderen als React child → crash.

## Fix - Alle 3 Templates

### Template 1: `src/app/(app)/shop/[slug]/ProductTemplate1.tsx`

**Regel 1185** en **regel 1231**: Vervang `Object.entries(product.specifications).map(([key, value], ...)` door:

```tsx
{product.specifications.map((specGroup: any, groupIdx: number) => (
  <div key={groupIdx}>
    {specGroup.group && (
      <h4 style={{
        padding: '12px 20px',
        fontWeight: 700,
        fontSize: '14px',
        background: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {specGroup.group}
      </h4>
    )}
    {specGroup.attributes?.map((attr: any, attrIdx: number) => (
      <div
        key={attrIdx}
        style={{
          display: 'flex',
          padding: '12px 20px',
          borderBottom: '1px solid var(--color-border)',
          fontSize: '14px',
        }}
      >
        <span style={{ width: '160px', color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>
          {attr.name}
        </span>
        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
          {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
        </span>
      </div>
    ))}
  </div>
))}
```

Dit geldt voor BEIDE plekken waar `Object.entries(product.specifications)` voorkomt (regels 1185 en 1231).

### Template 2: `src/app/(app)/shop/[slug]/ProductTemplate2.tsx`

**Regel 706**: Zelfde fix. Vervang `Object.entries(product.specifications).map(([key, value], ...)` door:

```tsx
{product.specifications.map((specGroup: any, groupIdx: number) => (
  <div key={groupIdx}>
    {specGroup.group && (
      <div style={{
        padding: '16px 0 8px',
        fontWeight: 700,
        fontSize: '14px',
        color: 'var(--color-text-primary)',
      }}>
        {specGroup.group}
      </div>
    )}
    {specGroup.attributes?.map((attr: any, attrIdx: number) => (
      <div
        key={attrIdx}
        style={{
          display: 'flex',
          padding: '16px 0',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{
          width: '200px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          flexShrink: 0,
        }}>
          {attr.name}
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
        }}>
          {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
        </div>
      </div>
    ))}
  </div>
))}
```

### Template 3: `src/app/(app)/shop/[slug]/ProductTemplate3.tsx`

**Regel 726-727**: Template 3 doet al `product.specifications.map((specGroup, idx) => ...)` — check of het `specGroup.attributes` correct rendert en niet `specGroup` zelf als child gebruikt.

## Extra: Null-safe check

Voeg bij alle 3 templates een type-check toe vóór de `.map()`:

```tsx
{Array.isArray(product.specifications) && product.specifications.length > 0 && (
  // ... render specifications
)}
```

## Samenvatting

| Template | Bestand | Regels | Fix |
|----------|---------|--------|-----|
| 1 | ProductTemplate1.tsx | 1185, 1231 | `Object.entries()` → `.map()` met group/attributes |
| 2 | ProductTemplate2.tsx | 706 | `Object.entries()` → `.map()` met group/attributes |
| 3 | ProductTemplate3.tsx | 726 | Check: mogelijk al correct, verify attributes rendering |

**KRITIEK**: Dit blokkeert ALLE product pages. Fix met hoge prioriteit.
