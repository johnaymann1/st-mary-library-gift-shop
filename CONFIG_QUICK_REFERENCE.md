# Site Configuration Quick Reference

## How to Use `siteConfig`

### Import

```typescript
import { siteConfig } from "@/config/site";
```

### Available Properties

#### Store Information

```typescript
siteConfig.name; // "St. Mary Library"
siteConfig.displayName; // "St. Mary"
siteConfig.tagline; // "Library"
siteConfig.description; // Full SEO description
```

#### Contact Details

```typescript
siteConfig.contact.phone; // "+20 123 456 7890"
siteConfig.contact.email; // "support@stmarylibrary.com"
siteConfig.contact.address; // "Cairo, Egypt"
```

#### Currency

```typescript
siteConfig.currency.code; // "EGP"
siteConfig.currency.symbol; // "EGP"
siteConfig.currency.locale; // "en-EG"
```

#### Delivery

```typescript
siteConfig.delivery.fee; // 50
siteConfig.delivery.freeThreshold; // 1000
```

#### Links

```typescript
siteConfig.links.facebook; // ""
siteConfig.links.instagram; // ""
siteConfig.links.twitter; // ""
siteConfig.links.linkedin; // ""
```

#### SEO

```typescript
siteConfig.seo.keywords; // Array of keywords
siteConfig.seo.ogImage; // "/og-image.png"
```

#### Email

```typescript
siteConfig.email.from; // "St Mary Library <onboarding@resend.dev>"
siteConfig.email.adminEmail; // From ADMIN_EMAIL env var
```

---

## Common Usage Examples

### Display Price

```typescript
<span>
  {price.toLocaleString()} {siteConfig.currency.code}
</span>
```

### Store Name in Header

```typescript
<h1>{siteConfig.name}</h1>
```

### Contact Link

```typescript
<a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a>
```

### Delivery Fee Calculation

```typescript
const shippingCost = deliveryType === "delivery" ? siteConfig.delivery.fee : 0;
```

### Email Template

```typescript
<p>
  © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
</p>
```

---

## Where to Update

**File:** `src/config/site.ts`

Update this single file to change store information across the entire application.
