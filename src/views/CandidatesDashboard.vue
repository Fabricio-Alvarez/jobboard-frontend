<template>
  <ion-page>
    <div class="home-container">
      <div class="top-bar">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <button @click="logout" class="logout-button">
          <span>🔓</span> Cerrar sesión
        </button>
      </div>

      <h2>Buscar Empleo</h2>
      <ion-item class="form-group">
        <ion-label class="icon-label" position="stacked">
          <span class="emoji">📍</span> Lugar
        </ion-label>
        <ion-select
          interface="action-sheet"
          placeholder="Selecciona un lugar"
          v-model="selectedLocation"
        >
          <ion-select-option value="San José">San José</ion-select-option>
          <ion-select-option value="Alajuela">Alajuela</ion-select-option>
          <ion-select-option value="Heredia">Heredia</ion-select-option>
          <ion-select-option value="Cartago">Cartago</ion-select-option>
          <ion-select-option value="Guanacaste">Guanacaste</ion-select-option>
          <ion-select-option value="Puntarenas">Puntarenas</ion-select-option>
          <ion-select-option value="Limón">Limón</ion-select-option>
        </ion-select>
      </ion-item>

      <div class="form-group">
        <label class="icon-label">
          <span class="emoji">💼</span> Categoría
        </label>
        <div class="autocomplete-container">
          <input
            type="text"
            v-model="categoriaInput"
            @input="filterCategorias"
            @focus="showCategoriaOptions = true"
            @blur="hideCategoriaOptions"
            class="autocomplete-input"
            placeholder="Escribe o selecciona una categoría"
          />
          <div
            v-if="showCategoriaOptions && filteredCategorias.length"
            class="autocomplete-list"
          >
            <div
              class="autocomplete-item"
              v-for="(categoria, index) in filteredCategorias"
              :key="index"
              @mousedown.prevent="selectCategoria(categoria)"
            >
              {{ categoria }}
            </div>
          </div>
        </div>
      </div>

      <div class="buttons-container">
        <button @click="buscarEmpleo" class="btn-ver-empleos">
          Buscar Empleos
        </button>
        <button @click="goToHistorialEmpleos" class="btn-ver-empleos">
          Ver todos los empleos
        </button>
      </div>

      <h3 class="subtitle">Últimas Búsquedas</h3>
      <div class="recent-searches">
        <div
          class="search-item"
          v-for="(busqueda, index) in ultimasBusquedas.filter(b => b.lugar && b.categoria)"
          :key="index"
        >
          <span class="emoji">🕒</span>
          <span>{{ busqueda.lugar }} - {{ busqueda.categoria }}</span>
        </div>

        <div v-if="ultimasBusquedas.filter(b => b.lugar && b.categoria).length === 0" class="no-searches-box">
          <span class="emoji-large">🔍</span>
          <p class="no-searches-text">Última búsqueda</p>
          <p class="last-search-values">
            <span class="value-box">{{ selectedLocation || 'No seleccionado' }}</span>
            <span class="separator">|</span>
            <span class="value-box">{{ categoriaInput || 'No seleccionado' }}</span>
          </p>
        </div>
      </div>

      <div class="info-section">
        <h3>Potencia tu desarrollo profesional</h3>
        <p>
          Consejos, guías y recursos para encontrar antes el empleo de tus
          sueños que encaje contigo. Mira para más información
        </p>
        <img
          src="@/assets/imagenmujer.png"
          alt="Desarrollo"
          class="info-img"
        />
        <p>
          Copyright 2025 - 2025<br />
          Para más información consulte el siguiente enlace
        </p>

        <div class="info-buttons">
          <button @click="goToSomos" class="btn-somos">Quienes Somos</button>
          <button @click="goToCandidateProfile" class="btn-volver">Ver Perfil</button>
        </div>
      </div>
    </div>
    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue'

