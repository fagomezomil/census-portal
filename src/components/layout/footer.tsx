import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* DEP */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/logos/secretaria-gestion-publica.png"
                alt="Secretaría de Gestión Pública"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Dirección de Estadística de la Provincia de Tucumán
            </p>
          </div>

          {/* Datos */}
          <div>
            <h4 className="font-semibold mb-2">Datos</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/economia" className="hover:text-foreground transition-colors">Economía</Link></li>
              <li><Link href="/sociedad" className="hover:text-foreground transition-colors">Sociedad</Link></li>
              <li><Link href="/poblacion" className="hover:text-foreground transition-colors">Población</Link></li>
              <li><Link href="/indicadores" className="hover:text-foreground transition-colors">Indicadores</Link></li>
              <li><Link href="/publicaciones" className="hover:text-foreground transition-colors">Publicaciones</Link></li>
              <li><Link href="/datasets" className="hover:text-foreground transition-colors">Datasets</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-semibold mb-2">Institucional</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/institucional" className="hover:text-foreground transition-colors">Quiénes somos</Link></li>
              <li><Link href="/institucional/historia" className="hover:text-foreground transition-colors">Historia</Link></li>
              <li><Link href="/operativos" className="hover:text-foreground transition-colors">Operativos</Link></li>
              <li><Link href="/censo" className="hover:text-foreground transition-colors">Censo 2022</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold mb-2">Enlaces</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="https://www.indec.gob.ar" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">INDEC</a></li>
              <li><a href="https://sep.tucuman.gob.ar" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">SEP — Repositorio de Datos</a></li>
              <li><a href="https://www.instagram.com/dep.tucuman" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram DEP</a></li>
              <li><a href="https://www.censo.gob.ar" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Censo 2022</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="/logos/gobierno-tucuman-horizontal.png"
            alt="Gobierno de Tucumán"
            className="h-8 w-auto object-contain opacity-70"
          />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dirección de Estadística de la Provincia de Tucumán
          </p>
        </div>
      </div>
    </footer>
  )
}