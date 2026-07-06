import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo/page-metadata"

export const metadata: Metadata = {
  title: "История компании",
  description:
    "История АО «Пластик» с 1959 года: этапы развития завода в Узловой, модернизация производства полимеров и пластмасс.",
  alternates: { canonical: "/about/history" },
  openGraph: pageOpenGraph({
    title: "История компании",
    description:
      "История АО «Пластик» с 1959 года: этапы развития завода в Узловой, модернизация производства полимеров и пластмасс.",
    path: "/about/history",
  }),
}

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="history-theme">
      {children}
    </div>
  );
}
