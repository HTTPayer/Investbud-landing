# SEO & Metadata Configuration

## Current Setup

### Metadata
The application includes comprehensive metadata in `app/layout.tsx`:

#### Basic SEO
- **Title**: "Investbud AI - AI Co-Pilot for Crypto Investing"
- **Description**: Comprehensive description with key features
- **Keywords**: 18 relevant keywords covering crypto, AI, DeFi, portfolio analysis

#### OpenGraph (Facebook, LinkedIn, etc.)
- Type: website
- Locale: en_US
- Images: 1200x630 OG image
- Sitemap: Proper URL structure

#### Twitter Cards
- Card type: summary_large_image
- Custom images and descriptions
- Creator handle: @investbud

#### Robots & Crawlers
- Full indexing enabled
- Max video/image preview
- Google Bot optimized

### Missing Assets (To Add Before Production)

#### 1. Open Graph Image
**Location**: `/public/og-image.jpg`
**Specifications**:
- Size: 1200x630 pixels
- Format: JPG or PNG
- Content: Investbud branding, tagline, key features
- Tools: Canva, Figma, Photoshop

**Design Tips**:
- Include logo prominently
- Use blue gradient (#2563eb theme)
- Add tagline: "AI Co-Pilot for Crypto Investing"
- Show mock chat interface or dashboard
- Keep text large and readable

#### 2. Favicons
**Needed files**:
- `/public/favicon.ico` (32x32, 16x16 multi-size)
- `/public/apple-touch-icon.png` (180x180)
- Optional: `/public/favicon-16x16.png`
- Optional: `/public/favicon-32x32.png`

**Tools**: 
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Verification Codes

Add these in `app/layout.tsx` when ready:

```typescript
verification: {
  google: 'your-google-search-console-code',
  yandex: 'your-yandex-verification-code',
}
```

**How to get**:
1. **Google Search Console**: https://search.google.com/search-console
   - Add property → HTML tag method
   - Copy verification code
   
2. **Yandex Webmaster**: https://webmaster.yandex.com/
   - Add site → Meta tag method
   - Copy verification code

### Sitemap

Create `/app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://investbudai.xyz',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add more pages as you create them
  ]
}
```

### Structured Data (Schema.org)

Consider adding to `app/layout.tsx` or `app/page.tsx`:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Investbud AI',
  description: 'AI Co-Pilot for Crypto Investing',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0.10',
    priceCurrency: 'USDC',
  },
}

// Add to page:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### Performance Optimization

#### Current Status
- ✅ Static homepage (prerendered)
- ✅ Optimized API routes
- ✅ No blocking scripts

#### Recommendations
1. **Image Optimization**: Use Next.js `<Image>` component
2. **Font Optimization**: Consider `next/font`
3. **Analytics**: Add Vercel Analytics or Google Analytics
4. **Error Tracking**: Integrate Sentry

### Social Media Setup

#### Before Launch
1. **Create Twitter account**: @investbud (or your handle)
2. **Update Twitter handle** in `app/layout.tsx`
3. **Test OG images**: Use [OpenGraph.xyz](https://www.opengraph.xyz/)
4. **Test Twitter cards**: Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Analytics & Tracking

#### Google Analytics (GA4)
Add to `app/layout.tsx`:

```typescript
import Script from 'next/script'

// In <head>
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

#### Vercel Analytics (Recommended)
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

// Add to layout
<Analytics />
```

### Pre-Launch Checklist

- [ ] Create OG image (1200x630)
- [ ] Generate favicons
- [ ] Set up Google Search Console
- [ ] Add verification codes
- [ ] Test OG tags with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Test Twitter cards
- [ ] Create sitemap.ts
- [ ] Add structured data (Schema.org)
- [ ] Set up analytics (Vercel or GA4)
- [ ] Update Twitter handle
- [ ] Test on mobile devices
- [ ] Check accessibility
- [ ] Run Lighthouse audit

### Post-Launch

1. **Submit sitemap** to Google Search Console
2. **Monitor** Core Web Vitals
3. **Track** user engagement metrics
4. **Update** OG images seasonally or for campaigns
5. **Test** social sharing regularly

### Useful Tools

- **OG Image Testing**: [OpenGraph.xyz](https://www.opengraph.xyz/)
- **Twitter Cards**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **SEO Audit**: [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- **Structured Data**: [Google Rich Results Test](https://search.google.com/test/rich-results)
- **Favicon Generator**: [RealFaviconGenerator](https://realfavicongenerator.net/)
- **Meta Tags**: [Meta Tags](https://metatags.io/)

## Current Metadata Details

### Keywords Included
- crypto AI
- crypto portfolio analysis
- DeFi AI assistant
- blockchain wallet analysis
- crypto market analysis
- on-chain analysis
- crypto trading AI
- macro regime signals
- Web3 AI
- crypto investment advisor
- portfolio tracker
- cryptocurrency analysis
- AI trading assistant
- Base blockchain
- USDC payments
- x402 protocol
- MetaMask integration
- crypto co-pilot

### URL Structure
- Base URL: https://investbudai.xyz
- Canonical: / (homepage)
- Update `metadataBase` URL when domain is ready

### Theme
- Primary color: #2563eb (blue-600)
- Used for theme-color meta tag
- Matches brand identity
