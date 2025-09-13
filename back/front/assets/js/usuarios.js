(() => {
  const API_URL = "http://localhost:8080/api/usuarios";

  const rolNombreAId = {
    "Administrador": 1,
    "Tecnico": 2,
    "Logistica": 3,
    "Visitante": 4
  };
  const rolIdAValue = {
    1: "Administrador",
    2: "Tecnico",
    3: "Logistica",
    4: "Visitante"
  };

  // Función que inicializa TODO lo de usuarios
  function initUsuarios(root) {
    const form = root.querySelector(".form-usuario");
    const tbody = root.querySelector(".tabla-usuarios tbody");
    const btnCrear = form?.querySelector(".btn-crear");
    if (!form || !tbody || !btnCrear) return;

    let editId = null;

    // ==== LISTAR USUARIOS ====
    async function listar() {
      tbody.innerHTML = "";
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        data.forEach(u => {
          const id = u.idUsuario ?? u.id_usuario ?? "";
          const nombre = u.nombreUsuario ?? u.nombre_usuario ?? "";
          const correo = u.correoUsuario ?? u.correo_usuario ?? "";
          const idRol = u.idRol ?? u.id_rol;
          const rolTxt = rolIdAValue[idRol] || "Visitante";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${correo}</td>
            <td>${rolTxt}</td>
            <td>
              <button class="btn-editar" data-id="${id}">Editar</button>
              <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error("Error listando usuarios", err);
        tbody.innerHTML = `<tr><td colspan="5">Error cargando usuarios</td></tr>`;
      }
    }

    // ==== CREAR / ACTUALIZAR ====
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = form.querySelector("#nombre_usuario").value.trim();
      const correo = form.querySelector("#correo_usuario").value.trim();
      const clave  = form.querySelector("#clave_usuario").value;
      const rolTxt = form.querySelector("#rol_usuario").value;
      const idRol  = rolNombreAId[rolTxt] ?? 4;

      const payload = { nombreUsuario: nombre, correoUsuario: correo, claveUsuario: clave, idRol };

      try {
        const url = editId ? `${API_URL}/${editId}` : API_URL;
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        form.reset();
        editId = null;
        btnCrear.textContent = "Crear Usuario";
        await listar();
      } catch (err) {
        console.error("Error guardando usuario", err);
        alert("Error guardando usuario");
      }
    });

    // ==== EDITAR / ELIMINAR ====
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const id = parseInt(btn.dataset.id, 10);

      if (btn.classList.contains("btn-eliminar")) {
        if (!confirm("¿Eliminar este usuario?")) return;
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        await listar();
      }

      if (btn.classList.contains("btn-editar")) {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) return alert("No se pudo obtener el usuario");
        const u = await res.json();

        form.querySelector("#nombre_usuario").value = u.nombreUsuario ?? "";
        form.querySelector("#correo_usuario").value = u.correoUsuario ?? "";
        form.querySelector("#clave_usuario").value  = u.claveUsuario  ?? "";
        form.querySelector("#rol_usuario").value   = rolIdAValue[u.idRol] || "Visitante";

        editId = id;
        btnCrear.textContent = "Actualizar Usuario";
      }
    });

    // Primera carga
    listar();
  }

  // ====== DETECTAR CUANDO SE CARGA EL MODULO USUARIOS ======
  const panels = document.getElementById("panels");
  if (panels) {
    const observer = new MutationObserver(() => {
      const seccionUsuarios = panels.querySelector(".usuarios");
      if (seccionUsuarios && !seccionUsuarios.dataset.iniciado) {
        initUsuarios(seccionUsuarios);
        seccionUsuarios.dataset.iniciado = "true";
      }
    });
    observer.observe(panels, { childList: true, subtree: true });
  }
})();