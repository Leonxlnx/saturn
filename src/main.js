import './style.css'
import gsap from 'gsap'

// ============================================
// AURORA
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
            a2.style.left = (bx + 100) + 'px'
            a2.style.top = (by - 80) + 'px'
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
// ORBIT TAG INDEPENDENT ANIMATIONS
// ============================================
function animateOrbitTags() {
    const tags = document.querySelectorAll('.orbit-tag')
    tags.forEach((tag, i) => {
        // Each tag gets its own looping drift animation
        const dur = 10 + i * 3
        const xRange = 15 + Math.random() * 15
        const yRange = 10 + Math.random() * 12
        const rot = 1 + Math.random() * 1.5

        gsap.to(tag, {
            x: `+=${xRange}`,
            y: `-=${yRange}`,
            rotation: rot,
            duration: dur / 2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        })

        // Also add a secondary micro-drift
        gsap.to(tag, {
            x: `-=${xRange * 0.4}`,
            y: `+=${yRange * 0.5}`,
            duration: dur / 3,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.3,
        })
    })
}

// ============================================
// HERO — cinematic Saturn reveal
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Saturn circular reveal — starts dark, circle expands
    tl.to('#hero-img-wrap', {
        clipPath: 'circle(90% at 50% 45%)',
        duration: 3,
        ease: 'power2.inOut',
        delay: 0.3,
    })

    // Simultaneous zoom settle
    tl.to('.hero-img', {
        scale: 1,
        duration: 3.5,
        ease: 'power2.out',
    }, '<')

    // 2. Nav
    tl.to('#nav', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        clearProps: 'transform',
        onComplete: () => {
            const nav = document.getElementById('nav')
            if (nav) nav.style.transform = 'translateX(-50%)'
        }
    }, '-=2.2')

    // 3. Eyebrow
    tl.to('.hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=1.6')

    // 4. Title words
    tl.to('.h1-word', {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.2,
        ease: 'power4.out',
    }, '-=1.3')

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
        duration: 0.65,
    }, '-=0.35')

    // 7. Tags — fly in from off-screen with spring
    const tags = document.querySelectorAll('.orbit-tag')
    tags.forEach((tag, i) => {
        // Determine which side tag comes from
        const fromLeft = tag.classList.contains('ot-1') || tag.classList.contains('ot-4') || tag.classList.contains('ot-6')
        const startX = fromLeft ? -120 : 120
        const startY = (Math.random() - 0.5) * 60

        gsap.set(tag, { x: startX, y: startY })

        tl.to(tag, {
            opacity: 0.9,
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(0.8, 0.6)',
        }, `-=${0.85 - i * 0.06}`)
    })

    // After entrance, start the tag drift animations
    tl.call(animateOrbitTags)
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
                x: x * -10,
                y: y * -6,
                duration: 2.5,
                ease: 'power2.out',
            })
        }

        // Tags react to mouse at different intensities
        tags.forEach((tag, i) => {
            const intensity = 4 + i * 2.5
            gsap.to(tag, {
                x: `+=${x * intensity * 0.15}`,
                y: `+=${y * intensity * 0.1}`,
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