export default defineComponent({
  name: 'Home',
  components: {
    IonPage,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption
  },
  setup() {
    const router = useRouter()

    const selectedLocation = ref<string | null>(null)
    const categoriaInput = ref('')
    const categorias = [
      'Recepcionista', 'Contador', 'Asistente administrativo',
      'Ingeniero industrial', 'Técnico en electrónica', 'Desarrollador web',
      'Secretaria', 'Diseñador gráfico', 'Operario de producción',
      'Agente de servicio al cliente', 'Auxiliar contable',
      'Mecánico automotriz', 'Cocinero', 'Guardia de seguridad',
      'Profesor de inglés', 'Auxiliar de bodega'
    ]
    const filteredCategorias = ref([...categorias])
    const showCategoriaOptions = ref(false)
    const ultimasBusquedas = ref<{ lugar: string | null, categoria: string | null }[]>([])

    // Cargar últimas búsquedas de localStorage al montar componente
    onMounted(() => {
      const storedBusquedas = localStorage.getItem('ultimasBusquedas')
      if (storedBusquedas) {
        try {
          ultimasBusquedas.value = JSON.parse(storedBusquedas)
        } catch (e) {
          ultimasBusquedas.value = []
        }
      }
    })

    const filterCategorias = () => {
      const search = categoriaInput.value.toLowerCase()
      filteredCategorias.value = categorias.filter(c =>
        c.toLowerCase().includes(search)
      )
    }

    const selectCategoria = (categoria: string) => {
      categoriaInput.value = categoria
      showCategoriaOptions.value = false
    }

    const hideCategoriaOptions = () => {
      setTimeout(() => {
        showCategoriaOptions.value = false
      }, 100)
    }

    const buscarEmpleo = () => {
      if (!selectedLocation.value || !categoriaInput.value) {
        alert('Por favor selecciona una ubicación y categoría')
        return
      }

      ultimasBusquedas.value.unshift({
        lugar: selectedLocation.value,
        categoria: categoriaInput.value
      })
      if (ultimasBusquedas.value.length > 3) {
        ultimasBusquedas.value.pop()
      }

      // Guardar en localStorage para persistencia
      localStorage.setItem('ultimasBusquedas', JSON.stringify(ultimasBusquedas.value))

      router.push({
        path: '/historial-empleos',
        query: {
          location: selectedLocation.value,
          category: categoriaInput.value
        }
      })
    }

    const logout = () => router.push('/login')
    const goToSomos = () => router.push('/somos')
    const goToCandidateProfile = () => router.push('/candidates-profile')
    const goToHistorialEmpleos = () => router.push('/historial-empleos')

    return {
      logout,
      goToSomos,
      goToCandidateProfile,
      goToHistorialEmpleos,
      selectedLocation,
      categoriaInput,
      filteredCategorias,
      filterCategorias,
      selectCategoria,
      showCategoriaOptions,
      hideCategoriaOptions,
      buscarEmpleo,
      ultimasBusquedas
    }
  }
})
</script>

<style scoped>
.home-container {
  padding: 1.5rem;
  max-width: 480px;
  margin: 0 auto;
  font-family: sans-serif;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: calc(100vh - 60px);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  width: 60px;
}

.logout-button {
  background: none;
  color: #e91e63;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

h2 {
  margin: 1.5rem 0 1rem;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.icon-label {
  font-weight: bold;
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.emoji {
  margin-right: 0.5rem;
}

.autocomplete-container {
  position: relative;
}

.autocomplete-input {
  width: 100%;
  padding: 0.4rem;
  font-size: 0.9rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.autocomplete-list {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 160px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.autocomplete-item {
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  background-color: #ffffff;
  color: #000000;
}

.autocomplete-item:hover {
  background-color: #f0f0f0;
}

.buttons-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: flex-start;
}

.btn-ver-empleos {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.85rem;
  flex: 1;
  max-width: 180px;
}

.subtitle {
  margin-top: 2rem;
  color: #1a73e8;
}

.no-searches-box {
  border: 2px dashed #1a73e8;
  background-color: #e8f0fe;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  color: #1a73e8;
  font-weight: 600;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.no-searches-box .emoji-large {
  font-size: 2.5rem;
}

.no-searches-text {
  font-size: 1.1rem;
  margin: 0;
}

.last-search-values {
  display: flex;
  gap: 0.5rem;
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.value-box {
  background-color: #1a73e8;
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 9999px;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(26, 115, 232, 0.4);
}

.separator {
  align-self: center;
  color: #555;
  font-weight: 400;
  user-select: none;
}

.recent-searches {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.search-item {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-section {
  text-align: center;
  margin-top: 2rem;
  padding-bottom: 3rem;
}

.info-img {
  width: 100%;
  max-width: 250px;
  margin: 1rem auto;
  display: block;
}

.btn-somos {
  background-color: #ddd;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}

.footer {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  padding: 1rem 0;
  border-top: 1px solid #ddd;
  background-color: #f8f8f8;
}

.info-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-volver {
  background-color: #ccc;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  color: black;
}
</style>