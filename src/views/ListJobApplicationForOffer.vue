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

        <h2 class="section-title">Postulaciones de la Oferta</h2>

        <div v-if="loading" class="loading">Cargando postulaciones...</div>
        <div v-else-if="applications.length === 0" class="no-applications">
          No hay postulaciones para esta oferta.
        </div>

        <table v-else class="applications-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Mensaje</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in applications" :key="app.id">
              <td>{{ app.user_id }}</td>
              <td>{{ app.message }}</td>
              <td>{{ app.status }}</td>
              <td>
                <button
                  v-if="app.status === 'pendiente'"
                  @click="approve(app.id)"
                  class="btn-approve"
                >
                  Aprobar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div class="navigation-wrapper">
          <ion-button color="medium" class="regresar-btn" @click="goBack">
            ← Regresar
          </ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { IonPage, IonContent, IonButton } from "@ionic/vue";
import apiClient from "@/services/apiClient";
import { alertController } from "@ionic/vue";

export default defineComponent({
  name: "ListJobApplicationsForOffer",
  components: { IonPage, IonContent, IonButton },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const offerId = Number(route.params.offerId);

    const applications = ref<any[]>([]);
    const loading = ref(true);

    const logout = () => {
      localStorage.removeItem("auth_token");
      router.replace("/login");
    };

    const fetchApplications = async () => {
      loading.value = true;
      try {
        const { data } = await apiClient.get(
          `/job-offers/${offerId}/applications`
        );
        applications.value = data;
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };

    const approve = async (applicationId: number) => {
      try {
        await apiClient.put(`/job-applications/${applicationId}/approve`);
        fetchApplications();
        const alert = await alertController.create({
          header: "¡Éxito!",
          message: "La postulación fue aprobada correctamente.",
          buttons: ["OK"],
        });
        await alert.present();
      } catch (e) {
        console.error(e);
      }
    };

    const goBack = () => {
      router.push("/historial-ofertas");
    };
    onMounted(() => {
      if (!offerId) {
        router.replace("/dashboard-reclutadores");
      } else {
        fetchApplications();
      }
    });

    return { applications, loading, logout, approve, goBack };
  },
});
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: auto;
  font-family: "Segoe UI", sans-serif;
  color: #2c3e50;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.logo {
  height: 40px;
}

.logout-button {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.section-title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
}

.loading,
.no-applications {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
}

.applications-table th {
  background: #3498db;
  color: #fff;
  padding: 0.8rem;
  text-align: left;
}

.applications-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #ecf0f1;
}

.btn-approve {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-approve:hover {
  background: #27ae60;
}

.navigation-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.regresar-btn {
  --padding-start: 1rem;
  --padding-end: 1rem;
  max-width: 200px;
  width: auto;
}
</style>
