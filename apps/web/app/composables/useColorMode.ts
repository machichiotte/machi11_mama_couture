export const useColorMode = () => {
    const colorMode = useState<'light' | 'dark'>('color-mode', () => {
        if (process.client) {
            const stored = localStorage.getItem('color-mode')
            if (stored === 'dark' || stored === 'light') return stored

            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark'
            }
        }
        return 'light'
    })

    const toggleColorMode = () => {
        const newMode = colorMode.value === 'light' ? 'dark' : 'light'
        colorMode.value = newMode

        if (process.client) {
            localStorage.setItem('color-mode', newMode)
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newMode)
        }
    }

    // Apply on mount
    if (process.client) {
        document.documentElement.classList.add(colorMode.value)
    }

    return {
        colorMode,
        toggleColorMode,
        isDark: computed(() => colorMode.value === 'dark')
    }
}
