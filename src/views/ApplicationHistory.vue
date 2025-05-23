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
          <h2 class="section-title">Historial de postulaciones realizadas</h2>

          <div v-if="loading" class="loading">
            Cargando postulaciones...
          </div>
          <div v-else-if="postulaciones.length === 0" class="no-ofertas">
            No tienes postulaciones activas.
          </div>

          <table v-else class="ofertas-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Ubicación</th>
                <th>Salario</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="postulacion in postulaciones" :key="postulacion.id">
                <td>{{ postulacion.job_offer.job_title }}</td>
                <td>{{ postulacion.job_offer.description }}</td>
                <td>{{ postulacion.job_offer.location }}</td>
                <td>₡{{ postulacion.job_offer.salary.toLocaleString() }}</td>
                <td>{{ postulacion.job_offer.category }}</td>
                <td>{{ postulacion.status }}</td>
                <td class="acciones">
                  <button @click="confirmarEliminacion(postulacion.id)" class="btn-delete" title="Eliminar Postulación">
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="mostrarModal" class="modal-backdrop">
          <div class="modal-content confirmation-modal">
            <div class="modal-header">
              <i class="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Confirmar Eliminación</h3>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro que deseas eliminar esta postulación?</p>
              <p class="warning-text"><i class="fas fa-exclamation-circle"></i> Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-actions">
              <button @click="cancelarEliminacion" class="btn btn-cancel">
                Cancelar
              </button>
              <button @click="eliminarPostulacion" class="btn btn-delete">
                Eliminar
              </button>
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
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonButton, onIonViewWillEnter } from '@ionic/vue'
import apiClient from '@/services/apiClient'

export default defineComponent({
  name: 'MisPostulaciones',
  components: { IonPage, IonContent, IonButton },
  setup() {
    const router = useRouter()
    const postulaciones = ref<any[]>([])
    const loading = ref(true)
    const userRole = ref<number|null>(null)

    const mostrarModal = ref(false)
    const ofertaAEliminar = ref<number|null>(null)

    const obtenerPostulaciones = async () => {
      loading.value = true
      try {
        const resp = await apiClient.get('/job-applications')
        postulaciones.value = resp.data
      } catch (e) {
        console.error(e)
      } finally {
        loading.value = false
      }
    }

    const validarAcceso = async () => {
      try {
        const resp = await apiClient.get('/user')
        userRole.value = resp.data.role
        
        if (userRole.value === 1) {
           await obtenerPostulaciones()
        } else {
          router.replace('/login')
        }
      } catch {
        router.replace('/login')
      }
    }

    onIonViewWillEnter(() => {
      if (userRole.value === 1) {
        obtenerPostulaciones()
      }
    })

    validarAcceso()

    const logout = () => {
      localStorage.removeItem('auth_token')
      router.replace('/login')
    }

    const confirmarEliminacion = (id: number) => {
      ofertaAEliminar.value = id
      mostrarModal.value = true
    }

    const cancelarEliminacion = () => {
      mostrarModal.value = false
      ofertaAEliminar.value = null
    }

    const eliminarPostulacion = async () => {
      if (!ofertaAEliminar.value) return
      
      try {
        await apiClient.delete(`/job-applications/${ofertaAEliminar.value}`)
        postulaciones.value = postulaciones.value.filter(p => p.id !== ofertaAEliminar.value)
        mostrarModal.value = false
        alert('Postulación eliminada correctamente')
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error al eliminar la postulación')
      } finally {
        cancelarEliminacion()
      }
    }

    const goBack = () => {
      router.push('/candidates-profile')
    }

    return {
      postulaciones,
      loading,
      mostrarModal,
      ofertaAEliminar,
      logout,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarPostulacion,
      goBack
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s;
}

.logout-button:hover {
  background: #c0392b;
}

.section-title {
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #ecf0f1;
}

.table-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.loading, .no-ofertas {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #7f8c8d;
}

.ofertas-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  vertical-align: top;
}

.ofertas-table tr:last-child td {
  border-bottom: none;
}

.ofertas-table tr:hover {
  background-color: #f8fafc;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  background: #c0392b;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirmation-modal {
  max-width: 450px;
  text-align: center;
}

.confirmation-modal .modal-header {
  background: #f8d7da;
  color: #721c24;
  flex-direction: column;
  padding: 1.5rem;
  position: relative;
}

.confirmation-modal .modal-header h3 {
  margin-top: 0.5rem;
  font-size: 1.5rem;
}

.confirmation-modal .warning-icon {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 0.5rem;
}

.confirmation-modal .modal-body {
  padding: 1.5rem;
}

.confirmation-modal p {
  font-size: 1.1rem;
  color: #343a40;
  margin-bottom: 1rem;
}

.confirmation-modal .warning-text {
  color: #dc3545;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.confirmation-modal .warning-text i {
  font-size: 1.2rem;
}

.confirmation-modal .modal-actions {
  justify-content: center;
  padding: 1rem 1.5rem 1.5rem;
  gap: 1.5rem;
  border-top: 1px solid #eee;
}

.confirmation-modal .btn {
  min-width: 120px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.confirmation-modal .btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
}

.confirmation-modal .btn-cancel:hover {
  background: #5a6268;
}

.confirmation-modal .btn-delete {
  background: #dc3545;
  color: white;
  border: none;
}

.confirmation-modal .btn-delete:hover {
  background: #c82333;
}

.regresar-btn {
  margin: 1rem auto 2rem;
  max-width: 200px;
}

@media (max-width: 768px) {
  .ofertas-table {
    display: block;
    overflow-x: auto;
  }
  
  .acciones {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>