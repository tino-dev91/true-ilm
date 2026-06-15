import { notFound } from "next/navigation";
import { GiftStats } from "@/components/GiftStats";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

type SearchParams = Promise<{ key?: string }>;

export default async function NewYearStatsPage({ searchParams }: { searchParams: SearchParams }) {
  const { key } = await searchParams;
  // Private: only viewable with the correct ?key=… (STATS_KEY env). Blocked if unset.
  if (!process.env.STATS_KEY || key !== process.env.STATS_KEY) notFound();

  return <GiftStats prefix="newyear:" label="True ILM Muharram gift" />;
}
