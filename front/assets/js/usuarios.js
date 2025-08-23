// ./js/usuarios.js
(() => {
  const API_URL = "http://localhost:8080/api/usuarios";

  // Valores EXACTOS según tu <select id="rol_usuario"> (value sin acentos)
  const rolNombreAId = {
    "Administrador": 1,
    "Tecnico": 2,
    "Logistica": 3,
    "Visitante": 4
  };
  // Para mostrar y para setear el <select>. Usa los mismos values del HTML.
  const rolIdAValue = {
    1: "Administrador",
    2: "Tecnico",
    3: "Logistica",
    4: "Visitante"
  };

  let usuariosInicializado = false;

  function initUsuarios(root) {
    if (usuariosInicializado) return;
    usuariosInicializado = true;

    const form = root.querySelector(".form-usuario");
    const tbody = root.querySelector(".tabla-usuarios tbody");
    const btnCrear = form?.querySelector(".btn-crear");
    if (!form || !tbody || !btnCrear) return;

    // ===== Listar =====
    async function listar() {
      tbody.innerHTML = "";
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const frag = document.createDocumentFragment();
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
            <td class="acciones">
              <button class="btn-editar" data-id="${id}">Editar</button>
              <button class="btn-eliminar" data-id="${id}">Eliminar</button>
            </td>
          `;
          frag.appendChild(tr);
        });
        tbody.appendChild(frag);
      } catch (e) {
        console.error("Error listando usuarios", e);
        tbody.innerHTML = `<tr><td colspan="5">Error cargando usuarios</td></tr>`;
      }
    }

    let editId = null;

    // ===== Crear / Actualizar =====
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = form.querySelector("#nombre_usuario").value.trim();
      const correo = form.querySelector("#correo_usuario").value.trim();
      const clave  = form.querySelector("#clave_usuario").value;
      const rolTxt = form.querySelector("#rol_usuario").value; // <-- ID CORRECTO
      const idRol  = rolNombreAId[rolTxt] ?? 4;

      // JSON en camelCase para Spring (tu modelo Usuario.java)
      const payload = { nombreUsuario: nombre, correoUsuario: correo, claveUsuario: clave, idRol };

      try {
        const url = editId ? `${API_URL}/${editId}` : API_URL;
        const method = editId ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.status === 409) {
          alert("El correo ya existe. Prueba con otro.");
          return;
        }
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

    // ===== Editar / Eliminar =====
    tbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const id = parseInt(btn.dataset.id, 10);

      if (btn.classList.contains("btn-eliminar")) {
        if (!confirm("¿Eliminar este usuario?")) return;
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (res.ok) listar(); else alert("No se pudo eliminar");
      }

      if (btn.classList.contains("btn-editar")) {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) { alert("No se pudo obtener el usuario"); return; }
        const u = await res.json();

        form.querySelector("#nombre_usuario").value = u.nombreUsuario ?? u.nombre_usuario ?? "";
        form.querySelector("#correo_usuario").value = u.correoUsuario ?? u.correo_usuario ?? "";
        form.querySelector("#clave_usuario").value  = u.claveUsuario  ?? u.clave_usuario  ?? "";

        const idRol = u.idRol ?? u.id_rol ?? 4;
        form.querySelector("#rol_usuario").value = rolIdAValue[idRol] || "Visitante"; // <-- ID CORRECTO

        editId = id;
        btnCrear.textContent = "Actualizar Usuario";
      }
    });

    listar();
  }

  // ===== Auto-init =====
  const panels = document.getElementById("panels");
  if (panels) {
    const seccion = panels.querySelector(".usuarios");
    if (seccion) initUsuarios(panels);

    const mo = new MutationObserver(() => {
      const s = panels.querySelector(".usuarios");
      if (s) initUsuarios(panels);
    });
    mo.observe(panels, { childList: true, subtree: true });
  }
})();