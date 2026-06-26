/** Dashboard / workspace types — aligned with OpenAPI v1.1.0 query & body shapes. */

export interface CursorMeta {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorListResponse<T = unknown> {
  data: T[];
  meta: CursorMeta;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PageListResponse<T = unknown> {
  data: T[];
  meta: PageMeta;
}

export type ProposalStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "EXPIRED"
  | "ARCHIVED";

export interface LeadListParams {
  statusId?: string;
  statusCode?: string;
  sourceId?: string;
  sourceCode?: string;
  assignedAgentId?: string;
  assignedManagerId?: string;
  createdFrom?: string;
  createdTo?: string;
  budgetMin?: number;
  budgetMax?: number;
  propertyUnitId?: string;
  propertySlug?: string;
  cursor?: string;
  limit?: number;
}

export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  nationality?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  preferredPropertyType?: string;
  sourceCode?: string;
  assignedAgentId?: string;
  assignedManagerId?: string;
}

export interface AssignLeadRequest {
  agentId?: string | null;
  managerId?: string | null;
}

export interface UpdateLeadStatusRequest {
  statusCode: string;
  note?: string;
}

export interface CreateLeadNoteRequest {
  content: string;
  isInternal?: boolean;
}

export interface CreateLeadInterestRequest {
  propertySlug: string;
  notes?: string;
}

export interface ProposalListParams {
  status?: ProposalStatus;
  leadId?: string;
  brokerId?: string;
  cursor?: string;
  limit?: number;
}

/** Permission codes referenced in OpenAPI (crm:read, proposal:create, etc.) */
export type PermissionCode = string;

export interface AuthMeUser {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  role?: { code?: string; name?: string };
  permissions?: PermissionCode[];
  status?: string;
}
