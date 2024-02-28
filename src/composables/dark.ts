export const isDark = useDark()
export const toggleDark = useToggle(isDark)
export const toggleToDark = () => isDark.value = true;
