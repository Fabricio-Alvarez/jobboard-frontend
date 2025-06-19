<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo SFC" />
        </div>

        <h2 class="titulo">Conectando el talento tico con las mejores oportunidades</h2>
        <p class="texto">
          SFC es una plataforma 100% costarricense dedicada exclusivamente a facilitar el encuentro entre personas que buscan empleo y empresas que deseen encontrar al candidato ideal. Nacida del espíritu emprendedor de tres universitarios de la Universidad de Costa Rica, sede de Guanacaste, Steven Conejo, Fabricio Álvarez y Carlos Jiménez, SFC fue fundada con una visión clara: revolucionar la forma en que se busca trabajo en Costa Rica.
        </p>

        <div class="imagen-ancha">
          <img src="@/assets/imagennosotros.png" alt="Nosotros" />
        </div>

        <h2 class="subtitulo">Solo Costa Rica, con el corazón en cada provincia</h2>
        <p class="texto">
          A diferencia de otras plataformas internacionales, SFC está enfocada 100% en el talento costarricense. Entendemos la realidad del país, sus regiones, sus industrias y sobre todo, las necesidades de las personas que buscan crecer profesionalmente aquí mismo. Nuestra cobertura abarca desde el Gran Área Metropolitana hasta las zonas más rurales, porque sabemos que el talento no tiene fronteras.
        </p>
        <div class="imagen-centro">
          <img src="@/assets/imagenmapa.png" alt="Mapa de Costa Rica" />
        </div>

        <h2 class="subtitulo">Empleo con propósito</h2>
        <p class="texto">
          En SFC no solo conectamos hojas de vida con vacantes. Conectamos sueños con oportunidades, personas con propósitos y comunidades con desarrollo. Creemos firmemente en el poder transformador del trabajo y nos motiva ser un puente hacia un futuro mejor para miles de costarricenses.
        </p>
        <div class="imagen-centro">
          <img src="@/assets/imagenequipo.png" alt="Equipo de trabajo" />
        </div>

        <ion-button expand="block" router-link="/dashboard-candidatos">Volver</ion-button>
      </div>
    </ion-content>

    <!-- Pie de página -->
    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonButton } from '@ionic/vue';
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

.logo img {
  width: 80px;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.subtitulo {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.texto {
  font-size: 1rem;
  margin-bottom: 1rem;
  text-align: justify;
}

.imagen-ancha img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.imagen-centro img {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 1rem auto;
  display: block;
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
