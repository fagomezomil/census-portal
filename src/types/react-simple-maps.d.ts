declare module "react-simple-maps" {
  import { ComponentType } from "react"

  interface GeoGeometry {
    type: string
    id?: string | number
    properties?: Record<string, unknown>
    rsmKey?: string
  }

  interface GeographyProps {
    key: string
    geography: GeoGeometry
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement>) => void
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement>) => void
    onClick?: (event: React.MouseEvent<SVGPathElement>) => void
    style?: {
      default?: Record<string, unknown>
      hover?: Record<string, unknown>
      pressed?: Record<string, unknown>
    }
  }

  interface GeographiesProps {
    geography: string
    children: (props: {
      geographies: GeoGeometry[]
    }) => React.ReactNode
  }

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    style?: Record<string, unknown>
    children: React.ReactNode
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
}