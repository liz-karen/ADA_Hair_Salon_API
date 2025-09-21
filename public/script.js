// URL de tu API backend (ajústala si lo subes a Render)
const API_URL = "http://localhost:3000/api/reservations";

// Referencias a elementos del DOM
const form = document.getElementById("formReservation");
const list = document.getElementById("list");

// Evento para enviar nueva reserva
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevenir que se recargue la página

  // Tomar valores del formulario
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // Validar datos simples antes de enviar
  if (!name || !email || !date || !time) {
    alert("⚠️ Completa todos los campos");
    return;
  }

  // Crear objeto de la reserva
  const newReservation = { name, email, date, time };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReservation)
    });

    if (response.ok) {
      alert("✅ Reserva creada con éxito!");
      form.reset();
      loadReservations(); // Recargar lista
    } else {
      const errorData = await response.json();
      alert("❌ Error: " + (errorData.error || "No se pudo crear la reserva"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ No se pudo conectar con la API");
  }
});

// Función para mostrar reservas en pantalla
async function loadReservations() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("No se pudieron obtener las reservas");

    const reservations = await response.json();

    // Limpiar lista antes de renderizar
    list.innerHTML = "";

    // Si no hay reservas, mostrar mensaje
    if (reservations.length === 0) {
      list.innerHTML = "<li>No hay reservas todavía</li>";
      return;
    }

    // Crear elementos <li> para cada reserva
    reservations.forEach((res) => {
      const li = document.createElement("li");
      li.textContent = `${res.name} - ${res.date} ${res.time}`;
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    list.innerHTML = "<li>Error al cargar reservas</li>";
  }
}

// Cargar reservas al iniciar la página
loadReservations();
