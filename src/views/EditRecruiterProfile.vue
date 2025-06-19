<template>
  <ion-page>
    <div class="scroll-wrapper">
      <div class="profile-update-container">
        <h2>Actualizar Perfil</h2>
        <form @submit.prevent="actualizarPerfil">
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="contrasena" type="password" required />
          </div>

          <div class="form-group">
            <label>Nombre</label>
            <input v-model="nombre" type="text" required />
          </div>

          <div class="form-group">
            <label>Apellido</label>
            <input v-model="apellido" type="text" required />
          </div>

          <button class="btn-actualizar" type="submit">Guardar Cambios</button>
        </form>
      </div>

      <footer class="footer">
        Bolsa de Empleo SFC de Steven, Fabricio y Carlos de la UCR
      </footer>
    </div>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'ActualizarPerfil',
  setup() {
    const contrasena = ref('')
    const nombre = ref('')
    const apellido = ref('')

    const actualizarPerfil = () => {
      console.log({
        contrasena: contrasena.value,
        nombre: nombre.value,
        apellido: apellido.value
      })
    }

    return {
      contrasena,
      nombre,
      apellido,
      actualizarPerfil
    }
  }
})
</script>

<style scoped>
ion-page {
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.profile-update-container {
  padding: 2rem;
  max-width: 600px;
  margin: 3rem auto 2rem auto;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #00cfff;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.4rem;
  color: #bfbfbf;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1px solid #444;
  background-color: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #00cfff;
}

.btn-actualizar {
  display: block;
  width: 100%;
  background-color: #00cfff;
  color: #000;
  padding: 0.9rem;
  border: none;
  border-radius: 15px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.btn-actualizar:hover {
  background-color: #00b2e6;
}

.footer {
  text-align: center;
  font-size: 0.9rem;
  color: #000;
  background-color: #fff;
  padding: 1rem;
  margin-top: auto;
  border-top: 1px solid #ddd;
}
</style>