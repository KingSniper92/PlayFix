(() => {
  const apiUrl = "http://localhost:8080/api/referencias";

  const form = document.querySelector(".form-referencia");
  const tablaBody = document.querySelector(".tabla-referencias tbody");

  if (!form || !tablaBody) {
    console.error("⚠️ No se encontró el formulario o la tabla de referencias");
    return;
  }

  let editId = null;

  // ========================
  // 1. Cargar referencias
  // ========================
  async function cargarReferencias() {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Error al obtener referencias");

      const referencias = await res.json();
      tablaBody.innerHTML = "";

      referencias.forEach(r => {
        const id = r.idReferencia ?? r.id_referencia ?? r.id;
        const nombre = r.referenciaDispositivo ?? r.referencia_dispositivo ?? "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${id}</td>
          <td>${nombre}</td>
          <td class="acciones">
            <button class="btn-editar" data-id="${id}">Editar</button>
            <button class="btn-eliminar" data-id="${id}">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });
    } catch (err) {
      console.error("Error cargando referencias:", err);
      tablaBody.innerHTML = `<tr><td colspan="3">Error cargando referencias</td></tr>`;
    }
  }

  // ========================
  // 2. Submit único
  // ========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
  referencia_dispositivo: document.querySelector("#nombre_referencia").value.trim()
};

    try {
      if (editId) {
        await fetch(`${apiUrl}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        editId = null;
      } else {
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
      }

      form.reset();
      const btnCrear = form.querySelector(".btn-crear");
      if (btnCrear) btnCrear.textContent = "Crear Referencia";

      cargarReferencias();
    } catch (err) {
      console.error("Error guardando referencia:", err);
      alert("Error guardando referencia (ver consola).");
    }
  });

  // ========================
  // 3. Delegación eventos
  // ========================
  tablaBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.classList.contains("btn-editar")) {
      try {
        const res = await fetch(`${apiUrl}/${id}`);
        if (!res.ok) throw new Error("Error al cargar referencia");
        const r = await res.json();

        document.querySelector("#nombre_referencia").value = r.referenciaDispositivo ?? r.referencia_dispositivo ?? "";

        editId = id;
        const btnCrear = form.querySelector(".btn-crear");
        if (btnCrear) btnCrear.textContent = "Actualizar Referencia";
      } catch (err) {
        console.error("Error cargando referencia:", err);
      }
    }

    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que deseas eliminar esta referencia?")) return;
      try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        cargarReferencias();
      } catch (err) {
        console.error("Error eliminando referencia:", err);
      }
    }
  });

  // ========================
  // 4. Inicial
  // ========================
  cargarReferencias();
})();