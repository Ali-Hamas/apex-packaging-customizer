/**
 * Apex Packaging - Upgraded Main Application Logic
 * Interactive 3D box config, folding animation, blueprints HUD, presets, card tilts, and chat widget.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Theme Management (Dark / Light Mode)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // ----------------------------------------------------
    // Mobile Drawer Navigation
    // ----------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    
    function toggleMobileNav() {
        document.body.classList.toggle('mobile-nav-active');
    }

    hamburger.addEventListener('click', toggleMobileNav);
    closeMobileNav.addEventListener('click', toggleMobileNav);
    mobileOverlay.addEventListener('click', toggleMobileNav);

    // ----------------------------------------------------
    // Sticky Header Scroll Effect
    // ----------------------------------------------------
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // ----------------------------------------------------
    // 3D Box Configurator & Price Calculator
    // ----------------------------------------------------
    const box3D = document.getElementById('box-3d');
    const boxScene = document.getElementById('box-3d-scene');
    
    // Sliders & Inputs
    const lengthInput = document.getElementById('config-length');
    const widthInput = document.getElementById('config-width');
    const heightInput = document.getElementById('config-height');
    const qtyInput = document.getElementById('config-qty');
    
    const lengthVal = document.getElementById('val-length');
    const widthVal = document.getElementById('val-width');
    const heightVal = document.getElementById('val-height');
    const qtyVal = document.getElementById('val-qty');

    const materialSelect = document.getElementById('config-material');
    const finishingSelect = document.getElementById('config-finishing');
    
    // Design Customization Inputs
    const printTextInput = document.getElementById('config-print-text');
    const boxLogos = document.querySelectorAll('.box-logo');
    const customColorInput = document.getElementById('custom-color-picker');
    const colorDots = document.querySelectorAll('.color-dot');
    
    // Config Actions Buttons
    const toggleLidBtn = document.getElementById('toggle-lid');
    const toggleHudBtn = document.getElementById('toggle-hud');
    
    // Style Cards
    const styleCards = document.querySelectorAll('.style-card');
    let activeBoxStyle = 'mailer';

    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            styleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            activeBoxStyle = card.dataset.style;
            
            // Auto open/close logic for visual feedback on rigid styles
            if (activeBoxStyle === 'rigid') {
                // Foam insert visible
            }
            calculatePrice();
        });
    });

    // ----------------------------------------------------
    // Materials & Pricing Metadata
    // ----------------------------------------------------
    const materialRates = {
        'kraft': { rate: 0.005, className: 'cardboard-kraft' },
        'corrugated': { rate: 0.008, className: 'cardboard-corrugated' },
        'rigid': { rate: 0.015, className: 'cardboard-rigid' },
        'glossy': { rate: 0.006, className: 'cardboard-glossy' }
    };

    const finishingCosts = {
        'matte': 0.05,
        'gloss': 0.05,
        'spot-uv': 0.12,
        'gold-foil': 0.22
    };

    // ----------------------------------------------------
    // Box 3D Folding & Blueprint HUD Controls
    // ----------------------------------------------------
    // Lid Open/Close Toggle
    toggleLidBtn.addEventListener('click', () => {
        const isOpen = box3D.classList.contains('is-open');
        if (isOpen) {
            box3D.classList.remove('is-open');
            toggleLidBtn.innerHTML = '<i class="fas fa-box"></i> Open Lid';
            toggleLidBtn.classList.remove('active');
        } else {
            box3D.classList.add('is-open');
            toggleLidBtn.innerHTML = '<i class="fas fa-box-open"></i> Close Lid';
            toggleLidBtn.classList.add('active');
        }
    });

    // Blueprint HUD Overlay Toggle
    toggleHudBtn.addEventListener('click', () => {
        const isHudActive = boxScene.classList.contains('hud-active');
        if (isHudActive) {
            boxScene.classList.remove('hud-active');
            toggleHudBtn.classList.remove('active');
        } else {
            boxScene.classList.add('hud-active');
            toggleHudBtn.classList.add('active');
        }
    });

    // ----------------------------------------------------
    // Real-Time Dimensions & Math Calculator
    // ----------------------------------------------------
    function updateBox3DDimensions() {
        const l = parseInt(lengthInput.value);
        const w = parseInt(widthInput.value);
        const h = parseInt(heightInput.value);

        // Map values to display sizes (scale up for visual impact)
        const scale = 14; 
        const visualW = l * scale;
        const visualH = h * scale;
        const visualD = w * scale;

        document.documentElement.style.setProperty('--box-w', `${visualW}px`);
        document.documentElement.style.setProperty('--box-h', `${visualH}px`);
        document.documentElement.style.setProperty('--box-d', `${visualD}px`);
        
        // Update Blueprint HUD labels
        document.getElementById('hud-label-x').textContent = `${l}"`;
        document.getElementById('hud-label-y').textContent = `${h}"`;
    }

    // Dynamic rotation drag handler
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let rotX = -20;
    let rotY = 40;

    boxScene.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        boxScene.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        startX = e.clientX;
        startY = e.clientY;

        rotX = Math.max(-80, Math.min(80, rotX - deltaY * 0.5));
        rotY = rotY + deltaX * 0.5;

        document.documentElement.style.setProperty('--box-rotate-x', `${rotX}deg`);
        document.documentElement.style.setProperty('--box-rotate-y', `${rotY}deg`);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            boxScene.style.cursor = 'grab';
        }
    });

    // Touch Support for 3D box drag
    boxScene.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        rotX = Math.max(-80, Math.min(80, rotX - deltaY * 0.5));
        rotY = rotY + deltaX * 0.5;

        document.documentElement.style.setProperty('--box-rotate-x', `${rotX}deg`);
        document.documentElement.style.setProperty('--box-rotate-y', `${rotY}deg`);
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Calculate Price Formula
    function calculatePrice() {
        const l = parseInt(lengthInput.value);
        const w = parseInt(widthInput.value);
        const h = parseInt(heightInput.value);
        const qty = parseInt(qtyInput.value);
        const mat = materialSelect.value;
        const fin = finishingSelect.value;

        // UI text update
        lengthVal.textContent = l;
        widthVal.textContent = w;
        heightVal.textContent = h;
        qtyVal.textContent = qty.toLocaleString();

        // Update cardboard style class
        const matConfig = materialRates[mat];
        box3D.classList.remove('cardboard-kraft', 'cardboard-corrugated', 'cardboard-rigid', 'cardboard-glossy');
        box3D.classList.add(matConfig.className);

        // Price Algorithm
        const surfaceArea = 2 * (l * w + w * h + h * l);
        const materialCost = surfaceArea * matConfig.rate;
        const finishingCost = finishingCosts[fin] || 0.05;

        // Bulk Quantity Discounts
        let discountMultiplier = 1.0;
        if (qty >= 10000) {
            discountMultiplier = 0.3;
        } else if (qty >= 5000) {
            discountMultiplier = 0.4;
        } else if (qty >= 1000) {
            discountMultiplier = 0.55;
        } else if (qty >= 500) {
            discountMultiplier = 0.75;
        }

        const baseSetupFee = 150.0;
        let unitPrice = (materialCost + finishingCost) * discountMultiplier + (baseSetupFee / qty);
        
        // Base Floors
        const baseFloors = {
            'mailer': 0.45,
            'shipping': 0.65,
            'rigid': 1.85
        };
        const floorPrice = baseFloors[activeBoxStyle] || 0.45;
        if (unitPrice < floorPrice) {
            unitPrice = floorPrice;
        }

        const totalPrice = unitPrice * qty;

        // Display results
        document.getElementById('res-unit-price').textContent = `$${unitPrice.toFixed(2)}`;
        document.getElementById('res-total-price').textContent = `$${totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('res-est-days').textContent = qty > 5000 ? '10-12 Days' : '8-10 Days';
    }

    // Sliders event bindings
    [lengthInput, widthInput, heightInput].forEach(slider => {
        slider.addEventListener('input', () => {
            updateBox3DDimensions();
            calculatePrice();
        });
    });
    qtyInput.addEventListener('input', calculatePrice);

    // ----------------------------------------------------
    // Brand Logo & Print Customization
    // ----------------------------------------------------
    printTextInput.addEventListener('input', (e) => {
        const text = e.target.value.trim() || 'APEX';
        boxLogos.forEach(logo => {
            logo.textContent = text.toUpperCase();
        });
    });

    // Color Swatch Selection
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            colorDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const color = dot.dataset.color;
            document.documentElement.style.setProperty('--box-color', color);
            
            // Guess a suitable print ink color for high contrast
            let printColor = '#ffffff';
            if (color === '#ffffff' || color === '#c5a077' || color === '#ffd700' || color === '#f3f4f6') {
                printColor = '#0f172a'; // dark slate ink on light box
            }
            document.documentElement.style.setProperty('--print-color', printColor);
            
            calculatePrice();
        });
    });

    // Custom color picker input
    customColorInput.addEventListener('input', (e) => {
        colorDots.forEach(d => d.classList.remove('active'));
        const color = e.target.value;
        document.documentElement.style.setProperty('--box-color', color);
        
        // Dynamic printing ink selector logic
        const r = parseInt(color.slice(1,3), 16);
        const g = parseInt(color.slice(3,5), 16);
        const b = parseInt(color.slice(5,7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        const printColor = brightness > 125 ? '#0f172a' : '#ffffff';
        document.documentElement.style.setProperty('--print-color', printColor);
        calculatePrice();
    });

    // Dropdown Material & Finish handlers
    materialSelect.addEventListener('change', (e) => {
        const material = e.target.value;
        // Auto match swatch color for Kraft
        if (material === 'kraft') {
            document.documentElement.style.setProperty('--box-color', '#c5a077');
            document.documentElement.style.setProperty('--print-color', '#4a2f13');
            // Make Kraft active in swatch UI
            colorDots.forEach(d => d.classList.remove('active'));
            document.querySelector('.color-dot[data-color="#c5a077"]').classList.add('active');
        } else if (material === 'rigid') {
            document.documentElement.style.setProperty('--box-color', '#1e293b');
            document.documentElement.style.setProperty('--print-color', '#ffd700');
            colorDots.forEach(d => d.classList.remove('active'));
            document.querySelector('.color-dot[data-color="#1e293b"]').classList.add('active');
        }
        calculatePrice();
    });

    finishingSelect.addEventListener('change', (e) => {
        const finish = e.target.value;
        box3D.classList.remove('print-foil-gold', 'print-foil-silver', 'print-uv');
        
        if (finish === 'gold-foil') {
            box3D.classList.add('print-foil-gold');
        } else if (finish === 'silver-foil') {
            box3D.classList.add('print-foil-silver');
        } else if (finish === 'spot-uv') {
            box3D.classList.add('print-uv');
        }
        calculatePrice();
    });

    // ----------------------------------------------------
    // Custom Preset Templates (WOW Factors)
    // ----------------------------------------------------
    const presetCards = document.querySelectorAll('.preset-card');
    const presets = {
        'eco-organic': {
            style: 'mailer',
            material: 'kraft',
            color: '#c5a077',
            printColor: '#4a2f13',
            finish: 'matte',
            logoText: 'ECO BOX',
            qty: 1000,
            printClass: ''
        },
        'luxury-noir': {
            style: 'rigid',
            material: 'rigid',
            color: '#111827',
            printColor: '#ffd700',
            finish: 'gold-foil',
            logoText: 'APEX NOIR',
            qty: 500,
            printClass: 'print-foil-gold'
        },
        'pristine-white': {
            style: 'mailer',
            material: 'glossy',
            color: '#ffffff',
            printColor: '#0f172a',
            finish: 'matte',
            logoText: 'MINIMAL',
            qty: 2500,
            printClass: ''
        },
        'electric-teal': {
            style: 'mailer',
            material: 'glossy',
            color: '#0d9488',
            printColor: '#ffffff',
            finish: 'spot-uv',
            logoText: 'DIGITAL',
            qty: 1000,
            printClass: 'print-uv'
        }
    };

    presetCards.forEach(card => {
        card.addEventListener('click', () => {
            presetCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const preset = presets[card.dataset.preset];
            if (!preset) return;

            // Apply preset properties
            activeBoxStyle = preset.style;
            styleCards.forEach(c => {
                c.classList.remove('active');
                if (c.dataset.style === preset.style) c.classList.add('active');
            });

            materialSelect.value = preset.material;
            finishingSelect.value = preset.finish;
            printTextInput.value = preset.logoText;
            qtyInput.value = preset.qty;
            
            boxLogos.forEach(logo => logo.textContent = preset.logoText);
            document.documentElement.style.setProperty('--box-color', preset.color);
            document.documentElement.style.setProperty('--print-color', preset.printColor);

            // Active correct color dot in UI
            colorDots.forEach(d => {
                d.classList.remove('active');
                if (d.dataset.color === preset.color) d.classList.add('active');
            });

            // Adjust lamination print styles
            box3D.classList.remove('print-foil-gold', 'print-foil-silver', 'print-uv');
            if (preset.printClass) box3D.classList.add(preset.printClass);

            updateBox3DDimensions();
            calculatePrice();
        });
    });

    // Run initial configuration computations
    updateBox3DDimensions();
    calculatePrice();

    // ----------------------------------------------------
    // 3D Card Tilt Interaction (Wow effect on grid cards)
    // ----------------------------------------------------
    const tiltCards = document.querySelectorAll('.product-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within the element
            const y = e.clientY - rect.top;  // y coordinate within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt angle (max 8 degrees rotation)
            const rotateX = ((centerY - y) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ----------------------------------------------------
    // Product Showcase Filter Tabs
    // ----------------------------------------------------
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productCards = document.querySelectorAll('.product-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ----------------------------------------------------
    // Testimonial Auto Slider
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideTimer();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideTimer();
    });

    function startSlideTimer() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        startSlideTimer();
    }

    startSlideTimer();

    const sliderContainer = document.querySelector('.testimonial-container');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
    sliderContainer.addEventListener('mouseleave', startSlideTimer);

    // ----------------------------------------------------
    // FAQ Accordion Toggle
    // ----------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const answer = q.nextElementSibling;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ----------------------------------------------------
    // Quote Submission Form
    // ----------------------------------------------------
    const quoteForm = document.getElementById('quote-request-form');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');

    // Pre-fill fields function
    const applyConfigBtn = document.getElementById('apply-config-to-form');
    if (applyConfigBtn) {
        applyConfigBtn.addEventListener('click', () => {
            document.getElementById('form-box-style').value = activeBoxStyle;
            document.getElementById('form-material').value = materialSelect.value;
            document.getElementById('form-qty').value = qtyInput.value;
            
            const dimensionsStr = `${lengthInput.value}" x ${widthInput.value}" x ${heightInput.value}"`;
            document.getElementById('form-dimensions').value = dimensionsStr;

            const quoteSection = document.getElementById('quote-form-section');
            if (quoteSection) {
                quoteSection.scrollIntoView({ behavior: 'smooth' });
                
                const formCard = document.querySelector('.quote-form-card');
                formCard.style.boxShadow = '0 0 0 3px #10b981';
                setTimeout(() => {
                    formCard.style.boxShadow = 'var(--shadow-xl)';
                }, 1500);
            }
        });
    }

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Request...';

            setTimeout(() => {
                modalOverlay.classList.add('active');
                quoteForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    // ----------------------------------------------------
    // Interactive Chat Support Widget (Sales Conversion Hook)
    // ----------------------------------------------------
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const chatBody = document.getElementById('chat-body');

    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    // Auto greetings message
    setTimeout(() => {
        appendMessage('agent', 'Hello! Thanks for checking out Apex Packaging. Let me know if you need help with dimensions, cardboard materials, or custom inserts!');
    }, 4000);

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleChatSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        
        appendMessage('user', text);
        chatInput.value = '';

        // Response logic simulation
        setTimeout(() => {
            let response = "That sounds like a great project! Please submit your request on our quote form, and one of our packaging specialists will email you an official blueprint and layout pricing in less than 2 hours.";
            if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
                response = "We offer excellent volume discounts! Mailer boxes range from $0.45 to $1.20 depending on quantity. Feel free to slide the quantity range controls to view instant wholesale price estimates.";
            } else if (text.toLowerCase().includes('material') || text.toLowerCase().includes('kraft')) {
                response = "We print on FSC-certified Recycled Kraft, double-wall corrugated cardboard for heavy items, and luxury white rigid cardboards. Select custom materials in the configurator to see how they look!";
            } else if (text.toLowerCase().includes('shipping') || text.toLowerCase().includes('deliver')) {
                response = "Shipping is 100% free across the USA! Production typically takes 8-10 business days after digital mockups are signed off.";
            }
            appendMessage('agent', response);
        }, 1500);
    }

    chatSendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSend();
    });
});
