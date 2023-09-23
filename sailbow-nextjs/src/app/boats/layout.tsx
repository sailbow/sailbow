export default function BoatsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <div style={{
        border: '2px dotted blue',
        padding: '10px',
        textAlign: 'center'
      }}>Shared on /boats routes</div>
      {children}
    </section>
  )
}