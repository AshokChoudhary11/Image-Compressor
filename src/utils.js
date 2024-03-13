export const debounce = (func, time = 1000) => {
    let id
    return (...params) => {
        if (id) {
            clearTimeout(id)
        }
        id = setTimeout(() => {
            func(...params)
        }, time)
    }
}
