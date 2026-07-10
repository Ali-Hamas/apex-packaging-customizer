import React, { useState, useEffect, useRef } from 'react';

// Pricing configuration matches static assets
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
  'gold-foil': 0.22,
  'silver-foil': 0.22
};

const baseFloors = {
  'mailer': 0.45,
  'shipping': 0.65,
  'rigid': 1.85
};

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

const testimonials = [
  {
    quote: 'The interactive customizer helped us design box mockups in minutes! Apex delivered 5,000 custom printed mailer boxes for our skincare launch, and the gloss finish was exceptional.',
    avatar: 'SC',
    avatarBg: '#3b82f6',
    name: 'Sarah Connor',
    role: 'Founder, SkinCore Organic'
  },
  {
    quote: 'We ordered custom heavy corrugated boxes for our smart blenders appliance line. The structural foam inserts fit perfectly and the shipping boxes survived long-distance shipping drop tests.',
    avatar: 'MH',
    avatarBg: '#e11d48',
    name: 'Marcus Howard',
    role: 'Logistics Director, SmartKitchen USA'
  },
  {
    quote: 'Outstanding B2B packaging partner. Zero setup fees, free designs, and reliable support. They made custom printing box orders extremely straightforward.',
    avatar: 'DK',
    avatarBg: '#059669',
    name: 'David Kim',
    role: 'Brand Manager, DecoDesigns Inc.'
  }
];

const faqs = [
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'Our standard wholesale box orders start as low as 100 units. Bulk orders above 500 units receive significant discounts on materials and manufacturing run costs.'
  },
  {
    q: 'Do you provide free design mockups and physical samples?',
    a: 'Yes! We provide complimentary 3D digital mockups for all quote inquiries. For production confirmation, we can create flat printed physical proof sheets or custom pre-production samples upon request.'
  },
  {
    q: 'What is your manufacturing turnaround time?',
    a: 'Standard manufacturing and printing takes 8 to 10 business days after digital mockup artwork proof approval. Safe cargo transit takes an additional 2-4 days, delivering directly to your warehouse.'
  },
  {
    q: 'Can you create heavy appliance cardboard packaging?',
    a: 'Absolutely! We manufacture heavy-duty double-wall and triple-wall corrugated shipping boxes specifically engineered for appliances, kitchen tools, and consumer electronics, with custom die-cut foam inserts for safe transport.'
  }
];

const productCatalog = [
  {
    id: 1,
    category: 'mailer',
    badge: 'Best Seller',
    title: 'Custom Corrugated Mailer',
    desc: 'Sturdy, double-wing lock design, perfect for e-commerce deliveries, subscription boxes, and retail presentation.',
    price: 'From $0.45 / unit',
    img: 'assets/mailer_box.jpg'
  },
  {
    id: 2,
    category: 'rigid',
    badge: 'Premium',
    badgeBg: 'var(--accent-emerald)',
    title: 'Luxury Rigid Board Box',
    desc: 'Crafted from premium heavy-duty chipboard. Ideal for luxury jewelry, premium electronics, cosmetics, and luxury gifts.',
    price: 'From $1.85 / unit',
    img: 'assets/rigid_box.jpg'
  },
  {
    id: 3,
    category: 'cosmetic',
    title: 'Cosmetics Folding Box',
    desc: 'Lightweight folding cartons with glossy finishes. Designed for beauty serums, makeup, perfumes, and skincare sets.',
    price: 'From $0.35 / unit',
    img: 'assets/cosmetic_box.jpg'
  },
  {
    id: 4,
    category: 'appliance',
    badge: 'Heavy Duty',
    badgeBg: 'var(--primary-dark)',
    title: 'Appliance & Device Box',
    desc: 'Double-wall thick corrugated cardboard, structural foam-insert friendly. Engineered for high protection transport.',
    price: 'From $0.95 / unit',
    img: 'assets/appliance_box.jpg'
  }
];

