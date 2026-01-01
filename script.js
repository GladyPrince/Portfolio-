document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll behavior
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');

                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }

                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('timeline-animate');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .timeline-item, .skill-category, .award-card, .cert-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Skill Bars
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar-inner');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-width');
            }, index * 100);
        });
    }

    // Scroll Spy
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Typing Animation
    const tagline = document.querySelector('.typing-text');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.display = 'inline-block';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 500);
    }

    // Mobile Menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
            navToggle.classList.toggle('toggle-active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-active');
                navToggle.classList.remove('toggle-active');
            });
        });
    }

    // Stagger Lists
    document.querySelectorAll('.stagger-list').forEach(list => {
        const items = list.querySelectorAll('li');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    });

    /******************
     * STARFIELD LOGIC
     ******************/
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        let mouse = { x: null, y: null };

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
        }

        function initStars() {
            stars = [];
            const starCount = Math.floor((width * height) / 6000);

            for (let i = 0; i < starCount; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 2;
                const opacity = Math.random();
                const speedX = (Math.random() - 0.5) * 0.2;
                const speedY = (Math.random() - 0.5) * 0.2;

                stars.push(new Star(x, y, size, opacity, speedX, speedY));
            }
        }

        class Star {
            constructor(x, y, size, opacity, speedX, speedY) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = size;
                this.opacity = opacity;
                this.speedX = speedX;
                this.speedY = speedY;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }

            update() {
                this.baseX += this.speedX;
                this.baseY += this.speedY;

                if (this.baseX < 0) this.baseX = width;
                if (this.baseX > width) this.baseX = 0;
                if (this.baseY < 0) this.baseY = height;
                if (this.baseY > height) this.baseY = 0;

                let dx = mouse.x - this.baseX;
                let dy = mouse.y - this.baseY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (mouse.x && distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const directionX = (dx / distance) * force * 50;
                    const directionY = (dy / distance) * force * 50;

                    this.x = this.baseX - directionX;
                    this.y = this.baseY - directionY;
                } else {
                    if (Math.abs(this.x - this.baseX) > 0.1 || Math.abs(this.y - this.baseY) > 0.1) {
                        this.x -= (this.x - this.baseX) / 10;
                        this.y -= (this.y - this.baseY) / 10;
                    } else {
                        this.x = this.baseX;
                        this.y = this.baseY;
                    }
                }

                this.draw();
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => star.update());
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resize();
        animate();
    }
});

// Loading Animation outside DOMContentLoaded to start ASAP if possible,
// but safely inside 'load' event.
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
