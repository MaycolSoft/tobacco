# Paleta de referencia — Tabaco editorial

La biblioteca y el configurador comparten estos colores. La definición base vive exclusivamente en las variables `--ls-base-*` de `src/styles/tokens.css`; el UI Kit las lee para su botón «Aplicar paleta base».

| Uso | Color base |
| --- | --- |
| Fondo principal | `#0F1110` |
| Tarjetas | `#181C19` |
| Paneles elevados | `#222823` |
| Acento bronce | `#C7A479` |
| Títulos y texto principal | `#F3EFE6` |
| Párrafos y descripciones | `#B8BBAF` |
| Etiquetas y texto auxiliar | `#939C92` |
| Fondo del video | `#D6C8B9` |

El marfil se utiliza para los títulos y la información principal. El bronce se reserva para acciones, selección y detalles de marca. Los párrafos utilizan el texto secundario; los metadatos y etiquetas, el auxiliar. Evitar porcentajes de opacidad en texto necesario para comprender la presentación.

Los bordes, reflejos y transparencias se derivan del tema mediante CSS. Los botones primario, secundario y enlace siguen inicialmente el acento; se pueden personalizar por separado. El texto sobre el acento y sobre el botón primario se elige automáticamente entre tinta oscura y clara, de forma independiente para cada fondo.

El panel conserva los colores personalizados guardados. Los valores del antiguo tema que seguían siendo los predeterminados se migran a la nueva base. Para ver exactamente esta propuesta, pulsar «Aplicar paleta base». No modifica las preferencias tipográficas ni la configuración del layout.

La escena del video tiene un color independiente para integrarse con sus fotogramas; cambiar el tema de la interfaz no recolorea las imágenes. No se modificaron descargas, caché, reproducción, scroll ni selección de videos.

Los estilos de referencia se aplican en `presentation-theme.css`. Las demás páginas pueden heredar los tokens que ya usaban, pero su adaptación visual queda para próximas revisiones. Los controles del UI Kit conservan una paleta neutral propia para poder editar incluso un tema con colores poco legibles.

La revisión visual queda a cargo del usuario; no se ejecutaron builds, servidores ni pruebas.
