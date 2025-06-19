<template>
  <ion-page>
    <div class="register-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <h1 class="title">Crear una cuenta</h1>

      <div class="form-wrapper">
        <form class="register-form" @submit.prevent="handleRegister">
          <label for="email">E-mail:</label>
          <input
            v-model="email"
            id="email"
            type="email"
            placeholder="Escriba su correo electrónico"
            class="input"
          />

          <label for="password">Contraseña:</label>
          <input
            v-model="password"
            id="password"
            type="password"
            placeholder="Escriba su contraseña (8–20 caracteres)"
            class="input"
          />

          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input
            v-model="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirme su contraseña"
            class="input"
          />

          <label for="nombre">Nombre:</label>
          <input
            v-model="nombre"
            id="nombre"
            type="text"
            placeholder="Digite su nombre"
            class="input"
          />

          <label for="apellidos">Apellidos:</label>
          <input
            v-model="apellidos"
            id="apellidos"
            type="text"
            placeholder="Digite sus apellidos"
            class="input"
          />

          <label>Deseas registrarte como:</label>
          <div class="role-options">
            <label>
              <input
                v-model.number="role"
                type="radio"
                name="role"
                :value="1"
              />
              Candidato
            </label>
            <label>
              <input
                v-model.number="role"
                type="radio"
                name="role"
                :value="2"
              />
              Reclutador
            </label>
          </div>

          <button type="submit" class="register-button">
            Registrar
          </button>
        </form>

        <p class="login-link">
          ¿Ya tienes una cuenta?<br />
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </div>
    </div>

    <footer class="footer">
      Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
    </footer>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { alertController, IonPage } from '@ionic/vue'
import apiClient from '@/services/apiClient'

export default defineComponent({
  name: 'Register',
  components: { IonPage },
  setup() {
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const nombre = ref('')
    const apellidos = ref('')
    const role = ref<number>(1) // 1 = candidato, 2 = reclutador
    const router = useRouter()

    const showAlert = async (header: string, message: string) => {
      const alert = await alertController.create({
        header,
        message,
        buttons: ['OK']
      })
      await alert.present()
    }

    const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e)

    const handleRegister = async () => {
    
      if (
        !email.value ||
        !password.value ||
        !confirmPassword.value ||
        !nombre.value ||
        !apellidos.value
      ) {
        return showAlert(
          '⚠️ Campos vacíos',
          'Por favor completa todos los campos.'
        )
      }
      if (!validateEmail(email.value)) {
        return showAlert(
          '📧 Correo inválido',
          'Escribe un correo electrónico válido.'
        )
      }
      if (password.value !== confirmPassword.value) {
        return showAlert(
          '🔁 Contraseñas no coinciden',
          'Asegúrate de que coincidan.'
        )
      }

      try {
        const resp = await apiClient.post('/register', {
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value,
          first_name: nombre.value,
          last_name: apellidos.value,
          role: role.value
        })

        console.log('Registro exitoso:', resp.data)
        await showAlert(
          '✅ Registro exitoso',
          `Bienvenido/a, ${nombre.value}!`
        )

        router.push(
          role.value === 1
            ? '/dashboard-candidatos'
            : '/dashboard-reclutadores'
        )
      } catch (err: any) {
        
        const status = err.response?.status
        const data = err.response?.data

        console.error('Error al registrar:', status, data)

       
        if (status === 400 && data && typeof data === 'object') {
          const msgs = Object
            .values(data)         
            .flat()               
            .join('\n')           
          return showAlert('❌ Errores de validación', msgs)
        }

       
        const msg = data?.message || err.message || 'Error al registrar'
        await showAlert('❌ Error al registrar', msg)
      }
    }

    return {
      email,
      password,
      confirmPassword,
      nombre,
      apellidos,
      role,
      handleRegister
    }
  }
})
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-height: 100vh;
  overflow-y: auto;
}

.logo {
  width: 60px;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.7rem 2rem;
  background-color: #007bff;
  border-radius: 8px;
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
  background: #fff;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.register-form {
  display: flex;
  flex-direction: column;
}

.register-form label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #333;
}

.input {
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

.role-options {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.role-options label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.register-button {
  padding: 0.6rem;
  background-color: #111;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.register-button:hover {
  background-color: #333;
}

.login-link {
  text-align: center;
  font-size: 0.9rem;
  margin-top: 1rem;
  color: #000;
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
