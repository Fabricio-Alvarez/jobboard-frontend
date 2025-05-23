<template>
  <ion-page>
    <div class="edit-profile-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="title">Editar Perfil</h1>

      <form class="edit-form" @submit.prevent="handleSave">
        <label for="email">E-mail:</label>
        <input v-model="email" id="email" type="email" class="input" />

        <label for="password">Contraseña:</label>
        <input v-model="password" id="password" type="password" class="input" />

        <label for="nombre">Nombre:</label>
        <input v-model="nombre" id="nombre" type="text" class="input" />

        <label for="apellidos">Apellidos:</label>
        <input v-model="apellidos" id="apellidos" type="text" class="input" />

        <button type="submit" class="save-button">Guardar Cambios</button>
        <button type="button" class="cancel-button" @click="cancelar">Cancelar</button>
      </form>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage } from '@ionic/vue'

export default defineComponent({
  name: 'EditarPerfilCandidato',
  components: { IonPage },
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const nombre = ref('')
    const apellidos = ref('')
    const userId = 'usuario123'

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/candidatos/${userId}`)
        if (!res.ok) throw new Error('No se pudo cargar la información')
        const data = await res.json()
        email.value = data.email
        nombre.value = data.nombre
        apellidos.value = data.apellidos
      } catch (error) {
        alert('Error al cargar datos')
      }
    }

    const handleSave = async () => {
      try {
        const body = {
          email: email.value,
          password: password.value,
          nombre: nombre.value,
          apellidos: apellidos.value
        }

        const res = await fetch(`/api/candidatos/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        if (!res.ok) throw new Error('Error al actualizar')

        alert('Perfil actualizado correctamente')
        router.push('/candidates-profile')
      } catch (error) {
        alert('Error al guardar cambios')
      }
    }

    const cancelar = () => {
      router.push('/candidates-profile')
    }

    onMounted(fetchUserData)

    return {
      email,
      password,
      nombre,
      apellidos,
      handleSave,
      cancelar,
    }
  },
})
</script>

<style scoped>
.edit-profile-container {
  padding: 2rem;
  max-width: 400px;
  margin: 2rem auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  display: block;
  margin: 0 auto 1rem;
  width: 80px;
}

.title {
  text-align: center;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #555;
}

.input {
  margin-bottom: 1.2rem;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  transition: border-color 0.3s;
  font-size: 1rem;
}

.input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.save-button,
.cancel-button {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
  transform: scale(1.02);
}

.cancel-button {
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #e53935;
  transform: scale(1.02);
}
</style>
