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
// ORBIT SYSTEM — tags on a 3D elliptical ring
// ============================================
const orbitState = {
    tags: [],
    count: 0,
    angleOffset: 0,
    // Ellipse params — will be recalculated on resize
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0,
    tilt: -10 * (Math.PI / 180), // slight tilt for 3D
    speed: 0.0003, // radians per frame — very slow
    active: false,
}

function initOrbitLayout() {
    const hero = document.getElementById('hero')
    if (!hero) return

    const tags = document.querySelectorAll('.orbit-tag')
    orbitState.tags = Array.from(tags)
    orbitState.count = tags.length

    function updateEllipse() {
        const w = window.innerWidth
        const h = window.innerHeight
        orbitState.cx = w / 2
        orbitState.cy = h * 0.47
        orbitState.rx = Math.min(w * 0.42, 620) // horizontal radius clamped
        orbitState.ry = Math.min(h * 0.2, 170)   // vertical radius — flat = 3D look
    }

    updateEllipse()
    window.addEventListener('resize', updateEllipse)

    // Position tags immediately (hidden)
    positionTags()
}

function positionTags() {
    const { tags, count, cx, cy, rx, ry, tilt, angleOffset } = orbitState

    tags.forEach((tag, i) => {
        const baseAngle = (i / count) * Math.PI * 2
        const angle = baseAngle + angleOffset

        // Ellipse position
        const ex = Math.cos(angle) * rx
        const ey = Math.sin(angle) * ry

        // Apply tilt rotation
        const x = cx + ex * Math.cos(tilt) - ey * Math.sin(tilt)
        const y = cy + ex * Math.sin(tilt) + ey * Math.cos(tilt)

        // 3D depth: items at "back" (top) are smaller + more transparent
        const depth = Math.sin(angle) // -1 = back, 1 = front
        const scale = 0.75 + (depth + 1) * 0.15 // 0.75 to 1.05
        const opacity = 0.3 + (depth + 1) * 0.25 // 0.3 to 0.8
        const zIndex = depth > 0 ? 8 : 3 // front = above content, back = behind

        // Center the tag on the point
        const tagW = tag.offsetWidth / 2
        const tagH = tag.offsetHeight / 2

        tag.style.left = `${x - tagW}px`
        tag.style.top = `${y - tagH}px`
        tag.style.transform = `scale(${scale})`
        tag.style.opacity = opacity
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

    // 1. Saturn circular reveal
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

    // 7. Orbit tags fade in (they're already positioned by initOrbitLayout)
    tl.call(() => {
        // Tags fade in from their orbital positions
        orbitState.tags.forEach((tag, i) => {
            gsap.fromTo(tag,
                { opacity: 0, scale: 0.5 },
                {
                    opacity: tag.style.opacity || 0.5,
                    scale: tag.style.transform ? parseFloat(tag.style.transform.match(/scale\((.+)\)/)?.[1] || 0.85) : 0.85,
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: 'back.out(1.5)',
                    onComplete: () => {
                        if (i === orbitState.count - 1) {
                            startOrbitAnimation()
                        }
                    }
                }
            )
        })
    }, null, '-=0.3')
}

// ============================================
// PARALLAX
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
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAurora()
    initMagnetic()
    initOrbitLayout()
    initHero()
    initParallax()
})
