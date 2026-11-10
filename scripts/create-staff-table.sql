-- =============================================
-- 1. CREAR TABLA staff
-- =============================================
CREATE TABLE IF NOT EXISTS staff (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  apellido text NOT NULL,
  nombre text NOT NULL,
  funcion text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura pública, escritura solo service_role
CREATE POLICY "Staff is publicly readable" ON staff FOR SELECT USING (true);
CREATE POLICY "Staff managed by service role" ON staff FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- 2. INSERTAR DATOS (119 personas)
-- =============================================
INSERT INTO staff (section, apellido, nombre, funcion, sort_order) VALUES
-- Dirección
('Dirección', 'Costa', 'Santiago Federico', 'Director', 1),
('Dirección', 'Enrico', 'Silvia Alejandra', 'Subdirectora', 2),
-- Análisis Económico
('Análisis Económico', '', '', 'Coordinador', 1),
('Análisis Económico', 'Gálvez', 'María del Rosario', 'Asistente', 2),
('Análisis Económico', 'Juez Perez', 'Adela', 'Asistente', 3),
('Análisis Económico', 'Pedraza', 'Candelaria', 'Asistente', 4),
-- Análisis Socio-Demográfico
('Análisis Socio-Demográfico', 'Leguizamón', 'María Cristina', 'Coordinador', 1),
('Análisis Socio-Demográfico', 'Barilaro', 'Miguel Ángel', 'Sub Coordinador', 2),
('Análisis Socio-Demográfico', 'Arredondo', 'María Emilia', 'Asistente', 3),
('Análisis Socio-Demográfico', 'Lauxman Granillo', 'Marco', 'Asistente', 4),
('Análisis Socio-Demográfico', 'Quinteros Medina', 'Cristian E.', 'Asistente', 5),
('Análisis Socio-Demográfico', 'Saravia Perello', 'Ignacio', 'Asistente', 6),
-- Cartografía Digital y S.I.G.
('Cartografía Digital y S.I.G.', 'Odstrcil', 'Gabriela', 'Coordinador', 1),
('Cartografía Digital y S.I.G.', 'Palavecino', 'Héctor Hernán', 'Analista', 2),
('Cartografía Digital y S.I.G.', 'Paz', 'Kimey Daniel', 'Programador', 3),
('Cartografía Digital y S.I.G.', 'Aguilar', 'Ana Gabriela', 'Técnico', 4),
('Cartografía Digital y S.I.G.', 'Rodríguez', 'María Belén', 'Técnico', 5),
('Cartografía Digital y S.I.G.', 'Rojas', 'Adriana Elena', 'Técnico', 6),
-- Capacitación y Desarrollo Personal
('Capacitación y Desarrollo Personal', 'Gramajo', 'María Victoria', 'Responsable', 1),
-- Comunicación
('Comunicación', 'Platas Robles', 'María Vanesa', 'Responsable', 1),
('Comunicación', 'Bonifacio', 'Mateo', 'Asistente', 2),
-- Encuesta de Indicadores Laborales (E.I.L.)
('Encuesta de Indicadores Laborales (E.I.L.)', 'Gambarte', 'Ramón Rubén', 'Coordinador', 1),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Civallero', 'Juan Fernando', 'Encuestador', 2),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Espinosa', 'Gladys Noemí', 'Encuestador', 3),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Iñigo', 'Verónica Gabriela', 'Encuestador', 4),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Sueldo', 'Diego Gabino', 'Encuestador', 5),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Younes', 'Mariam Silvana', 'Encuestador', 6),
('Encuesta de Indicadores Laborales (E.I.L.)', 'Caballero Gutiérrez', 'Sandra Lourdes', 'Encuestador', 7),
-- Encuesta de Ocupación Hotelera (E.O.H.)
('Encuesta de Ocupación Hotelera (E.O.H.)', 'Ledesma', 'Griselda Carolina', 'Coordinador', 1),
-- Encuesta Permanente de Hogares (E.P.H.)
('Encuesta Permanente de Hogares (E.P.H.)', 'Temoche', 'Nilda Gisele', 'Coordinador', 1),
('Encuesta Permanente de Hogares (E.P.H.)', 'Guerrero', 'Yolanda Victoria', 'Supervisor', 2),
('Encuesta Permanente de Hogares (E.P.H.)', 'Jeréz', 'Claudia Inés', 'Supervisor', 3),
('Encuesta Permanente de Hogares (E.P.H.)', 'Larroque', 'Jesica', 'Supervisor', 4),
('Encuesta Permanente de Hogares (E.P.H.)', 'Rudzinski', 'Vicente Eduardo', 'Supervisor', 5),
('Encuesta Permanente de Hogares (E.P.H.)', 'Balmaceda', 'Héctor Ricardo', 'Encuestador', 6),
('Encuesta Permanente de Hogares (E.P.H.)', 'Gallo', 'Marcelo', 'Encuestador', 7),
('Encuesta Permanente de Hogares (E.P.H.)', 'Jiménez', 'Javier Alejandro', 'Encuestador', 8),
('Encuesta Permanente de Hogares (E.P.H.)', 'Lescano', 'Lorena de los Ángeles', 'Encuestador', 9),
('Encuesta Permanente de Hogares (E.P.H.)', 'Rodríguez', 'Belén', 'Encuestador', 10),
('Encuesta Permanente de Hogares (E.P.H.)', 'Rodríguez', 'María Fernanda', 'Encuestador', 11),
('Encuesta Permanente de Hogares (E.P.H.)', 'Rollán Leguizamón', 'Silvio', 'Encuestador', 12),
('Encuesta Permanente de Hogares (E.P.H.)', 'Aguaysol', 'Balbín Amable', 'Ingresador', 13),
('Encuesta Permanente de Hogares (E.P.H.)', 'Díaz', 'Melina Elizabeth', 'Ingresador', 14),
('Encuesta Permanente de Hogares (E.P.H.)', 'Carrizo', 'Patricio', 'Asistente', 15),
('Encuesta Permanente de Hogares (E.P.H.)', 'Maza', 'Sergio Nahuel', 'Asistente', 16),
-- Estadísticas Vitales (E.V.)
('Estadísticas Vitales (E.V.)', 'Gómez', 'María Cecilia', 'Responsable', 1),
('Estadísticas Vitales (E.V.)', 'Medina', 'Andrea del Rosario', 'Codificador', 2),
('Estadísticas Vitales (E.V.)', 'Robles', 'Natalia Fátima', 'Ingresador-Codificador', 3),
('Estadísticas Vitales (E.V.)', 'Castilla', 'José María', 'Ingresador', 4),
('Estadísticas Vitales (E.V.)', 'Pérez', 'Mayra Alejandra', 'Ingresador', 5),
('Estadísticas Vitales (E.V.)', 'Ponce', 'María Eugenia', 'Ingresador', 6),
('Estadísticas Vitales (E.V.)', 'Rodríguez', 'María Gabriela', 'Ingresador', 7),
('Estadísticas Vitales (E.V.)', 'Ruiz Cuellar', 'Melina', 'Ingresador', 8),
('Estadísticas Vitales (E.V.)', 'Durango Serafini', 'Rodrigo', 'Ingresador/Gestor', 9),
('Estadísticas Vitales (E.V.)', 'Guevara', 'María Alejandra', 'Recepción de Informes', 10),
('Estadísticas Vitales (E.V.)', 'Coronel', 'Florencia Micaela', 'Asistente Estadístico', 11),
('Estadísticas Vitales (E.V.)', 'Costilla', 'María Daniela', 'Codificador', 12),
('Estadísticas Vitales (E.V.)', 'Luna', 'María De Los Ángeles', 'Coordinador', 13),
('Estadísticas Vitales (E.V.)', 'Soria', 'Fernando Oscar', 'Sub Coordinador', 14),
('Estadísticas Vitales (E.V.)', 'Agüero', 'Ana María', 'Supervisor', 15),
('Estadísticas Vitales (E.V.)', 'Franco', 'Adrián Martín', 'Supervisor', 16),
('Estadísticas Vitales (E.V.)', 'González Juárez', 'Francisco René', 'Supervisor', 17),
('Estadísticas Vitales (E.V.)', 'Juárez Ovruchsky', 'Cristian Mauricio', 'Supervisor', 18),
('Estadísticas Vitales (E.V.)', 'Paez', 'Juan Pablo', 'Supervisor', 19),
('Estadísticas Vitales (E.V.)', 'Romano', 'Pedro Miguel', 'Supervisor', 20),
('Estadísticas Vitales (E.V.)', 'Cabeza', 'Luciano', 'Encuestador', 21),
('Estadísticas Vitales (E.V.)', 'Cuellar', 'Osvaldo Álvaro', 'Encuestador', 22),
('Estadísticas Vitales (E.V.)', 'Lizondo', 'Liliana Leonor', 'Encuestador', 23),
('Estadísticas Vitales (E.V.)', 'Leal', 'Martín Julio', 'Encuestador', 24),
('Estadísticas Vitales (E.V.)', 'Olmedo', 'Mónica Elizabeth', 'Encuestador', 25),
('Estadísticas Vitales (E.V.)', 'Véliz', 'Tamara', 'Encuestador', 26),
('Estadísticas Vitales (E.V.)', 'Quiroga', 'Fernando Gustavo', 'Ingresador', 27),
('Estadísticas Vitales (E.V.)', 'Martín', 'Diego Roberto', 'Ingresador', 28),
('Estadísticas Vitales (E.V.)', 'Molina', 'Franco', 'Ingresador', 29),
('Estadísticas Vitales (E.V.)', 'Olmedo', 'Luisa Antonia', 'Ingresador', 30),
('Estadísticas Vitales (E.V.)', 'Risso', 'Gustavo Mariano', 'Ingresador', 31),
('Estadísticas Vitales (E.V.)', 'Romano', 'María Cecilia', 'Ingresador', 32),
('Estadísticas Vitales (E.V.)', 'Ortega', 'Walter Daniel', 'Coordinador', 33),
('Estadísticas Vitales (E.V.)', 'Norri', 'José Gabriel', 'Encuestador', 34),
('Estadísticas Vitales (E.V.)', 'Santillán', 'Mario Ernesto', 'Encuestador', 35),
('Estadísticas Vitales (E.V.)', 'Zampella', 'Fabricio Ariel', 'Encuestador', 36),
-- Índice de Precios al Consumidor (I.P.C.)
('Índice de Precios al Consumidor (I.P.C.)', 'Luna', 'María De Los Ángeles', 'Coordinador', 1),
('Índice de Precios al Consumidor (I.P.C.)', 'Soria', 'Fernando Oscar', 'Sub Coordinador', 2),
('Índice de Precios al Consumidor (I.P.C.)', 'Agüero', 'Ana María', 'Supervisor', 3),
('Índice de Precios al Consumidor (I.P.C.)', 'Franco', 'Adrián Martín', 'Supervisor', 4),
('Índice de Precios al Consumidor (I.P.C.)', 'González Juárez', 'Francisco René', 'Supervisor', 5),
('Índice de Precios al Consumidor (I.P.C.)', 'Juárez Ovruchsky', 'Cristian Mauricio', 'Supervisor', 6),
('Índice de Precios al Consumidor (I.P.C.)', 'Paez', 'Juan Pablo', 'Supervisor', 7),
('Índice de Precios al Consumidor (I.P.C.)', 'Romano', 'Pedro Miguel', 'Supervisor', 8),
('Índice de Precios al Consumidor (I.P.C.)', 'Cabeza', 'Luciano', 'Encuestador', 9),
('Índice de Precios al Consumidor (I.P.C.)', 'Cuellar', 'Osvaldo Álvaro', 'Encuestador', 10),
('Índice de Precios al Consumidor (I.P.C.)', 'Lizondo', 'Liliana Leonor', 'Encuestador', 11),
('Índice de Precios al Consumidor (I.P.C.)', 'Leal', 'Martín Julio', 'Encuestador', 12),
('Índice de Precios al Consumidor (I.P.C.)', 'Olmedo', 'Mónica Elizabeth', 'Encuestador', 13),
('Índice de Precios al Consumidor (I.P.C.)', 'Véliz', 'Tamara', 'Encuestador', 14),
('Índice de Precios al Consumidor (I.P.C.)', 'Quiroga', 'Fernando Gustavo', 'Ingresador', 15),
('Índice de Precios al Consumidor (I.P.C.)', 'Martín', 'Diego Roberto', 'Ingresador', 16),
('Índice de Precios al Consumidor (I.P.C.)', 'Molina', 'Franco', 'Ingresador', 17),
('Índice de Precios al Consumidor (I.P.C.)', 'Olmedo', 'Luisa Antonia', 'Ingresador', 18),
('Índice de Precios al Consumidor (I.P.C.)', 'Risso', 'Gustavo Mariano', 'Ingresador', 19),
('Índice de Precios al Consumidor (I.P.C.)', 'Romano', 'María Cecilia', 'Ingresador', 20),
-- Índice de Salarios
('Índice de Salarios', 'Ortega', 'Walter Daniel', 'Coordinador', 1),
('Índice de Salarios', 'Norri', 'José Gabriel', 'Encuestador', 2),
('Índice de Salarios', 'Santillán', 'Mario Ernesto', 'Encuestador', 3),
('Índice de Salarios', 'Zampella', 'Fabricio Ariel', 'Encuestador', 4),
-- Índice del Costo de la Construcción
('Índice del Costo de la Construcción', 'Zambudio', 'Mario Gabriel', 'Coordinador', 1),
('Índice del Costo de la Construcción', 'Pastrana', 'Sandra Cristina', 'Sub Coordinador', 2),
('Índice del Costo de la Construcción', 'González Medina', 'Lourdes Noemí', 'Encuestador', 3),
('Índice del Costo de la Construcción', 'García', 'Marina Beatriz', 'Encuestador', 4),
('Índice del Costo de la Construcción', 'Morales', 'Cynthia Daniela', 'Encuestador', 5),
('Índice del Costo de la Construcción', 'Navarro', 'Sofía Nazarena', 'Encuestador', 6),
('Índice del Costo de la Construcción', 'Véliz', 'Sergio Daniel', 'Encuestador', 7),
('Índice del Costo de la Construcción', 'Zelaya', 'Roberto Álvaro', 'Encuestador', 8),
('Índice del Costo de la Construcción', 'Domínguez', 'Gerónimo', 'Auxiliar', 9),
-- Permisos de Edificación
('Permisos de Edificación', 'López', 'Rosa Mabel', 'Coordinador', 1),
('Permisos de Edificación', 'Ruíz', 'Gisella', 'Asistente', 2),
-- Producto Bruto Geográfico
('Producto Bruto Geográfico', 'Torres Vega', 'Matías Agustín', 'Coordinador', 1),
('Producto Bruto Geográfico', 'Paz Terán', 'Corina', 'Analista', 2),
('Producto Bruto Geográfico', 'Albornoz', 'Estela Roxana', 'Coordinador', 3),
-- SEP
('SEP', 'Albornoz', 'Estela Roxana', 'Coordinador', 1),
-- Sistemas y TIC'S
('Sistemas y TIC''S', 'Lobo', 'Leonardo Nahuel', 'Coordinador', 1),
('Sistemas y TIC''S', 'Rodríguez', 'María Alejandra', 'Analista', 2),
('Sistemas y TIC''S', 'Gil', 'Leandro', 'Técnico - Programador', 3),
('Sistemas y TIC''S', 'Castillo', 'Santiago Emanuel', 'Asistente', 4),
('Sistemas y TIC''S', 'Magro', 'Ángel Nicolás', 'Asistente', 5),
('Sistemas y TIC''S', 'Rodríguez Romano', 'Franco', 'Asistente', 6),
-- Administración de Personal
('Administración de Personal', 'Medina', 'Silvina Alejandra', 'Responsable', 1),
('Administración de Personal', 'Rodríguez', 'Natalia Soledad', 'Administrativo', 2),
-- Administrativo Financiero
('Administrativo Financiero', 'Alfaro', 'Rodolfo', 'Administrativo', 1),
('Administrativo Financiero', 'Lazo', 'Claudia', 'Administrativo', 2),
('Administrativo Financiero', 'Lazarte Zulli', 'Cecilia', 'Administrativo', 3),
-- Asesoría Legal
('Asesoría Legal', 'Figueroa', 'Mabel del V.', 'Responsable', 1),
-- Biblioteca
('Biblioteca', 'Boullhesen', 'Patricia del Carmen', 'Responsable', 1),
('Biblioteca', 'Carrizo', 'Ángel Rolando', 'Auxiliar', 2),
-- Bienes Patrimoniales
('Bienes Patrimoniales', 'Gregorio', 'María Elena', 'Responsable', 1),
-- Mantenimiento y Maestranza
('Mantenimiento y Maestranza', 'Galván', 'Antonio Alberto', 'Auxiliar', 1),
('Mantenimiento y Maestranza', 'Gramajo', 'Daniel Marcelo', 'Auxiliar', 2),
('Mantenimiento y Maestranza', 'Lezana', 'Cynthia L.', 'Auxiliar', 3),
('Mantenimiento y Maestranza', 'Quipildor', 'Daniel Fernando', 'Auxiliar', 4),
('Mantenimiento y Maestranza', 'Zurita', 'Elvira del V.', 'Responsable de Cantina', 5),
-- Mesa de Entradas
('Mesa de Entradas', 'Mamaní', 'Silvia C.', 'Auxiliar', 1),
('Mesa de Entradas', 'Medina', 'María Roxana', 'Auxiliar', 2),
('Mesa de Entradas', 'Soria', 'Sergio Alfredo', 'Secretario', 3),
('Mesa de Entradas', 'Zurita', 'Paola Carolina', 'Auxiliar', 4);