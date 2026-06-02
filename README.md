# DietApp

Webapp con Supabase + Vercel para dieta por rutina.

## Incluye
- Login por magic link con Supabase.
- Primer login crea automáticamente `DietApp Casa`.
- Si un correo fue agregado a `household_invites`, entra a esa familia en vez de crear otra.
- Perfiles agregables y eliminables.
- Dietas carnívora / vegetariana / vegana.
- Horarios por perfil.
- Plan semanal.
- Tarjetas plato por plato con imagen.
- Botón cambiar plato.
- Recetas paso a paso.
- Super / Mandado interactivo.
- Reemplazos, productos manuales y exportación a WhatsApp.
- Análisis de producto con IA por fotos.
- Recordatorios internos y prueba de notificación del navegador.

## Pasos
1. Ejecuta `supabase/schema.sql` en Supabase SQL Editor.
2. Crea `.env.local` con las variables de `.env.example`.
3. Corre:
   npm install
   npm run dev
4. Para Vercel, sube el proyecto y agrega las mismas variables de entorno.

## Importante
Los archivos de `/public/dishes` son placeholders limpios con fondo blanco para mantener el diseño. La app ya está lista para recibir fotos reales de platillos cuando las generes/subas.
