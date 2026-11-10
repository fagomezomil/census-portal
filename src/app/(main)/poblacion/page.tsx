import { POBLACION_SECTIONS } from "@/lib/sections"
import { SectionPageLayout } from "@/components/shared/section-page-layout"
import { SectionCardsGrid } from "@/components/shared/section-cards-grid"

export default function PoblacionPage() {
  return (
    <SectionPageLayout
      title="Población"
      description="Censos, estadísticas vitales, demografía y proyecciones poblacionales."
    >
      <SectionCardsGrid sections={POBLACION_SECTIONS} columns={2} />
    </SectionPageLayout>
  )
}