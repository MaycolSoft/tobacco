# Auditoría y plan de internacionalización (i18n)

Fecha: 7 de octubre de 2026. Proyecto: Tabacalera Tamboril.

Estado: auditoría histórica anterior a la implementación. El usuario autorizó después aplicar este plan y añadir chino. La implementación vigente incluye español, inglés, francés y chino simplificado (`zh-CN`); su arquitectura y validación están documentadas en [I18N.md](./I18N.md). Los hallazgos siguientes describen el estado previo.

## Propósito y alcance

Este documento describe el estado del código, qué archivos habría que tocar y un contrato de implementación para que otra IA pueda añadir al menos tres idiomas sin reconstruir la aplicación. La entrega actual es documental: no se han instalado dependencias ni implementado traducciones.

La auditoría se basa en lectura del código, búsquedas de textos y revisión de la configuración. No incluye una auditoría general de seguridad, pruebas de navegador ni una validación del despliegue. Las observaciones del estado actual están separadas de las decisiones propuestas.

Idiomas propuestos: español (`es`, idioma base), inglés (`en`) y francés (`fr`). El tercer idioma es una propuesta, no una preferencia confirmada. El diseño debe permitir añadir otro idioma mediante recursos y configuración, sin duplicar componentes.

## 1. Contexto real del proyecto

- Aplicación React 19 en JavaScript/JSX, construida con Vite 7 y React Router 7. Los números proceden de `package.json`, no de una comprobación de versiones instaladas.
- Zustand 5 gestiona autenticación, preferencias visuales y composición. Framer Motion y GSAP intervienen en las animaciones.
- No hay dependencias i18n declaradas, catálogos de traducción ni selector de idioma.
- `src/main.jsx` monta `ErrorBoundary`, `App` y `CentralLogViewer`. `App.jsx` contiene `BrowserRouter`, `Seo`, el panel de control y `MainLayout`.
- `src/App.jsx`, alrededor de la línea 26 indicada, ensambla el layout. Es un punto relevante para coordinar rutas e idioma, pero por sí solo no contiene todos los textos que deben traducirse.
- Hay alias como `@`, `@components`, `@pages` y `@store`, definidos en `vite.config.js` y `jsconfig.json`.
- El sitio combina páginas editoriales, biblioteca de hojas, una mesa de composición protegida por login y una guía dentro de esa mesa.
- La autenticación actual es una simulación local. Contacto y reserva muestran un resultado local y no envían formularios a un servidor. Traducir no debe cambiar esos comportamientos ni prometer envíos reales.
- `plugins/seoPlugin.js` genera HTML por ruta con metadatos, sitemap, robots y 404. Genera shells de la SPA; no renderiza el cuerpo React en servidor.
- `vercel.json` tiene `cleanUrls: true` y `trailingSlash: false`.

### Rutas activas

| Ruta base | Vista | Consideraciones |
| --- | --- | --- |
| `/` | `Home` | Portada editorial y acceso a otros recorridos |
| `/leaf-library` | `LeafLibrary` | Filtros, ficha, recorrido inmersivo y anclas por ID de hoja |
| `/about` | `About` | Proceso y composición; anclas como `#proceso` y `#composicion` |
| `/menu` | `Menu` | Perfiles de mezcla |
| `/reservation` | `Reservation` | Formulario de presentación guiada |
| `/testimonial` | `Testimonial` | Experiencia sensorial |
| `/contact` | `Contact` | Formulario local de contacto |
| `/login` | `Login` | Conserva un destino para después del acceso |
| `/craft-your-cigar` | `CraftYourCigar` | Protegida; mezcla, resultado, vídeo y guía |
| Cualquier otra | 404 de `App` | Textos y enlace de retorno también deben traducirse |

`Service.jsx` y `BlendGuide.jsx` existen pero no están registrados en `App`. La guía sí se usa como modal mediante `TobaccoGuidePage`. No añadir rutas para archivos antiguos por el solo hecho de traducirlos.

## 2. Hallazgos y riesgos concretos

