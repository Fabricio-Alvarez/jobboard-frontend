<template>
  <ion-page>
    <div class="dashboard-container">
      <div class="top-bar">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <button @click="logout" class="logout-button">
          <span>🔓</span> Cerrar sesión
        </button>
      </div>

      <h2 class="headline">¡Publica ofertas gratis!</h2>
      <p class="subtext">
        Ahorra costos y tiempo en tus procesos de selección y consigue el candidato ideal de forma rápida y fácil
      </p>

      <button class="publish-button" @click="irAOferta">Publicar una Oferta</button>
      <button class="history-button" @click="verHistorial">Ver historial de ofertas</button>

      <div class="steps-section">
        <div class="steps-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <strong>Publica tu vacante</strong>
              <p>Crea fácilmente la oferta de trabajo y publícala en un clic.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <strong>Revisa las postulaciones</strong>
              <p>Selecciona a los mejores candidatos entre todos los CVs recibidos.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <strong>Contrata</strong>
              <p>Encuentra el candidato que mejor se adapta al perfil buscado.</p>
            </div>
          </div>
        </div>
        <div class="step-image">
          <img src="@/assets/infoimagen.png" alt="Pasos" />
        </div>
      </div>

      <div class="info-section">
        <h3>Aquí encontrarás la persona que necesitas sea cual sea el empleo</h3>
        <p>Localiza los mejores candidatos en la web de empleo líder en Latinoamérica</p>

        <div class="info-block">
          <p>
            Atrae al candidato que necesitas<br />
            Enumera las habilidades necesarias para el empleo para que puedan postularse candidatos pertinentes.
          </p>
          <img src="@/assets/atraeimagen.png" alt="Atrae" />
        </div>

        <div class="info-block">
          <p>
            Organiza tus candidatos<br />
            Ordena los CV, envía mensajes y entrevistas, todo en la web de empleo más utilizada en Latinoamérica.
          </p>
          <img src="@/assets/organizaimagen.png" alt="Organiza" />
        </div>

        <div class="info-block">
          <p>
            Verifica sus habilidades<br />
            Personaliza el proceso de selección de cada oferta: definición de etapas, test y mucho más.
          </p>
          <img src="@/assets/verificaimagen.png" alt="Verifica" />
        </div>
      </div>
    </div>

    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage } from '@ionic/vue'

export default defineComponent({
  name: 'DashboardReclutadores',
  components: { IonPage },
  setup() {
    const router = useRouter()

    const logout = () => {
      router.push('/login')
    }

    const irAOferta = () => {
      router.push('/oferta')
    }

    const verHistorial = () => {
      router.push('/historial-ofertas')
    }

    return { logout, irAOferta, verHistorial }
  }
})
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  font-family: sans-serif;
  overflow-y: auto;
  min-height: calc(100vh - 60px); 
  box-sizing: border-box;
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

.headline {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 1.2rem;
}

.subtext {
  text-align: center;
  font-size: 0.95rem;
  margin: 0.8rem 0;
}

.publish-button,
.history-button {
  display: block;
  margin: 0.5rem auto;
  background-color: #a8e6cf;
  color: black;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

.history-button {
  background-color: #dcedc1;
}

.steps-section {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  margin-bottom: 1.5rem;
}

.steps-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.step-number {
  background-color: #1a73e8;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.85rem;
}

.step-image img {
  height: 100%;
  max-height: 210px;
  width: auto;
  object-fit: cover;
}

.info-section {
  margin-top: 2rem;
}

.info-section h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.info-section p {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.info-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  gap: 1rem;
}

.info-block img {
  width: 60px;
  height: 60px;
  object-fit: contain;
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
