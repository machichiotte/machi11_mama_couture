<template>
  <div class="py-20 container mx-auto px-6">
    <div class="max-w-2xl mx-auto text-center">
      <h2 class="text-accent text-sm uppercase tracking-widest mb-4 font-semibold">Une question ?</h2>
      <h1 class="text-4xl md:text-5xl font-serif mb-12">Nous Contacter</h1>
      
      <form class="space-y-8 text-left">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-widest font-bold">Nom</label>
            <input type="text" class="w-full border-b border-gray-200 py-3 focus:border-accent outline-none transition-colors" placeholder="Votre nom" />
          </div>
          <div class="space-y-2">
            <label class="text-xs uppercase tracking-widest font-bold">Email</label>
            <input type="email" class="w-full border-b border-gray-200 py-3 focus:border-accent outline-none transition-colors" placeholder="votre@email.com" />
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="text-xs uppercase tracking-widest font-bold">Message</label>
          <textarea rows="4" class="w-full border-b border-gray-200 py-3 focus:border-accent outline-none transition-colors resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
        </div>
        
        <button type="submit" class="premium-button w-full py-4 text-lg">Envoyer le message</button>
      </form>
    </div>
  </div>
</template>
