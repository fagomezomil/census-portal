-- =============================================
-- Agregar columnas email, photo_url, gender a staff
-- Ejecutar en Supabase Dashboard > SQL Editor
-- =============================================

ALTER TABLE staff ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS gender text DEFAULT 'M';

-- Actualizar Director y Subdirectora con email y foto
UPDATE staff SET email = 'scosta@tucuman.gov.ar', photo_url = '/staff/costa-santiago.jpg', gender = 'M' WHERE apellido = 'Costa' AND section = 'Dirección';
UPDATE staff SET email = 'senrico@tucuman.gov.ar', photo_url = '/staff/enrico-silvia.jpg', gender = 'F' WHERE apellido = 'Enrico' AND section = 'Dirección';

-- Agregar emails de ejemplo para coordinadores/responsables
UPDATE staff SET email = 'godstrcil@tucuman.gov.ar' WHERE apellido = 'Odstrcil' AND section = 'Cartografía Digital y S.I.G.';
UPDATE staff SET email = 'mleguizamon@tucuman.gov.ar' WHERE apellido = 'Leguizamón' AND section LIKE 'Análisis Socio%';
UPDATE staff SET email = 'lluna@tucuman.gov.ar' WHERE apellido = 'Luna' AND section LIKE '%Vitales%';
UPDATE staff SET email = 'llobo@tucuman.gov.ar' WHERE apellido = 'Lobo' AND section = 'Sistemas y TIC''S';