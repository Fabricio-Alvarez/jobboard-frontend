<template>
  <ion-page>
    <ion-content>
      <div class="historial-container">
        <h2 class="section-title">Empleos Disponibles</h2>

        <div v-if="loading" class="loading">
          Cargando ofertas...
        </div>

        <div v-else-if="ofertas.length === 0" class="no-ofertas">
          <p>Por este momento no hay ofertas de empleo disponibles.</p>
        </div>

        <div v-else class="ofertas-list">
          <div v-for="oferta in ofertas" :key="oferta.id" class="oferta-card">
            <h3>{{ oferta.job_title }}</h3>
            <p><strong>Descripción:</strong> {{ oferta.description }}</p>
            <p><strong>Ubicación:</strong> {{ oferta.location }}</p>
            <p><strong>Salario:</strong> ₡{{ oferta.salary.toLocaleString() }}</p>
            <p><strong>Categoría:</strong> {{ oferta.category }}</p>

            <div class="botones">
              <ion-button
                color="success"
                :disabled="oferta.postulado"
                @click="postular(oferta.id)"
              >
                Postularme
              </ion-button>

              <ion-button
                color="danger"
                :disabled="!oferta.postulado"
                @click="quitarPostulacion(oferta.id)"
              >
                Quitar Postulación
              </ion-button>
            </div>
          </div>
        </div>

        <ion-button expand="block" color="medium" class="regresar-btn" @click="goBack">
          ← Regresar
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IonPage, IonContent, IonButton, onIonViewWillEnter } from '@ionic/vue'
import apiClient from '@/services/apiClient'

export default defineComponent({
  name: 'HistorialEmpleos',
  components: { IonPage, IonContent, IonButton },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const ofertas = ref<any[]>([])
    const loading = ref(true)

    // Leer filtros desde query params
    const categoriaFilter = ref<string>(route.query.categoria as string || '')
    const lugarFilter = ref<string>(route.query.lugar as string || '')

    const obtenerOfertas = async () => {
      loading.value = true
      try {
        // Llama al endpoint del backend, pasando filtros como query params
        // Backend debe filtrar según estos parámetros:
        // GET /job-offers-with-application-status?categoria=<categoria>&lugar=<lugar>
        const params: any = {}
        if (categoriaFilter.value) params.categoria = categoriaFilter.value
        if (lugarFilter.value) params.lugar = lugarFilter.value

        const resp = await apiClient.get('/job-offers-with-application-status', { params })
        // El backend debería devolver algo tipo:
        // [{ id, job_title, description, location, salary, category, postulado: true/false }, ...]
        ofertas.value = resp.data
      } catch (e) {
        console.error(e)
        ofertas.value = []
      } finally {
        loading.value = false
      }
    }

    const postular = async (id: number) => {
      try {
        await apiClient.post('/job-applications', { job_offer_id: id })
        const idx = ofertas.value.findIndex(o => o.id === id)
        if (idx >= 0) ofertas.value[idx].postulado = true
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error al postularse.')
      }
    }

    const quitarPostulacion = async (id: number) => {
      try {
        await apiClient.delete(`/job-applications/${id}`)
        const idx = ofertas.value.findIndex(o => o.id === id)
        if (idx >= 0) ofertas.value[idx].postulado = false
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error al quitar postulación.')
      }
    }

    const goBack = () => {
      router.back()
    }

    onIonViewWillEnter(() => {
      obtenerOfertas()
    })

    return {
      ofertas,
      loading,
      postular,
      quitarPostulacion,
      goBack,
      categoriaFilter,
      lugarFilter,
    }
  }
})
</script>

<style scoped>
.historial-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.loading,
.no-ofertas {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #7f8c8d;
}

.ofertas-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.oferta-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.07);
  padding: 1.2rem 1.5rem;
}

.oferta-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #2980b9;
}

.oferta-card p {
  margin: 0.3rem 0;
  font-size: 1rem;
}

.botones {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.regresar-btn {
  margin-top: 2rem;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
}
</style>