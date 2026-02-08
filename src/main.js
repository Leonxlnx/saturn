import './style.css'
import gsap from 'gsap'

// ============================================
// STARFIELD — subtle, clean
// ============================================
function initStarfield() {
    const canvas = document.getElementById('starfield')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let stars = []

    function resize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    function create() {
        stars = Array.from({ length: 140 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 0.9 + 0.15,
            o: Math.random() * 0.35 + 0.05,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.004 + 0.001,
        }))
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const s of stars) {
            s.phase += s.speed
            const a = s.o + Math.sin(s.phase) * 0.08
            ctx.beginPath()
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(242, 237, 228, ${Math.max(0, a)})`
            ctx.fill()
        }
        requestAnimationFrame(draw)
    }

    resize()
    create()
    draw()
    window.addEventListener('resize', () => { resize(); create() })
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            gsap.to(el, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: 'power2.out' })
        })
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
        })
    })
}

// ============================================
// HERO ENTRANCE
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 })

    // Nav
    tl.from('#nav', { y: -15, opacity: 0, duration: 0.7 })

    // Background text
    tl.to('.bg-text', { opacity: 1, duration: 1.8, ease: 'power2.inOut' }, '-=0.3')

    // Planet
    gsap.set('#planet-container', { scale: 0.75 })
    tl.to('#planet-container', { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, '-=1.2')

    // Title words
    tl.to('[data-w]', {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power4.out',
    }, '-=0.7')

    // Subline
    tl.to('#subline', { opacity: 1, y: 0, duration: 0.65 }, '-=0.35')

    // CTA
    tl.to('#hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
}

// ============================================
// SUBTLE PARALLAX — planet + bg text only
// ============================================
function initParallax() {
    const planet = document.getElementById('planet-container')
    const bg = document.getElementById('bg-text')

    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        if (planet) {
            gsap.to(planet, {
                x: x * 8,
                y: y * 6,
                duration: 1.8,
                ease: 'power2.out',
            })
        }

        if (bg) {
            gsap.to(bg, {
                x: x * -12,
                y: y * -8,
                duration: 2.2,
                ease: 'power2.out',
            })
        }
    })
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initStarfield()
    initMagnetic()
    initHero()
    initParallax()
})
