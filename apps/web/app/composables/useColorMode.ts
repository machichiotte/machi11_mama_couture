export const useColorMode = () => {
    // Default to 'light' for SSR
    const colorMode = useState<'light' | 'dark'>('color-mode', () => 'light')

    // On client mount, sync with reality (localStorage or system)
    onMounted(() => {
        const stored = localStorage.getItem('color-mode')
        if (stored === 'dark' || stored === 'light') {
            colorMode.value = stored
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            colorMode.value = 'dark'
        }

        // Ensure class is applied
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(colorMode.value)
    })

    const toggleColorMode = () => {
        const newMode = colorMode.value === 'light' ? 'dark' : 'light'
        colorMode.value = newMode

        localStorage.setItem('color-mode', newMode)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newMode)
    }

    return {
        colorMode,
        toggleColorMode,
        isDark: computed(() => colorMode.value === 'dark')
    }
}
