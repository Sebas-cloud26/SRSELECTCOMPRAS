(function () {
  "use strict";

  const CONFIG = window.SR_CONFIG;
  const PRODUCTOS = window.SR_PRODUCTOS;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const STORAGE_KEY = "srselect_pedido";
  const estado = { genero: "todos", marca: "", categoria: "", texto: "" };
  let carrito = cargarCarrito();
  let productoModal = null;
  let tallaModal = null;

  // Paletas para las tarjetas sin foto (estables por marca)
  const PALETAS = [
    ["#1c1c1c", "#d9b77e"], ["#e9dfd0", "#3a2f22"], ["#2f3a33", "#e7e1d8"],
    ["#f4ece4", "#8a6c3e"], ["#3b2a2a", "#f1d9c9"], ["#dfe5ea", "#1f2b36"],
    ["#5a4632", "#f6eee2"], ["#efe7f0", "#4b3350"],
  ];

  /* ---------- Utilidades ---------- */
  const formato = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: CONFIG.moneda, maximumFractionDigits: 0 }).format(n);

  const escapar = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function hash(str) {
    let h = 0;
    for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return h;
  }

  function media(p) {
    if (p.imagen) return `<img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy">`;
    const [bg, fg] = PALETAS[hash(p.marca) % PALETAS.length];
    return `<div class="ph" style="background:${bg};color:${fg}">
      <div><div class="ph__brand">${escapar(p.marca)}</div><div class="ph__cat">${escapar(p.categoria)}</div></div></div>`;
  }

  function enlaceWhatsApp(mensaje) {
    return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Catálogo ---------- */
  function contarPorMarca() {
    const conteo = {};
    PRODUCTOS.forEach((p) => (conteo[p.marca] = (conteo[p.marca] || 0) + 1));
    return conteo;
  }

  function pintarMarcas() {
    const conteo = contarPorMarca();
    const marcas = Object.keys(conteo).sort((a, b) => a.localeCompare(b));
    $("#listaMarcas").innerHTML = marcas
      .map((m) => `<button class="brand-chip${estado.marca === m ? " is-active" : ""}" data-marca="${escapar(m)}">${escapar(m)}<small>${conteo[m]}</small></button>`)
      .join("");
    $("#filtroMarca").innerHTML =
      `<option value="">Todas las marcas</option>` +
      marcas.map((m) => `<option ${estado.marca === m ? "selected" : ""}>${escapar(m)}</option>`).join("");
    const categorias = [...new Set(PRODUCTOS.map((p) => p.categoria))].sort();
    $("#filtroCategoria").innerHTML =
      `<option value="">Todas las categorías</option>` +
      categorias.map((c) => `<option ${estado.categoria === c ? "selected" : ""}>${escapar(c)}</option>`).join("");
  }

  function filtrar() {
    const texto = estado.texto.trim().toLowerCase();
    return PRODUCTOS.filter((p) => {
      if (estado.genero !== "todos" && p.genero !== estado.genero && p.genero !== "unisex") return false;
      if (estado.marca && p.marca !== estado.marca) return false;
      if (estado.categoria && p.categoria !== estado.categoria) return false;
      if (texto && !`${p.nombre} ${p.marca} ${p.categoria}`.toLowerCase().includes(texto)) return false;
      return true;
    });
  }

  function pintarCatalogo() {
    const lista = filtrar();
    $("#conteo").textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;
    const etiquetaGenero = { mujer: "Mujer", hombre: "Hombre", unisex: "Unisex" };
    $("#gridProductos").innerHTML = lista.length
      ? lista
          .map(
            (p) => `
        <article class="card">
          <div class="card__media" data-ver="${p.id}">
            ${media(p)}
            <span class="card__tag">${etiquetaGenero[p.genero] || ""}</span>
          </div>
          <div class="card__body">
            <span class="card__brand">${escapar(p.marca)}</span>
            <h3 class="card__name">${escapar(p.nombre)}</h3>
            <div class="card__foot">
              <p class="price">${formato(p.precio)}</p>
              <button class="add-btn" data-ver="${p.id}">Agregar</button>
            </div>
          </div>
        </article>`
          )
          .join("")
      : `<div class="empty-state">No encontramos productos con esos filtros.<br>Prueba con otra marca o <a href="#" data-limpiar>limpia los filtros</a>.</div>`;
  }

  function setGenero(g) {
    estado.genero = g;
    $$("#tabsGenero .tab").forEach((t) => t.classList.toggle("is-active", t.dataset.genero === g));
    pintarCatalogo();
  }

  function setMarca(m) {
    estado.marca = estado.marca === m ? "" : m;
    pintarMarcas();
    pintarCatalogo();
  }

  /* ---------- Modal de producto ---------- */
  function abrirModal(id) {
    const p = PRODUCTOS.find((x) => x.id === Number(id));
    if (!p) return;
    productoModal = p;
    tallaModal = null;
    $("#modalMedia").innerHTML = media(p);
    $("#modalMarca").textContent = p.marca;
    $("#modalTitulo").textContent = p.nombre;
    $("#modalPrecio").textContent = formato(p.precio);
    $("#modalCantidad").value = 1;
    $("#modalTallas").innerHTML = p.tallas && p.tallas.length
      ? `<div class="sizes__label">Talla</div><div class="sizes">${p.tallas
          .map((t) => `<button class="size" data-talla="${escapar(t)}">${escapar(t)}</button>`)
          .join("")}</div>`
      : "";
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function cerrarModal() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- Carrito ---------- */
  function cargarCarrito() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data.filter((i) => PRODUCTOS.some((p) => p.id === i.id)) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarCarrito() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
  }

  function agregar(id, talla, cantidad) {
    const existente = carrito.find((i) => i.id === id && i.talla === talla);
    if (existente) existente.cantidad += cantidad;
    else carrito.push({ id, talla, cantidad });
    guardarCarrito();
    pintarCarrito();
    const btn = $("#abrirCarrito");
    btn.classList.remove("bump");
    void btn.offsetWidth;
    btn.classList.add("bump");
  }

  function totales() {
    const subtotal = carrito.reduce((s, i) => s + PRODUCTOS.find((p) => p.id === i.id).precio * i.cantidad, 0);
    const abono = Math.ceil((subtotal * CONFIG.abonoPorcentaje) / 100);
    return { subtotal, abono };
  }

  function pintarCarrito() {
    const unidades = carrito.reduce((s, i) => s + i.cantidad, 0);
    $("#contadorCarrito").textContent = unidades;
    $("#carritoVacio").hidden = carrito.length > 0;
    $("#itemsCarrito").innerHTML = carrito
      .map((i, idx) => {
        const p = PRODUCTOS.find((x) => x.id === i.id);
        return `<div class="line">
          <div class="line__thumb">${media(p)}</div>
          <div>
            <p class="line__name">${escapar(p.nombre)}</p>
            <div class="line__meta">${escapar(p.marca)}${i.talla ? " · Talla " + escapar(i.talla) : ""}</div>
            <div class="line__ctrl">
              <button data-menos="${idx}" aria-label="Quitar uno">−</button>
              <span>${i.cantidad}</span>
              <button data-mas="${idx}" aria-label="Agregar uno">+</button>
            </div>
          </div>
          <div>
            <div class="line__price">${formato(p.precio * i.cantidad)}</div>
            <button class="line__remove" data-quitar="${idx}">Eliminar</button>
          </div>
        </div>`;
      })
      .join("");
    const { subtotal, abono } = totales();
    $("#subtotal").textContent = formato(subtotal);
    $("#abono").textContent = formato(abono);
  }

  function abrirCarrito() {
    $("#carrito").classList.add("is-open");
    $("#carrito").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function cerrarCarrito() {
    $("#carrito").classList.remove("is-open");
    $("#carrito").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
    document.body.style.overflow = "";
  }

  function enviarPedido(e) {
    e.preventDefault();
    const form = e.target;
    const error = $("#errorForm");
    const datos = Object.fromEntries(new FormData(form).entries());

    if (!carrito.length) {
      error.textContent = "Agrega al menos un producto a tu pedido.";
      error.hidden = false;
      return;
    }
    if (!datos.nombre.trim() || !datos.ciudad.trim()) {
      error.textContent = "Por favor escribe tu nombre y ciudad.";
      error.hidden = false;
      return;
    }
    error.hidden = true;

    const { subtotal, abono } = totales();
    const lineas = carrito.map((i, n) => {
      const p = PRODUCTOS.find((x) => x.id === i.id);
      return `${n + 1}. ${p.marca} – ${p.nombre}${i.talla ? ` (Talla ${i.talla})` : ""} x${i.cantidad} = ${formato(p.precio * i.cantidad)}`;
    });

    const mensaje = [
      "¡Hola Sr Select! 👋 Quiero hacer este pedido:",
      "",
      ...lineas,
      "",
      `Subtotal: ${formato(subtotal)}`,
      `Abono para separar (${CONFIG.abonoPorcentaje}%): ${formato(abono)}`,
      "",
      `Nombre: ${datos.nombre.trim()}`,
      `Ciudad: ${datos.ciudad.trim()}`,
      datos.telefono.trim() ? `Teléfono: ${datos.telefono.trim()}` : "",
      datos.notas.trim() ? `Notas: ${datos.notas.trim()}` : "",
      "",
      "¿Me confirmas disponibilidad y los medios de pago para el abono? 🙌",
    ]
      .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
      .join("\n");

    window.open(enlaceWhatsApp(mensaje), "_blank", "noopener");
  }

  /* ---------- Eventos ---------- */
  function eventos() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-ver],[data-marca],[data-mas],[data-menos],[data-quitar],[data-talla],[data-limpiar],[data-genero-link]");
      if (!t) return;
      if (t.dataset.ver) abrirModal(t.dataset.ver);
      else if (t.dataset.marca) {
        setMarca(t.dataset.marca);
        document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
      } else if (t.dataset.mas) {
        carrito[t.dataset.mas].cantidad++;
        guardarCarrito(); pintarCarrito();
      } else if (t.dataset.menos) {
        const item = carrito[t.dataset.menos];
        if (--item.cantidad <= 0) carrito.splice(t.dataset.menos, 1);
        guardarCarrito(); pintarCarrito();
      } else if (t.dataset.quitar) {
        carrito.splice(t.dataset.quitar, 1);
        guardarCarrito(); pintarCarrito();
      } else if (t.dataset.talla) {
        tallaModal = t.dataset.talla;
        $$("#modalTallas .size").forEach((b) => b.classList.toggle("is-active", b === t));
      } else if (t.hasAttribute("data-limpiar")) {
        e.preventDefault();
        Object.assign(estado, { marca: "", categoria: "", texto: "" });
        $("#buscar").value = "";
        pintarMarcas(); setGenero("todos");
      } else if (t.dataset.generoLink) {
        setGenero(t.dataset.generoLink);
      }
    });

    $$("#tabsGenero .tab").forEach((t) => t.addEventListener("click", () => setGenero(t.dataset.genero)));
    $("#buscar").addEventListener("input", (e) => { estado.texto = e.target.value; pintarCatalogo(); });
    $("#filtroMarca").addEventListener("change", (e) => { estado.marca = e.target.value; pintarMarcas(); pintarCatalogo(); });
    $("#filtroCategoria").addEventListener("change", (e) => { estado.categoria = e.target.value; pintarCatalogo(); });

    $("#modalAgregar").addEventListener("click", () => {
      const p = productoModal;
      if (p.tallas && p.tallas.length && !tallaModal) {
        toast("Selecciona una talla");
        return;
      }
      const cantidad = Math.max(1, Math.min(20, parseInt($("#modalCantidad").value, 10) || 1));
      agregar(p.id, tallaModal, cantidad);
      cerrarModal();
      toast(`${p.nombre} agregado al pedido`);
    });
    $("#cerrarModal").addEventListener("click", cerrarModal);
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") cerrarModal(); });

    $("#abrirCarrito").addEventListener("click", abrirCarrito);
    $("#cerrarCarrito").addEventListener("click", cerrarCarrito);
    $("#overlay").addEventListener("click", cerrarCarrito);
    $("#formPedido").addEventListener("submit", enviarPedido);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { cerrarModal(); cerrarCarrito(); }
    });
  }

  function enlacesWhatsApp() {
    const general = enlaceWhatsApp("¡Hola Sr Select! 👋 Quiero información sobre sus compras en Estados Unidos.");
    $("#whatsappDirecto").href = general;
    $("#waFlotante").href = general;
    $("#waFlotante").target = "_blank";
    $("#whatsappDirecto").target = "_blank";
    const cotizar = $("#pedidoPersonalizado");
    cotizar.href = enlaceWhatsApp("¡Hola Sr Select! 👋 Quiero cotizar este producto: (pega aquí el link o envía la foto)");
    cotizar.target = "_blank";

    $$(".abono-pct").forEach((el) => (el.textContent = CONFIG.abonoPorcentaje));
    $("#anio").textContent = new Date().getFullYear();

    const redes = [];
    if (CONFIG.instagram) redes.push(`<a href="${escapar(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
    if (CONFIG.tiktok) redes.push(`<a href="${escapar(CONFIG.tiktok)}" target="_blank" rel="noopener">TikTok</a>`);
    redes.push(`<a href="${general}" target="_blank" rel="noopener">WhatsApp</a>`);
    $("#redes").innerHTML = redes.join("");
  }

  /* ---------- Inicio ---------- */
  pintarMarcas();
  pintarCatalogo();
  pintarCarrito();
  enlacesWhatsApp();
  eventos();
})();
