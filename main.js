// The Prompt Atlas - Main JavaScript File
// Comprehensive interactive features and visualizations

class PromptAtlas {
    constructor() {
        this.isLoaded = false;
        this.visualizations = {};
        this.currentSection = 'home';
        this.notifications = [];
        
        this.init();
    }
    
    init() {
        this.setupLoadingScreen();
        this.setupEventListeners();
        this.initializeVisualizations();
        this.setupScrollAnimations();
        this.setupTypedText();
        this.setupStarField();
        this.setupNeuralNetwork();
        
        // Simulate loading progress
        this.simulateLoading();
    }
    
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingProgress = document.getElementById('loadingProgress');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        this.isLoaded = true;
                        this.showNotification('The Prompt Atlas is ready to explore!', 'success');
                    }, 500);
                }, 500);
            }
            loadingProgress.style.width = `${progress}%`;
        }, 200);
    }
    
    simulateLoading() {
        const steps = [
            'Initializing cosmic constants...',
            'Loading neural network visualizations...',
            'Setting up quantum probability clouds...',
            'Calibrating AI ethics simulators...',
            'Preparing interactive experiences...',
            'The Prompt Atlas is ready!'
        ];
        
        let currentStep = 0;
        const stepInterval = setInterval(() => {
            if (currentStep < steps.length - 1) {
                this.updateLoadingText(steps[currentStep]);
                currentStep++;
            } else {
                clearInterval(stepInterval);
            }
        }, 1000);
    }
    
    updateLoadingText(text) {
        const loadingText = document.querySelector('#loadingScreen p');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
        
        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Scroll handler for parallax effects
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }
    
    toggleMobileMenu() {
        // Mobile menu implementation
        this.showNotification('Mobile menu feature coming soon!', 'info');
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.currentSection = sectionId;
        }
    }
    
    handleResize() {
        // Redraw visualizations on resize
        Object.values(this.visualizations).forEach(viz => {
            if (viz && viz.resize) {
                viz.resize();
            }
        });
    }
    
    handleScroll() {
        // Parallax effects and section tracking
        const scrollY = window.scrollY;
        
        // Update current section
        const sections = ['home', 'chapters', 'visualizations', 'interactive', 'about'];
        for (let section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    this.currentSection = section;
                    break;
                }
            }
        }
        
        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }
    
    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal').forEach(element => {
            observer.observe(element);
        });
    }
    
    setupTypedText() {
        const typed = new Typed('#typedText', {
            strings: [
                'A Guide for AI & Humanity',
                'Interactive Visualizations',
                'Educational Experiences',
                'The Future of Intelligence',
                'Navigate Questions • Reflect Yourself'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: false
        });
    }
    
    setupStarField() {
        const starField = document.getElementById('starField');
        if (!starField) return;
        
        // Create star field using p5.js
        new p5((p) => {
            let stars = [];
            const numStars = 200;
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('starField');
                
                // Initialize stars
                for (let i = 0; i < numStars; i++) {
                    stars.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        size: p.random(1, 3),
                        brightness: p.random(0.3, 1),
                        twinkleSpeed: p.random(0.01, 0.03)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Draw stars
                stars.forEach(star => {
                    const twinkle = p.sin(p.frameCount * star.twinkleSpeed) * 0.5 + 0.5;
                    const alpha = star.brightness * twinkle;
                    
                    p.fill(251, 191, 36, alpha * 255);
                    p.noStroke();
                    p.ellipse(star.x, star.y, star.size);
                    
                    // Subtle movement
                    star.x += p.sin(p.frameCount * 0.001 + star.x * 0.01) * 0.1;
                    star.y += p.cos(p.frameCount * 0.001 + star.y * 0.01) * 0.1;
                    
                    // Wrap around screen
                    if (star.x > p.width) star.x = 0;
                    if (star.x < 0) star.x = p.width;
                    if (star.y > p.height) star.y = 0;
                    if (star.y < 0) star.y = p.height;
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }
    
    setupNeuralNetwork() {
        const neuralNetwork = document.getElementById('neuralNetwork');
        if (!neuralNetwork) return;
        
        // Create neural network visualization using p5.js
        new p5((p) => {
            let nodes = [];
            let connections = [];
            const numNodes = 50;
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('neuralNetwork');
                
                // Initialize nodes
                for (let i = 0; i < numNodes; i++) {
                    nodes.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6),
                        connections: []
                    });
                }
                
                // Create connections between nearby nodes
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const distance = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        if (distance < 150) {
                            connections.push({
                                from: i,
                                to: j,
                                strength: p.map(distance, 0, 150, 1, 0.1)
                            });
                        }
                    }
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw connections
                connections.forEach(conn => {
                    const fromNode = nodes[conn.from];
                    const toNode = nodes[conn.to];
                    const alpha = conn.strength * 100;
                    
                    p.stroke(124, 58, 237, alpha);
                    p.strokeWeight(conn.strength * 2);
                    p.line(fromNode.x, fromNode.y, toNode.x, toNode.y);
                });
                
                // Update and draw nodes
                nodes.forEach((node, index) => {
                    // Update position
                    node.x += node.vx;
                    node.y += node.vy;
                    
                    // Bounce off edges
                    if (node.x < 0 || node.x > p.width) node.vx *= -1;
                    if (node.y < 0 || node.y > p.height) node.vy *= -1;
                    
                    // Keep within bounds
                    node.x = p.constrain(node.x, 0, p.width);
                    node.y = p.constrain(node.y, 0, p.height);
                    
                    // Draw node
                    const pulse = p.sin(p.frameCount * 0.02 + index) * 0.5 + 0.5;
                    const alpha = pulse * 200 + 55;
                    
                    p.fill(251, 191, 36, alpha);
                    p.noStroke();
                    p.ellipse(node.x, node.y, node.size * (1 + pulse * 0.5));
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }
    
    initializeVisualizations() {
        this.initHeroVisualization();
        this.initNeuralNetworkViz();
        this.initEcosystemViz();
        this.initQuantumViz();
        this.initAuthorVisualization();
    }
    
    initHeroVisualization() {
        const container = document.getElementById('heroVisualization');
        if (!container) return;
        
        // Create Three.js scene for hero visualization
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create floating geometric shapes
        const geometries = [
            new THREE.IcosahedronGeometry(1, 1),
            new THREE.OctahedronGeometry(1, 1),
            new THREE.TetrahedronGeometry(1, 1),
            new THREE.DodecahedronGeometry(1, 1)
        ];
        
        const shapes = [];
        for (let i = 0; i < 20; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            shapes.push(mesh);
            scene.add(mesh);
        }
        
        camera.position.z = 15;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            shapes.forEach((shape, index) => {
                shape.rotation.x += 0.005 * (index % 3 + 1);
                shape.rotation.y += 0.003 * (index % 2 + 1);
                shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Handle resize
        const resizeHandler = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        
        window.addEventListener('resize', resizeHandler);
        
        // Store for cleanup
        this.visualizations.hero = { scene, camera, renderer, shapes, resizeHandler };
    }
    
    initNeuralNetworkViz() {
        const container = document.getElementById('neuralNetworkViz');
        if (!container) return;
        
        // Create ECharts neural network visualization
        const chart = echarts.init(container);
        
        const nodes = [];
        const links = [];
        const categories = [
            { name: 'Input Layer', itemStyle: { color: '#fbbf24' } },
            { name: 'Hidden Layer', itemStyle: { color: '#7c3aed' } },
            { name: 'Output Layer', itemStyle: { color: '#0d9488' } }
        ];
        
        // Create nodes
        for (let i = 0; i < 8; i++) {
            nodes.push({
                id: `input_${i}`,
                name: `Input ${i + 1}`,
                category: 0,
                x: Math.cos(i * Math.PI / 4) * 100,
                y: Math.sin(i * Math.PI / 4) * 100,
                symbolSize: 20
            });
        }
        
        for (let i = 0; i < 6; i++) {
            nodes.push({
                id: `hidden_${i}`,
                name: `Hidden ${i + 1}`,
                category: 1,
                x: Math.cos(i * Math.PI / 3) * 50,
                y: Math.sin(i * Math.PI / 3) * 50,
                symbolSize: 25
            });
        }
        
        for (let i = 0; i < 4; i++) {
            nodes.push({
                id: `output_${i}`,
                name: `Output ${i + 1}`,
                category: 2,
                x: Math.cos(i * Math.PI / 2) * 0,
                y: Math.sin(i * Math.PI / 2) * 0,
                symbolSize: 30
            });
        }
        
        // Create links
        nodes.forEach((node, index) => {
            if (node.category === 0) {
                nodes.filter(n => n.category === 1).forEach(hiddenNode => {
                    links.push({
                        source: node.id,
                        target: hiddenNode.id,
                        lineStyle: { opacity: 0.6 }
                    });
                });
            } else if (node.category === 1) {
                nodes.filter(n => n.category === 2).forEach(outputNode => {
                    links.push({
                        source: node.id,
                        target: outputNode.id,
                        lineStyle: { opacity: 0.6 }
                    });
                });
            }
        });
        
        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        return `${params.data.name}<br/>Category: ${categories[params.data.category].name}`;
                    } else {
                        return `${params.data.source} → ${params.data.target}`;
                    }
                }
            },
            legend: {
                data: categories.map(c => c.name),
                textStyle: { color: '#f8fafc' },
                top: 20
            },
            series: [{
                type: 'graph',
                layout: 'none',
                data: nodes,
                links: links,
                categories: categories,
                roam: true,
                focusNodeAdjacency: true,
                itemStyle: {
                    borderColor: '#fbbf24',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#7c3aed',
                    curveness: 0.1,
                    width: 2
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 4
                    }
                },
                animationDuration: 1500,
                animationEasingUpdate: 'quinticInOut'
            }]
        };
        
        chart.setOption(option);
        
        // Animation
        let animationFrame = 0;
        const animate = () => {
            animationFrame++;
            
            // Animate node positions
            nodes.forEach((node, index) => {
                if (node.category === 1) { // Hidden layer
                    const time = animationFrame * 0.02;
                    node.x += Math.sin(time + index) * 0.5;
                    node.y += Math.cos(time + index) * 0.5;
                }
            });
            
            chart.setOption({
                series: [{
                    data: nodes
                }]
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        // Store for cleanup
        this.visualizations.neuralNetwork = { chart, nodes, links };
    }
    
    initEcosystemViz() {
        const container = document.getElementById('ecosystemViz');
        if (!container) return;
        
        // Create p5.js ecosystem simulation
        new p5((p) => {
            let particles = [];
            let connections = [];
            const numParticles = 30;
            
            p.setup = () => {
                const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
                canvas.parent('ecosystemViz');
                
                // Initialize particles
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-1, 1),
                        vy: p.random(-1, 1),
                        size: p.random(3, 8),
                        type: p.random(['producer', 'consumer', 'decomposer']),
                        energy: p.random(50, 100),
                        color: p.random(['#10b981', '#f59e0b', '#8b5cf6'])
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw connections
                connections = [];
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const distance = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                        if (distance < 80) {
                            connections.push({
                                x1: particles[i].x,
                                y1: particles[i].y,
                                x2: particles[j].x,
                                y2: particles[j].y,
                                strength: p.map(distance, 0, 80, 1, 0.1)
                            });
                        }
                    }
                }
                
                connections.forEach(conn => {
                    p.stroke(13, 148, 136, conn.strength * 100);
                    p.strokeWeight(conn.strength * 2);
                    p.line(conn.x1, conn.y1, conn.x2, conn.y2);
                });
                
                // Update and draw particles
                particles.forEach(particle => {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Bounce off edges
                    if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                    
                    // Keep within bounds
                    particle.x = p.constrain(particle.x, 0, p.width);
                    particle.y = p.constrain(particle.y, 0, p.height);
                    
                    // Draw particle
                    p.fill(particle.color);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, particle.size);
                    
                    // Energy indicator
                    const energySize = p.map(particle.energy, 0, 100, 2, particle.size);
                    p.fill(255, 255, 255, 100);
                    p.ellipse(particle.x, particle.y, energySize);
                    
                    // Update energy
                    particle.energy += p.random(-1, 1);
                    particle.energy = p.constrain(particle.energy, 0, 100);
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(container.clientWidth, container.clientHeight);
            };
        });
    }
    
    initQuantumViz() {
        const container = document.getElementById('quantumViz');
        if (!container) return;
        
        // Create p5.js quantum visualization
        new p5((p) => {
            let particles = [];
            let waveFunction = [];
            let isCollapsed = false;
            
            p.setup = () => {
                const canvas = p.createCanvas(container.clientWidth, container.clientHeight);
                canvas.parent('quantumViz');
                
                // Initialize quantum particles
                for (let i = 0; i < 5; i++) {
                    particles.push({
                        x: p.width / 2,
                        y: p.height / 2,
                        vx: p.random(-2, 2),
                        vy: p.random(-2, 2),
                        probability: p.random(0.1, 1),
                        entangled: false,
                        entangledWith: null
                    });
                }
                
                // Initialize wave function
                for (let x = 0; x < p.width; x += 5) {
                    for (let y = 0; y < p.height; y += 5) {
                        const distance = p.dist(x, y, p.width / 2, p.height / 2);
                        const probability = p.exp(-distance * 0.01);
                        waveFunction.push({ x, y, probability });
                    }
                }
            };
            
            p.draw = () => {
                p.clear();
                
                if (!isCollapsed) {
                    // Draw wave function
                    waveFunction.forEach(point => {
                        const alpha = point.probability * 50;
                        p.fill(124, 58, 237, alpha);
                        p.noStroke();
                        p.ellipse(point.x, point.y, 3);
                    });
                }
                
                // Draw particles
                particles.forEach((particle, index) => {
                    if (!isCollapsed) {
                        // Quantum superposition - multiple positions
                        const numPositions = Math.floor(particle.probability * 10) + 1;
                        for (let i = 0; i < numPositions; i++) {
                            const offsetX = p.random(-20, 20);
                            const offsetY = p.random(-20, 20);
                            const alpha = (1 - i / numPositions) * 100;
                            
                            p.fill(251, 191, 36, alpha);
                            p.noStroke();
                            p.ellipse(particle.x + offsetX, particle.y + offsetY, 4);
                        }
                    } else {
                        // Collapsed state - single position
                        p.fill(251, 191, 36);
                        p.noStroke();
                        p.ellipse(particle.x, particle.y, 6);
                    }
                    
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Bounce off edges
                    if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                    
                    // Keep within bounds
                    particle.x = p.constrain(particle.x, 0, p.width);
                    particle.y = p.constrain(particle.y, 0, p.height);
                    
                    // Entanglement visualization
                    if (particle.entangled && particle.entangledWith) {
                        const otherParticle = particles[particle.entangledWith];
                        p.stroke(236, 72, 153, 150);
                        p.strokeWeight(2);
                        p.line(particle.x, particle.y, otherParticle.x, otherParticle.y);
                    }
                });
            };
            
            p.windowResized = () => {
                p.resizeCanvas(container.clientWidth, container.clientHeight);
            };
            
            // Expose functions for interaction
            window.collapseWavefunction = () => {
                isCollapsed = true;
                particles.forEach(particle => {
                    // Randomly select one position
                    particle.x += p.random(-20, 20);
                    particle.y += p.random(-20, 20);
                });
            };
            
            window.entangleParticles = () => {
                if (particles.length >= 2) {
                    particles[0].entangled = true;
                    particles[0].entangledWith = 1;
                    particles[1].entangled = true;
                    particles[1].entangledWith = 0;
                }
            };
        });
    }
    
    initAuthorVisualization() {
        const container = document.getElementById('authorVisualization');
        if (!container) return;
        
        // Create Three.js author visualization
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create author portrait using particles
        const particles = [];
        const particleCount = 1000;
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.1 + Math.random() * 0.1, 0.8, 0.6),
                transparent: true,
                opacity: Math.random() * 0.8 + 0.2
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Create portrait-like distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 3;
            const height = Math.sin(angle * 2) * 0.5 + Math.cos(angle) * 0.3;
            
            particle.position.set(
                Math.cos(angle) * radius,
                height,
                Math.sin(angle) * radius
            );
            
            particle.userData = {
                originalPosition: particle.position.clone(),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.01
                )
            };
            
            particles.push(particle);
            scene.add(particle);
        }
        
        camera.position.z = 5;
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
            particles.forEach(particle => {
                // Gentle floating animation
                particle.position.add(particle.userData.velocity);
                
                // Return to original position
                const direction = particle.userData.originalPosition.clone().sub(particle.position);
                particle.position.add(direction.multiplyScalar(0.02));
                
                // Pulse opacity
                const time = Date.now() * 0.001;
                particle.material.opacity = (Math.sin(time + particle.position.x) * 0.5 + 0.5) * 0.8 + 0.2;
            });
            
            // Rotate entire scene
            scene.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        };
        
        animate();
        
        // Store for cleanup
        this.visualizations.author = { scene, camera, renderer, particles };
    }
    
    // Interactive Functions
    generatePrompt() {
        const context = document.getElementById('promptContext').value;
        const style = document.getElementById('promptStyle').value;
        
        const prompts = {
            descriptive: [
                `Describe a ${context} in vivid detail, focusing on sensory experiences and atmospheric elements.`,
                `Paint a picture with words of ${context}, including colors, textures, and emotions.`,
                `Create a detailed observation of ${context} as if seeing it for the first time.`
            ],
            technical: [
                `Analyze the technical specifications and engineering challenges of ${context}.`,
                `Explain the scientific principles behind ${context} in precise technical language.`,
                `Document the implementation process for ${context} including code examples.`
            ],
            creative: [
                `Imagine ${context} as a character in a story. What would its personality be?`,
                `Create a myth or legend about the origin of ${context}.`,
                `Write a poem that captures the essence of ${context} in metaphorical language.`
            ],
            analytical: [
                `Compare and contrast ${context} with similar concepts throughout history.`,
                `Analyze the social, economic, and cultural implications of ${context}.`,
                `Evaluate the effectiveness of ${context} using quantitative metrics.`
            ]
        };
        
        const stylePrompts = prompts[style] || prompts.descriptive;
        const randomPrompt = stylePrompts[Math.floor(Math.random() * stylePrompts.length)];
        
        document.getElementById('generatedPrompt').innerHTML = `
            <div class="text-cosmic-gold font-semibold mb-2">Generated Prompt:</div>
            <div class="text-gray-300">${randomPrompt}</div>
        `;
        
        this.showNotification('New prompt generated successfully!', 'success');
    }
    
    handleEthicsChoice(choice) {
        const results = {
            ignore: {
                result: "Ignoring bias can perpetuate discrimination and harm marginalized groups.",
                recommendation: "Always investigate and address bias in AI systems.",
                score: -1
            },
            investigate: {
                result: "Investigating training data is the first step in understanding and addressing bias.",
                recommendation: "Continue with data auditing and implement bias mitigation strategies.",
                score: 1
            },
            retrain: {
                result: "Retraining can be effective but may not address root causes of bias.",
                recommendation: "Combine retraining with comprehensive bias analysis.",
                score: 0
            }
        };
        
        const result = results[choice];
        document.getElementById('ethicsResult').innerHTML = `
            <div class="font-semibold mb-2">Result:</div>
            <div class="mb-2">${result.result}</div>
            <div class="text-sm text-gray-300">${result.recommendation}</div>
        `;
    }
    
    predictFuture() {
        const year = parseInt(document.getElementById('timeHorizon').value);
        const focusArea = document.getElementById('focusArea').value;
        
        const predictions = {
            general: {
                2030: "AI assistants become ubiquitous, handling complex tasks and decision-making. Quantum-classical hybrid systems emerge.",
                2040: "Artificial General Intelligence breakthroughs. AI creativity matches human levels. Ethical AI frameworks mature globally.",
                2050: "AI-human collaboration reaches unprecedented levels. Consciousness research in AI accelerates. Space exploration enhanced by AI.",
                2100: "Post-human intelligence emerges. AI civilizations may coexist with human society. Cosmic-scale AI networks possible."
            },
            healthcare: {
                2030: "AI diagnostics surpass human accuracy. Personalized medicine based on genetic and lifestyle data becomes standard.",
                2040: "AI surgeons perform complex procedures. Drug discovery accelerated by quantum-AI systems. Aging research breakthroughs.",
                2050: "Disease prediction and prevention at molecular level. AI-enhanced human longevity treatments widely available.",
                2100: "Biological aging potentially reversible. AI-enhanced human capabilities in healthcare. Consciousness transfer research begins."
            },
            transportation: {
                2030: "Autonomous vehicles dominate urban areas. Electric flying taxis in major cities. Hyperloop networks expanding.",
                2040: "Space tourism becomes common. Supersonic flight returns. Underwater transportation networks emerge.",
                2050: "Teleportation research shows promise. Interplanetary travel regular. Quantum tunneling transportation experiments.",
                2100: "Instantaneous travel possible. Interstellar exploration missions launched. Transportation redefined completely."
            },
            education: {
                2030: "AI tutors personalize learning for every student. Virtual reality education becomes mainstream. Skill acquisition accelerated.",
                2040: "Direct knowledge transfer research successful. Learning happens at neural interface level. Education becomes continuous process.",
                2050: "Collective intelligence networks for learning. Education transcends individual capability. Species-level knowledge integration.",
                2100: "Learning becomes fundamental aspect of consciousness. Education redefined as evolution of awareness itself."
            },
            economy: {
                2030: "AI-managed economies show efficiency gains. Universal Basic Income implemented in many countries. Cryptocurrency mainstream.",
                2040: "Post-scarcity economics emerges in developed nations. AI-driven resource allocation optimizes global distribution.",
                2050: "Economic systems based on consciousness and creativity rather than material scarcity. Value redefined fundamentally.",
                2100: "Economy becomes system of consciousness exchange. Material scarcity eliminated. New forms of value creation emerge."
            }
        };
        
        const areaPredictions = predictions[focusArea] || predictions.general;
        let predictionText = areaPredictions[year] || "The future remains unwritten, full of infinite possibilities.";
        
        // Add some randomness for variety
        if (Math.random() > 0.7) {
            predictionText += " However, unexpected breakthroughs could accelerate or alter this timeline significantly.";
        }
        
        document.getElementById('futurePrediction').innerHTML = `
            <div class="text-cosmic-purple font-semibold mb-2">${year} - ${focusArea.charAt(0).toUpperCase() + focusArea.slice(1)}:</div>
            <div class="text-gray-300">${predictionText}</div>
        `;
        
        this.showNotification('Future prediction generated!', 'success');
    }
    
    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');
        
        notificationText.textContent = message;
        notification.classList.remove('translate-x-full');
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
        }, 3000);
    }
    
    resetNeuralNetwork() {
        if (this.visualizations.neuralNetwork) {
            this.showNotification('Neural network reset!', 'info');
        }
    }
    
    resetEcosystem() {
        this.showNotification('Ecosystem simulation reset!', 'info');
    }
    
    // Cleanup function
    destroy() {
        // Cleanup visualizations
        Object.values(this.visualizations).forEach(viz => {
            if (viz && viz.renderer) {
                viz.renderer.dispose();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }
}

// Interactive Functions (Global scope for HTML onclick handlers)
window.generatePrompt = function() {
    if (window.promptAtlas) {
        window.promptAtlas.generatePrompt();
    }
};

window.handleEthicsChoice = function(choice) {
    if (window.promptAtlas) {
        window.promptAtlas.handleEthicsChoice(choice);
    }
};

window.predictFuture = function() {
    if (window.promptAtlas) {
        window.promptAtlas.predictFuture();
    }
};

window.resetNeuralNetwork = function() {
    if (window.promptAtlas) {
        window.promptAtlas.resetNeuralNetwork();
    }
};

window.resetEcosystem = function() {
    if (window.promptAtlas) {
        window.promptAtlas.resetEcosystem();
    }
};

window.collapseWavefunction = function() {
    // This will be defined in the quantum visualization
};

window.entangleParticles = function() {
    // This will be defined in the quantum visualization
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.promptAtlas = new PromptAtlas();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.promptAtlas) {
        window.promptAtlas.destroy();
    }
});

// Year slider update
document.addEventListener('DOMContentLoaded', () => {
    const timeHorizon = document.getElementById('timeHorizon');
    const yearDisplay = document.getElementById('yearDisplay');
    
    if (timeHorizon && yearDisplay) {
        timeHorizon.addEventListener('input', (e) => {
            yearDisplay.textContent = e.target.value;
        });
    }
});

// Smooth scrolling enhancement
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
});

// Performance optimization
window.addEventListener('load', () => {
    // Lazy load heavy components
    const heavyElements = document.querySelectorAll('.visualization-container');
    
    const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyLoadObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px' });
    
    heavyElements.forEach(element => {
        lazyLoadObserver.observe(element);
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    if (window.promptAtlas) {
        window.promptAtlas.showNotification('An error occurred. Please refresh the page.', 'error');
    }
});

// Console easter egg
console.log(`
🌌 Welcome to The Prompt Atlas 🌌
A Guide for AI & Humanity - Kronos Edition

"Dwell On The Beauty Of Life.
Watch The Stars, And See Yourself Running With Them"

- Don D.M. Tadaya
`);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptAtlas;
}