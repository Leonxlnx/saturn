import './style.css'
import gsap from 'gsap'

// ============================================
// STARFIELD
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
        stars = Array.from({ length: 180 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.1 + 0.15,
            o: Math.random() * 0.5 + 0.05,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.006 + 0.002,
        }))
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const s of stars) {
            s.phase += s.speed
            const alpha = s.o + Math.sin(s.phase) * 0.12
            ctx.beginPath()
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(237, 232, 223, ${Math.max(0, alpha)})`
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
// CUSTOM CURSOR
// ============================================
function initCursor() {
    const ring = document.getElementById('cursor-ring')
    const dot = document.getElementById('cursor-dot')
    if (!ring || !dot) return

    let mx = 0, my = 0, rx = 0, ry = 0, dx = 0, dy = 0

    document.addEventListener('mousemove', e => {
        mx = e.clientX
        my = e.clientY
    })

    // Hover effect on interactive elements
    const interactives = document.querySelectorAll('a, button, [data-magnetic]')
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'))
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'))
    })

    function animate() {
        // Ring follows with lag
        rx += (mx - rx) * 0.1
        ry += (my - ry) * 0.1
        ring.style.left = rx + 'px'
        ring.style.top = ry + 'px'

        // Dot follows tightly
        dx += (mx - dx) * 0.25
        dy += (my - dy) * 0.25
        dot.style.left = dx + 'px'
        dot.style.top = dy + 'px'

        requestAnimationFrame(animate)
    }
    animate()
}

// ============================================
// MAGNETIC ELEMENTS
// ============================================
function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power2.out' })
        })
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
        })
    })
}

// ============================================
// HERO ENTRANCE TIMELINE
// ============================================
function initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.2 })

    // 1. Background text fades in
    tl.to('.bg-word', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
    })

    // 2. Planet scales in
    tl.to('.planet-wrap', {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power2.out',
    }, '-=1.0')

    // Apply initial scale
    gsap.set('.planet-wrap', { scale: 0.7 })

    // 3. Title words reveal
    tl.to('[data-w]', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power4.out',
    }, '-=0.8')

    // 4. Tag line
    tl.to('#tag-tl', {
        opacity: 1,
        duration: 0.6,
    }, '-=0.5')

    // 5. Description & buttons
    tl.to('#hero-desc', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.3')

    tl.to('#hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.5')

    // 6. Floating stats
    tl.to('.float-stat', {
        opacity: 0.6,
        duration: 0.6,
        stagger: 0.12,
    }, '-=0.4')

    // 7. Corner elements
    tl.to('.corner-text', {
        opacity: 1,
        duration: 0.5,
    }, '-=0.3')
}

// ============================================
// PLANET PARALLAX ON MOUSE
// ============================================
function initParallax() {
    const planet = document.getElementById('planet-wrap')
    const bgWord = document.getElementById('bgWord')
    if (!planet) return

    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        gsap.to(planet, {
            rotateY: x * 12,
            rotateX: -y * 8,
            x: x * 15,
            y: y * 10,
            duration: 1.5,
            ease: 'power2.out',
        })

        if (bgWord) {
            gsap.to(bgWord, {
                x: x * -25,
                y: y * -15,
                duration: 2,
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
    initCursor()
    initMagnetic()
    initHeroAnimation()
    initParallax()
})
