/** Catalog types aligned with CredXP Dubai API v1.0.0 (developers, projects, properties). */

export interface CodeNameRef {
  code: string;
  name: string;
}

export interface CurrencyRef {
  code: string;
  symbol: string;
}

export interface DeveloperRef {
  name: string;
  slug: string;
  logo?: string | null;
}

export interface ProjectRef {
  name: string;
  slug: string;
  city?: string;
  area?: string;
  address?: string;
}

export interface StatusRef {
  code: string;
  name: string;
}

export interface MediaItem {
  type: string;
  url: string;
  title?: string;
  altText?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface LocationRef {
  country?: string;
  emirate?: string;
  area?: string;
  city?: string;
}

export interface PaymentMilestone {
  label: string;
  percentage: string;
  type?: CodeNameRef;
}

export interface PaymentPlan {
  name: string;
  downPaymentPercent?: string;
  isDefault?: boolean;
  milestones?: PaymentMilestone[];
}

export interface CursorPaginatedMeta {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: CursorPaginatedMeta;
}

// ─── Developers ───────────────────────────────────────────────────────────────

export interface DeveloperListItem {
  name: string;
  slug: string;
  logo: string | null;
  description?: string;
}

export interface DeveloperDetail extends DeveloperListItem {
  website?: string;
  phone?: string;
  email?: string;
  reraRegistrationNumber?: string;
  projectCount?: number;
  activeProjects?: ProjectListItem[];
  media?: MediaItem[];
}

export interface DeveloperListParams {
  cursor?: string;
  limit?: number;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectListItem {
  name: string;
  slug: string;
  city: string;
  area: string;
  handoverDate?: string;
  serviceChargePerSqft?: string;
  status?: StatusRef;
  developer?: DeveloperRef;
}

export interface ProjectDetail extends ProjectListItem {
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalSlug?: string;
  launchDate?: string;
  dldPermitNumber?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  location?: LocationRef;
  amenities?: CodeNameRef[];
  features?: CodeNameRef[];
  tags?: CodeNameRef[];
  media?: MediaItem[];
  paymentPlans?: PaymentPlan[];
}

export interface ProjectListParams {
  city?: string;
  area?: string;
  developerSlug?: string;
  cursor?: string;
  limit?: number;
}

export type ProjectSort = "newest" | "handover_asc" | "handover_desc";

// ─── Properties ───────────────────────────────────────────────────────────────

export interface PropertyListItem {
  slug: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: string;
  areaSqft: string;
  price: string;
  availability: string;
  currency: CurrencyRef;
  propertyType: CodeNameRef;
  project: ProjectRef;
  developer: DeveloperRef;
}

export interface PropertyDetail extends PropertyListItem {
  metaTitle?: string;
  metaDescription?: string;
  canonicalSlug?: string;
  maidRoom?: boolean;
  balconyAreaSqft?: string;
  parkingSpaces?: number;
  floorNumber?: number;
  viewType?: CodeNameRef;
  furnishingStatus?: CodeNameRef;
  facingDirection?: CodeNameRef;
  status?: StatusRef;
  tower?: { name: string; code: string };
  projectPhase?: string | null;
  location?: LocationRef;
  amenities?: CodeNameRef[];
  features?: CodeNameRef[];
  media?: MediaItem[];
  paymentPlans?: PaymentPlan[];
}

export type PropertySort =
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest"
  | "bedrooms_desc";

export interface PropertyListParams {
  city?: string;
  area?: string;
  developerSlug?: string;
  projectSlug?: string;
  propertyTypeCode?: string;
  bedrooms?: number;
  availability?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: PropertySort;
  cursor?: string;
  limit?: number;
}
