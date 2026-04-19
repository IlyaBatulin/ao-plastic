import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "История компании",
  description:
    "История АО «Пластик» с 1959 года: этапы развития завода в Узловой, модернизация производства полимеров и пластмасс.",
  alternates: { canonical: "/about/history" },
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
