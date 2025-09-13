(() => {
  // ====== Endpoints ======
  const API = "http://localhost:8080/api";
  const URL_ORDENES = `${API}/ordenes`;
  const URL_CLIENTES = `${API}/clientes`;
  const URL_REFERENCIAS = `${API}/referencias`;
  const URL_ESTADOS = `${API}/estados`;

  // ====== Elementos del DOM ======
  const form = document.getElementById("form-orden");
  const tbody = document.getElementById("tabla-ordenes-body");
  const btnCrear = form.querySelector(".btn-crear");

  const inNumeroSerie = document.getElementById("numeroSerie");
  const selCliente = document.getElementById("idCliente");
  const selReferencia = document.getElementById("idReferencia");
  const selEstado = document.getElementById("idEstado");
  const inFechaIngreso = document.getElementById("fechaIngreso");
  const inFechaCotizacion = document.getElementById("fechaCotizacion");
  const inFechaAprobacion = document.getElementById("fechaAprobacion");
  const inFechaFinalizacion = document.getElementById("fechaFinalizacion");
  const inObservaciones = document.getElementById("observaciones");

  let editId = null;

  // ====== Helpers de mapeo ======
  const getIdCliente = c => c?.id_cliente ?? c?.idCliente ?? null;
  const getNombreCliente = c => c?.nombre_cliente ?? c?.nombreCliente ?? "";

  const getIdReferencia = r => r?.id_referencia ?? r?.idReferencia ?? null;
  const getNombreReferencia = r => r?.referencia_dispositivo ?? r?.referenciaDispositivo ?? "";

  const getIdEstado = e => e?.id_estado ?? e?.idEstado ?? null;
  const getNombreEstado = e => e?.estado_dispositivo ?? e?.estadoDispositivo ?? "";

  // ====== 1) Cargar selects ======
  async function cargarClientes() {
    try {
      const res = await fetch(URL_CLIENTES);
      const data = await res.json();
      selCliente.innerHTML = `<option value="">Seleccione un cliente</option>`;
      data.forEach(c => {
        const option = document.createElement("option");
        option.value = getIdCliente(c);
        option.textContent = getNombreCliente(c);
        selCliente.appendChild(option);
      });
    } catch (e) {
      console.error("⚠️ Error cargando clientes:", e);
    }
  }

  async function cargarReferencias() {
    try {
      const res = await fetch(URL_REFERENCIAS);
      const data = await res.json();
      selReferencia.innerHTML = `<option value="">Seleccione una referencia</option>`;
      data.forEach(r => {
        const option = document.createElement("option");
        option.value = getIdReferencia(r);
        option.textContent = getNombreReferencia(r);
        selReferencia.appendChild(option);
      });
    } catch (e) {
      console.error("⚠️ Error cargando referencias:", e);
    }
  }

  async function cargarEstados() {
    try {
      const res = await fetch(URL_ESTADOS);
      const data = await res.json();
      selEstado.innerHTML = `<option value="">Seleccione un estado</option>`;
      data.forEach(es => {
        const option = document.createElement("option");
        option.value = getIdEstado(es);
        option.textContent = getNombreEstado(es);
        selEstado.appendChild(option);
      });
    } catch (e) {
      console.error("⚠️ Error cargando estados:", e);
    }
  }

  // ====== 2) Cargar tabla de órdenes ======
  async function cargarOrdenes() {
    try {
      const res = await fetch(URL_ORDENES);
      if (!res.ok) throw new Error(`Error al listar órdenes (${res.status})`);
      const data = await res.json();
      tbody.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;">Sin registros</td></tr>`;
        return;
      }

      data.forEach(o => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${o.idOrden}</td>
          <td>${o.numeroSerie}</td>
          <td>${o.usuario ?? ""}</td>
          <td>${getNombreCliente(o.cliente)}</td>
          <td>${getNombreReferencia(o.referencia)}</td>
          <td>${getNombreEstado(o.estado)}</td>
          <td>${o.fechaIngreso ?? ""}</td>
          <td>${o.fechaCotizacion ?? ""}</td>
          <td>${o.fechaAprobacion ?? ""}</td>
          <td>${o.fechaFinalizacion ?? ""}</td>
          <td>${o.observaciones ?? ""}</td>
          <td class="acciones">
            <button class="btn-editar" data-id="${o.idOrden}">Editar</button>
            <button class="btn-eliminar" data-id="${o.idOrden}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      console.error("⚠️ Error cargando órdenes:", e);
      tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;">Error cargando órdenes</td></tr>`;
    }
  }

  // ====== 3) Crear / Actualizar ======
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    if (!inNumeroSerie.value.trim() || !selCliente.value || !selReferencia.value || !selEstado.value) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const payload = {
      ...(editId && { idOrden: editId }),
      numeroSerie: inNumeroSerie.value.trim(),
      cliente: { id_cliente: Number(selCliente.value) },
      referencia: { id_referencia: Number(selReferencia.value) },
      estado: { idEstado: Number(selEstado.value) }, // 👈 camelCase aquí
      fechaIngreso: inFechaIngreso.value || null,
      fechaCotizacion: inFechaCotizacion.value || null,
      fechaAprobacion: inFechaAprobacion.value || null,
      fechaFinalizacion: inFechaFinalizacion.value || null,
      observaciones: inObservaciones.value.trim()
    };

    try {
      const url = editId ? `${URL_ORDENES}/${editId}` : URL_ORDENES;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`${method} falló (${res.status})`);

      form.reset();
      editId = null;
      btnCrear.textContent = "Crear Orden de Reparación";
      await cargarOrdenes();
    } catch (e) {
      console.error("⚠️ Error guardando orden:", e);
      alert("Error guardando orden. Revisa la consola.");
    }
  });

  // ====== 4) Delegación eventos Editar / Eliminar ======
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que deseas eliminar esta orden?")) return;
      try {
        const res = await fetch(`${URL_ORDENES}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE falló (${res.status})`);
        await cargarOrdenes();
      } catch (e2) {
        console.error("⚠️ Error eliminando:", e2);
        alert("No se pudo eliminar. Revisa la consola.");
      }
      return;
    }

    if (btn.classList.contains("btn-editar")) {
      const tr = btn.closest("tr");
      if (!tr) return;
      const tds = tr.querySelectorAll("td");

      editId = id;
      inNumeroSerie.value = tds[1]?.textContent ?? "";
      inObservaciones.value = tds[10]?.textContent ?? "";

      const selectByText = (selectEl, text) => {
        const opts = Array.from(selectEl.options);
        const found = opts.find(o => (o.textContent || "").trim() === (text || "").trim());
        if (found) selectEl.value = found.value;
      };

      selectByText(selCliente, tds[3]?.textContent ?? "");
      selectByText(selReferencia, tds[4]?.textContent ?? "");
      selectByText(selEstado, tds[5]?.textContent ?? "");

      inFechaIngreso.value = tds[6]?.textContent ?? "";
      inFechaCotizacion.value = tds[7]?.textContent ?? "";
      inFechaAprobacion.value = tds[8]?.textContent ?? "";
      inFechaFinalizacion.value = tds[9]?.textContent ?? "";

      btnCrear.textContent = "Actualizar Orden de Reparación";
      inNumeroSerie.focus();
    }
  });

  // ====== Inicialización ======
  cargarClientes();
  cargarReferencias();
  cargarEstados();
  cargarOrdenes();
})();
