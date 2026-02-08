import './style.css'
import gsap from 'gsap'

// ============================================
// AURORA — mouse-following ambient glow
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
        ax += (mx - ax) * 0.035
        ay += (my - ay) * 0.035
        a1.style.left = ax + 'px'
        a1.style.top = ay + 'px'

        bx += (mx - bx) * 0.018
        by += (my - by) * 0.018
        if (a2) {
            a2.style.left = (bx + 90) + 'px'
            a2.style.top = (by - 70) + 'px'
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
// HERO — cinematic Saturn reveal
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Saturn reveal — circular clip-path expands from center
    tl.to('#hero-img-wrap', {
        clipPath: 'circle(85% at 50% 45%)',
        duration: 2.8,
        ease: 'power2.inOut',
        delay: 0.4,
    })

    // Simultaneously: image zooms to rest
    tl.to('.hero-img', {
        scale: 1,
        duration: 3,
        ease: 'power2.out',
    }, '<')

    // 2. Nav fades in
    tl.to('#nav', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        // Need to reset the transform to only remove the Y offset
        clearProps: 'transform',
        onComplete: () => {
            // Re-center after animation
            const nav = document.getElementById('nav')
            if (nav) nav.style.transform = 'translateX(-50%)'
        }
    }, '-=2.0')

    // 3. Eyebrow
    tl.to('.hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=1.5')

    // 4. Title words — one by one
    tl.to('.h1-word', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.18,
        ease: 'power4.out',
    }, '-=1.2')

    // 5. Subtitle
    tl.to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.5')

    // 6. Buttons
    tl.to('.hero-btns', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.3')

    // 7. Orbit tags float in
    tl.to('.orbit-tag', {
        opacity: 0.85,
        duration: 0.8,
        stagger: 0.12,
    }, '-=0.4')
}

// ============================================
// PARALLAX
// ============================================
function initParallax() {
    const img = document.getElementById('hero-img')
    const tags = document.querySelectorAll('.orbit-tag')

    document.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        if (img) {
            gsap.to(img, {
                x: x * -7,
                y: y * -4,
                duration: 2.5,
                ease: 'power2.out',
            })
        }

        tags.forEach((tag, i) => {
            gsap.to(tag, {
                x: x * (8 + i * 6),
                y: y * (5 + i * 4),
                duration: 2.2,
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
