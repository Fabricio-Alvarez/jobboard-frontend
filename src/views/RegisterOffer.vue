<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Registrar Oferta de Empleo</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="registrarOferta">
        <ion-item>
          <ion-label position="stacked">Título del Puesto</ion-label>
          <ion-input v-model="oferta.titulo" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Descripción</ion-label>
          <ion-textarea v-model="oferta.descripcion" required></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Ubicación</ion-label>
          <ion-input v-model="oferta.ubicacion" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Salario</ion-label>
          <ion-input
            v-model.number="oferta.salario"
            type="number"
            required
          ></ion-input>
        </ion-item>

        <div class="form-group">
          <ion-label class="ion-padding-start">Categoría</ion-label>
          <div class="autocomplete-container">
            <input
              type="text"
              v-model="oferta.categoria"
              @input="filterCategorias"
              @focus="showCategoriaOptions = true"
              @blur="hideCategoriaOptions"
              class="autocomplete-input"
              placeholder="Escriba o seleccione una categoría"
              required
            />
            <div
              v-if="showCategoriaOptions && filteredCategorias.length"
              class="autocomplete-list"
            >
              <div
                class="autocomplete-item"
                v-for="(cat, i) in filteredCategorias"
                :key="i"
                @mousedown.prevent="selectCategoria(cat)"
              >
                {{ cat }}
              </div>
            </div>
          </div>
        </div>

        <ion-button expand="block" type="submit" class="ion-margin-top">
          Registrar Oferta
        </ion-button>

    
        <ion-button
          expand="block"
          color="medium"
          class="ion-margin-top"
          @click="goBack"
        >
          ← Regresar
        </ion-button>
      </form>
    </ion-content>

    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  alertController
} from '@ionic/vue'
import apiClient from '@/services/apiClient'

const router = useRouter()


const initialOferta = {
  titulo: '',
  descripcion: '',
  ubicacion: '',
  salario: null as number | null,
  categoria: ''
}
// Estado reactivo para la oferta
const oferta = ref({ ...initialOferta })


const clearFields = () => {
  Object.assign(oferta.value, initialOferta)
}


const categorias = [
  'Recepcionista','Contador','Asistente administrativo','Ingeniero industrial',
  'Técnico en electrónica','Desarrollador web','Secretaria','Diseñador gráfico',
  'Operario de producción','Agente de servicio al cliente','Auxiliar contable',
  'Mecánico automotriz','Cocinero','Guardia de seguridad','Profesor de inglés',
  'Auxiliar de bodega', 'Otra'
]
const showCategoriaOptions = ref(false)
const filteredCategorias = ref<string[]>([...categorias])

const filterCategorias = () => {
  const s = oferta.value.categoria.toLowerCase()
  filteredCategorias.value = categorias.filter(c =>
    c.toLowerCase().includes(s)
  )
}
const selectCategoria = (cat: string) => {
  oferta.value.categoria = cat
  showCategoriaOptions.value = false
}
const hideCategoriaOptions = () => {
  setTimeout(() => { showCategoriaOptions.value = false }, 100)
}


const fieldLabels: Record<string,string> = {
  job_title: 'Título del Puesto',
  description: 'Descripción',
  location: 'Ubicación',
  salary: 'Salario',
  category: 'Categoría'
}
const translateError = (field:string, msg:string) => {
  const label = fieldLabels[field] || field
  if (/required/.test(msg)) return `${label} es obligatorio.`
  if (/string/.test(msg))   return `${label} debe ser texto.`
  if (/numeric/.test(msg))  return `${label} debe ser un número.`
  if (/max:\d+/.test(msg)) {
    const m = msg.match(/max:(\d+)/)
    return m ? `${label} no puede exceder ${m[1]} caracteres.` : msg
  }
  if (/min:\d+/.test(msg)) {
    const m = msg.match(/min:(\d+)/)
    return m ? `${label} debe tener al menos ${m[1]} caracteres.` : msg
  }
  return msg
}


const userRole = ref<number|null>(null)
onMounted(async () => {
  try {
    const resp = await apiClient.get('/user')
    userRole.value = resp.data.role
  } catch {
    router.replace('/login')
  }
})


const registrarOferta = async () => {
  if (userRole.value !== 2) {
    return alertController.create({
      header: '🚫 Acceso denegado',
      message: 'Solo los reclutadores pueden crear ofertas.',
      buttons: ['OK']
    }).then(a => a.present())
  }

  try {
    const payload = {
      job_title: oferta.value.titulo,
      description: oferta.value.descripcion,
      location: oferta.value.ubicacion,
      salary: oferta.value.salario,
      category: oferta.value.categoria
    }
    await apiClient.post('/job-offers', payload)

    await alertController.create({
      header: '✅ Oferta creada',
      message: 'Tu oferta de trabajo se ha registrado con éxito.',
      buttons: ['OK']
    }).then(a => a.present())

    clearFields()
    router.push('/dashboard-reclutadores')
  } catch (err: any) {
    const status = err.response?.status
    const data = err.response?.data

    if (status === 422 || status === 400) {
      const msgs: string[] = []
      Object.entries(data.errors || data).forEach(([f, arr]) => {
        ;(arr as string[]).forEach(m => msgs.push(translateError(f, m)))
      })
      return alertController.create({
        header: '❌ Errores de validación',
        message: msgs.join('\n'),
        buttons: ['OK']
      }).then(a => a.present())
    }

    const msg = data?.message || 'Error al crear la oferta.'
    return alertController.create({
      header: '❌ Error',
      message: msg,
      buttons: ['OK']
    }).then(a => a.present())
  }
}


const goBack = () => {
  clearFields()
  router.push('/dashboard-reclutadores')
}
</script>


<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  margin: 1rem 0;
  position: relative;
}

.autocomplete-container {
  position: relative;
  width: 100%;
}

.autocomplete-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.autocomplete-list {
  background: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 6px;
  max-height: 160px;
  overflow-y: auto;
  position: absolute;
  z-index: 10;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.autocomplete-item {
  padding: 0.6rem 0.8rem;
  cursor: pointer;
}

.autocomplete-item:hover {
  background: #f0f0f0;
}

.footer {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  padding: 1rem 0;
  border-top: 1px solid #ddd;
  background: #f8f8f8;
}
</style>
