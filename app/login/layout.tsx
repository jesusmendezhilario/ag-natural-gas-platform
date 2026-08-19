import Footer from "@/app/components/footer/footer"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>
      <Footer />
    </div>
  )
}
