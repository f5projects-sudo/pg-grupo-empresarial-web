const canvas = document.getElementById('bubble-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let time = 0;
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

function init() {
    resize();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    mouse.x = mouse.targetX = width / 2;
    mouse.y = mouse.targetY = height / 2;
}

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
});

function drawWaves() {
    time += 0.005;

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Create a series of semi-transparent overlapping waves
    const waveCount = 3;
    for (let i = 0; i < waveCount; i++) {
        const opacity = 0.15 - (i * 0.03);
        const color = `rgba(23, 54, 245, ${opacity})`;

        ctx.fillStyle = color;
        ctx.beginPath();

        const frequency = 0.002 + (i * 0.001);
        const amplitude = 50 + (i * 20);
        const speed = time + (i * 2);

        // Draw wave from left to right
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 10) {
            // Base sin wave + mouse interaction offset
            const mouseFactor = (mouse.x / width) * 2 - 1;
            const yOffset = (mouse.y / height) * 100 - 50;

            const y = height * 0.7 +
                Math.sin(x * frequency + speed) * amplitude +
                Math.cos(x * frequency * 0.5 + speed * 0.8) * (amplitude * 0.5) +
                yOffset +
                (mouseFactor * x * 0.05);

            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }

    // Add a soft radial glow that follows the cursor
    const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, width * 0.5);
    gradient.addColorStop(0, 'rgba(23, 54, 245, 0.15)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

function animate() {
    drawWaves();
    requestAnimationFrame(animate);
}

init();

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about')) {
                startAboutAnimations(entry.target);
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.about');
if (aboutSection) observer.observe(aboutSection);

function startAboutAnimations(section) {
    // Start Typing Animations
    const typingElements = section.querySelectorAll('[class^="typing-"]');
    typingElements.forEach(el => {
        const text = el.getAttribute('data-text');
        typeWriter(el, text, 0);
    });

    // Start Counter Animations
    const counters = section.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        countUp(counter, target);
    });
}

function typeWriter(element, text, i) {
    if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1);
        setTimeout(() => typeWriter(element, text, i + 1), 30);
    } else {
        // Once finished, remove the typing class to hide the cursor if desired
        // element.classList.add('typing-done');
    }
}

function countUp(element, target) {
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    const updateCount = () => {
        count += increment;
        if (count < target) {
            element.innerText = Math.floor(count);
            requestAnimationFrame(updateCount);
        } else {
            element.innerText = target;
        }
    };
    updateCount();
}
