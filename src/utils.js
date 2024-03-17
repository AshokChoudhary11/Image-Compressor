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


export const getImageSize = (size)=>{
    if(size > 1024*1024){
        return `${(size/(1024*1024)).toFixed(2)} MB`
    }
        return `${(size/(1024)).toFixed(2)} KB`
        
}