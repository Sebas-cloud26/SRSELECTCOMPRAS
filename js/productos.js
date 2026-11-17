/* =========================================================
   CATÁLOGO DE PRODUCTOS
   Para agregar un producto copia un bloque { ... } y cambia los datos.
   - genero: "mujer" | "hombre" | "unisex"
   - imagen: URL de la foto (opcional). Si se deja "", se muestra una tarjeta con la marca.
   - tallas: lista de tallas disponibles (o [] si no aplica)
   ========================================================= */
window.SR_PRODUCTOS = [
  { id: 1,  nombre: "Bolso Jet Set Tote",          marca: "Michael Kors",     genero: "mujer",  categoria: "Bolsos",     precio: 145, imagen: "", tallas: [] },
  { id: 2,  nombre: "Tenis Air Force 1 '07",        marca: "Nike",             genero: "hombre", categoria: "Calzado",    precio: 120, imagen: "", tallas: ["8", "9", "10", "11"] },
  { id: 3,  nombre: "Perfume Bombshell 100ml",      marca: "Victoria's Secret",genero: "mujer",  categoria: "Belleza",    precio: 85,  imagen: "", tallas: [] },
  { id: 4,  nombre: "Polo Custom Slim Fit",         marca: "Ralph Lauren",     genero: "hombre", categoria: "Ropa",       precio: 98,  imagen: "", tallas: ["S", "M", "L", "XL"] },
  { id: 5,  nombre: "Bolso Tabby Shoulder 26",      marca: "Coach",            genero: "mujer",  categoria: "Bolsos",     precio: 295, imagen: "", tallas: [] },
  { id: 6,  nombre: "Jean 501 Original",            marca: "Levi's",           genero: "hombre", categoria: "Ropa",       precio: 69,  imagen: "", tallas: ["30", "32", "34", "36"] },
  { id: 7,  nombre: "Set Brasier Modern Cotton",    marca: "Calvin Klein",     genero: "mujer",  categoria: "Ropa",       precio: 55,  imagen: "", tallas: ["XS", "S", "M", "L"] },
  { id: 8,  nombre: "Tenis Samba OG",               marca: "Adidas",           genero: "unisex", categoria: "Calzado",    precio: 100, imagen: "", tallas: ["6", "7", "8", "9", "10"] },
  { id: 9,  nombre: "Body Mist Pure Seduction",     marca: "Victoria's Secret",genero: "mujer",  categoria: "Belleza",    precio: 22,  imagen: "", tallas: [] },
  { id: 10, nombre: "Billetera Bifold en cuero",    marca: "Tommy Hilfiger",   genero: "hombre", categoria: "Accesorios", precio: 45,  imagen: "", tallas: [] },
  { id: 11, nombre: "Reloj Lexington Dorado",       marca: "Michael Kors",     genero: "mujer",  categoria: "Accesorios", precio: 199, imagen: "", tallas: [] },
  { id: 12, nombre: "Hoodie Club Fleece",           marca: "Nike",             genero: "hombre", categoria: "Ropa",       precio: 65,  imagen: "", tallas: ["S", "M", "L", "XL"] },
  { id: 13, nombre: "Gorra Classic Baseball",       marca: "Tommy Hilfiger",   genero: "unisex", categoria: "Accesorios", precio: 39,  imagen: "", tallas: [] },
  { id: 14, nombre: "Boxers pack x3",               marca: "Calvin Klein",     genero: "hombre", categoria: "Ropa",       precio: 48,  imagen: "", tallas: ["S", "M", "L", "XL"] },
  { id: 15, nombre: "Tenis Air Max 270",            marca: "Nike",             genero: "mujer",  categoria: "Calzado",    precio: 160, imagen: "", tallas: ["5", "6", "7", "8"] },
  { id: 16, nombre: "Camiseta Big Pony",            marca: "Ralph Lauren",     genero: "mujer",  categoria: "Ropa",       precio: 75,  imagen: "", tallas: ["XS", "S", "M", "L"] },
];
