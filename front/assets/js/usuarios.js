document.addEventListener("DOMContentLoaded", () => {
  const formUsuario = document.getElementById("formUsuario");
  const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");

  // TODO: Aquí luego harás un fetch GET a tu backend
  function cargarUsuarios() {
    tablaUsuarios.innerHTML = ""; // limpia tabla
    // Ejemplo de estructura cuando tengas datos del backend:
    /*
    usuarios.forEach(usuario => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${usuario.id_usuario}</td>
        <td>${usuario.nombre_usuario}</td>
        <td>${usuario.mail_usuario}</td>
        <td>${usuario.rol}</td>
        <td>
          <button onclick="editarUsuario(${usuario.id_usuario})">Editar</button>
          <button onclick="borrarUsuario(${usuario.id_usuario})">Borrar</button>
        </td>
      `;
      tablaUsuarios.appendChild(fila);
    });
    */
  }

  // Crear usuario
  formUsuario.addEventListener("submit", (e) => {
    e.preventDefault();
    // Aquí luego harás un fetch POST al backend
    console.log("Enviar datos:", {
      nombre: formUsuario.nombre.value,
      correo: formUsuario.correo.value,
      clave: formUsuario.clave.value,
      rol: formUsuario.rol.value
    });
    formUsuario.reset();
  });

  // Funciones para acciones (placeholder por ahora)
  window.editarUsuario = function (id) {
    console.log("Editar usuario ID:", id);
  };

  window.borrarUsuario = function (id) {
    console.log("Borrar usuario ID:", id);
  };

  cargarUsuarios();
});