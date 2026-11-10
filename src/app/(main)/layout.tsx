import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-1 container px-4 md:px-6 py-8">{children}</main>
      <Footer />
    </>
  )
}