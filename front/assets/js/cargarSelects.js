(() => {
  const apiFabricantes = "http://localhost:8080/api/fabricantes";
  const apiReferencias = "http://localhost:8080/api/referencias";

  const selectFabricante = document.querySelector("#idFabricante");
  const selectReferencia = document.querySelector("#idReferencia");

  // ====================
  // Cargar fabricantes
  // ====================
  const cargarFabricantes = async () => {
    try {
      const res = await fetch(apiFabricantes);
      if (!res.ok) throw new Error("Error al cargar fabricantes");
      const data = await res.json();

      selectFabricante.innerHTML = `<option value="">-- Selecciona fabricante --</option>`;
      data.forEach(fab => {
        const option = document.createElement("option");
        option.value = fab.idFabricante;       // el ID
        option.textContent = fab.nombreFabricante; // el nombre
        selectFabricante.appendChild(option);
      });
    } catch (error) {
      console.error("⚠️ Error cargando fabricantes:", error);
    }
  };

  // ====================
  // Cargar referencias
  // ====================
  const cargarReferencias = async () => {
    try {
      const res = await fetch(apiReferencias);
      if (!res.ok) throw new Error("Error al cargar referencias");
      const data = await res.json();

      selectReferencia.innerHTML = `<option value="">-- Selecciona referencia --</option>`;
      data.forEach(ref => {
        const option = document.createElement("option");
        option.value = ref.id_referencia;              // el ID
        option.textContent = ref.referencia_dispositivo; // el nombre
        selectReferencia.appendChild(option);
      });
    } catch (error) {
      console.error("⚠️ Error cargando referencias:", error);
    }
  };

  // ====================
  // Ejecutar al inicio
  // ====================
  cargarFabricantes();
  cargarReferencias();
})();