"use client"

import { useState, useCallback } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export interface DepartmentData {
  name: string
  value?: number
  unit?: string
  period?: string
}

interface TucumanMapProps {
  /** Data keyed by department name (uppercase, as in TopoJSON) */
  data?: Record<string, DepartmentData>
  /** Called when a department is clicked */
  onDepartmentClick?: (departmentName: string) => void
  /** Highlighted department name */
  highlighted?: string
  className?: string
}

const GEO_URL = "/maps/tucuman-departments.topojson"

// Map TopoJSON department names to slugs for routing
const DEPT_SLUGS: Record<string, string> = {
  "CAPITAL": "capital",
  "CRUZ ALTA": "cruz-alta",
  "BURRUYACU": "burruyacu",
  "TAFI VIEJO": "tafi-viejo",
  "TAFI DEL VALLE": "tafi-del-valle",
  "MONTEROS": "monteros",
  "FAMAILLA": "famaila",
  "LULES": "lules",
  "CHICLIGASTA": "chicligasta",
  "JUAN BAUSTISTA ALBERDI": "juan-bautista-alberdi",
  "SIMOCA": "simoca",
  "RIO CHICO": "rio-chico",
  "GRANEROS": "graneros",
  "LA COCHA": "la-cocha",
  "LEALES": "leales",
  "YERBA BUENA": "yerba-buena",
  "TRANCAS": "trancas",
}

export function TucumanMap({
  data,
  onDepartmentClick,
  highlighted,
  className,
}: TucumanMapProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null)
  const prefersReduced = useReducedMotion()

  const handleMouseEnter = useCallback((deptName: string) => {
    setHoveredDept(deptName)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredDept(null)
  }, [])

  return (
    <div className={`relative ${className ?? ""}`}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3500,
          center: [-65.4, -26.8],
        }}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo, i) => {
              const deptName = (geo.properties?.departamento ?? geo.properties?.name ?? "") as string
              const isHovered = hoveredDept === deptName
              const isHighlighted = highlighted === deptName
              const deptData = data?.[deptName as keyof typeof data]

              return (
                <Geography
                  key={geo.rsmKey ?? String(geo.id ?? i)}
                  geography={geo}
                  onMouseEnter={() => handleMouseEnter(deptName)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => onDepartmentClick?.(deptName)}
                  style={{
                    default: {
                      fill: isHighlighted
                        ? "var(--accent-light, #84CFED)"
                        : "var(--muted, #f0f0ec)",
                      stroke: "var(--border-strong, rgba(26, 26, 26, 0.16))",
                      strokeWidth: 0.75,
                      outline: "none",
                      transition: prefersReduced ? "none" : "fill 150ms ease-out",
                    },
                    hover: {
                      fill: "var(--accent, #005CA2)",
                      stroke: "var(--accent, #005CA2)",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "var(--accent, #005CA2)",
                      stroke: "var(--accent, #005CA2)",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDept && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: prefersReduced ? 0 : 0.15 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-card border border-[var(--border-strong)] rounded-[var(--radius-md)] px-3 py-2 text-sm shadow-sm pointer-events-none z-10"
          >
            <div className="font-semibold">{hoveredDept}</div>
            {data?.[hoveredDept]?.value != null && (
              <div className="text-muted-foreground tabular-nums">
                {data[hoveredDept].value.toLocaleString("es-AR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                {data[hoveredDept].unit ?? ""}
              </div>
            )}
            {data?.[hoveredDept]?.period && (
              <div className="text-xs text-muted-foreground">{data[hoveredDept].period}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}