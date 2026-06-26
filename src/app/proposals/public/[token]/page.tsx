import { PublicProposalView } from "@/features/proposals/PublicProposalView";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PublicProposalPage({ params }: PageProps) {
  const { token } = await params;
  return <PublicProposalView token={token} />;
}
