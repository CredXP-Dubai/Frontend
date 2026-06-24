import type { Property } from "@/types/api";

function formatPrice(price: number, currency = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="property-card">
      <div className="property-card__image">
        {property.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={property.images[0]} alt={property.title} />
        ) : (
          <div className="property-card__placeholder" aria-hidden="true" />
        )}
        {property.featured && (
          <span className="property-card__badge">Featured</span>
        )}
      </div>
      <div className="property-card__body">
        <h3 className="property-card__title">{property.title}</h3>
        {property.location && (
          <p className="property-card__location">{property.location}</p>
        )}
        <p className="property-card__price">
          {formatPrice(property.price, property.currency)}
        </p>
        <div className="property-card__meta">
          {property.bedrooms != null && (
            <span>{property.bedrooms} bed</span>
          )}
          {property.bathrooms != null && (
            <span>{property.bathrooms} bath</span>
          )}
          {property.areaSqft != null && (
            <span>{property.areaSqft.toLocaleString()} sqft</span>
          )}
        </div>
      </div>
    </article>
  );
}
