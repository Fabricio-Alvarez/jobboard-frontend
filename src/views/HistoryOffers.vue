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
          <h2 class="section-title">Historial de Ofertas Publicadas</h2>

          <div v-if="loading" class="loading">
            Cargando ofertas...
          </div>
          <div v-else-if="ofertas.length === 0" class="no-ofertas">
            Aún no tienes ninguna oferta registrada.
          </div>

          <table v-else class="ofertas-table">
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
              <tr v-for="oferta in ofertas" :key="oferta.id">
                <td>{{ oferta.job_title }}</td>
                <td>{{ oferta.description }}</td>
                <td>{{ oferta.location }}</td>
                <td>₡{{ oferta.salary.toLocaleString() }}</td>
                <td>{{ oferta.category }}</td>
                <td class="acciones">
                  <button @click="abrirEditor(oferta)" class="btn-edit" title="Editar">✏️</button>
                  <button @click="confirmarEliminacion(oferta.id)" class="btn-delete" title="Eliminar">🗑️</button>
                  <!-- Botón para ver postulaciones de esta oferta -->
                  <button @click="verCandidatos(oferta.id)" class="btn-candidates" title="Ver Candidatos">
                    👤
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal de confirmación de eliminación -->
        <div v-if="mostrarModal" class="modal-backdrop">
          <div class="modal-content confirmation-modal">
            <div class="modal-header">
              <i class="fas fa-exclamation-triangle warning-icon"></i>
              <h3>Confirmar Eliminación</h3>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro que deseas eliminar esta oferta?</p>
              <p class="warning-text"><i class="fas fa-exclamation-circle"></i> Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-actions">
              <button @click="cancelarEliminacion" class="btn btn-cancel">
                Cancelar
              </button>
              <button @click="eliminarOfertaConfirmada" class="btn btn-delete">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Modal de edición -->
        <div v-if="editarModal" class="modal-backdrop">
          <div class="modal-content edit-modal">
            <div class="modal-header">
              <h3>Editar Oferta</h3>
              <button @click="cancelarEdicion" class="btn-close">&times;</button>
            </div>
            <form @submit.prevent="actualizarOfertaConfirmada" class="edit-form">
              <div class="form-group">
                <label for="job_title">Título:</label>
                <input id="job_title" v-model="ofertaEditar.job_title" required />
              </div>
              <div class="form-group">
                <label for="description">Descripción:</label>
                <textarea id="description" v-model="ofertaEditar.description" rows="4" required></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="location">Ubicación:</label>
                  <input id="location" v-model="ofertaEditar.location" required />
                </div>
                <div class="form-group">
                  <label for="salary">Salario:</label>
                  <input id="salary" type="number" v-model.number="ofertaEditar.salary" required />
                </div>
              </div>
              <div class="form-group">
                <label for="category">Categoría:</label>
                <input id="category" v-model="ofertaEditar.category" required />
              </div>
              <div class="form-actions">
                <button type="button" @click="cancelarEdicion" class="btn btn-cancel">
                  Cancelar
                </button>
                <button type="submit" class="btn btn-save">
                  Guardar Cambios
                </button>
              </div>
            </form>
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
  name: 'HistoryOffers',
  components: { IonPage, IonContent, IonButton },
  setup() {
    const router = useRouter()
    const ofertas = ref<any[]>([])
    const loading = ref(true)
    const userRole = ref<number|null>(null)

    const mostrarModal = ref(false)
    const ofertaAEliminar = ref<number|null>(null)

    const editarModal = ref(false)
    const ofertaEditar = ref<any>({
      id: null,
      job_title: '',
      description: '',
      location: '',
      salary: null,
      category: ''
    })

    const obtenerOfertas = async () => {
      loading.value = true
      try {
        const resp = await apiClient.get('/job-offers')
        ofertas.value = resp.data
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
        if (userRole.value !== 2) {
          router.replace('/login')
        } else {
          await obtenerOfertas()
        }
      } catch {
        router.replace('/login')
      }
    }

    onIonViewWillEnter(() => {
      if (userRole.value === 2) {
        return obtenerOfertas()
      }
    })

    validarAcceso()

    const logout = () => {
      localStorage.removeItem('auth_token')
      router.replace('/login')
    }

    const verCandidatos = (offerId: number) => {
      router.push(`/job-offers/${offerId}/applications`)
    }

    const confirmarEliminacion = (id: number) => {
      ofertaAEliminar.value = id
      mostrarModal.value = true
    }
    const cancelarEliminacion = () => {
      mostrarModal.value = false
      ofertaAEliminar.value = null
    }
    const eliminarOfertaConfirmada = async () => {
      if (!ofertaAEliminar.value) return
      try {
        await apiClient.delete(`/job-offers/${ofertaAEliminar.value}`)
        ofertas.value = ofertas.value.filter(o => o.id !== ofertaAEliminar.value)
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error al eliminar.')
      } finally {
        cancelarEliminacion()
      }
    }

    const abrirEditor = (of: any) => {
      ofertaEditar.value = { ...of }
      editarModal.value = true
    }
    const cancelarEdicion = () => {
      editarModal.value = false
      ofertaEditar.value = { id: null, job_title: '', description: '', location: '', salary: null, category: '' }
    }
    const actualizarOfertaConfirmada = async () => {
      try {
        const { id, job_title, description, location, salary, category } = ofertaEditar.value
        const resp = await apiClient.put(`/job-offers/${id}`, { job_title, description, location, salary, category })
        const idx = ofertas.value.findIndex(o => o.id === id)
        if (idx >= 0) ofertas.value[idx] = resp.data.job_offer
        cancelarEdicion()
      } catch (e: any) {
        alert(e.response?.data?.message || 'Error al actualizar.')
      }
    }

    const goBack = () => {
      router.push('/dashboard-reclutadores')
    }

    return {
      ofertas,
      loading,
      mostrarModal,
      ofertaAEliminar,
      editarModal,
      ofertaEditar,
      logout,
      verCandidatos,
      confirmarEliminacion,
      cancelarEliminacion,
      eliminarOfertaConfirmada,
      abrirEditor,
      cancelarEdicion,
      actualizarOfertaConfirmada,
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

.regresar-btn {
  margin: 1rem auto 2rem;
  max-width: 200px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading i, .no-ofertas i {
  font-size: 2rem;
  color: #3498db;
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

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-block;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete, .btn-candidates {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-edit {
  color: #3498db;
}

.btn-edit:hover {
  background: #e3f2fd;
}

.btn-delete {
  color: #e74c3c;
}

.btn-delete:hover {
  background: #fde8e8;
}

.btn-candidates {
  color: #2ecc71;
}

.btn-candidates:hover {
  background: #e8f8f0;
}

/* Modales */
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

.modal-header {
  background: #3498db;
  color: white;
  padding: 1.2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.btn-close:hover {
  opacity: 1;
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

.edit-modal .edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: #f8f9fa;
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  background-color: white;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ecf0f1;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #ecf0f1;
  color: #7f8c8d;
}

.btn-cancel:hover {
  background: #d5dbdb;
}

.btn-save {
  background: #2ecc71;
  color: white;
}

.btn-save:hover {
  background: #27ae60;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.footer {
  text-align: center;
  font-size: 0.9rem;
  color: #7f8c8d;
  padding: 1.5rem 0;
  margin-top: 2rem;
  border-top: 1px solid #ecf0f1;
}


@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .ofertas-table {
    display: block;
    overflow-x: auto;
  }
  
  .acciones {
    flex-wrap: wrap;
    justify-content: center;
  }
}

.regresar-btn {
  margin: 1rem auto 2rem;
  max-width: 200px;
}
</style>