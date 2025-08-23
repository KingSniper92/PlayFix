
document.addEventListener('DOMContentLoaded', () => {
  const navList = document.getElementById('navList');
  const panels = document.getElementById('panels');
  const pageTitle = document.getElementById('pageTitle');
  const sidebar = document.getElementById('sidebar');
  const btnToggle = document.getElementById('btnToggle');
  const btnToggleTop = document.getElementById('btnToggleTop');
  const logoutBtn = document.querySelector('.btn-logout'); // 🔹 botón logout
  const userBubble = document.querySelector('.user-bubble'); // 🔹 burbuja usuario

  // =============================
  // 🔒 Gestión de sesión
  // =============================
  const usuario = localStorage.getItem("usuarioLogueado");
  if (!usuario) {
    // Si no hay sesión, lo regresamos al login
    window.location.href = "index.html";
    return;
  }

  // 👤 Mostrar el nombre/usuario en la burbuja
  const datosUsuario = JSON.parse(usuario);
  if (userBubble) {
    userBubble.textContent = datosUsuario.nombre
      ? datosUsuario.nombre.charAt(0).toUpperCase()
      : "PF";
  }

  // 🚪 Cerrar sesión
  logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    sessionStorage.setItem("logoutMessage", "Sesión cerrada correctamente ✅");
    window.location.href = "index.html";
  });



  
  // Mapa de módulos -> archivo parcial y título
  const modules = {
    dashboard: { title: 'Dashboard', file: './partials/dashboard.html' },
    usuarios: { title: 'Usuarios', file: './partials/usuarios.html' },
    clientes: { title: 'Clientes', file: './partials/clientes.html' },
    fabricantes: { title: 'Fabricantes', file: './partials/fabricantes.html' },
    referencias: { title: 'Referencias', file: './partials/referencias.html' },
    inventario: { title: 'Inventario', file: './partials/inventario.html' },
    ordenes: { title: 'Órdenes', file: './partials/ordenes.html' },
    reportes: { title: 'Reportes', file: './partials/reportes.html' },
  };

  // ---- helpers ----
  function setActiveNav(moduleId) {
    navList.querySelectorAll('.nav-item').forEach(li => {
      if (li.getAttribute('data-module') === moduleId) {
        li.classList.add('is-active');
        li.setAttribute('aria-current', 'page');
      } else {
        li.classList.remove('is-active');
        li.removeAttribute('aria-current');
      }
    });
  }

  function showLoader() {
    panels.innerHTML = `
      <div class="card">
        <p role="status" aria-live="polite">Cargando...</p>
      </div>`;
  }

  async function loadModule(moduleId, options = { push: true }) {
    const mod = modules[moduleId] || modules.dashboard;
    setActiveNav(moduleId);
    pageTitle.textContent = mod.title;
    document.title = `${mod.title} — PlayFix`; // para pestañas del navegador

    showLoader();

    try {
      // Fetch HTML parcial
      const res = await fetch(mod.file, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // Inserta contenido
      panels.innerHTML = html;

      // Accesibilidad: mover el foco al título del contenido
      const firstHeading = panels.querySelector('h1, h2, h3');
      if (firstHeading) {
        firstHeading.setAttribute('tabindex', '-1');
        firstHeading.focus();
      }

      // Guardar en historial
      if (options.push) {
        const url = new URL(window.location);
        url.hash = moduleId; // ejemplo simple con hash
        history.pushState({ module: moduleId }, mod.title, url.toString());
      }

      // Guarda preferencia
      localStorage.setItem('playfix-last', moduleId);
    } catch (err) {
      panels.innerHTML = `
        <div class="card">
          <h3>Error</h3>
          <p>No se pudo cargar ${mod.title}. (${err.message})</p>
        </div>`;
      console.error(err);
    }
  }

  //  eventos 
  navList.addEventListener('click', (e) => {
    const li = e.target.closest('.nav-item');
    if (!li) return;
    const moduleId = li.getAttribute('data-module');
    loadModule(moduleId);
    // si mobile, cerrar sidebar
    if (window.matchMedia('(max-width:700px)').matches) sidebar.classList.remove('open');
  });

  // teclado
  navList.addEventListener('keydown', (e) => {
    const focusables = Array.from(navList.querySelectorAll('.nav-item'));
    const idx = focusables.indexOf(document.activeElement);
    if (e.key === 'Enter' || e.key === ' ') {
      document.activeElement.click();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      focusables[Math.min(focusables.length-1, idx+1)].focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      focusables[Math.max(0, idx-1)].focus();
      e.preventDefault();
    }
  });

  btnToggle && btnToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  btnToggleTop && btnToggleTop.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Manejo back/forward
  window.addEventListener('popstate', (e) => {
    const moduleId = (e.state && e.state.module) || window.location.hash.replace('#','') || localStorage.getItem('playfix-last') || 'dashboard';
    loadModule(moduleId, { push: false });
  });

  // init (hash -> localStorage -> dashboard)
  const initModule = window.location.hash.replace('#','') || localStorage.getItem('playfix-last') || 'dashboard';
  loadModule(initModule, { push: false });
});

