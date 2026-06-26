import { ProposalDetailFeature } from "@/features/proposals/ProposalDetailFeature";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProposalDetailFeature id={id} />;
}
