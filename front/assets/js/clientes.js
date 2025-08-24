(() => {
  const apiUrl = "http://localhost:8080/api/clientes";

  const form = document.querySelector(".form-cliente");
  const tablaBody = document.querySelector(".tabla-clientes tbody");

  if (!form || !tablaBody) {
    console.error("⚠️ No se encontró el formulario o la tabla de clientes");
    return;
  }

  // estado: null => crear, id => editar
  let editId = null;

  // ========================
  // 1. Cargar clientes
  // ========================
  async function cargarClientes() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error al obtener clientes");

      const clientes = await response.json();
      tablaBody.innerHTML = ""; // limpiar tabla

      clientes.forEach(cliente => {
        const id = cliente.id_cliente ?? cliente.idCliente ?? cliente.id;
        const nombre = cliente.nombre_cliente ?? cliente.nombreCliente ?? "";
        const direccion = cliente.direccion_cliente ?? cliente.direccionCliente ?? "";
        const telefono = cliente.telefono_cliente ?? cliente.telefonoCliente ?? "";
        const correo = cliente.correo_cliente ?? cliente.correoCliente ?? "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${id}</td>
          <td>${nombre}</td>
          <td>${direccion}</td>
          <td>${telefono}</td>
          <td>${correo}</td>
          <td class="acciones">
            <button class="btn-editar" data-id="${id}">Editar</button>
            <button class="btn-eliminar" data-id="${id}">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });

    } catch (error) {
      console.error("Error listando clientes:", error);
      tablaBody.innerHTML = `<tr><td colspan="6">Error cargando clientes</td></tr>`;
    }
  }

  // ========================
  // 2. Submit único (crear o actualizar según editId)
  // ========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      nombre_cliente: document.getElementById("nombre_cliente").value.trim(),
      direccion_cliente: document.getElementById("direccion_cliente").value.trim(),
      telefono_cliente: document.getElementById("telefono_cliente").value.trim(),
      correo_cliente: document.getElementById("correo_cliente").value.trim(),
    };

    // validación mínima
    if (!payload.nombre_cliente) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const url = editId ? `${apiUrl}/${editId}` : apiUrl;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(()=>"");
        throw new Error(`HTTP ${res.status} ${text}`);
      }

      // limpiar y resetear estado
      form.reset();
      editId = null;
      const btnCrear = form.querySelector(".btn-crear");
      if (btnCrear) btnCrear.textContent = "Crear Cliente";

      await cargarClientes();

    } catch (err) {
      console.error("Error guardando cliente:", err);
      alert("Error guardando cliente (ver consola).");
    }
  });

  // ========================
  // 3. Delegación eventos (Editar / Eliminar)
  // ========================
  tablaBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;

    // Eliminar cliente
    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
      try {
        const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await cargarClientes();
      } catch (err) {
        console.error("Error eliminando cliente:", err);
        alert("No se pudo eliminar (ver consola).");
      }
      return;
    }

    // Editar cliente (pone el formulario en modo edición)
    if (btn.classList.contains("btn-editar")) {
      try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const c = await res.json();

        // Rellenar formulario (soporta snake_case o camelCase en la respuesta)
        document.getElementById("nombre_cliente").value = c.nombre_cliente ?? c.nombreCliente ?? "";
        document.getElementById("direccion_cliente").value = c.direccion_cliente ?? c.direccionCliente ?? "";
        document.getElementById("telefono_cliente").value = c.telefono_cliente ?? c.telefonoCliente ?? "";
        document.getElementById("correo_cliente").value = c.correo_cliente ?? c.correoCliente ?? "";

        editId = id; // <-- ahora el submit hará PUT
        const btnCrear = form.querySelector(".btn-crear");
        if (btnCrear) btnCrear.textContent = "Actualizar Cliente";
        // no reasignamos form.onsubmit: usamos el handler único arriba
      } catch (err) {
        console.error("Error al cargar cliente para editar:", err);
        alert("No se pudo cargar cliente (ver consola).");
      }
      return;
    }
  });

  // Cargar inicial
  cargarClientes();
})();