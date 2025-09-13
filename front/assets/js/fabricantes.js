(() => {
  const apiUrl = "http://localhost:8080/api/fabricantes";

  const form = document.querySelector(".form-fabricante");
  const tablaBody = document.querySelector(".tabla-fabricantes tbody");

  if (!form || !tablaBody) {
    console.error("⚠️ No se encontró el formulario o la tabla de fabricantes");
    return;
  }

  let editId = null;

  // ========================
  // 1. Cargar fabricantes
  // ========================
  async function cargarFabricantes() {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Error al obtener fabricantes");

      const fabricantes = await res.json();
      tablaBody.innerHTML = "";

      fabricantes.forEach(f => {
        const id = f.idFabricante ?? f.id_fabricante ?? f.id;
        const nombre = f.nombreFabricante ?? f.nombre_fabricante ?? "";
        const web = f.webFabricante ?? f.web_fabricante ?? "";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${id}</td>
          <td>${nombre}</td>
          <td><a href="${web}" target="_blank">${web}</a></td>
          <td class="acciones">
            <button class="btn-editar" data-id="${id}">Editar</button>
            <button class="btn-eliminar" data-id="${id}">Eliminar</button>
          </td>
        `;
        tablaBody.appendChild(tr);
      });
    } catch (err) {
      console.error("Error cargando fabricantes:", err);
      tablaBody.innerHTML = `<tr><td colspan="4">Error cargando fabricantes</td></tr>`;
    }
  }

  // ========================
  // 2. Submit único
  // ========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombreFabricante: document.querySelector("#nombre_fabricante").value.trim(),
      webFabricante: document.querySelector("#web_fabricante").value.trim()
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
      if (btnCrear) btnCrear.textContent = "Crear Fabricante";

      cargarFabricantes();
    } catch (err) {
      console.error("Error guardando fabricante:", err);
      alert("Error guardando fabricante (ver consola).");
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
        if (!res.ok) throw new Error("Error al cargar fabricante");
        const f = await res.json();

        document.querySelector("#nombre_fabricante").value = f.nombreFabricante ?? f.nombre_fabricante ?? "";
        document.querySelector("#web_fabricante").value = f.webFabricante ?? f.web_fabricante ?? "";

        editId = id;
        const btnCrear = form.querySelector(".btn-crear");
        if (btnCrear) btnCrear.textContent = "Actualizar Fabricante";
      } catch (err) {
        console.error("Error cargando fabricante:", err);
      }
    }

    if (btn.classList.contains("btn-eliminar")) {
      if (!confirm("¿Seguro que deseas eliminar este fabricante?")) return;
      try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        cargarFabricantes();
      } catch (err) {
        console.error("Error eliminando fabricante:", err);
      }
    }
  });

  // ========================
  // 4. Inicial
  // ========================
  cargarFabricantes();
})();