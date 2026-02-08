import './style.css'
import gsap from 'gsap'

// ============================================
// AURORA — follows mouse with lag
// ============================================
function initAurora() {
    const a1 = document.getElementById('aurora')
    const a2 = document.getElementById('aurora-2')
    if (!a1) return

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let ax = mx, ay = my
    let bx = mx, by = my

    document.addEventListener('mousemove', e => {
        mx = e.clientX
        my = e.clientY
    })

    function tick() {
        // Primary aurora — follows with smooth lag
        ax += (mx - ax) * 0.04
        ay += (my - ay) * 0.04
        a1.style.left = ax + 'px'
        a1.style.top = ay + 'px'

        // Secondary aurora — even more lag, offset
        bx += (mx - bx) * 0.02
        by += (my - by) * 0.02
        if (a2) {
            a2.style.left = (bx + 80) + 'px'
            a2.style.top = (by - 60) + 'px'
        }

        requestAnimationFrame(tick)
    }
    tick()
}

// ============================================
// MAGNETIC
// ============================================
function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            gsap.to(el, { x: x * 0.18, y: y * 0.18, duration: 0.4, ease: 'power2.out' })
        })
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
        })
    })
}

// ============================================
// HERO ENTRANCE — cinematic timeline
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Image + overlay fade in
    tl.to('.hero-img', {
        opacity: 1,
        scale: 1,
        duration: 2.5,
        ease: 'power2.out',
        delay: 0.2,
    })

    // 2. Orbit decoration
    tl.to('.orbit-deco', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.inOut',
    }, '-=1.8')

    // 3. Nav
    tl.fromTo('#nav',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=1.2'
    )

    // 4. Label
    tl.to('.hero-label', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.6')

    // 5. Title words
    tl.to('.h1-word', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power4.out',
    }, '-=0.3')

    // 6. Subtitle
    tl.to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.65,
    }, '-=0.4')

    // 7. Buttons
    tl.to('.hero-btns', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.3')

    // 8. Orbit tags
    tl.to('.orbit-tag', {
        opacity: 0.9,
        duration: 0.7,
        stagger: 0.1,
    }, '-=0.4')

    // 9. Scroll indicator
    tl.to('#hero-bottom', {
        opacity: 0.6,
        duration: 0.5,
    }, '-=0.2')
}

// ============================================
// PARALLAX — subtle depth
// ============================================
function initParallax() {
    const img = document.getElementById('hero-img')
    const orbits = document.getElementById('orbit-deco')
    const tags = document.querySelectorAll('.orbit-tag')

    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        if (img) {
            gsap.to(img, {
                x: x * -6,
                y: y * -4,
                duration: 2.5,
                ease: 'power2.out',
            })
        }

        if (orbits) {
            gsap.to(orbits, {
                x: x * 10,
                y: y * 6,
                rotation: x * 1.5,
                duration: 2.5,
                ease: 'power2.out',
            })
        }

        tags.forEach((tag, i) => {
            gsap.to(tag, {
                x: x * (10 + i * 5),
                y: y * (6 + i * 3),
                duration: 2,
                ease: 'power2.out',
            })
        })
    })
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAurora()
    initMagnetic()
    initHero()
    initParallax()
})
