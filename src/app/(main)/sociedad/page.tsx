import { SOCIEDAD_SECTIONS } from "@/lib/sections"
import { SectionPageLayout } from "@/components/shared/section-page-layout"
import { SectionCardsGrid } from "@/components/shared/section-cards-grid"

export default function SociedadPage() {
  return (
    <SectionPageLayout
      title="Sociedad"
      description="Condiciones de vida, pobreza, población, educación y más."
    >
      <SectionCardsGrid sections={SOCIEDAD_SECTIONS} columns={3} />
    </SectionPageLayout>
  )
}