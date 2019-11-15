import './styles/app'
import './images/logo.jpg'
import mediumZoom from 'medium-zoom'

hljs.initHighlightingOnLoad()

mediumZoom('.article-content img')

const icon = document.querySelector('.js-icon-menu') as HTMLDivElement
const menu = document.querySelector('.js-menu-mobile') as HTMLDivElement

icon.addEventListener('click', () => {
    menu.classList.add('visible')
})

menu.addEventListener('click', () => {
    menu.classList.remove('visible')
})