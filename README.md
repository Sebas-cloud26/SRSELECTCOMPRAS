# Sr Select · Landing page

Landing page de **Sr Select**, compras personalizadas en Estados Unidos. Los clientes ven productos por marca y por género (mujer / hombre), arman su pedido y lo envían por **WhatsApp** con el resumen y el valor del abono.

Es un sitio estático (HTML + CSS + JavaScript), sin instalación ni servidor.

## Estructura

```
index.html        Página principal
css/styles.css    Estilos
js/config.js      ← Número de WhatsApp, % de abono, redes sociales
js/productos.js   ← Catálogo de productos
js/app.js         Lógica (filtros, pedido, WhatsApp)
```

## Personalizar

### 1. Tu número de WhatsApp
En `js/config.js` cambia `whatsapp` por tu número con código de país, solo dígitos:

```js
whatsapp: "573001234567",   // Colombia (57) + número
abonoPorcentaje: 50,        // % de abono que pides
```

### 2. Productos
En `js/productos.js` cada producto es una línea:

```js
{ id: 17, nombre: "Bolso Tote", marca: "Coach", genero: "mujer", categoria: "Bolsos", precio: 250, imagen: "https://...", tallas: [] },
```

- `id`: número único.
- `genero`: `"mujer"`, `"hombre"` o `"unisex"` (aparece en ambos).
- `imagen`: URL de la foto, o una ruta local como `"img/bolso-coach.jpg"` (crea la carpeta `img/`). Si está vacío se muestra una tarjeta con el nombre de la marca.
- `tallas`: por ejemplo `["S","M","L"]`, o `[]` si no aplica.

Las marcas y categorías de los filtros se generan solas a partir de los productos.

## Ver en tu computador
Abre `index.html` en el navegador.

## Publicar gratis (GitHub Pages)
1. En GitHub: **Settings → Pages**.
2. En *Source* elige la rama y la carpeta `/ (root)`.
3. Tu página quedará en `https://<usuario>.github.io/<repositorio>/`.

También funciona en Netlify o Vercel arrastrando la carpeta.