| Hallazgo observado | Evidencia | Consecuencia para i18n |
| --- | --- | --- |
| Textos incrustados en JSX y arrays a nivel de módulo | Páginas, `Navbar`, `Footer`, `TobaccoFamiliesInfo` | Sustituirlos por claves; traducir durante el render, no una sola vez al importar |
| Títulos/subtítulos en configuración y copiados a Zustand | `routesConfig.js`, `useLayoutStore.js`, `MainLayout.jsx` | No almacenar textos traducidos en `currentConfig`; resolver claves al renderizar |
| Mensajes con concatenación y singular/plural manual | `getStepMessage` en `useBlendStore.js`, `LeafGrid`, biblioteca | Extraer frases completas y usar `count`, límites y variables |
| Origen mostrado también funciona como valor del filtro | `LeafLibrary.jsx`, `getLeafOrigin` | Separar identificador del origen y etiqueta traducida; el filtro no puede depender del idioma |
| Lista de orígenes calculada al importar y ordenada con `'es'` | Constante `origins` de `LeafLibrary.jsx` | Recalcular etiquetas/orden al cambiar idioma, manteniendo el ID seleccionado |
| Inventario mezcla orígenes en inglés y descripciones en español | `leaves.js`, `leafPresentation.js` | Localizar descripciones y nombres geográficos sin alterar IDs o recursos |
| Metadatos forzados a español | `seoConfig.js`, `Seo.jsx`, `index.html` | Compartir catálogos entre navegador y generación de HTML |
| SEO declara `inLanguage: ['en', 'es']` aunque no hay versiones traducidas | `seoConfig.js` | Declarar idiomas realmente disponibles, con páginas equivalentes |
| Localización OG solo contempla español/inglés | `Seo.jsx`, `seoPlugin.js` | Usar mapa explícito para los tres idiomas |
| Paneles de control combinan inglés y español | `LayoutControlPanel`, `control-center/*`, `FrameVariantsModal`, logs | Incluir controles visibles y mensajes locales en el alcance completo |
| Errores guardados como frases | `Login.jsx`, `LeafLibrary.jsx`, API de variantes | Guardar código/parámetros y traducir al presentar para evitar frases del idioma anterior |
| Boundary de error es un componente de clase | `ErrorBoundary.jsx` | Inyectar `t` con un adaptador/HOC; no usar hooks dentro de la clase |
| Rutas literales usadas para enlaces, imágenes, navegación y preferencias | Layout, páginas, `ProtectedRoute`, `LayoutTab` | Introducir helpers comunes para separar ruta base e idioma |
| Manifest en español y plugins heredados cargados globalmente | `public/site.webmanifest`, `index.html`, `public/js/main.js` | Revisar superficies realmente visibles; no traducir código de proveedores |

`docs/SEO.md` tiene una descripción de indexación que no coincide completamente con los flags actuales de `seoRoutes`. Para implementar, tomar los flags del código como estado vigente y actualizar la documentación. No activar la indexación de páginas excluidas como efecto secundario de i18n.

### Datos que se deben conservar

- Los 21 IDs actuales de `leaves.js`, incluidas grafías existentes como `tripa-kentuky` y `tripa-hba-abano`. No corregirlos durante esta migración: aparecen en selecciones y anclas.
- Las categorías técnicas `CAPA`, `CAPOTE`, `TRIPA`, `ALL` y el paso `RESULT`.
- Los límites actuales: tripa de 2 a 5 hojas, un capote y una capa.
- Rutas de imágenes, frames, vídeos, endpoints, claves CSS, nombres de eventos y tokens visuales.
- Claves de perfil `fortaleza`, `aroma`, `cuerpo`; se traduce su etiqueta, no la propiedad.
- Claves de almacenamiento `auth-storage`, `tamboril-blend` y `tamborilero-layout-storage`.
- Parámetros funcionales existentes: `categoria=CAPA|CAPOTE|TRIPA` y `guia=abierta`; mantener también hashes de hojas y secciones.
- Nombres propios de variedades, marca y composiciones, salvo decisión editorial expresa. Traducir sus descripciones y etiquetas.
- `masterBlends` está vacío: no inventar composiciones ni perfiles para completar traducciones. `blends.js` contiene contenido antiguo en inglés con combinaciones numéricas; no se encontró una importación de ese catálogo en el recorrido activo.

## 3. Arquitectura propuesta

### Motor y recursos

