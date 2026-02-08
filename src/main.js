import './style.css'
import gsap from 'gsap'

// ============================================
// MAGNETIC
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
// HERO ENTRANCE — cinematic sequence
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Start with a moment of darkness, then...

    // 1. Image fades in with slow zoom
    tl.to('.hero-img', {
        opacity: 1,
        scale: 1,
        duration: 2.2,
        ease: 'power2.out',
        delay: 0.3,
    })

    // 2. Orbit lines fade in
    tl.to('.orbit-lines', {
        opacity: 1,
        duration: 1.2,
    }, '-=1.5')

    // 3. Nav slides in
    tl.from('#nav', {
        y: -20,
        opacity: 0,
        duration: 0.7,
    }, '-=1.0')

    // 4. Giant words slam in one by one
    tl.to('[data-v]', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
    }, '-=0.6')

    // 5. Floating labels drift in
    tl.to('.float-label', {
        opacity: 0.85,
        duration: 0.8,
        stagger: 0.12,
    }, '-=0.5')

    // 6. Bottom bar
    tl.to(['.hf-left', '.hf-center', '.hf-right'], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
    }, '-=0.4')
}

// ============================================
// PARALLAX — image + text layers
// ============================================
function initParallax() {
    const img = document.getElementById('hero-img')
    const display = document.getElementById('hero-display')
    const labels = document.querySelectorAll('.float-label')
    const orbits = document.getElementById('orbit-lines')

    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        // Image moves subtly opposite
        if (img) {
            gsap.to(img, {
                x: x * -8,
                y: y * -5,
                duration: 2,
                ease: 'power2.out',
            })
        }

        // Display text moves WITH mouse slightly
        if (display) {
            gsap.to(display, {
                x: x * 6,
                y: y * 4,
                duration: 1.8,
                ease: 'power2.out',
            })
        }

        // Orbit lines
        if (orbits) {
            gsap.to(orbits, {
                x: x * 10,
                y: y * 8,
                rotation: x * 2,
                duration: 2.5,
                ease: 'power2.out',
            })
        }

        // Float labels each at different rates
        labels.forEach((label, i) => {
            const speed = 0.6 + i * 0.3
            gsap.to(label, {
                x: x * 12 * speed,
                y: y * 8 * speed,
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
    initMagnetic()
    initHero()
    initParallax()
})
