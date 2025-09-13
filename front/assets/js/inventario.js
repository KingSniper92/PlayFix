(() => {
  // ====== Endpoints (ajusta si tu puerto/host cambia) ======
  const API = "http://localhost:8080";
  const URL_COMPONENTES = `${API}/api/componentes`;
  const URL_FABRICANTES = `${API}/api/fabricantes`;
  const URL_REFERENCIAS = `${API}/api/referencias`;

  // ====== Elementos del DOM (soporta ids snake_case y camelCase) ======
  const form = document.querySelector(".form-inventario");
  const tbody = document.querySelector(".tabla-inventario tbody");

  // Campos del form con tolerancia a nombres
  const $ = (a,b) => document.getElementById(a) || document.getElementById(b);
  const inNombre = $("nombre_parte","nombreParte");
  const inCantidad = $("cantidad_parte","cantidadParte");
  const selFabricante = $("id_fabricante","idFabricante");
  const selReferencia = $("id_referencia","idReferencia");
  const btnCrear = form?.querySelector(".btn-crear");

  if (!form || !tbody || !inNombre || !inCantidad || !selFabricante || !selReferencia) {
    console.error("⚠️ Faltan elementos requeridos en el HTML. Revisa ids/clases del formulario y tabla.");
    return;
  }

  let editId = null; // id de la fila en modo edición

  // ====== Helpers de mapeo seguros ======
  const getIdFab = f => f?.idFabricante ?? f?.id_fabricante ?? f?.id ?? null;
  const getNombreFab = f => f?.nombreFabricante ?? f?.nombre_fabricante ?? f?.nombre ?? "";
  const getIdRef = r => r?.id_referencia ?? r?.idReferencia ?? r?.id ?? null;
  const getNombreRef = r => r?.referencia_dispositivo ?? r?.referenciaDispositivo ?? r?.nombre ?? "";

  // Las filas del inventario pueden venir en varios formatos; normalizamos:
  const mapComponenteRow = (item) => {
    // Campos base
    const idParte = item.idParte ?? item.id_parte ?? item.id ?? null;
    const nombreParte = item.nombreParte ?? item.nombre_parte ?? item.nombre ?? "";
    const cantidadParte = item.cantidadParte ?? item.cantidad_parte ?? item.cantidad ?? 0;

    // Nombre fabricante puede venir como string (DTO) o como objeto
    let fabricanteNombre = "";
    if (typeof item.fabricante === "string") fabricanteNombre = item.fabricante;
    else if (item.nombreFabricante) fabricanteNombre = item.nombreFabricante;
    else if (item.fabricante && typeof item.fabricante === "object") fabricanteNombre = getNombreFab(item.fabricante);

    // Nombre referencia puede venir como string (DTO) o como objeto
    let referenciaNombre = "";
    if (typeof item.referencia === "string") referenciaNombre = item.referencia;
    else if (item.nombreReferencia) referenciaNombre = item.nombreReferencia;
    else if (item.referencia && typeof item.referencia === "object") referenciaNombre = getNombreRef(item.referencia);

    return { idParte, nombreParte, cantidadParte, fabricanteNombre, referenciaNombre };
  };

  // ====== 1) Cargar selects ======
  async function cargarFabricantes() {
    try {
      const res = await fetch(URL_FABRICANTES);
      if (!res.ok) throw new Error("No se pudieron cargar fabricantes");
      const data = await res.json();

      selFabricante.innerHTML = `<option value="">Seleccione un fabricante</option>`;
      data.forEach(f => {
        const option = document.createElement("option");
        option.value = getIdFab(f);
        option.textContent = getNombreFab(f);
        selFabricante.appendChild(option);
      });
    } catch (e) {
      console.error("⚠️ Error cargando fabricantes:", e);
    }
  }

  async function cargarReferencias() {
    try {
      const res = await fetch(URL_REFERENCIAS);
      if (!res.ok) throw new Error("No se pudieron cargar referencias");
      const data = await res.json();

      selReferencia.innerHTML = `<option value="">Seleccione una referencia</option>`;
      data.forEach(r => {
        const option = document.createElement("option");
        option.value = getIdRef(r);
        option.textContent = getNombreRef(r);
        selReferencia.appendChild(option);
      });
    } catch (e) {
      console.error("⚠️ Error cargando referencias:", e);
    }
  }

  // ====== 2) Cargar tabla inventario ======
  async function cargarInventario() {
    try {
      const res = await fetch(URL_COMPONENTES); // <- IMPORTANTE: /api/componentes (NO /api/inventarios)
      if (!res.ok) throw new Error(`Error al listar componentes (${res.status})`);
      const data = await res.json();

      tbody.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Sin registros</td></tr>`;
        return;
      }

      data.map(mapComponenteRow).forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.idParte ?? ""}</td>
          <td>${item.nombreParte}</td>
          <td>${item.cantidadParte}</td>
          <td>${item.fabricanteNombre}</td>
          <td>${item.referenciaNombre}</td>
          <td class="acciones">
            <button class="btn-editar" data-id="${item.idParte}">Editar</button>
            <button class="btn-eliminar" data-id="${item.idParte}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      console.error("⚠️ Error cargando inventario:", e);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Error cargando inventario</td></tr>`;
    }
  }

  // ====== 3) Crear / Actualizar ======
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const nombreParte = inNombre.value.trim();
    const cantidadParte = Number(inCantidad.value);
    const idFabricante = Number(selFabricante.value);
    const idReferencia = Number(selReferencia.value);

    if (!nombreParte || Number.isNaN(cantidadParte) || !idFabricante || !idReferencia) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // El backend espera la entidad Componente con objetos anidados para fabricante/referencia
    const payload = {
      nombreParte,
      cantidadParte,
      fabricante: { idFabricante },            // <- Java: Fabricante.getIdFabricante()
      referencia: { id_referencia: idReferencia } // <- Java: Referencia.getId_referencia()
    };

    try {
      const url = editId ? `${URL_COMPONENTES}/${editId}` : URL_COMPONENTES;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`${method} falló (${res.status})`);

      // Reset de formulario/estado
      form.reset();
      editId = null;
      if (btnCrear) btnCrear.textContent = "Crear Parte";

      await cargarInventario();
    } catch (e) {
      console.error("⚠️ Error guardando componente:", e);
      alert("Error guardando componente. Revisa la consola.");
    }
  });

  // ====== 4) Delegación de eventos (Editar / Eliminar) ======
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;

    // Eliminar
    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que deseas eliminar esta parte?")) return;
      try {
        const res = await fetch(`${URL_COMPONENTES}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló (${res.status})`);
        await cargarInventario();
      } catch (e2) {
        console.error("⚠️ Error eliminando:", e2);
        alert("No se pudo eliminar. Revisa la consola.");
      }
      return;
    }

    // Editar: usamos la fila ya renderizada (DTO trae nombres, no IDs)
    if (btn.classList.contains("btn-editar")) {
      const tr = btn.closest("tr");
      if (!tr) return;
      const tds = tr.querySelectorAll("td");
      // Orden: ID, Nombre, Cantidad, FabricanteNombre, ReferenciaNombre
      const idParte = tds[0]?.textContent?.trim();
      const nombre = tds[1]?.textContent?.trim();
      const cantidad = tds[2]?.textContent?.trim();
      const fabNombre = tds[3]?.textContent?.trim();
      const refNombre = tds[4]?.textContent?.trim();

      // Llenar formulario
      inNombre.value = nombre ?? "";
      inCantidad.value = cantidad ?? "";

      // Seleccionar opción por NOMBRE visible (no tenemos id en el DTO)
      const selectByText = (selectEl, text) => {
        const opts = Array.from(selectEl.options);
        const found = opts.find(o => (o.textContent || "").trim() === (text || ""));
        if (found) selectEl.value = found.value;
      };
      selectByText(selFabricante, fabNombre);
      selectByText(selReferencia, refNombre);

      // Marcar modo edición
      editId = idParte;
      if (btnCrear) btnCrear.textContent = "Editar Parte";
      inNombre.focus();
    }
  });

  // ====== 5) Inicial ======
  const init = async () => {
    await Promise.all([cargarFabricantes(), cargarReferencias()]);
    await cargarInventario();
  };
  init();
})();