import { LeadDetailFeature } from "@/features/crm/LeadDetailFeature";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <LeadDetailFeature id={id} />;
}
