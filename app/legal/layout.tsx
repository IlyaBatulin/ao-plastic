export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden overscroll-y-auto">
      {children}
    </div>
  )
}
