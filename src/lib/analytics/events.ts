export type AnalyticsEvent =
  | "smart_search_completed"
  | "property_search_submitted"
  | "lead_step_completed"
  | "lead_submitted"
  | "proposal_generated"
  | "proposal_shared"
  | "whatsapp_sent"
  | "email_sent";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.info("[Analytics]", event, properties ?? {});
  }

  // GTM / Segment / backend analytics hook point
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...properties });
}
