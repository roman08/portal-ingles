// Registro del modo sin internet y aviso para instalar la app (solo en la versión de Netlify).
(() => {
  if ("serviceWorker" in navigator) {
    addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  const instalada = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (instalada) return;
  let cerrado = false;
  try { cerrado = localStorage.getItem("pwa-aviso-cerrado") === "1"; } catch {}
  if (cerrado) return;

  function aviso(html, alInstalar) {
    document.querySelector(".pwa-aviso")?.remove();
    const b = document.createElement("div");
    b.className = "pwa-aviso";
    b.innerHTML = html;
    document.body.append(b);
    b.querySelector("[data-cerrar]").onclick = () => {
      b.remove();
      try { localStorage.setItem("pwa-aviso-cerrado", "1"); } catch {}
    };
    const instalar = b.querySelector("[data-instalar]");
    if (instalar) instalar.onclick = alInstalar;
  }

  // Android y computadora: el navegador ofrece instalar.
  addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    const solicitud = e;
    aviso(
      `<span>📲 Instala la app para estudiar aunque no tengas internet.</span>
       <span class="pwa-acc"><button class="btn btn-chico" data-cerrar>Ahora no</button><button class="btn btn-chico btn-primario" data-instalar>Instalar</button></span>`,
      async () => { solicitud.prompt(); await solicitud.userChoice; document.querySelector(".pwa-aviso")?.remove(); }
    );
  });
  addEventListener("appinstalled", () => document.querySelector(".pwa-aviso")?.remove());

  // iPhone y iPad: se instala desde el menú Compartir de Safari.
  const esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (esIOS) {
    addEventListener("load", () => aviso(
      `<span>📲 Para usarla sin internet, en Safari toca <b>Compartir</b> <span aria-hidden="true">⬆️</span> y luego <b>Agregar a inicio</b>.</span>
       <span class="pwa-acc"><button class="btn btn-chico" data-cerrar>Entendido</button></span>`
    ));
  }
})();
