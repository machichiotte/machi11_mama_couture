export default defineNuxtPlugin(() => {
    if (process.client) {
        // Apply color mode immediately to prevent flash
        const stored = localStorage.getItem('color-mode')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const colorMode = stored || (prefersDark ? 'dark' : 'light')

        document.documentElement.classList.add(colorMode)
    }
})
