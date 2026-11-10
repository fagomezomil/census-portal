import { createClient } from "@/lib/supabase/server"
import { CapitalHumanoClient } from "@/components/capital-humano"

export default async function CapitalHumanoPage() {
  const supabase = await createClient()
  const { data: staff } = await supabase
    .from("staff")
    .select("*")
    .order("sort_order")

  return <CapitalHumanoClient staff={staff ?? []} />
}