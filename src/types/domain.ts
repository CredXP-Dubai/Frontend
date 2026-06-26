/**
 * CredXP SOW domain models — single source of truth for platform entities.
 * API transport types live in `catalog.ts`; extend here for full product shape.
 */

import type { User } from "./api";
import type { DeveloperListItem, PropertyListItem } from "./catalog";

// ─── Theme (SOW: Admin Theme Management + Developer CMS) ─────────────────────

export interface ThemeTokens {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  typographyStyle?: "serif" | "sans";
}

// ─── Verification (SOW: Verified Listings) ─────────────────────────────────

export interface VerificationData {
  propertyVerified: boolean;
  developerVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  badgeLabel?: string;
}

// ─── Virtual Tours (SOW: Property Details) ───────────────────────────────────

export interface VirtualTour {
  provider?: "matterport" | "youtube" | "custom";
  embedUrl: string;
  thumbnailUrl?: string;
  label?: string;
}

// ─── ROI / Investment (SOW: ROI Calculator on Property Details) ──────────────

export interface RoiData {
  purchasePriceAed: number;
  annualRentalIncomeAed?: number;
  annualCostsAed?: number;
  projectedCagrPct?: number;
  rentalYieldPct?: number;
  currency?: string;
}

// ─── ROI Calculator inputs (shared with lib/calculators/investment.ts) ───────

export interface RoiInput {
  purchasePriceAed: number;
  annualRentalIncomeAed: number;
  annualCostsAed?: number;
  holdingYears?: number;
}

export interface CagrInput {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface RentalYieldInput {
  purchasePriceAed: number;
  annualRentalIncomeAed: number;
}

export interface InvestmentComparisonInput {
  dubaiPriceAed: number;
  dubaiAnnualYieldPct: number;
  indiaPriceInr: number;
  indiaAnnualYieldPct: number;
  inrPerAed?: number;
}

export interface InvestmentComparisonResult {
  dubaiAnnualIncomeAed: number;
  indiaAnnualIncomeAed: number;
  dubaiYieldPct: number;
  indiaYieldPct: number;
  higherYieldMarket: "dubai" | "india";
}

// ─── Property Detail (SOW extensions beyond API) ───────────────────────────

export interface PropertySowDetail extends PropertyListItem {
  brochureUrl?: string;
  virtualTour?: VirtualTour;
  verification?: VerificationData;
  roi?: RoiData;
  floorPlans?: string[];
  latitude?: number;
  longitude?: number;
}

/** @deprecated Use PropertySowDetail */
export type PropertyDetail = PropertySowDetail;

// ─── Developer Detail (SOW extensions beyond API) ──────────────────────────

export interface DeveloperSowDetail extends DeveloperListItem {
  theme?: ThemeTokens;
  verification?: VerificationData;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

/** @deprecated Use DeveloperSowDetail */
export type DeveloperDetail = DeveloperSowDetail;

// ─── Leads (SOW: Progressive Lead Capture + CRM) ───────────────────────────

export type LeadCaptureStep =
  | "country"
  | "intent"
  | "lastVisit"
  | "name"
  | "phone";

export type LeadIntent = "invest" | "move-in";

export type LeadStatus = "new" | "qualified" | "assigned" | "converted" | "lost";

export interface Lead {
  id: string;
  country: string;
  intent: LeadIntent;
  lastDubaiVisit?: string;
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  brokerId?: string;
  status: LeadStatus;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  timeline?: string;
  source?: string;
  smartSearch?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgressiveLeadPayload {
  country: string;
  intent: LeadIntent;
  lastDubaiVisit?: string;
  name: string;
  phone: string;
  propertyId?: string;
  source?: string;
  smartSearch?: Record<string, string>;
}

// ─── Brokers (SOW: Broker Portal) ────────────────────────────────────────────

export type BrokerRole = "AFFILIATE_BROKER" | "BROKER" | "ADMIN";

export interface Broker extends User {
  role?: BrokerRole;
  agencyName?: string;
  licenseNumber?: string;
  whatsappNumber?: string;
  brandingLogoUrl?: string;
  commissionRatePct?: number;
}

// ─── Clients (SOW: Client Management) ────────────────────────────────────────

export interface Client {
  id: string;
  brokerId: string;
  name: string;
  email?: string;
  phone: string;
  country?: string;
  notes?: string;
  leadId?: string;
  createdAt?: string;
}

// ─── Messages (SOW: WhatsApp + Email Activity) ─────────────────────────────

export type MessageChannel = "whatsapp" | "email";
export type MessageStatus = "queued" | "sent" | "delivered" | "read" | "failed";

export interface Message {
  id: string;
  channel: MessageChannel;
  status: MessageStatus;
  recipient: string;
  subject?: string;
  bodyPreview?: string;
  brokerId: string;
  leadId?: string;
  clientId?: string;
  proposalId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

// ─── Proposals (SOW: PDF Proposal System) ────────────────────────────────────

export type ProposalStatus = "draft" | "generated" | "sent" | "viewed";

export interface Proposal {
  id: string;
  brokerId: string;
  propertyId: string;
  clientId?: string;
  leadId?: string;
  status: ProposalStatus;
  pdfUrl?: string;
  shareToken?: string;
  brandingApplied?: boolean;
  createdAt?: string;
  sentAt?: string;
}
