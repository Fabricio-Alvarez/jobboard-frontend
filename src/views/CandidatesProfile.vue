<template>
  <ion-page>
    <div class="dashboard-container">
      <div class="header">
        <img src="@/assets/logo.png" alt="Logo SFC" class="logo" />
      </div>

      <div class="profile-section">

        <img :src="profilePhotoUrl || defaultProfilePhoto" alt="Foto de perfil" class="profile-pic" />
        <p class="user-name">{{ fullName }}</p>
      </div>

      <div class="add-photo">
        <button class="add-photo-btn" @click="triggerPhotoInput">Agregar Foto (+)</button>
        <input ref="photoInput" type="file" accept="image/*" style="display: none" @change="handlePhotoChange" />
      </div>

      <div class="scrollable-content">

        <div class="card">
          <div class="card-border"></div>
          <div class="card-content">
            <div class="card-header">
              <img src="@/assets/imagenpostulaciones.png" class="card-icon" alt="Postulaciones" />
              <h4>Postulaciones</h4>
            </div>
            <p>Accede al historial de todas las postulaciones que has realizado</p>
            <button class="card-btn" @click="goToPostulaciones">Ver Postulaciones</button>
          </div>
        </div>


        <div class="card">
          <div class="card-border"></div>
          <div class="card-content">
            <div class="card-header">
              <img src="@/assets/imagencurriculun.png" class="card-icon" alt="Curriculum" />
              <h4>Curriculum</h4>
            </div>
            <p>Asegúrate de mantener actualizado tu curriculum</p>
            <button class="card-btn" @click="triggerFileInput">Actualizar CV</button>
            <button v-if="cvUrl" class="card-btn" @click="abrirCV">Ver CV</button>
            <input ref="fileInput" type="file" accept="application/pdf" style="display: none" @change="handleFileChange" />
          </div>
        </div>


        <div class="card">
          <div class="card-border"></div>
          <div class="card-content">
            <div class="card-header">
              <img src="@/assets/imagenperfil.png" class="card-icon" alt="Perfil" />
              <h4>Perfil</h4>
            </div>
            <p>Actualiza tus datos generales y tus preferencias</p>
            <button class="card-btn" @click="goToActualizarPerfil">Actualizar perfil</button>
          </div>
        </div>
      </div>

      <div class="footer-nav">
        <span class="link" @click="goToHome">🔍 Buscar Trabajo</span>
        <span class="link" @click="logout">🔓 Cerrar sesión</span>
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
import { IonPage } from '@ionic/vue'

export default defineComponent({
  name: 'DashboardCandidatos',
  components: { IonPage },
  setup() {
    const router = useRouter()
    const fileInput = ref<HTMLInputElement | null>(null)
    const photoInput = ref<HTMLInputElement | null>(null)
    const cvFileName = ref<string>('')

    const email = localStorage.getItem('email') || ''
    const password = localStorage.getItem('password') || ''

    const goToHome = () => router.push('/dashboard-candidatos')
    const logout = () => router.push('/login')
    const goToPostulaciones = () => router.push('/postulacionesHistorial')
    const goToActualizarPerfil = () => router.push('/actualizar-perfil')

    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.value = ''
        fileInput.value.click()
      }
    }

    const triggerPhotoInput = () => {
      if (photoInput.value) {
        photoInput.value.value = ''
        photoInput.value.click()
      }
    }

    const handleFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const file = target.files[0]
        if (file.type !== 'application/pdf') {

        await uploadCV(file)
      }
    }

    const handlePhotoChange = async (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const file = target.files[0]
        if (!file.type.startsWith('image/')) {

        await uploadProfilePhoto(file)
      }
    }

    const abrirCV = () => {

        window.open(cvUrl.value, '_blank')
      }
    }

    const uploadCV = async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('file', file)

        const response = await fetch('/api/cv/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Error al subir el CV')

      }
    }

    const uploadProfilePhoto = async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('email', email)
        formData.append('file', file)

        const response = await fetch('/api/photo/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Error al subir la imagen')

      }
    }

    const fetchProfilePhoto = async () => {
      try {

        const response = await fetch(`/api/photo?email=${email}`)
        if (!response.ok) return
        const data = await response.json()
        profilePhotoUrl.value = data.imageUrl || ''
      } catch (error) {

      }
    }

    const fetchCV = async () => {
      try {

        const response = await fetch(`/api/cv?email=${email}`)
        if (!response.ok) return
        const data = await response.json()
        cvFileName.value = data.fileName || ''
        cvUrl.value = data.cvUrl || ''
      } catch (error) {

      }
    }

    const fetchFullName = async () => {
      try {
        const response = await fetch('/api/candidato/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) throw new Error('No se pudo obtener el nombre')

        fullName.value = 'Usuario'
      }
    }

    onMounted(() => {
      fetchCV()
      fetchProfilePhoto()
      fetchFullName()
    })

    return {
      goToHome,
      logout,
      goToPostulaciones,
      goToActualizarPerfil,
      triggerFileInput,
      triggerPhotoInput,
      handleFileChange,
      handlePhotoChange,
      abrirCV,
      fileInput,
      photoInput,
      cvFileName,
      cvUrl,
      profilePhotoUrl,
      defaultProfilePhoto,
      fullName,
    }
  },
})
</script>

<style scoped>
.dashboard-container {
  padding: 1rem;
  font-family: sans-serif;
  max-width: 500px;
  margin: 0 auto;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.logo {
  width: 60px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
}

.profile-pic {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #eee;
  object-fit: cover;
}

.user-name {
  margin: 0;
  font-weight: bold;
  text-align: center;
}

.add-photo {
  display: flex;
  justify-content: flex-start;
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.add-photo-btn {
  background-color: #b5efbf;
  border: none;
  border-radius: 8px;
  padding: 0.3rem 0.6rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
  font-size: 0.85rem;
  width: auto;
}

.scrollable-content {
  overflow-y: auto;
  flex-grow: 1;
  padding-bottom: 1rem;
}

.card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 1rem;
  background-color: #fff;
  overflow: hidden;
}

.card-border {
  width: 10px;
  background-image: url('@/assets/bordeimagen.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.card-content {
  flex: 1;
  padding: 1rem;
  color: black;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.card-content p {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.card-content input {
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: black;
}

.card-btn {
  width: 100%;
  background-color: #b5efbf;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
}

.footer-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #e91e63;
  font-weight: bold;
  flex-shrink: 0;
}

.link {
  cursor: pointer;
}

.footer {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  padding: 1rem 0;
  border-top: 1px solid #ddd;
  background-color: #f8f8f8;
}
</style>