// // article full-screen image handler
(() => {
    // const wrapperSelector = '#article-image-warpper'
    //
    // document.addEventListener("mousedown", e => {
    //     if (e.target.matches)
    // })

    const image = document.querySelector("img.article-image")

    if (!!image) {
        image.scrollTo()
    }
})()

// card data-href handler
(() => {
    const getCardUrl = (element) => {
        if (!element.matches('.card.clickable *, .card.clickable')) {
            console.log('no match', element)
            return null
        }

        let current = element
        while (!current.matches('.card.clickable')) {
            console.log({current})
            current = element.parentElement
            if (!!current) break
        }

        console.log({current})

        return current.querySelector('a')
    }

    document.addEventListener('click', e => {
        const clicked = e.target
        const clickable = clicked.matches('.card.clickable *, .card.clickable')
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
