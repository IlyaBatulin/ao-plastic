import { BackgroundPaths } from "@/components/ui/background-paths"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundPaths />
      {children}
    </div>
  )
}
