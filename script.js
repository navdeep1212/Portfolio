/* ==========================================================================
   PORTFOLIO INTERACTION & LOGIC
   Navdeep Chaurasia - Full Stack Developer & UI/UX Designer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Project Database ---
    const projectDatabase = {
        terrarun: {
            title: "Terra Run",
            category: "Full Stack • Geolocation • Multiplayer",
            description: "A real-world GPS-based multiplayer game where players physically walk or run to claim and conquer territory on a live map. Paths are drawn in real-time, and enclosed areas become the player's colored capture zone.",
            role: "Lead Full Stack Developer & Architect",
            features: [
                "Visualized player paths as dynamic polylines and captured zones as colored GeoJSON polygons using React.js and Leaflet.js.",
                "Designed MongoDB schemas to persist coordinate arrays, capture timestamps, area sizes, and user states.",
                "Built real-time location broadcasting using Socket.io to support live PvP territory captures and zone takeover logic.",
                "Engineered complex territory capture mechanics including full transfers, partial splits, and boundary reductions when paths intersect.",
                "Integrated global leaderboards tracking distance walked, areas claimed, and a stamina/energy system to prevent spam."
            ],
            tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Leaflet.js", "GeoJSON"],
            liveUrl: "#",
            githubUrl: "https://github.com"
        },
        interprep: {
            title: "InterPrep",
            category: "Full Stack • AI Integration • Speech Analysis",
            description: "An end-to-end interview preparation platform designed to simulate realistic technical and behavioral interviews, analyze speech behavior, and build candidate confidence through immediate AI guidance.",
            role: "Full Stack Developer & AI Integrator",
            features: [
                "Integrated speech-to-text functionality (Web Speech API) to record spoken answers and evaluate vocal pacing.",
                "Implemented AI feedback generation via OpenAI/Claude API to analyze answer structure, filler words, and confidence tone.",
                "Structured user dashboard in React.js showing historic progress charts, confidence scores, and custom recommendations.",
                "Designed distraction-free interview UI featuring interactive interviewer avatars, countdown timers, and contextual follow-up questions.",
                "Built Express API backend with MongoDB persistence for secure profile, session, and rating records."
            ],
            tech: ["React.js", "Node.js", "Express.js", "MongoDB", "OpenAI API", "Web Speech API", "Chart.js"],
            liveUrl: "#",
            githubUrl: "https://github.com"
        },
        skillswap: {
            title: "SkillSwap",
            category: "Full Stack • Database Design",
            description: "A multi-page learning and peer-to-peer skill exchange portal featuring custom user dashboards, community profile directories, and skill matching query services.",
            role: "Full Stack Web Intern & Database Designer",
            features: [
                "Collaborated on relational and non-relational database schema designs, optimizing exchange-pair lookup performance.",
                "Designed dynamic profile dashboards in React.js to manage listed skill offerings and request queues.",
                "Implemented seamless client-side page routing with React Router and state preservation hooks.",
                "Developed search and filter logic based on skill categories, ratings, and active status."
            ],
            tech: ["HTML5", "CSS3", "JavaScript", "React.js", "Node.js", "Express.js", "MongoDB"],
            liveUrl: "#",
            githubUrl: "https://github.com"
        }
    };

    // --- Navigation Drawer (Hamburger Menu) ---
    const openDrawerBtn = document.getElementById('open-drawer');
    const closeDrawerBtn = document.getElementById('close-drawer');
    const navDrawer = document.getElementById('nav-drawer');
    const navLinks = document.querySelectorAll('.nav-link-item');

    function openDrawer() {
        navDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }

    function closeDrawer() {
        navDrawer.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (openDrawerBtn) openDrawerBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

    // Close drawer when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
            
            // Set active class immediately on click
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // --- Active Link Highlight on Scroll ---
    const sections = document.querySelectorAll('.canvas-section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Target center of screen
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Mouse Parallax for 3D Floating Cubes ---
    const parallaxContainer = document.getElementById('parallax-container');
    const cubes = document.querySelectorAll('.floating-cube');
    let mouseX = 0;
    let mouseY = 0;
    
    // Smooth transition vars
    let currentX = 0;
    let currentY = 0;
    const easeFactor = 0.08;

    window.addEventListener('mousemove', (e) => {
        // Calculate coordinate percentages from center of window (-50 to 50)
        mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * 50;
        mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2) * 50;
    });

    function animateParallax() {
        // Interpolate movement for extra smooth drag effect
        currentX += (mouseX - currentX) * easeFactor;
        currentY += (mouseY - currentY) * easeFactor;

        cubes.forEach(cube => {
            const depth = parseFloat(cube.getAttribute('data-depth')) || 0.2;
            const moveX = currentX * depth * 20;
            const moveY = currentY * depth * 20;
            
            // Combine floating frame offset (controlled by CSS) and mouse position
            // We use transform translate3d for hardware acceleration
            cube.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });

        requestAnimationFrame(animateParallax);
    }
    
    // Start animation loop
    if (cubes.length > 0) {
        animateParallax();
    }

    // --- Project Details Drawer Modal ---
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');

    window.openProjectModal = function(projectId) {
        const project = projectDatabase[projectId];
        if (!project) return;

        // Build HTML payload
        let featuresHTML = "";
        project.features.forEach(feature => {
            featuresHTML += `<li>${feature}</li>`;
        });

        let techHTML = "";
        project.tech.forEach(t => {
            techHTML += `<span>${t}</span>`;
        });

        modalBody.innerHTML = `
            <span class="modal-proj-cat">${project.category}</span>
            <h2 class="modal-proj-title">${project.title}</h2>
            
            <p class="role-tag" style="margin-bottom: 20px;">Role: ${project.role}</p>
            
            <div class="modal-proj-body">
                <p>${project.description}</p>
                <h3 style="color: var(--color-text-white); margin-top: 30px; margin-bottom: 15px; font-size: 1.2rem;">Key Contributions & Features:</h3>
                <ul class="modal-proj-list">
                    ${featuresHTML}
                </ul>
            </div>
            
            <h3 style="color: var(--color-text-white); margin-bottom: 15px; font-size: 1.1rem;">Technologies Used:</h3>
            <div class="project-tags" style="margin-bottom: 40px;">
                ${techHTML}
            </div>
            
            <div class="modal-proj-btn-group">
                <a href="${project.liveUrl}" class="btn-orange" target="_blank" style="text-align: center;">Launch Application</a>
                <a href="${project.githubUrl}" class="btn-outline-header" target="_blank" style="text-align: center; border-radius: 30px; padding: 14px 32px;">View Source Code</a>
            </div>
        `;

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function closeProjectModal() {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);
    
    // Close modal on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('portfolio-contact-form');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract values
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const phone = document.getElementById('form-phone').value;
            const message = document.getElementById('form-message').value;

            // Simple validation check
            if (!name || !email || !message) {
                showToast("Please fill in all required fields.", false);
                return;
            }

            // Simulate form submission (e.g. EmailJS connection API block)
            console.log("--- Contact Form submission received ---");
            console.log("Name:", name);
            console.log("Email:", email);
            console.log("Phone:", phone);
            console.log("Message:", message);
            console.log("-----------------------------------------");

            // Success state handling
            showToast(`Thank you, ${name}! Your message was sent successfully.`, true);
            contactForm.reset();
        });
    }

    function showToast(message, isSuccess = true) {
        toastMsg.textContent = message;
        const icon = toast.querySelector('.toast-icon');
        
        if (isSuccess) {
            icon.textContent = "✓";
            icon.style.backgroundColor = "var(--color-orange)";
        } else {
            icon.textContent = "✕";
            icon.style.backgroundColor = "#d32f2f"; // red error icon
        }

        toast.classList.add('show');

        // Hide toast after 4.5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4500);
    }
});
