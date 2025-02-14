interface SectionProps {
  children: React.ReactNode
  className?: string
}

export function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`w-full ${className}`}>
      {children}
    </section>
  )
}

