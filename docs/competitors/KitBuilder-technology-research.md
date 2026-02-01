# KitBuilder's 3D customizer: a proprietary SaaS stack built on Azure

KitBuilder is a **closed-source, enterprise SaaS platform** that deliberately keeps its core rendering technology undisclosed. While the company evolved from Flash-based 2D (founded 2003) to modern browser-based 3D, specific details about their 3D library—whether Three.js, Babylon.js, or custom WebGL—remain proprietary. What we know for certain: the platform runs on **Microsoft Azure**, embeds via a **JavaScript widget architecture**, and integrates with e-commerce platforms through **REST APIs** with OAuth authentication.

## The rendering engine remains a black box

KitBuilder does not publicly document which 3D rendering library powers their configurator. The transition from Flash strongly suggests **WebGL-based rendering** for browser compatibility, but no technical articles, GitHub repositories, or developer documentation confirm whether they use Three.js, Babylon.js, or a custom implementation. Their marketing claims "3D speed is second to none, using the latest 3D techniques"—but provides no benchmarks.

The platform runs entirely in-browser with no plugins required, supporting real-time 3D visualization with dynamic design changes. JavaScript must be enabled, and WebGL support is recommended. Container width requirements of **960-980 pixels** suggest the 3D canvas has fixed rendering constraints rather than fully responsive behavior.

## JavaScript widget architecture powers the embed system

KitBuilder's frontend implementation uses a **bootstrapper pattern** that dynamically loads all required assets from a single script entry point:

```html
<script src="https://api.kitbuilder.co.uk/api/bootstrapper?distributorId=668216"></script>
<script>KitBuilder.init("#kitBuilder");</script>
```

This exposes a global `KitBuilder` object with an `init()` method for targeted container initialization. The widget approach differs from iframe embedding—though iframe fallback exists for compatibility edge cases. Styling customization happens via CSS overrides, and a white-label option removes KitBuilder branding entirely.

No npm package, public SDK, or GitHub repository exists for the 3D customizer. The specific frontend framework (React, Vue, Angular) remains undisclosed. Their marketing website runs WordPress with Elementor, but this is separate from the product itself.

## Azure infrastructure with REST API integrations

The backend runs on **Microsoft Azure** with worldwide CDN distribution across multiple data centers. The SaaS architecture includes automatic updates pushed to all client instances, **99.9%+ claimed uptime**, DDoS protection, and regular security testing. Hosting and unlimited bandwidth are included with subscriptions.

For e-commerce integration, KitBuilder provides REST APIs with platform-specific authentication:

| Platform | Integration Method | Authentication |
|----------|-------------------|----------------|
| **Shopify** | Private App API | API password |
| **WooCommerce** | REST API | OAuth (Consumer Key/Secret) |
| **BigCommerce** | API Credentials | Client ID + Access Token |
| **Magento, OpenCart, nopCommerce** | Custom API integration | Varies |

CMS platforms like WordPress, Wix, Joomla, and Drupal support JavaScript embed only without native API integration. The workflow creates products directly in connected e-commerce platforms—BigCommerce implementations store products in a hidden category invisible to search.

## File format support prioritizes print production output

KitBuilder's 3D model input specifications are **not publicly documented**. Models can come from their off-the-shelf library, bespoke in-house modeling, or customer-provided files created from CAD patterns. Customer models typically require "re-export" to work within their system—suggesting proprietary format requirements or specific optimization needs.

Output formats focus heavily on print production workflows:

- **RGB SVG files** for scalable vector output per order
- **CMYK PDF files** for color-accurate print production
- **RGB PDF files** for digital workflows
- **Sliced PNG files** for production processes
- **Production ZIP packages** containing all manufacturing assets

An **Adobe Illustrator plugin** enables one-click conversion to multi-sized files with automatic field population. This integration displays the 3D model alongside designs and generates size-specific outputs scaled to exact print specifications. Print queue automation can trigger at cart addition, order creation, or payment.

## How KitBuilder connects to e-commerce platforms

The integration architecture keeps customers entirely within the merchant's storefront—no redirects to external checkout. When a customer completes customization:

1. The JavaScript widget communicates configuration to KitBuilder's servers
2. KitBuilder creates a product directly in the connected e-commerce platform via API
3. Order data persists in both KitBuilder's system and the merchant's platform
4. Production files become accessible through KitBuilder's Orders dashboard

Shopify integration requires creating a Private App with read/write product permissions. WooCommerce demands a custom WordPress user role with `publish_products` capability plus REST API keys. BigCommerce uses API credentials with store path configuration.

## Performance claims without published benchmarks

KitBuilder emphasizes speed in marketing—"exceptionally high loading speeds" and "second to none" 3D performance—but publishes no quantitative benchmarks. The Azure CDN infrastructure suggests geographic performance optimization. Real-time pricing updates occur as customers modify designs, indicating efficient state management between the 3D renderer and pricing logic.

Mobile support exists but with constraints: landscape orientation is recommended, and the fixed container width (960-980px) may limit responsive behavior on smaller screens.

## Additional technical components

Beyond core 3D functionality, KitBuilder includes several specialized features:

- **Caldera integration** connects the 3D configurator directly into Caldera's print workflow manufacturing software
- **CSV import** enables batch team roster uploads for squad store functionality  
- **Multi-site deployment** allows a single customizer instance to serve multiple storefronts and software platforms simultaneously
- **Smart scaling controls** let administrators define which design elements scale dynamically versus remain fixed across product sizes

## Conclusion

KitBuilder operates as a **mature but opaque technical platform**—the company treats implementation specifics as competitive advantages rather than documentation opportunities. Confirmed technologies include Microsoft Azure hosting, JavaScript widget embedding, REST APIs with OAuth, and SVG/PDF output generation. The specific 3D rendering library, frontend framework, and backend language stack remain undisclosed. No public API documentation, developer portal, or SDK exists; technical specifications are provided during customer onboarding with implementation support handled by KitBuilder's team rather than self-service resources. For organizations evaluating the platform, this means direct engagement with KitBuilder is required to understand deeper technical compatibility requirements.