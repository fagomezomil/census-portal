/**
 * DEP Tucumán — Section definitions
 * Centralizes section arrays used across economy, society, and population pages.
 * Censo 2022 is excluded per project decision.
 */

export interface Section {
  slug: string
  name: string
  desc: string
}

export const ECONOMIA_SECTIONS: Section[] = [
  { slug: "precios", name: "Precios (IPC)", desc: "Índice de Precios al Consumidor de Tucumán" },
  { slug: "canasta-basica", name: "Canasta Básica", desc: "Canasta Básica Alimentaria y Total" },
  { slug: "mercado-laboral", name: "Mercado Laboral", desc: "Desocupación, empleo, informalidad" },
  { slug: "comercio-exterior", name: "Comercio Exterior", desc: "Exportaciones por destino y producto" },
  { slug: "producto-bruto-geografico", name: "Producto Bruto Geográfico", desc: "PBG de Tucumán" },
  { slug: "distribucion-del-ingreso", name: "Distribución del Ingreso", desc: "Brecha de ingresos y coeficiente de Gini" },
  { slug: "permisos-de-edificacion", name: "Permisos de Edificación", desc: "Superficie autorizada y unidades" },
  { slug: "turismo", name: "Turismo", desc: "Encuesta de Ocupación Hotelera" },
  { slug: "isaet", name: "Indicadores Sindicales", desc: "ISAET - Índice de Salarios" },
  { slug: "tics", name: "TICs", desc: "Acceso a tecnología y conectividad" },
]

export const SOCIEDAD_SECTIONS: Section[] = [
  { slug: "condiciones-de-vida", name: "Condiciones de Vida", desc: "Pobreza, indigencia e indicadores EPH" },
  { slug: "estadisticas-vitales", name: "Estadísticas Vitales", desc: "Natalidad, mortalidad y causas de defunción" },
  { slug: "poblacion", name: "Población", desc: "Censos, proyecciones y demografía" },
  { slug: "educacion", name: "Educación", desc: "Alumnado, egresados y estadísticas educativas" },
  { slug: "rucvm", name: "Violencia contra las Mujeres", desc: "Registro de casos de violencia" },
  { slug: "covid-19", name: "COVID-19", desc: "Indicadores de la pandemia" },
  { slug: "demografia", name: "Demografía", desc: "Indicadores demográficos" },
  { slug: "ecvt", name: "ECVT", desc: "Encuesta de Condiciones de Vida de Tucumán" },
]

export const POBLACION_SECTIONS: Section[] = [
  { slug: "poblacion", name: "Censos y Población", desc: "Censo Nacional de Población, Hogares y Viviendas" },
  { slug: "estadisticas-vitales", name: "Estadísticas Vitales", desc: "Nacimientos, defunciones y mortalidad" },
  { slug: "demografia", name: "Indicadores Demográficos", desc: "Proyecciones y tasas demográficas" },
]