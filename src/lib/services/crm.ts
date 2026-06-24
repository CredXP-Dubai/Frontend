import type { ProgressiveLeadPayload } from "@/types/domain";

export type {
  LeadCaptureStep,
  LeadIntent,
  Lead,
  LeadStatus,
  ProgressiveLeadPayload,
} from "@/types/domain";

export interface CrmLeadResponse {
  id: string;
  status: "new" | "qualified" | "assigned";
}

/** Wire to POST /api/v1/leads when backend ships CRM routes */
export async function submitLeadToCrm(
  payload: ProgressiveLeadPayload,
): Promise<CrmLeadResponse> {
  if (process.env.NODE_ENV === "development") {
    console.info("[CRM] Lead payload (awaiting backend):", payload);
  }

  return {
    id: `pending-${Date.now()}`,
    status: "new",
  };
}
