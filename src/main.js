import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
// MAGNETIC — nav only, subtle
// ============================================
function initMagnetic() {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2
            gsap.to(el, { x: x * 0.08, y: y * 0.08, duration: 0.4, ease: 'power2.out' })
        })
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' })
        })
    })
}

// ============================================
// ORBIT SYSTEM — 3D elliptical ring
// Tags always behind hero content (z-index < 10)
// Ellipse is wider + taller to CLEAR center text
// ============================================
const orbitState = {
    tags: [],
    count: 0,
    angleOffset: 0,
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    tilt: -12 * (Math.PI / 180),
    speed: 0.0008,
    active: false,
    revealed: false, // tags hidden until entrance completes
}

function initOrbitLayout() {
    const tags = document.querySelectorAll('.orbit-tag')
    orbitState.tags = Array.from(tags)
    orbitState.count = tags.length

    function updateEllipse() {
        const w = window.innerWidth
        const h = window.innerHeight
        orbitState.cx = w / 2
        orbitState.cy = h * 0.46
        // Wider + taller ellipse so tags orbit AROUND the text, not through it
        orbitState.rx = Math.min(w * 0.46, 700)
        orbitState.ry = Math.min(h * 0.32, 280)
    }

    updateEllipse()
    window.addEventListener('resize', updateEllipse)
    positionTags()
}

function positionTags() {
    const { tags, count, cx, cy, rx, ry, tilt, angleOffset } = orbitState

    tags.forEach((tag, i) => {
        const baseAngle = (i / count) * Math.PI * 2
        const angle = baseAngle + angleOffset

        const ex = Math.cos(angle) * rx
        const ey = Math.sin(angle) * ry

        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt)
        const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)

        // 3D depth
        const depth = Math.sin(angle) // -1 back, +1 front
        const scale = 0.7 + (depth + 1) * 0.18 // 0.7 – 1.06
        const opacity = 0.25 + (depth + 1) * 0.2 // 0.25 – 0.65
        // ALWAYS behind hero-content (z-index 10)
        const zIndex = depth > 0 ? 4 : 2

        const tagW = tag.offsetWidth / 2
        const tagH = tag.offsetHeight / 2

        // Clamp to viewport with padding
        const pad = 20
        const clampX = Math.max(pad, Math.min(x - tagW, window.innerWidth - tag.offsetWidth - pad))
        const clampY = Math.max(pad, Math.min(y - tagH, window.innerHeight - tag.offsetHeight - pad))

        tag.style.left = `${clampX}px`
        tag.style.top = `${clampY}px`
        tag.style.transform = `scale(${scale})`
        // Only set opacity once tags have been revealed by entrance animation
        if (orbitState.revealed) {
            tag.style.opacity = opacity
        }
        tag.style.zIndex = zIndex
    })
}

function startOrbitAnimation() {
    orbitState.active = true

    function tick() {
        if (!orbitState.active) return
        orbitState.angleOffset += orbitState.speed
        positionTags()
        requestAnimationFrame(tick)
    }
    tick()
}

// ============================================
// HERO ENTRANCE
// ============================================
function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Saturn reveal
    tl.to('#hero-img-wrap', {
        clipPath: 'circle(90% at 50% 45%)',
        duration: 3,
        ease: 'power2.inOut',
        delay: 0.3,
    })

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

    // 7. Orbit tags — only AFTER everything else is settled
    tl.call(() => {
        orbitState.tags.forEach((tag, i) => {
            gsap.to(tag, {
                opacity: 0.45,
                scale: 0.85,
                duration: 1,
                delay: 0.3 + i * 0.1,
                ease: 'power2.out',
                onComplete: () => {
                    if (i === orbitState.count - 1) {
                        orbitState.revealed = true
                        startOrbitAnimation()
                    }
                }
            })
        })
    })
}

// ============================================
// PARALLAX — image only
// ============================================
function initParallax() {
    const img = document.getElementById('hero-img')

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
    })
}

// ============================================
// FEATURES — scroll reveal
// ============================================
function initFeatures() {
    // Header reveal
    gsap.to('.feat-label', {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: '.feat-header', start: 'top 80%', toggleActions: 'play none none none' }
    })

    gsap.to('.feat-line', {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.15,
        scrollTrigger: { trigger: '.feat-h2', start: 'top 80%', toggleActions: 'play none none none' }
    })

    gsap.to('.feat-intro', {
        opacity: 1, y: 0, duration: 0.8, delay: 0.3,
        scrollTrigger: { trigger: '.feat-intro', start: 'top 85%', toggleActions: 'play none none none' }
    })

    // Bento cards staggered reveal
    const cards = document.querySelectorAll('[data-feat]')
    cards.forEach((card) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        })
    })
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAurora()
    initMagnetic()
    initOrbitLayout()
    initHero()
    initParallax()
    initFeatures()
})

