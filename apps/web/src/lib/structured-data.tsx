/**
 * JSON-LD Structured Data pour SEO
 * Améliore le référencement Google avec Rich Snippets
 */

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AniReserve',
        url: 'https://anireserve.com',
        logo: 'https://anireserve.com/logo.png',
        description: 'Plateforme de réservation de professionnels francophones en Israël',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'IL',
            addressRegion: 'Tel Aviv',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'contact@anireserve.com',
            availableLanguage: ['French', 'Hebrew', 'English'],
        },
        sameAs: [
            'https://facebook.com/anireserve',
            'https://instagram.com/anireserve',
            'https://twitter.com/anireserve',
        ],
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AniReserve',
        url: 'https://anireserve.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://anireserve.com/?service={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateLocalBusinessSchema(professional: {
    name: string;
    slug: string;
    serviceType: string;
    city: string;
    description?: string;
    phone?: string;
    averageRating?: number;
    totalReviews?: number;
}) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: professional.name,
        url: `https://anireserve.com/professionals/${professional.slug}`,
        description: professional.description || `${professional.serviceType} à ${professional.city}`,
        address: {
            '@type': 'PostalAddress',
            addressLocality: professional.city,
            addressCountry: 'IL',
        },
        geo: {
            '@type': 'GeoCoordinates',
            // Coordonnées à ajouter si disponibles
        },
    };

    if (professional.phone) {
        schema.telephone = professional.phone;
    }

    if (professional.averageRating && professional.totalReviews) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: professional.averageRating,
            reviewCount: professional.totalReviews,
            bestRating: 5,
            worstRating: 1,
        };
    }

    return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateServiceSchema(service: {
    name: string;
    description: string;
    provider: string;
    areaServed?: string[];
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
            '@ type': 'Organization',
            name: service.provider,
        },
        areaServed: service.areaServed?.map(area => ({
            '@type': 'City',
            name: area,
        })) || [],
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: 'https://anireserve.com',
            serviceType: 'Online booking',
        },
    };
}

/**
 * Helper pour injecter le script dans le head
 */
export function StructuredData({ data }: { data: any }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
