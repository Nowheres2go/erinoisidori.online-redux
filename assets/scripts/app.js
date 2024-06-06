// card data-href handler
(() => {
    const getCardUrl = (element) => {
        if (!element.matches('[data-href] *, [data-href]')) {
            console.log('no match', element)
            return null
        }

        if (!element.hasAttribute('data-href')) {
            if (!element.parentElement) return null

            return getCardUrl(element.parentElement)
        } else {
            return element.querySelector('a')
        }
    }

    document.addEventListener('click', e => {
        const clicked = e.target
        const clickable = clicked.matches('[data-href] *')
        if (clickable) {
            getCardUrl(clicked).click()
        }
    })
})()


// a super subtle and not obviously easter egg
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
