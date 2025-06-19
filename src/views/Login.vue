<template>
  <ion-page>
    <div class="login-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="title">Iniciar Sesión</h1>
      <form class="login-form" @submit.prevent="handleLogin">
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          class="input"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="input"
        />
        <button type="submit" class="login-button">Ingresar</button>
      </form>

      <p class="register-link">
        ¿No tienes una cuenta?
        <router-link to="/register" custom v-slot="{ navigate }">
          <a @click="navigate" class="register-link-text">Regístrate</a>
        </router-link>
      </p>
    </div>

    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, alertController } from '@ionic/vue'
import apiClient from '@/services/apiClient'

export default defineComponent({
  name: 'Login',
  components: { IonPage },
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()

    const showAlert = async (header: string, message: string) => {
      const alert = await alertController.create({ header, message, buttons: ['OK'] })
      await alert.present()
    }

    const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e)

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        return showAlert('⚠️ Campos incompletos', 'Por favor completa todos los campos.')
      }
      if (!validateEmail(email.value)) {
        return showAlert('📧 Correo inválido', 'Ingresa un correo electrónico válido.')
      }

      try {
       
        const resp = await apiClient.post('/login', {
          email: email.value,
          password: password.value
        })
        console.log('Login response:', resp.data)

       
        const token = resp.data.token ?? resp.data.access_token
        if (!token) {
          throw new Error('No se recibió token desde el servidor.')
        }
        
        localStorage.setItem('auth_token', token)
        apiClient.defaults.headers.common.Authorization = `Bearer ${token}`


        const userResp = await apiClient.get('/user')
        const user = userResp.data
        console.log('User profile:', user)

     
        await showAlert('✅ Inicio de sesión exitoso', `Bienvenido de nuevo, ${user.first_name || user.name}!`)
        if (user.role === 1) {
          router.push('/dashboard-candidatos')
        } else {
          router.push('/dashboard-reclutadores')
        }
      } catch (err: any) {
        console.error('Error en login:', err.response?.data || err.message)
  
        const validation = err.response?.data?.errors
        if (validation) {
          const msgs = Object.values(validation).flat().join('\n')
          return showAlert('❌ Errores de validación', msgs)
        }
        const msg = err.response?.data?.message || err.message || 'Error al iniciar sesión'
        await showAlert('❌ Error al iniciar sesión', msg)
      }
    }

    return {
      email,
      password,
      handleLogin
    }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}
.logo {
  width: 100px;
  margin-bottom: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.input {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login-button {
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
}
.register-link {
  margin-top: 1rem;
}
.register-link-text {
  color: #007bff;
  text-decoration: underline;
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
