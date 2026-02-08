import './style.css'
import gsap from 'gsap'

// ============================================
// STARFIELD CANVAS
// ============================================
function initStarfield() {
    const canvas = document.getElementById('starfield')
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let stars = []
    const STAR_COUNT = 200

    function resize() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    function createStars() {
        stars = []
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.2 + 0.2,
                opacity: Math.random() * 0.6 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.008 + 0.002,
            })
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (const star of stars) {
            star.pulse += star.pulseSpeed
            const alpha = star.opacity + Math.sin(star.pulse) * 0.15

            ctx.beginPath()
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(240, 236, 228, ${Math.max(0, alpha)})`
            ctx.fill()
        }

        requestAnimationFrame(draw)
    }

    resize()
    createStars()
    draw()

    window.addEventListener('resize', () => {
        resize()
        createStars()
    })
}

// ============================================
// CURSOR GLOW
// ============================================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow')
    if (!glow) return

    let mouseX = 0, mouseY = 0
    let glowX = 0, glowY = 0

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        glow.classList.add('active')
    })

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active')
    })

    function animate() {
        glowX += (mouseX - glowX) * 0.08
        glowY += (mouseY - glowY) * 0.08
        glow.style.left = glowX + 'px'
        glow.style.top = glowY + 'px'
        requestAnimationFrame(animate)
    }

    animate()
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn')

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.4,
                ease: 'power2.out'
            })
        })

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            })
        })
    })
}

// ============================================
// HERO ENTRANCE ANIMATIONS
// ============================================
function initHeroAnimations() {
    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.3
    })

    // Navbar fade in
    tl.from('#navbar', {
        y: -20,
        opacity: 0,
        duration: 0.8,
    })

    // Badge
    tl.to('#hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.4')

    // Title words — staggered reveal
    tl.to('[data-word]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power4.out',
    }, '-=0.3')

    // Description
    tl.to('#hero-desc', {
        opacity: 1,
        y: 0,
        duration: 0.7,
    }, '-=0.4')

    // Buttons
    tl.to('#hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.4')

    // Social proof
    tl.to('#hero-proof', {
        opacity: 1,
        y: 0,
        duration: 0.6,
    }, '-=0.3')

    // Saturn scene
    tl.to('#saturn-scene', {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
    }, '-=0.8')

    // Scroll indicator
    tl.to('#scroll-indicator', {
        opacity: 0.5,
        duration: 0.8,
    }, '-=0.3')
}

// ============================================
// PLANET PARALLAX ON MOUSE MOVE
// ============================================
function initPlanetParallax() {
    const scene = document.getElementById('saturn-scene')
    if (!scene) return

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2

        gsap.to(scene, {
            rotateY: x * 8,
            rotateX: -y * 5,
            duration: 1.2,
            ease: 'power2.out'
        })
    })
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavScroll() {
    const navbar = document.getElementById('navbar')
    if (!navbar) return

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(240, 236, 228, 0.08)'
            navbar.style.background = 'rgba(6, 6, 8, 0.85)'
        } else {
            navbar.style.borderBottomColor = 'rgba(240, 236, 228, 0.06)'
            navbar.style.background = 'rgba(6, 6, 8, 0.6)'
        }
    })
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initStarfield()
    initCursorGlow()
    initMagneticButtons()
    initHeroAnimations()
    initPlanetParallax()
    initNavScroll()
})
