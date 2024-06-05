// a super subtle and not obviously easter egg file....

const sixth = () => {
    const initial = 'HOME'
    const end = 'secret sixth option'

    const el = () => document.querySelector('.nav-group:last-of-type > .nav-item:last-of-type')

    const reset = () => el().innerText = initial

    const write = () => {
        el().innerText = end
        setTimeout(() => reset(), 400)
    }

    const init = () => document.addEventListener("keypress", e => write())

    return { init }
}

(() => {
    sixth().init()
})()
