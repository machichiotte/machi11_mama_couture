<script setup lang="ts">
import { usePayload } from '~/composables/usePayload'

const { create } = usePayload()

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const error = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  error.value = ''
  
  try {
    await create('messages', {
      name: form.name,
      email: form.email,
      message: form.message,
      subject: `Nouveau message de ${form.name}`
    })
    isSuccess.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e) {
    console.error(e)
    error.value = "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer."
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="py-20 container mx-auto px-6">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-accent text-sm uppercase tracking-widest mb-4 font-semibold italic">Une question ?</h2>
      <h1 class="text-4xl md:text-5xl font-serif mb-12 text-primary">Nous Contacter</h1>
      
      <div v-if="isSuccess" class="bg-secondary/50 p-12 rounded-sm border border-accent/20 animate-fade-in">
        <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-2xl font-serif text-primary mb-4">Message Envoyé !</h3>
        <p class="text-primary/60 font-light italic text-lg leading-relaxed">
          Merci pour votre message. Nous reviendrons vers vous très prochainement à l'adresse indiquée.
        </p>
        <button @click="isSuccess = false" class="mt-10 text-accent font-bold uppercase tracking-widest text-xs border-b border-accent pb-1">
          Envoyer un autre message
        </button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-10 text-left bg-white p-10 md:p-14 shadow-xl border border-primary/5 rounded-sm relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20"></div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-3">
            <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">Votre Nom</label>
            <input 
              v-model="form.name"
              type="text" 
              required
              class="w-full bg-transparent border-b border-primary/10 py-4 focus:border-accent outline-none transition-all duration-500 text-primary placeholder:text-primary/20" 
              placeholder="Ex: Marie Laurent" 
            />
          </div>
          <div class="space-y-3">
            <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">Votre Email</label>
            <input 
              v-model="form.email"
              type="email" 
              required
              class="w-full bg-transparent border-b border-primary/10 py-4 focus:border-accent outline-none transition-all duration-500 text-primary placeholder:text-primary/20" 
              placeholder="marie@email.com" 
            />
          </div>
        </div>
        
        <div class="space-y-3">
          <label class="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 block">Votre Message</label>
          <textarea 
            v-model="form.message"
            rows="5" 
            required
            class="w-full bg-transparent border-b border-primary/10 py-4 focus:border-accent outline-none transition-all duration-500 resize-none text-primary placeholder:text-primary/20 leading-relaxed" 
            placeholder="Écrivez-nous votre message ici..."
          ></textarea>
        </div>
        
        <div v-if="error" class="text-red-500 text-sm italic py-2">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="premium-button w-full py-5 text-sm uppercase tracking-[0.3em] font-bold group relative overflow-hidden"
        >
          <span class="relative z-10 flex items-center justify-center gap-3">
             {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
             <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
             </svg>
          </span>
        </button>
        
        <p class="text-center text-[10px] text-primary/30 uppercase tracking-widest mt-8">
          {{ form.email === 'zespamfull4@gmail.com' ? 'Mode test activé : Vérification de réception.' : 'Votre vie privée est respectée. Aucune donnée n\'est partagée.' }}
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}
</style>
