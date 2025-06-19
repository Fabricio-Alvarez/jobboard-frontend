<template>
  <ion-page>
    <ion-content>
      <div class="dashboard-container">
        <div class="top-bar">
          <img src="@/assets/logo.png" alt="Logo" class="logo" />
          <button @click="logout" class="logout-button">
            🔓 Cerrar sesión
          </button>
        </div>

        <div class="table-container">
          <h2 class="section-title">Ofertas de empleos disponibles</h2>

          <div v-if="loading" class="loading">
            Cargando ofertas de empleos…
          </div>
          <div v-else-if="ofertas.length === 0" class="no-ofertas">
            Aún no hay empleos disponibles.
          </div>
          <div v-else-if="ofertasFiltradas.length === 0" class="no-ofertas">
            No se encontraron empleos que coincidan con los filtros.
          </div>

          <div v-else class="table-responsive">
            <table class="ofertas-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Ubicación</th>
                  <th>Salario</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="oferta in ofertasFiltradas" :key="oferta.id">
                  <td>{{ oferta.job_title }}</td>
                  <td>{{ oferta.description }}</td>
                  <td>{{ oferta.location }}</td>
                  <td>₡{{ oferta.salary.toLocaleString() }}</td>
                  <td>{{ oferta.category }}</td>
                  <td class="acciones">
                    <button
                      class="btn-apply"
                      :disabled="loadingPost[oferta.id]"
                      @click="askForMessage(oferta.id)"
                    >
                      {{ loadingPost[oferta.id] ? 'Enviando…' : 'Postularme' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <ion-toast
          :is-open="showToast"
          :message="toastMessage"
          duration="2000"
          @did-dismiss="showToast = false"
        />

        <ion-button
          expand="block"
          color="medium"
          class="regresar-btn"
          @click="goBack"
        >
          ← Regresar
        </ion-button>

        <footer class="footer">
          <p>Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR</p>
        </footer>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonToast,
  alertController
} from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '@/services/apiClient'

export default defineComponent({
  name: 'AvailableJobs',
  components: { IonPage, IonContent, IonButton, IonToast },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const ofertas = ref<any[]>([])
    const loading = ref(true)
    const loadingPost = reactive<Record<number, boolean>>({})
    const showToast = ref(false)
    const toastMessage = ref('')
    const selectedOfferId = ref<number | null>(null)


    const filtroLocation = ref<string | null>(
      (route.query.location as string) || null
    )
    const filtroCategory = ref<string | null>(
      (route.query.category as string) || null
    )

    const fetchOffers = async () => {
      loading.value = true
      try {
        const { data } = await apiClient.get('/job-offers/all')
        ofertas.value = data
      } catch {
        ofertas.value = []
      } finally {
        loading.value = false
      }
    }


    const ofertasFiltradas = computed(() => {
      return ofertas.value.filter((oferta) => {
        const matchLocation = filtroLocation.value
          ? oferta.location === filtroLocation.value
          : true
        const matchCategory = filtroCategory.value
          ? oferta.category === filtroCategory.value
          : true
        return matchLocation && matchCategory
      })
    })


    watch(
      () => route.query,
      (newQuery) => {
        filtroLocation.value = (newQuery.location as string) || null
        filtroCategory.value = (newQuery.category as string) || null
      }
    )

    const askForMessage = async (offerId: number) => {
      selectedOfferId.value = offerId
      const alert = await alertController.create({
        header: 'Mensaje al reclutador',
        inputs: [
          {
            name: 'message',
            type: 'textarea',
            placeholder: 'Explica por qué eres un buen candidato…'
          }
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Enviar',
            handler: (data: { message: string }) => {
              if (!data.message?.trim()) return false
              sendApplication(data.message.trim())
            }
          }
        ]
      })
      await alert.present()
    }

    const sendApplication = async (message: string) => {
      const id = selectedOfferId.value!
      loadingPost[id] = true
      try {
        await apiClient.post('/job-applications', {
          job_offer_id: id,
          message
        })
        toastMessage.value = '¡Postulación enviada con éxito!'
      } catch (e: any) {
        toastMessage.value =
          e.response?.status === 409
            ? 'Ya te habías postulado a esta oferta'
            : 'Error al postularse. Intenta de nuevo más tarde.'
      } finally {
        showToast.value = true
        loadingPost[id] = false
      }
    }

    const logout = () => {
      localStorage.removeItem('auth_token')
      router.replace('/login')
    }
    const goBack = () => router.push('/dashboard-candidatos')

    onMounted(fetchOffers)

    return {
      ofertas,
      loading,
      loadingPost,
      showToast,
      toastMessage,
      askForMessage,
      logout,
      goBack,
      ofertasFiltradas
    }
  }
})
</script>

<style scoped>

.dashboard-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  height: 50px;
}

.logout-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.logout-button:hover {
  background: #c0392b;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ecf0f1;
}

.loading,
.no-ofertas {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #7f8c8d;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.ofertas-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

.ofertas-table th {
  background-color: #3498db;
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.ofertas-table td {
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.ofertas-table tr:hover {
  background-color: #f8fafc;
}

.acciones {
  display: flex;
  align-items: center;
}

.btn-apply {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-apply:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.btn-apply:hover:not(:disabled) {
  background: #27ae60;
}

.regresar-btn {
  margin: 1rem auto 2rem;
  max-width: 200px;
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
  border-top: 1px solid #ecf0f1;
}
</style>