export default function App() {
  // ----------------------------------------------------
  // Global Layout / Theme State
  // ----------------------------------------------------
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (systemPrefersDark ? 'dark' : 'light');
  });

  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // ----------------------------------------------------
  // Customizer Configuration State
  // ----------------------------------------------------
  const [activeBoxStyle, setActiveBoxStyle] = useState('mailer');
  const [presetActive, setPresetActive] = useState('eco-organic');
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [height, setHeight] = useState(4);
  const [boxColor, setBoxColor] = useState('#c5a077');
  const [printColor, setPrintColor] = useState('#4a2f13');
  const [printText, setPrintText] = useState('APEX');
  const [material, setMaterial] = useState('corrugated');
  const [finishing, setFinishing] = useState('matte');
  const [quantity, setQuantity] = useState(1000);

  const [isOpen, setIsOpen] = useState(false);
  const [isHud, setIsHud] = useState(false);

  // ----------------------------------------------------
  // 3D Canvas Box Drag Rotation State
  // ----------------------------------------------------
  const [rotX, setRotX] = useState(-20);
  const [rotY, setRotY] = useState(40);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  const handleDragStart = (clientX, clientY) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startYRef.current = clientY;
  };

  const handleDragMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startXRef.current;
    const deltaY = clientY - startYRef.current;
    startXRef.current = clientX;
    startYRef.current = clientY;

    setRotX(prev => Math.max(-80, Math.min(80, prev - deltaY * 0.5)));
    setRotY(prev => prev + deltaX * 0.5);
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  // ----------------------------------------------------
  // Pricing Engine Math
  // ----------------------------------------------------
  const matConfig = materialRates[material] || materialRates['kraft'];
  const surfaceArea = 2 * (length * width + width * height + height * length);
  const materialCost = surfaceArea * matConfig.rate;
  const finishingCost = finishingCosts[finishing] || 0.05;

  let discountMultiplier = 1.0;
  if (quantity >= 10000) discountMultiplier = 0.3;
  else if (quantity >= 5000) discountMultiplier = 0.4;
  else if (quantity >= 1000) discountMultiplier = 0.55;
  else if (quantity >= 500) discountMultiplier = 0.75;

  const baseSetupFee = 150.0;
  let unitPrice = (materialCost + finishingCost) * discountMultiplier + (baseSetupFee / quantity);

  const floorPrice = baseFloors[activeBoxStyle] || 0.45;
  if (unitPrice < floorPrice) {
    unitPrice = floorPrice;
  }
  const totalPrice = unitPrice * quantity;

  // ----------------------------------------------------
  // Preset Swatch Application
  // ----------------------------------------------------
  const handlePresetSelect = (presetKey) => {
    setPresetActive(presetKey);
    const p = presets[presetKey];
    if (!p) return;

    setActiveBoxStyle(p.style);
    setMaterial(p.material);
    setFinishing(p.finish);
    setPrintText(p.logoText);
    setQuantity(p.qty);
    setBoxColor(p.color);
    setPrintColor(p.printColor);
  };

  const handleMaterialChange = (e) => {
    const val = e.target.value;
    setMaterial(val);
    setPresetActive('');
    if (val === 'kraft') {
      setBoxColor('#c5a077');
      setPrintColor('#4a2f13');
    } else if (val === 'rigid') {
      setBoxColor('#1e293b');
      setPrintColor('#ffd700');
    }
  };

  const handleColorDotSelect = (hex) => {
    setPresetActive('');
    setBoxColor(hex);
    let inkColor = '#ffffff';
    if (hex === '#ffffff' || hex === '#c5a077' || hex === '#ffd700' || hex === '#f3f4f6') {
      inkColor = '#0f172a';
    }
    setPrintColor(inkColor);
  };

  const handleCustomColorInput = (e) => {
    setPresetActive('');
    const hex = e.target.value;
    setBoxColor(hex);
    
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    setPrintColor(brightness > 125 ? '#0f172a' : '#ffffff');
  };

  // ----------------------------------------------------
  // 3D Card Hover Tilt Event Handlers
  // ----------------------------------------------------
  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    cardEl.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    cardEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  // ----------------------------------------------------
  // Showcase Filter Tabs State
  // ----------------------------------------------------
  const [catalogFilter, setCatalogFilter] = useState('all');

  // ----------------------------------------------------
  // Testimonials Auto Slider State
  // ----------------------------------------------------
  const [currentTesti, setCurrentTesti] = useState(0);
  const testimonialTimerRef = useRef(null);

  const startTestiTimer = () => {
    clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => {
      setCurrentTesti(prev => (prev + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    startTestiTimer();
    return () => clearInterval(testimonialTimerRef.current);
  }, []);

  const handlePrevTesti = () => {
    setCurrentTesti(prev => (prev - 1 + testimonials.length) % testimonials.length);
    startTestiTimer();
  };

  const handleNextTesti = () => {
    setCurrentTesti(prev => (prev + 1) % testimonials.length);
    startTestiTimer();
  };

  // ----------------------------------------------------
  // FAQ Accordion State
  // ----------------------------------------------------
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaqIndex(prev => prev === index ? null : index);
  };

  // ----------------------------------------------------
  // Quote Form Multi-Step & Submission State
  // ----------------------------------------------------
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formBoxStyle, setFormBoxStyle] = useState('mailer');
  const [formMaterial, setFormMaterial] = useState('corrugated');
  const [formDimensions, setFormDimensions] = useState('10 x 8 x 4');
  const [formQty, setFormQty] = useState(1000);
  const [formDetails, setFormDetails] = useState('');
  const [formAgreed, setFormAgreed] = useState(false);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formCardRef = useRef(null);

  const applyConfigToForm = () => {
    setFormBoxStyle(activeBoxStyle);
    setFormMaterial(material);
    setFormQty(quantity);
    setFormDimensions(`${length} x ${width} x ${height}`);

    const quoteSection = document.getElementById('quote-form-section');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
      if (formCardRef.current) {
        formCardRef.current.style.boxShadow = '0 0 0 3px #10b981';
        setTimeout(() => {
          if (formCardRef.current) formCardRef.current.style.boxShadow = 'var(--shadow-xl)';
        }, 1500);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    setTimeout(() => {
      setFormSubmitting(false);
      setIsModalOpen(true);
      // Reset form fields
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormCompany('');
      setFormDetails('');
      setFormAgreed(false);
    }, 1500);
  };

  // ----------------------------------------------------
  // Live Support Chat Assistant State
  // ----------------------------------------------------
  const [chatActive, setChatActive] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: 'Hello! Thanks for checking out Apex Packaging. Let me know if you need help with dimensions, cardboard materials, or custom inserts!' }
  ]);
  const chatBodyRef = useRef(null);

  const handleChatSend = () => {
    const text = chatInputText.trim();
    if (!text) return;

    // Append user message
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInputText('');

    // Simulate response
    setTimeout(() => {
      let reply = "That sounds like a great project! Please submit your request on our quote form, and one of our packaging specialists will email you an official blueprint and layout pricing in less than 2 hours.";
      const query = text.toLowerCase();

      if (query.includes('price') || query.includes('cost')) {
        reply = "We offer excellent volume discounts! Mailer boxes range from $0.45 to $1.20 depending on quantity. Feel free to slide the quantity range controls to view instant wholesale price estimates.";
      } else if (query.includes('material') || query.includes('kraft')) {
        reply = "We print on FSC-certified Recycled Kraft, double-wall corrugated cardboard for heavy items, and luxury white rigid cardboards. Select custom materials in the configurator to see how they look!";
      } else if (query.includes('shipping') || query.includes('deliver')) {
        reply = "Shipping is 100% free across the USA! Production typically takes 8-10 business days after digital mockups are signed off.";
      }

      setChatMessages(prev => [...prev, { sender: 'agent', text: reply }]);
    }, 1500);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // CSS variables for 3D visual workspace
  const scale = 14;
  const visualW = length * scale;
  const visualH = height * scale;
  const visualD = width * scale;

  const boxStyleVariables = {
    '--box-w': `${visualW}px`,
    '--box-h': `${visualH}px`,
    '--box-d': `${visualD}px`,
    '--box-color': boxColor,
    '--print-color': printColor,
    '--box-rotate-x': `${rotX}deg`,
    '--box-rotate-y': `${rotY}deg`,
  };

  // Prevent background scrolling when mobile drawer navigation is active
  useEffect(() => {
    if (mobileNavActive) {
      document.body.classList.add('mobile-nav-active');
    } else {
      document.body.classList.remove('mobile-nav-active');
    }
  }, [mobileNavActive]);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-info">
            <span><i className="fas fa-phone-alt"></i> <a href="tel:(510) 500-9533">(510) 500-9533</a></span>
            <span><i class="fas fa-envelope"></i> <a href="mailto:sales@apexpack.com">sales@apexpack.com</a></span>
            <span className="displaynone"><i className="fas fa-leaf"></i> 100% Eco-Friendly & Biodegradable Materials</span>
          </div>
          <div className="top-bar-links">
            <a href="#quote-form-section" className="displaynone">Free Design Support</a>
            <span className="displaynone">|</span>
            <a href="#how-it-works-section" className="displaynone">Order Process</a>
            <button 
              onClick={toggleTheme} 
              className="theme-toggle" 
              aria-label="Toggle dark mode"
            >
              <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className={`main-header ${headerScrolled ? 'header-scrolled' : ''}`} id="main-header">
        <div className="container nav-container">
          {/* Brand Logo */}
          <a href="#" className="logo-text" aria-label="Apex Packaging Home">
            <div className="logo-icon"></div>
            APEX<span>PACK</span>
          </a>

          {/* Desktop Menu */}
          <nav className="nav-menu">
            <div className="nav-item">
              <a href="#" className="nav-link">Home</a>
            </div>
            <div className="nav-item">
              <a href="#configurator-section" className="nav-link">Box Customizer</a>
            </div>
            <div className="nav-item">
              <a href="#" className="nav-link" onClick={e => e.preventDefault()}>Products <i className="fas fa-chevron-down"></i></a>
              <div className="mega-menu">
                <div className="mega-column">
                  <h4>Box Styles</h4>
                  <ul>
                    <li><a href="#showcase-section"><i className="fas fa-box"></i> Mailer Boxes</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-box-open"></i> Shipping Boxes</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-gem"></i> Luxury Rigid Boxes</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-folder"></i> Folding Cartons</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-shapes"></i> Die-Cut Custom Shapes</a></li>
                  </ul>
                </div>
                <div className="mega-column">
                  <h4>By Industry</h4>
                  <ul>
                    <li><a href="#showcase-section"><i className="fas fa-spa"></i> Cosmetics & Beauty</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-plug"></i> Electronics & Appliances</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-cookie-bite"></i> Food & Bakery</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-tshirt"></i> Apparel & Retail</a></li>
                    <li><a href="#showcase-section"><i className="fas fa-prescription-bottle"></i> Pharma & Health</a></li>
                  </ul>
                </div>
                <div className="mega-column">
                  <h4>Our Material</h4>
                  <ul>
                    <li><a href="#configurator-section"><i className="fas fa-recycle"></i> 100% Recycled Kraft</a></li>
                    <li><a href="#configurator-section"><i className="fas fa-layer-group"></i> Double-wall Corrugated</a></li>
                    <li><a href="#configurator-section"><i className="fas fa-scroll"></i> Premium Rigid Board</a></li>
                    <li><a href="#configurator-section"><i className="fas fa-image"></i> High-Gloss Art Paper</a></li>
                  </ul>
                </div>
                <div className="mega-promo">
                  <div>
                    <h5>Eco-Friendly Guarantee</h5>
                    <p>We plant a tree for every 1,000 custom boxes ordered. Join our green initiative.</p>
                  </div>
                  <a href="#quote-form-section" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Learn More</a>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <a href="#why-choose-us-section" className="nav-link">Why Apex</a>
            </div>
            <div className="nav-item">
              <a href="#faq-section" className="nav-link">FAQs</a>
            </div>
          </nav>

          {/* Action CTA */}
          <div className="flex align-center gap-2">
            <a href="tel:(510) 500-9533" className="btn btn-secondary displaynone">
              <i className="fas fa-phone-alt"></i> Call Us
            </a>
            <a href="#quote-form-section" className="btn btn-primary">
              Get Free Quote
            </a>
            <button 
              onClick={() => setMobileNavActive(prev => !prev)} 
              className="hamburger" 
              id="hamburger" 
              aria-label="Open navigation drawer"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay & Menu */}
      <div 
        className="mobile-nav-overlay" 
        onClick={() => setMobileNavActive(false)}
        style={{ opacity: mobileNavActive ? 1 : 0, visibility: mobileNavActive ? 'visible' : 'hidden' }}
      ></div>
      <div 
        className="mobile-nav-drawer" 
        style={{ right: mobileNavActive ? 0 : 'calc(-1 * min(320px, 100vw))' }}
      >
        <div className="flex justify-between align-center">
          <a href="#" className="logo-text">
            <div className="logo-icon"></div>
            APEX<span>PACK</span>
          </a>
          <button 
            className="btn-icon" 
            onClick={() => setMobileNavActive(false)} 
            aria-label="Close navigation drawer"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav className="mobile-menu">
          <a href="#" className="mobile-link" onClick={() => setMobileNavActive(false)}>Home</a>
          <a href="#configurator-section" className="mobile-link" onClick={() => setMobileNavActive(false)}>Box Customizer</a>
          <a href="#showcase-section" className="mobile-link" onClick={() => setMobileNavActive(false)}>Products</a>
          <a href="#why-choose-us-section" className="mobile-link" onClick={() => setMobileNavActive(false)}>Why Apex</a>
          <a href="#faq-section" className="mobile-link" onClick={() => setMobileNavActive(false)}>FAQs</a>
        </nav>
        <div className="flex flex-column gap-2" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
          <a href="tel:(510) 500-9533" className="btn btn-secondary"><i className="fas fa-phone-alt"></i> (510) 500-9533</a>
          <a href="#quote-form-section" className="btn btn-primary" onClick={() => setMobileNavActive(false)}>Get Custom Quote</a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content-left">
            <div className="hero-tag">
              <i className="fas fa-award"></i> Rated 4.9/5 by 2,000+ Brands
            </div>
            <h1 className="hero-title">
              Premium Custom Boxes, <span>Crafted to Perfection.</span>
            </h1>
            <p className="hero-desc">
              Eco-friendly, custom-designed wholesale packaging with free shipping and instant digital mockups. Elevate your brand with high-quality printing.
            </p>
            <div className="hero-buttons">
              <a href="#configurator-section" className="btn btn-primary btn-amber">
                <i className="fas fa-tools"></i> Configure Your Box
              </a>
              <a href="#quote-form-section" className="btn btn-secondary">
                <i className="fas fa-paper-plane"></i> Request Custom Quote
              </a>
            </div>
            <div className="hero-badges">
              <div className="hero-badge">
                <div className="hero-badge-icon"><i className="fas fa-truck-moving"></i></div>
                <div className="hero-badge-info">
                  <h5>Free Shipping</h5>
                  <p>All orders across USA</p>
                </div>
              </div>
              <div className="hero-badge">
                <div className="hero-badge-icon"><i className="fas fa-clock"></i></div>
                <div className="hero-badge-info">
                  <h5>Fast Turnaround</h5>
                  <p>Shipped in 8-10 Days</p>
                </div>
              </div>
              <div className="hero-badge">
                <div className="hero-badge-icon"><i className="fas fa-palette"></i></div>
                <div className="hero-badge-info">
                  <h5>Free Design</h5>
                  <p>3D mockup support</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-circle-bg"></div>
            <img src="assets/hero_boxes.jpg" alt="Premium custom boxes showcase" className="hero-image" width="560" height="315" />
          </div>
        </div>
      </section>

      {/* Trust Partner Logos */}
      <section className="trust-bar">
        <div className="container trust-logos">
          <div className="trust-title">Trusted by industry leaders</div>
          <div className="logo-grid">
            <span>MICROSOFT</span>
            <span>SHOPIFY</span>
            <span>AMAZON</span>
            <span>P&G</span>
            <span>L'OREAL</span>
          </div>
        </div>
      </section>

      {/* Interactive Configurator Section */}
      <section className="section-padding configurator-sec" id="configurator-section">
        <div className="container">
          <div className="section-title text-center" style={{ margin: '0 auto 60px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Interactive Packaging Lab</span>
            <h2 style={{ marginTop: '10px' }}>Design & Price in real-time</h2>
            <p>Customize structural styles, scale dimensions, print company branding, and test luxury finishes dynamically.</p>
          </div>

          <div className="configurator-grid">
            {/* Left Column: Controls */}
            <div className="config-form">
              <div className="config-title">
                <h2>Structural Studio</h2>
                <p>Real-time box adjustments</p>
              </div>

              {/* Step 0: Preset Selector */}
              <div>
                <div className="config-section-title"><i className="fas fa-magic"></i> Choose Design Preset</div>
                <div className="preset-swatches">
                  <div 
                    onClick={() => handlePresetSelect('eco-organic')} 
                    className={`preset-card ${presetActive === 'eco-organic' ? 'active' : ''}`}
                  >Eco Organic</div>
                  <div 
                    onClick={() => handlePresetSelect('luxury-noir')} 
                    className={`preset-card ${presetActive === 'luxury-noir' ? 'active' : ''}`}
                  >Luxury Noir</div>
                  <div 
                    onClick={() => handlePresetSelect('pristine-white')} 
                    className={`preset-card ${presetActive === 'pristine-white' ? 'active' : ''}`}
                  >Frost White</div>
                  <div 
                    onClick={() => handlePresetSelect('electric-teal')} 
                    className={`preset-card ${presetActive === 'electric-teal' ? 'active' : ''}`}
                  >Teal Glow</div>
                </div>
              </div>

              {/* Step 1: Style Selection */}
              <div>
                <div className="config-section-title"><i className="fas fa-boxes"></i> 1. Select Box Style</div>
                <div className="style-options">
                  <div 
                    onClick={() => { setActiveBoxStyle('mailer'); setPresetActive(''); }} 
                    className={`style-card ${activeBoxStyle === 'mailer' ? 'active' : ''}`}
                  >
                    <i className="fas fa-box"></i>
                    <h4>Mailer Box</h4>
                  </div>
                  <div 
                    onClick={() => { setActiveBoxStyle('shipping'); setPresetActive(''); }} 
                    className={`style-card ${activeBoxStyle === 'shipping' ? 'active' : ''}`}
                  >
                    <i className="fas fa-box-open"></i>
                    <h4>Shipping Box</h4>
                  </div>
                  <div 
                    onClick={() => { setActiveBoxStyle('rigid'); setPresetActive(''); }} 
                    className={`style-card ${activeBoxStyle === 'rigid' ? 'active' : ''}`}
                  >
                    <i className="fas fa-gem"></i>
                    <h4>Luxury Rigid</h4>
                  </div>
                </div>
              </div>

              {/* Step 2: Dimensions */}
              <div>
                <div className="config-section-title"><i className="fas fa-ruler-combined"></i> 2. Scale Dimensions (Inches)</div>
                <div className="dimension-sliders">
                  <div className="slider-group">
                    <div className="slider-label">
                      <span>Length (L)</span>
                      <span>{length}</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="20" 
                      value={length} 
                      onChange={e => { setLength(parseInt(e.target.value)); setPresetActive(''); }} 
                      className="range-slider" 
                    />
                  </div>
                  <div className="slider-group">
                    <div className="slider-label">
                      <span>Width (W)</span>
                      <span>{width}</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="20" 
                      value={width} 
                      onChange={e => { setWidth(parseInt(e.target.value)); setPresetActive(''); }} 
                      className="range-slider" 
                    />
                  </div>
                  <div className="slider-group">
                    <div className="slider-label">
                      <span>Height (H)</span>
                      <span>{height}</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="15" 
                      value={height} 
                      onChange={e => { setHeight(parseInt(e.target.value)); setPresetActive(''); }} 
                      className="range-slider" 
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Colors & Logo Printing */}
              <div>
                <div className="config-section-title"><i className="fas fa-palette"></i> 3. Color & Logo Print</div>
                <div className="slider-group" style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Box Color Swatch</label>
                  <div className="color-picker-grid">
                    <div 
                      onClick={() => handleColorDotSelect('#c5a077')} 
                      className={`color-dot ${boxColor === '#c5a077' ? 'active' : ''}`} 
                      style={{ backgroundColor: '#c5a077' }} 
                      title="Eco Brown"
                    ></div>
                    <div 
                      onClick={() => handleColorDotSelect('#111827')} 
                      className={`color-dot ${boxColor === '#111827' ? 'active' : ''}`} 
                      style={{ backgroundColor: '#111827' }} 
                      title="Matte Black"
                    ></div>
                    <div 
                      onClick={() => handleColorDotSelect('#ffffff')} 
                      className={`color-dot ${boxColor === '#ffffff' ? 'active' : ''}`} 
                      style={{ backgroundColor: '#ffffff', border: '1px solid #ddd' }} 
                      title="Frost White"
                    ></div>
                    <div 
                      onClick={() => handleColorDotSelect('#0d9488')} 
                      className={`color-dot ${boxColor === '#0d9488' ? 'active' : ''}`} 
                      style={{ backgroundColor: '#0d9488' }} 
                      title="Teal Green"
                    ></div>
                    <div 
                      onClick={() => handleColorDotSelect('#2563eb')} 
                      className={`color-dot ${boxColor === '#2563eb' ? 'active' : ''}`} 
                      style={{ backgroundColor: '#2563eb' }} 
                      title="Royal Blue"
                    ></div>
                    <input 
                      type="color" 
                      className="custom-color-input" 
                      value={boxColor} 
                      onChange={handleCustomColorInput} 
                      title="Choose Custom Color" 
                    />
                  </div>
                </div>

                <div className="slider-group">
                  <label htmlFor="config-print-text" style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Custom Printed Logo Text</label>
                  <div className="logo-text-group">
                    <input 
                      type="text" 
                      id="config-print-text" 
                      className="form-input" 
                      placeholder="e.g. BRANDNAME" 
                      value={printText} 
                      onChange={e => { setPrintText(e.target.value); setPresetActive(''); }} 
                      style={{ padding: '8px 12px', marginBottom: 0 }} 
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Materials & Finishing */}
              <div>
                <div className="config-section-title"><i className="fas fa-layer-group"></i> 4. Board Stock & Laminates</div>
                <div className="option-selects">
                  <div className="select-group">
                    <label htmlFor="config-material">Material Stock</label>
                    <select 
                      id="config-material" 
                      className="custom-select" 
                      value={material} 
                      onChange={handleMaterialChange}
                    >
                      <option value="kraft">Eco Kraft Paperboard</option>
                      <option value="corrugated">Premium Corrugated Cardboard</option>
                      <option value="rigid">Luxury Chipboard Rigid</option>
                      <option value="glossy">Glossy White Bleached Paper</option>
                    </select>
                  </div>
                  <div className="select-group">
                    <label htmlFor="config-finishing">Finishing / Coating</label>
                    <select 
                      id="config-finishing" 
                      className="custom-select" 
                      value={finishing} 
                      onChange={e => { setFinishing(e.target.value); setPresetActive(''); }}
                    >
                      <option value="matte">Soft Matte Coating</option>
                      <option value="gloss">Glossy UV Coating</option>
                      <option value="spot-uv">Spot UV Gloss</option>
                      <option value="gold-foil">Gold Foil Stamping</option>
                      <option value="silver-foil">Silver Foil Stamping</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 5: Quantity */}
              <div>
                <div className="config-section-title"><i className="fas fa-sort-amount-up-alt"></i> 5. Order Volume</div>
                <div className="slider-group">
                  <div className="slider-label">
                    <span>Wholesale Quantity</span>
                    <span>{quantity.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="100" 
                    value={quantity} 
                    onChange={e => { setQuantity(parseInt(e.target.value)); setPresetActive(''); }} 
                    className="range-slider" 
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Canvas */}
            <div className="config-display">
              <div className="viewer-header">
                <h3><i className="fas fa-eye"></i> Live 3D Interactive Workbench</h3>
                <div className="viewer-actions">
                  <button 
                    onClick={() => setIsOpen(prev => !prev)} 
                    className={`btn-glass ${isOpen ? 'active' : ''}`}
                  >
                    <i className={isOpen ? 'fas fa-box-open' : 'fas fa-box'}></i> {isOpen ? 'Close Lid' : 'Open Lid'}
                  </button>
                  <button 
                    onClick={() => setIsHud(prev => !prev)} 
                    className={`btn-glass ${isHud ? 'active' : ''}`}
                  >
                    <i className="fas fa-drafting-compass"></i> Blueprint HUD
                  </button>
                </div>
              </div>

              {/* 3D Box Workbench */}
              <div 
                className={`box-3d-scene ${isHud ? 'hud-active' : ''}`}
                id="box-3d-scene"
                onMouseDown={e => handleDragStart(e.clientX, e.clientY)}
                onMouseMove={e => handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={e => {
                  if (e.touches.length === 1) handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchMove={e => {
                  if (e.touches.length === 1) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
                }}
                onTouchEnd={handleDragEnd}
                style={{ cursor: isDraggingRef.current ? 'grabbing' : 'grab' }}
              >
                {/* CAD Dimension lines HUD overlay */}
                <div className="dimension-lines-hud">
                  <div className="dim-line dim-line-x">L: <span>{length}"</span></div>
                  <div className="dim-line dim-line-y">H: <span>{height}"</span></div>
                </div>

                <div 
                  className={`box-3d ${matConfig.className} ${isOpen ? 'is-open' : ''} ${
                    finishing === 'gold-foil' ? 'print-foil-gold' : 
                    finishing === 'silver-foil' ? 'print-foil-silver' : 
                    finishing === 'spot-uv' ? 'print-uv' : ''
                  }`}
                  style={boxStyleVariables}
                >
                  {/* Outer Faces */}
                  <div className="box-face face-front"><div className="box-logo">{printText.toUpperCase()}</div></div>
                  <div className="box-face face-back"><div className="box-logo">{printText.toUpperCase()}</div></div>
                  <div className="box-face face-left"></div>
                  <div className="box-face face-right"></div>
                  <div className="box-face face-bottom"></div>
                  
                  {/* Foldable top lid container */}
                  <div className="box-lid-hinge">
                    <div className="box-face face-top"><div className="box-logo">{printText.toUpperCase()}</div></div>
                  </div>
                  
                  {/* Inside foam insert revealed when lid opens */}
                  <div className="box-insert"></div>
                </div>
              </div>

              {/* Real-Time Pricing details panel */}
              <div className="config-results">
                <div className="result-row">
                  <span>Estimated Unit Price:</span>
                  <span style={{ fontWeight: 700, color: 'white' }}>${unitPrice.toFixed(2)}</span>
                </div>
                <div className="result-row">
                  <span>Production Turnaround:</span>
                  <span style={{ color: 'white' }}>{quantity > 5000 ? '10-12 Days' : '8-10 Days'}</span>
                </div>
                <div className="result-row total">
                  <span>Estimated Total:</span>
                  <span>${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="config-actions">
                  <button 
                    onClick={applyConfigToForm} 
                    className="btn btn-primary btn-amber"
                  >
                    <i className="fas fa-check-circle"></i> Lock In Settings
                  </button>
                  <a href="#quote-form-section" className="btn btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Quick Quote</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Showcase Grid */}
      <section className="section-padding showcase-sec" id="showcase-section">
        <div className="container">
          <div className="showcase-header">
            <div className="section-title">
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Our Catalog</span>
              <h2 style={{ marginTop: '10px' }}>Tailored Boxes for Every Need</h2>
              <p>Discover standard categories optimized for product marketing, delivery protection, and retail branding.</p>
            </div>
            
            <div className="category-tabs">
              {['all', 'mailer', 'rigid', 'cosmetic', 'appliance'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setCatalogFilter(tab)}
                  className={`tab-btn ${catalogFilter === tab ? 'active' : ''}`}
                >
                  {tab === 'all' ? 'All Boxes' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid">
            {productCatalog
              .filter(p => catalogFilter === 'all' || p.category === catalogFilter)
              .map(p => {
                let cardRef = null;
                return (
                  <div 
                    key={p.id}
                    ref={el => cardRef = el}
                    onMouseMove={e => handleCardMouseMove(e, cardRef)}
                    onMouseLeave={() => handleCardMouseLeave(cardRef)}
                    className="product-card"
                    style={{ display: 'flex', transition: 'all 0.3s' }}
                  >
                    {p.badge && <span className="product-badge" style={{ backgroundColor: p.badgeBg }}>{p.badge}</span>}
                    <div className="product-img-wrapper">
                      <img src={p.img} alt={p.title} loading="lazy" />
                    </div>
                    <div className="product-info">
                      <h3>{p.title}</h3>
                      <p>{p.desc}</p>
                      <div className="product-footer">
                        <span className="product-price">{p.price}</span>
                        <a href="#configurator-section" className="product-action">Customize <i className="fas fa-arrow-right"></i></a>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding why-sec" id="why-choose-us-section">
        <div className="container">
          <div className="section-title text-center" style={{ maxWidth: '600px', margin: '0 auto 60px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Our Advantages</span>
            <h2 style={{ marginTop: '10px' }}>Why Brands Choose Apex Packaging</h2>
            <p>We blend state-of-the-art box manufacturing with a dedication to sustainability and wholesale affordability.</p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon"><i className="fas fa-shipping-fast"></i></div>
              <h3>Free Global Shipping</h3>
              <p>We handle transport costs! Get free delivery right to your warehouse anywhere across the continental United States.</p>
            </div>
            <div className="why-card">
              <div className="why-icon"><i className="fas fa-recycle"></i></div>
              <h3>Eco-Friendly Initiative</h3>
              <p>All box materials are biodegradable, 100% recyclable, and printed using non-toxic soy-based biodegradable inks.</p>
            </div>
            <div className="why-card">
              <div className="why-icon"><i className="fas fa-paint-brush"></i></div>
              <h3>Free Graphic Support</h3>
              <p>No design files yet? No worries! Our expert artwork engineers will review, edit, or create templates for you at no extra cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding how-sec" id="how-it-works-section">
        <div className="container">
          <div className="section-title text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Order Process</span>
            <h2 style={{ marginTop: '10px' }}>4 Simple Steps to Custom Packaging</h2>
            <p>From initial sandbox layout configuration to warehouse doorstep shipping delivery, simplified.</p>
          </div>

          <div className="timeline">
            <div className="timeline-step">
              <div className="step-num">1</div>
              <h3>Configure & Quote</h3>
              <p>Define box styles, sizes, textures, and quantities in our customizer tool and request a free quote.</p>
            </div>
            <div className="timeline-step">
              <div className="step-num">2</div>
              <h3>Share Artwork</h3>
              <p>Upload branding elements, color details, or work with our internal designers to finalize your mockup template.</p>
            </div>
            <div className="timeline-step">
              <div className="step-num">3</div>
              <h3>Approve 3D Model</h3>
              <p>Inspect a complete 3D digital model or review physically manufactured press proofs prior to full factory assembly.</p>
            </div>
            <div className="timeline-step">
              <div className="step-num">4</div>
              <h3>Fast Delivery</h3>
              <p>Your custom boxes are manufactured, quality inspected, and shipped directly to your door in 8-12 days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eco-Friendly CTA Banner */}
      <section className="container section-padding">
        <div className="eco-banner">
          <div className="eco-banner-grid">
            <div className="eco-content">
              <h2>Go Green with Apex Packaging</h2>
              <p>Reduce carbon footprints by switching to soy-based inks and organic cardboard alternatives. Help us plant trees and make shipping packaging fully sustainable.</p>
              <div className="eco-badges-grid">
                <div className="eco-badge-item"><i class="fas fa-check-circle"></i> FSC Certified Board</div>
                <div className="eco-badge-item"><i className="fas fa-check-circle"></i> Organic Soy Ink</div>
                <div className="eco-badge-item"><i className="fas fa-check-circle"></i> Carbon Neutral Production</div>
              </div>
            </div>
            <div className="eco-action">
              <a href="#quote-form-section" className="btn btn-primary btn-amber" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>Get Started Now</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider Section */}
      <section className="section-padding testi-sec">
        <div className="container">
          <div className="section-title text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Client Reviews</span>
            <h2 style={{ marginTop: '10px' }}>What Brands Say About Us</h2>
            <p>See why major retailers, small e-commerce stores, and high-volume brands trust us with their product delivery.</p>
          </div>

          <div 
            className="testimonial-container"
            onMouseEnter={() => clearInterval(testimonialTimerRef.current)}
            onMouseLeave={startTestiTimer}
          >
            <div className="testimonial-slider">
              {testimonials.map((t, idx) => (
                <div 
                  key={idx}
                  className={`testimonial-slide ${currentTesti === idx ? 'active' : ''}`}
                >
                  <p className="testi-quote">"{t.quote}"</p>
                  <div className="testi-profile">
                    <div className="profile-info">
                      <div 
                        className="profile-avatar" 
                        style={{ backgroundColor: t.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
                      >
                        {t.avatar}
                      </div>
                      <div className="profile-meta">
                        <h4>{t.name}</h4>
                        <p>{t.role}</p>
                      </div>
                    </div>
                    <div className="stars">
                      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Arrow Controls */}
            <div className="slider-controls">
              <button onClick={handlePrevTesti} className="slide-arrow" aria-label="Previous testimonial"><i className="fas fa-chevron-left"></i></button>
              <button onClick={handleNextTesti} className="slide-arrow" aria-label="Next testimonial"><i className="fas fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding faq-sec" id="faq-section">
        <div className="container">
          <div className="section-title text-center" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Help Center</span>
            <h2 style={{ marginTop: '10px' }}>Frequently Asked Questions</h2>
            <p>Have questions about sizes, materials, design reviews, or wholesale wholesale shipping? Find quick answers here.</p>
          </div>

          <div className="faq-container">
            {faqs.map((faq, idx) => {
              const isActive = activeFaqIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                  <button onClick={() => toggleFaq(idx)} className="faq-question">
                    {faq.q}
                    <i className="fas fa-chevron-down"></i>
                  </button>
                  <div 
                    className="faq-answer"
                    style={{ maxHeight: isActive ? '200px' : null, transition: 'all 0.3s ease-in-out' }}
                  >
                    <div className="faq-answer-content">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Request A Quote Form Section */}
      <section className="section-padding quote-sec" id="quote-form-section">
        <div className="container quote-grid">
          <div className="quote-info-panel">
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.05em' }}>Get in Touch</span>
            <h2>Request a Free Custom Quote</h2>
            <p>Send us your dimensional requirements, box styles, quantities, and upload designs if any. Our packaging specialists will contact you in under 2 hours with pricing.</p>
            
            <div className="benefit-list">
              <div className="benefit-item">
                <div className="benefit-icon"><i className="fas fa-clock"></i></div>
                <div className="benefit-text">
                  <h4>2-Hour Response Time</h4>
                  <p>Fast response with detailed pricing quotes during business hours.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><i className="fas fa-file-invoice-dollar"></i></div>
                <div className="benefit-text">
                  <h4>No Hidden Setup Fees</h4>
                  <p>Clear, transparent wholesale wholesale rates with plate setup charges included.</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon"><i className="fas fa-user-shield"></i></div>
                <div className="benefit-text">
                  <h4>Satisfaction Guarantee</h4>
                  <p>Pre-shipment photo checks and dedicated support from order to arrival.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RFQ Form Card */}
          <div ref={formCardRef} className="quote-form-card" id="quote-form-section">
            <div className="form-header">
              <h3>Submit Details</h3>
              <p>Take 1 minute to share your project dimensions</p>
            </div>

            <form className="quote-request-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-name">Full Name *</label>
                  <input 
                    type="text" 
                    id="form-name" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-email">Work Email *</label>
                  <input 
                    type="email" 
                    id="form-email" 
                    className="form-input" 
                    placeholder="john@brand.com" 
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="form-phone" 
                    className="form-input" 
                    placeholder="(555) 000-0000" 
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-company">Company Name</label>
                  <input 
                    type="text" 
                    id="form-company" 
                    className="form-input" 
                    placeholder="Brand LLC" 
                    value={formCompany}
                    onChange={e => setFormCompany(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-box-style">Box Style</label>
                  <select 
                    id="form-box-style" 
                    className="form-input"
                    value={formBoxStyle}
                    onChange={e => setFormBoxStyle(e.target.value)}
                  >
                    <option value="mailer">Corrugated Mailer Box</option>
                    <option value="shipping">Standard Shipping Carton</option>
                    <option value="rigid">Premium Rigid Presentation</option>
                    <option value="other">Other Shape / Tube / Pillow</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="form-material">Material</label>
                  <select 
                    id="form-material" 
                    className="form-input"
                    value={formMaterial}
                    onChange={e => setFormMaterial(e.target.value)}
                  >
                    <option value="kraft">Recycled Brown Kraft</option>
                    <option value="corrugated">Corrugated Cardboard</option>
                    <option value="rigid">Luxury Rigid Chipboard</option>
                    <option value="glossy">Gloss White SBS Paper</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="form-dimensions">Dimensions (L x W x H inches)</label>
                  <input 
                    type="text" 
                    id="form-dimensions" 
                    className="form-input" 
                    placeholder="e.g. 10 x 8 x 4"
                    value={formDimensions}
                    onChange={e => setFormDimensions(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="form-qty">Required Quantity *</label>
                  <input 
                    type="number" 
                    id="form-qty" 
                    className="form-input" 
                    min="100" 
                    value={formQty} 
                    onChange={e => setFormQty(parseInt(e.target.value) || 0)}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="form-desc">Project Details / Custom Features</label>
                <textarea 
                  id="form-desc" 
                  className="form-input" 
                  placeholder="Tell us about special laminations, foam inserts, handle cuts, printing locations..."
                  value={formDetails}
                  onChange={e => setFormDetails(e.target.value)}
                ></textarea>
              </div>

              <label className="form-checkbox">
                <input 
                  type="checkbox" 
                  checked={formAgreed}
                  onChange={e => setFormAgreed(e.target.checked)}
                  required 
                /> I agree to submit this layout request for quote estimation.
              </label>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '14px' }}
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <><i className="fas fa-spinner fa-spin"></i> Submitting Request...</>
                ) : (
                  <><i className="fas fa-paper-plane"></i> Submit Request</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="logo-text">
                <div className="logo-icon"></div>
                APEX<span>PACK</span>
              </a>
              <p>We print and manufacture custom boxes at wholesale prices. Eco-friendly FSC board, custom foam designs, and fast logistics services.</p>
              <div className="social-links">
                <a href="#" className="social-btn" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-btn" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-btn" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="social-btn" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Box Styles</h4>
              <div className="footer-links">
                <a href="#showcase-section">Mailer Boxes</a>
                <a href="#showcase-section">Shipping Boxes</a>
                <a href="#showcase-section">Luxury Rigid Boxes</a>
                <a href="#showcase-section">Cartons & Sleeves</a>
              </div>
            </div>

            <div className="footer-column">
              <h4>By Industry</h4>
              <div className="footer-links">
                <a href="#showcase-section">Cosmetic Boxes</a>
                <a href="#showcase-section">Appliance & Devices</a>
                <a href="#showcase-section">Bakery & Food</a>
                <a href="#showcase-section">Pharma & Health</a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Contact Us</h4>
              <div className="footer-contact-info">
                <div className="footer-contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <div>
                    <h5>Phone</h5>
                    <p>(510) 500-9533</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h5>Email</h5>
                    <p>sales@apexpack.com</p>
                  </div>
                </div>
                <div className="footer-contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h5>Headquarters</h5>
                    <p>Newark, CA 94560, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <div className="footer-newsletter">
                <p>Subscribe for custom packaging ideas, trends, and wholesale seasonal promotions.</p>
                <form className="newsletter-form" onSubmit={e => { e.preventDefault(); e.target.reset(); alert('Subscribed to Newsletter!'); }}>
                  <input type="email" className="newsletter-input" placeholder="Your Email" aria-label="Newsletter email input" required />
                  <button type="submit" className="newsletter-btn" aria-label="Subscribe button"><i className="fas fa-paper-plane"></i></button>
                </form>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 Apex Packaging. All rights reserved.</p>
            <div className="footer-legal-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Quality Assurance Guarantee</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Form Success Modal Popup */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`}>
        <div className="modal-card">
          <div className="modal-icon"><i className="fas fa-check-double"></i></div>
          <h3>Request Submitted Successfully!</h3>
          <p>Your custom packaging specifications have been successfully sent. A sales consultant is reviewing your layout details and will reply with standard wholesale rates in under 2 hours.</p>
          <button onClick={() => setIsModalOpen(false)} className="btn btn-primary" style={{ padding: '10px 24px', minWidth: '140px' }}>Great, Thanks</button>
        </div>
      </div>

      {/* Live Sales Chat Assistant Widget */}
      <div className="chat-widget">
        <div className={`chat-window ${chatActive ? 'active' : ''}`} id="chat-window">
          <div className="chat-header">
            <h4>Apex Live Support</h4>
            <button 
              className="btn-icon" 
              style={{ background: 'none', border: 'none', color: 'white', width: 'auto', height: 'auto' }}
              onClick={() => setChatActive(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div ref={chatBodyRef} className="chat-body" id="chat-body">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask a custom packaging expert..."
              value={chatInputText}
              onChange={e => setChatInputText(e.target.value)}
              onKeyPress={e => { if (e.key === 'Enter') handleChatSend(); }}
            />
            <button onClick={handleChatSend} className="chat-send-btn"><i className="fas fa-paper-plane"></i></button>
          </div>
        </div>
        <div 
          onClick={() => setChatActive(prev => !prev)} 
          className="chat-bubble" 
          aria-label="Open chat support"
        >
          <i className="fas fa-comments"></i>
        </div>
      </div>
    </>
  );
}