Usar `i18next` y `react-i18next`, agregados con npm y reflejados en `package-lock.json`. No fijar una versión supuesta: comprobar compatibilidad con el proyecto al instalar. La integración con hooks, namespaces, clases y contenido JSX está descrita en la [documentación oficial de react-i18next](https://react.i18next.com/latest/using-with-hooks).

Propuesta inicial: recursos JSON incluidos en el bundle. Evita depender de una petición de traducciones para mostrar el primer render. Si el tamaño medido lo justifica, cargar namespaces secundarios más tarde; no introducir ese cambio junto con la primera migración sin necesidad.

```text
src/i18n/
  index.js                  # instancia de navegador; initReactI18next
  config.js                 # idiomas, locales, fallback y nombres nativos
  routing.js                # parseLocalePath, localizePath, cambio de idioma
  resources.js              # recursos puros utilizables desde Node y navegador
  localizeLeaf.js            # vista traducida del inventario sin mutarlo
  locales/
    es/{common,navigation,pages,leaves,craft,guide,controls,errors,seo}.json
    en/{common,navigation,pages,leaves,craft,guide,controls,errors,seo}.json
    fr/{common,navigation,pages,leaves,craft,guide,controls,errors,seo}.json
src/components/LanguageSwitcher.jsx
scripts/check-i18n.mjs       # verificación de catálogos
```

Las llaves entre llaves en el árbol representan varios archivos, no un nombre literal. `pages.json` debe tener grupos `home`, `about`, `menu`, `reservation`, `testimonial`, `contact`, `login` y `notFound`; no hace falta un archivo por página.

Configuración propuesta: `supportedLngs: ['es', 'en', 'fr']`, `fallbackLng: 'es'`, namespace base `common`, recursos preparados antes de montar React. Utilizar el escape normal de React para el contenido; no introducir `dangerouslySetInnerHTML` para traducciones.

`resources.js` y `config.js` no deben importar React, Zustand, módulos con alias de Vite ni acceder a `window`, `document` o almacenamiento. El plugin de SEO los consume desde Node con imports relativos. Para SEO en build, usar una instancia aislada de i18next o un lector puro del catálogo, sin modificar el singleton de navegador.

### Idioma y URL: contrato recomendado

Mantener español en las rutas actuales; añadir prefijos para los demás idiomas:

| Español | Inglés | Francés |
| --- | --- | --- |
| `/` | `/en` | `/fr` |
| `/about` | `/en/about` | `/fr/about` |
| `/leaf-library?categoria=CAPA#capa-habana` | `/en/leaf-library?categoria=CAPA#capa-habana` | `/fr/leaf-library?categoria=CAPA#capa-habana` |

Esto conserva las URLs y preferencias actuales. No traducir slugs en esta primera versión. Las rutas españolas no llevan `/es`; si se aceptan aliases `/es/...`, redirigirlos a su equivalente español y no incluirlos como canonical o entradas adicionales del sitemap.

Reglas obligatorias de esta propuesta:

1. La URL es la fuente de verdad: ruta sin prefijo = español; `/en` = inglés; `/fr` = francés. No redirigir por idioma del navegador al abrir un enlace explícito.
2. Guardar la selección en una clave nueva, por ejemplo `tamboril-language`, como preferencia opcional para futuros accesos sin una URL explícita. Esa preferencia no puede sobrescribir una URL española ni un enlace compartido. No se necesita un detector automático para esta versión.
3. `parseLocalePath` devuelve `{ language, basePath }`; usar `basePath` en configuración, matching del navbar, imágenes de Header, `data-route` y claves de preferencias del layout. La portada localizada devuelve `basePath: '/'`.
4. `localizePath` opera sobre rutas internas, separa pathname/search/hash y conserva estos dos últimos. No prefijar URLs externas, assets, anclas aisladas ni prefijos existentes una segunda vez.
5. Cambiar idioma actualiza ruta e instancia i18n de forma coordinada, sin recargar el documento. Sincronizar también con navegación atrás/adelante y entrada directa; evitar bucles de efectos.
6. El idioma desconocido y la ruta desconocida muestran 404 según una regla documentada; `/en/no-existe` debe tener 404 en inglés, `/fr/no-existe` en francés. No convertir rutas desconocidas en páginas válidas quitando segmentos arbitrariamente.
7. Al cambiar entre equivalentes no remontar la página ni ejecutar el scroll al inicio por un cambio exclusivamente de idioma. Los efectos de layout/scroll deben distinguir `basePath` de pathname localizado.

En `App`, se puede agrupar el mismo árbol de rutas bajo un layout de idioma compartido. Las páginas deben seguir siendo componentes únicos. Evitar tres copias de las declaraciones de rutas; mantener una definición verificable y cubrir la 404 en cada idioma.

### Selector y experiencia

Opciones con nombres nativos: `Español`, `English`, `Français`; no depender de banderas. Control accesible por teclado, etiqueta traducida, selección actual visible y espacio en navbar móvil/escritorio. Como algunas rutas pueden ocultar el navbar mediante preferencias, proporcionar un acceso al selector también cuando esté oculto, por ejemplo junto a los controles globales.

El cambio de idioma debe conservar sesión, mezcla, paso, filtros, formulario sin enviar, ficha abierta y variante visual. No usar el idioma como `key` de la aplicación o de las páginas. Los portales reciben contexto React; verificar que ficha y guía también se actualizan mientras están abiertas.

## 4. Contrato de traducciones y datos

### Claves semánticas y frases completas

Ejemplos: `navigation:home`, `pages:login.invalidCredentials`, `leaves:items.capa-habana.description`, `craft:selection.selected`, `seo:about.description`. No usar el texto español como clave ni índices del array como identidad.

Traducir texto visible, `aria-label`, `alt` informativo, `title`, placeholders, opciones de selects, estados vacíos, errores, confirmaciones y mensajes de progreso. Mantener `alt=""` en imágenes decorativas. No traducir atributos funcionales como `name`, `autoComplete`, valores de API o IDs.

Ejemplo de pluralización del namespace `craft`:

```json
// es/craft.json (quitar esta línea de comentario al crear el JSON real)
{
  "selection": {
    "selected_one": "{{count}} hoja seleccionada",
    "selected_other": "{{count}} hojas seleccionadas"
  }
}
```

```json
// en/craft.json (quitar comentario)
{
  "selection": {
    "selected_one": "{{count}} leaf selected",
    "selected_other": "{{count}} leaves selected"
  }
}
```

```json
// fr/craft.json (quitar comentario)
{
  "selection": {
    "selected_one": "{{count}} feuille sélectionnée",
    "selected_other": "{{count}} feuilles sélectionnées"
  }
}
```

```jsx
const { t } = useTranslation('craft');
const message = t('selection.selected', { count: selectedIds.length });
```

El parámetro para resolver plurales es `count`; consultar las [reglas oficiales de i18next](https://www.i18next.com/translation-function/plurals). Para el mensaje completo del paso crear claves diferentes para vacío, insuficiente, listo y máximo, con parámetros `count`, `min`, `max`, `remaining` según corresponda. No construirlo uniendo la frase anterior con fragmentos traducidos ni traducir una categoría y después aplicar `.toLowerCase()` como solución gramatical.

Usar `Trans` para frases con énfasis, enlaces o saltos editoriales, sin forzar al inglés/francés el mismo orden de palabras del español. Arrays de principios, sentidos y enlaces guardan IDs/claves e iconos; el render resuelve las traducciones.

### Inventario y filtros

- Conservar `leaves.js` como fuente técnica con IDs, categoría, imágenes y datos verificables. Introducir `descriptionKey` o un adaptador que resuelva `leaves:items.<id>.description` en todos los consumidores.
- Para orígenes, añadir un identificador estable (`originId`) manteniendo el origen original como dato de referencia. Países combinados necesitan IDs explícitos, por ejemplo `ecuador-cuba`; no partir cadenas traducidas para deducir países.
- El estado del filtro almacena `originId`, no `República Dominicana` o `Dominican Republic`. Mostrar su etiqueta traducida y ordenar etiquetas con `Intl.Collator` del locale vigente, conservando el ID al cambiar idioma.
- Convertir `leafCategories`, `PROFILE_AXES`, capítulos y familias a claves o funciones que reciban `t`; evitar duplicar descripciones de una misma hoja entre UI y JSON-LD.
- Revisar todos los consumidores, incluida guía, galería, ficha, recorrido inmersivo, grid y resultado. Un adaptador aislado aplicado solo en la biblioteca deja el resto en español.
- Mantener datos ausentes como pendientes. No crear fortaleza, aroma, cuerpo, procedencia ni recomendaciones nuevas para llenar catálogos.
- Guardar el ID de una mezcla cargada y traducir su nombre/descripción al mostrarla, en lugar de guardar una etiqueta traducida en `loadedBlend`.

### Estado, errores y formatos

`getStepMessage` debe pasar a un helper de presentación que reciba `t`, o devolver código y parámetros para que la vista traduzca. El store conserva reglas y selecciones independientes del idioma. `routesConfig` debe ofrecer `titleKey`, `subtitleKey`, `parentKey`; el layout los traduce en el render y no depende de recargar el store para cambiar un encabezado.

Login y biblioteca guardan códigos de error. En variantes, distinguir errores locales conocidos de detalles arbitrarios del servidor: presentar un mensaje localizado y mantener el detalle técnico original disponible. No intentar traducir automáticamente stacks, mensajes de logs históricos o respuestas externas desconocidas.

Locales sugeridos: `es-DO`, `en-US`, `fr-FR`; OG: `es_DO`, `en_US`, `fr_FR`. Usar `Intl.NumberFormat` para números/progreso visibles y `Intl.DateTimeFormat` si se muestran fechas como texto. Mantener ISO en el valor de `input[type=date]`; su presentación y validación nativa dependen también del navegador. En `Reservation`, asignar valores estables a las opciones de participantes, que actualmente usan su texto como valor implícito.

## 5. Archivos que tocaría

| Archivos existentes | Cambio previsto |
| --- | --- |
| `package.json`, `package-lock.json` | Motor i18n y comando de verificación de recursos |
| `src/main.jsx` | Inicializar recursos antes del render y proporcionar traducción al boundary |
| `src/App.jsx` | Rutas equivalentes por idioma, sincronización y 404 traducida |
| `src/config/routesConfig.js` | Claves de presentación manteniendo flags e iconos |
| `src/store/useLayoutStore.js` | Conservar claves/ruta base y evitar snapshots traducidos |
| `src/components/layout/{MainLayout,Navbar,Header,Footer}.jsx` | Traducir textos, enlazar con idioma y resolver configuración por ruta base |
| Las nueve páginas activas de `src/pages` | Textos editoriales, arrays, formularios, errores y destinos |
| `src/data/leaves.js`, `src/data/leafPresentation.js` | Referencias de traducción, orígenes estables y helpers de presentación |
| `src/store/useBlendStore.js` | Separar mensajes de reglas; identidad estable de mezcla cargada |
| `LeafGrid`, `CigarResult`, `MasterBlends`, `FloatingPrepButton` | Pasos, composición, acciones y resultado |
| `leaf-library/{TechnicalSheet,ImmersiveView}` | Ficha, capítulos, controles y accesibilidad |
| `TobaccoGuidePage`, `TobaccoFamilyGallery`, `TobaccoFamiliesInfo` | Guía y contenido educativo con frases completas |
| `ProtectedRoute.jsx`, `Login.jsx` | Login localizado y destino con search/hash e idioma vigente |
| `LayoutControlPanel`, `control-center/*`, `FrameVariantsModal`, `CentralLogViewer`, `ErrorBoundary` | Paneles, accesibilidad, estados y fallback global |
| `src/config/visualProfiles.js`, configuraciones de controles | Claves para nombres descriptivos sin cambiar IDs/tokens |
| `src/lib/frameVariantsApi.js`, `src/hooks/useFrameVariants.js` | Códigos para errores locales que presenta la UI; conservar contrato externo |
| `ScrollVideo`, `MixingAnimation` y componentes restantes alcanzables | Extraer solo cadenas mostradas; preservar animación y programación de frames |
| `src/config/seoConfig.js`, `src/components/Seo.jsx`, `plugins/seoPlugin.js` | SEO coherente en runtime/build, alternates y sitemap |
| `index.html`, `public/site.webmanifest` | Base española coherente; manifests localizados si se anuncian como parte del alcance |
| `src/styles/site-editorial.css` y estilos de controles/mesa/biblioteca | Solo ajustes demostrados por longitud, selector y responsive |
| `docs/SEO.md` | Actualizar rutas, indexación y política de idiomas |

`BlendResult`, `BlendSummary`, `BlendProfiles`, `BackToTop` y cualquier componente sin consumo deben clasificarse mediante imports antes de editar. Traducir los componentes alcanzables; registrar los antiguos que queden fuera. No borrar archivos ni activar funciones antiguas como parte de i18n. Revisar también `public/js/main.js` si sus plugins muestran UI real; no editar archivos minificados de bibliotecas para traducirlos.

## 6. SEO multilingüe y publicación

Cada página equivalente necesita URL propia, canonical propio, título, descripción, etiqueta, idioma de documento y datos estructurados acordes. La propuesta de URLs y alternates sigue la [documentación de Google sobre versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions).

- Adaptar `getSeo` para recibir idioma explícito y ruta base. Compartir los textos `seo` e inventario localizado entre build y navegador.
- Actualizar `Seo` cuando cambie ruta o idioma. Un efecto dependiente solo del pathname no cubre un cambio del motor mientras se conserva la ruta.
- Generar alternates recíprocos `hreflang="es"`, `"en"`, `"fr"`, incluyendo la propia URL. Propuesta: `x-default` apunta al equivalente español. Usar origen validado desde la configuración actual.
- Añadir `og:locale:alternate` para los otros locales y sustituir alternates antiguos durante navegación, sin acumular etiquetas.
- Mantener identidad y assets comunes; localizar `imageAlt`, breadcrumbs, `inLanguage` y nombres/descripciones del `ItemList` de biblioteca. Su categoría técnica no debe aparecer como texto sin traducir.
- Mantener los flags actuales de indexación: `/reservation`, `/login` y `/craft-your-cigar` están excluidas del sitemap. Las demás rutas registradas tienen `index: true` en el código auditado. Replicar ese criterio en cada idioma.
- Generar shells localizados como `en.html`, `en/about.html`, `fr.html`, `fr/about.html`, además de los existentes. Usar rutas absolutas de assets para que una entrada anidada no rompa recursos.
- Añadir las URLs indexables de los tres idiomas al sitemap; si incorpora alternates XML, declarar su namespace y comprobar reciprocidad. No incluir query strings de filtros, hashes, 404 ni aliases.
- No afirmar que el plugin prerenderiza el contenido: sigue generando solo metadatos iniciales.
- Revisar la estrategia de 404 localizada con el hosting. Un único `404.html` no garantiza un cuerpo francés/inglés sin JavaScript. No usar un rewrite general a `index.html` que convierta desconocidos en HTTP 200 ni entregue metadatos españoles para páginas inglesas.
- Verificar entradas directas, recargas y status HTTP en el hosting real, además de inspeccionar el build. `vite dev`/`preview` no prueban reglas de Vercel.

Si se decide localizar manifests, generar uno por idioma y actualizar su enlace, `lang`, descripción y `start_url`. Conservar la marca. Si se mantiene el manifest base español, registrar esa limitación: el motor i18n no traduce un manifest estático.

## 7. Orden de implementación

1. Registrar estado inicial de `npm run build` y `npm run lint`. Diferenciar fallos previos de regresiones. Enumerar consumidores y cadenas alcanzables; no tomar el texto de documentos antiguos como fuente de datos nuevos.
2. Crear configuración, catálogos, instancia y helpers de ruta. Completar una franja funcional de navbar, selector y 404 para verificar los tres idiomas.
3. Adaptar layout, configuración y enlaces. Resolver por ruta base y comprobar preferencias guardadas previamente.
4. Extraer páginas editoriales, login y formularios con claves, arrays estables y marcado traducible.
5. Localizar inventario, orígenes, guía, mesa, mensajes con plural y resultado. Probar preservación de mezcla/filtros.
6. Localizar controles globales, paneles, errores y boundary. Revisar cadenas fuera de JSX y mensajes imperativos.
7. Adaptar SEO compartido, plugin, HTML y sitemap para los tres idiomas, conservando exclusiones y 404 reales.
8. Completar los catálogos de inglés/francés, revisar terminología y diseño, ejecutar validación y actualizar documentación.

En cada fase mantener funcionamiento del recorrido actual. El trabajo queda completo al terminar todas las fases, no con una portada traducida o catálogos vacíos que recurren al español.

## 8. Verificación y criterios de aceptación

No hay un script de tests declarado actualmente. Incorporar checks pequeños que validen contratos y regresiones reales; elegir herramientas compatibles al implementar. Para esta entrega documental no se ejecutaron build/lint ni se añadieron tests de aplicación.

### Comprobaciones automáticas necesarias

- `check-i18n.mjs`: JSON válido, mismas claves hoja en `es/en/fr`, traducciones no vacías y mismos placeholders. Reconocer sufijos plurales y sus llamadas base para no marcar falsos errores.
- Cobertura de los 21 IDs del inventario y de todas las rutas activas, incluidas SEO y 404; sin traducciones de datos inventados.
- Helpers de rutas: portada, rutas anidadas, query/hash, prefijo existente, navegación de vuelta, idioma inválido y URL externa.
- Mensajes de tripa con 0, 1, 2 y 5 hojas; capa/capote con 0 y 1. Verificar resultado tanto gramatical como lógico.
- Inspeccionar build: HTML por idioma con `lang`, canonical, OG, alternates y JSON-LD correctos; sitemap sin rutas excluidas y sin aliases duplicados.
- `npm run build` y `npm run lint`; reportar cualquier fallo previo que permanezca sin atribuirlo a la nueva migración.

### Recorridos manuales o de navegador

| Escenario | Resultado esperado |
| --- | --- |
| Abrir y recargar las nueve rutas en cada idioma | Misma vista y metadatos adecuados; sin caída a portada |
| Cambiar ES → EN → FR durante una composición | Conserva IDs, paso, sesión y selecciones; mensajes cambian |
| Cambiar idioma con filtro de origen y ficha abierta | Mantiene filtro/hoja y actualiza etiquetas, capítulos y accesibilidad |
| Cambiar idioma con un formulario parcialmente lleno | Conserva campos, traduce opciones y mensajes sin alterar valores técnicos |
| Entrar sin sesión a `/fr/craft-your-cigar?guia=abierta` | Login francés; después abre la guía en francés |
| Cambiar idioma en login con retorno pendiente | Adapta el destino al idioma elegido y conserva query/hash |
| Usar atrás/adelante y enlaces con anclas | Motor, URL y documento sincronizados; sin duplicar prefijos |
| Mostrar un error y cambiar idioma | Error conocido se presenta en el idioma nuevo; detalle técnico intacto |
| Ocultar navbar en una página | Sigue habiendo acceso al cambio de idioma |
| Abrir 404 localizada en producción | Texto localizado y HTTP 404 real; no indexable |
| Revisar móvil, teclado y zoom 200% | Selector, botones y textos largos utilizables, sin recortes ni desbordamiento |

Comprobar todos los idiomas en navbar, footer, páginas, modales, controles, errores y SEO. Buscar cadenas residuales con `rg` y clasificarlas: nombres propios, datos técnicos y logs no equivalen a texto de interfaz pendiente. El fallback español sirve para resiliencia, no para aprobar catálogos incompletos.

### Terminología inicial para revisión editorial

| Concepto | Español | Inglés | Francés |
| --- | --- | --- | --- |
| Hoja exterior | Capa | Wrapper | Cape |
| Hoja de unión | Capote | Binder | Sous-cape |
| Interior de la mezcla | Tripa | Filler | Tripe |
| Producto | Cigarro | Cigar | Cigare |
| Composición | Mezcla | Blend | Assemblage |

Son traducciones propuestas para mantener consistencia; requieren revisión editorial antes de publicar. No traducir literalmente nombres de variedades o expresiones técnicas sin revisar su función.

## 9. Encargo listo para otra IA

> Implementa i18n en este repositorio usando `docs/I18N-AUDIT-PLAN.md` como contexto técnico. Relee el código vigente antes de editar: el documento puede quedar desactualizado. Implementa español, inglés y francés completos con i18next/react-i18next, componentes compartidos y URLs españolas existentes más `/en` y `/fr`. Extrae textos de páginas, navegación, inventario, accesibilidad, guía, composición, controles, errores y SEO. Conserva IDs, recursos, límites de selección, sesión, preferencias y valores funcionales. Coordina idioma con rutas, navegación protegida y destinos con query/hash. Separa claves de traducción del estado de negocio y reutiliza recursos puros para el SEO del build. Completa y verifica los tres catálogos, metadatos, alternates, sitemap y entradas directas. No inventes datos, actives rutas antiguas, cambies autenticación/envío de formularios ni publiques el sitio sin una solicitud de publicación. Entrega la implementación, validaciones realizadas, fallos previos identificados y limitaciones pendientes.

El encargo anterior conserva la propuesta original. La solicitud posterior autorizó su implementación e incorporó chino simplificado como cuarto idioma. Consultar [I18N.md](./I18N.md) para mantener la versión actual.
