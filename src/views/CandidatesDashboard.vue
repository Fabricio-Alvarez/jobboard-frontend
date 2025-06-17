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

      <button @click="buscarEmpleo" class="btn-ver-empleos">
        Buscar Empleos
      </button>

      <!-- Mostrar los empleos encontrados -->
      <div v-if="empleos.length">
        <h3>Empleos encontrados</h3>
        <div v-for="empleo in empleos" :key="empleo.id">
          <p>{{ empleo.job_title }} - {{ empleo.location }}</p>
        </div>
      </div>

      <!-- Botón para ver todos los empleos -->
      <div class="ver-empleos-container">
        <button @click="goToHistorialEmpleos" class="btn-ver-empleos">
          Ver todos los empleos
        </button>
      </div>

      <h3 class="subtitle">Últimas Búsquedas</h3>
      <div class="recent-searches">
        <div class="search-item">
          <span class="emoji">🕒</span> Sin búsquedas recientes
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue'
import apiClient from '@/services/apiClient'

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
    const filteredCategorias = ref([
      'Recepcionista',
      'Contador',
      'Asistente administrativo',
      'Ingeniero industrial',
      'Técnico en electrónica',
      'Desarrollador web',
      'Secretaria',
      'Diseñador gráfico',
      'Operario de producción',
      'Agente de servicio al cliente',
      'Auxiliar contable',
      'Mecánico automotriz',
      'Cocinero',
      'Guardia de seguridad',
      'Profesor de inglés',
      'Auxiliar de bodega'
    ])
    const showCategoriaOptions = ref(false)
    const empleos = ref<any[]>([])

    const filterCategorias = () => {
      const search = categoriaInput.value.toLowerCase()
      filteredCategorias.value = filteredCategorias.value.filter((c) =>
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

    // Buscar empleos por categoría y ubicación
    const buscarEmpleo = async () => {
      if (!selectedLocation.value || !categoriaInput.value) {
        alert('Por favor selecciona una ubicación y categoría')
        return
      }

      try {
        const response = await apiClient.get('/job-offers/search', {
          params: {
            category: categoriaInput.value,
            location: selectedLocation.value
          }
        })

        empleos.value = response.data
      } catch (error) {
        console.error('Error al buscar empleos:', error)
      }
    }

    const logout = () => {
      router.push('/login')
    }

    const goToSomos = () => {
      router.push('/somos')
    }

    const goToCandidateProfile = () => {
      router.push('/candidates-profile')
    }

    const goToHistorialEmpleos = () => {
      router.push('/historial-empleos')
    }

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
      empleos
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

.subtitle {
  margin-top: 2rem;
  color: #1a73e8;
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

.ver-empleos-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
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