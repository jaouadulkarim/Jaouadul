/**
 * JAOUADUL KARIM HIMEL - DATA ANALYST PORTFOLIO
 * Core Interactions, Parallax, Interactive Analytics Lab, Modals & WhatsApp Integration
 */

function initAll() {
  initScrollProgress();
  initStickyHeader();
  initStatsCounter();
  initHeroParallax();
  initSpotlightCards();
  initAnalyticsLab();
  initScrollReveals();
  initProjectModals();
  initCertificateModal();
  initWhatsAppInquiry();
  initSmoothScroll();
  initCopyActions();
  initMobileMenu();
  initServiceCardSelection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

/* ==========================================================================
   Sticky Header on Scroll
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   Animated Numbers Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target') || '0', 10);
          animateCount(numEl, target, 1600);
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.hero-stats-stack');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

function animateCount(element, target, duration) {
  let start = 0;
  const startTime = performance.now();

  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = Math.floor(easeOut * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ==========================================================================
   Hero Mouse Parallax Effect (3D Editorial Depth)
   ========================================================================== */
function initHeroParallax() {
  const heroSection = document.querySelector('.hero-section');
  const portraitContainer = document.querySelector('.portrait-image-container');
  const glowRing = document.querySelector('.portrait-glow-ring');

  if (!heroSection || !portraitContainer) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentPortraitX = 0;
  let currentPortraitY = 0;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX = x * 20;
    mouseY = y * 16;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  function renderParallax() {
    currentPortraitX += (mouseX - currentPortraitX) * 0.08;
    currentPortraitY += (mouseY - currentPortraitY) * 0.08;

    portraitContainer.style.transform = `translate3d(${currentPortraitX}px, ${currentPortraitY}px, 0)`;
    if (glowRing) {
      glowRing.style.transform = `translate3d(${currentPortraitX * 0.6}px, ${currentPortraitY * 0.6}px, 0)`;
    }

    requestAnimationFrame(renderParallax);
  }

  renderParallax();
}

/* ==========================================================================
   Spotlight Cursor Effect on Cards
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card, .project-card, .tri-col-education, .tri-col-process');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   Interactive Analytics Lab / Live BI Playground
   ========================================================================== */
const labDatasets = {
  revenue: {
    title: 'Omnichannel Sales Trajectory (Q3/Q4)',
    points: 'M 40,220 C 120,180 180,240 260,140 C 340,60 420,130 500,80 C 580,30 660,90 740,40',
    areaPoints: 'M 40,220 C 120,180 180,240 260,140 C 340,60 420,130 500,80 C 580,30 660,90 740,40 L 740,280 L 40,280 Z',
    dots: [
      { cx: 40, cy: 220, val: '$8.2M' },
      { cx: 260, cy: 140, val: '$11.4M' },
      { cx: 500, cy: 80, val: '$13.9M' },
      { cx: 740, cy: 40, val: '$14.8M' }
    ],
    metric1: '$14.82M',
    label1: 'Total Generated Revenue',
    metric2: '+24.8%',
    label2: 'Revenue Target Outperformance',
    metric3: '18 hrs/wk',
    label3: 'Automated Reporting Savings'
  },
  churn: {
    title: 'Subscriber Churn Probability Curve (60-Day Forecast)',
    points: 'M 40,60 C 120,70 200,90 300,150 C 400,210 500,230 620,240 C 680,245 740,250 740,250',
    areaPoints: 'M 40,60 C 120,70 200,90 300,150 C 400,210 500,230 620,240 C 680,245 740,250 740,250 L 740,280 L 40,280 Z',
    dots: [
      { cx: 40, cy: 60, val: '89.2%' },
      { cx: 300, cy: 150, val: 'F1: 0.84' },
      { cx: 500, cy: 230, val: 'Threshold' },
      { cx: 740, cy: 250, val: 'Stable' }
    ],
    metric1: '89.2%',
    label1: 'Model Prediction Accuracy',
    metric2: '31.4%',
    label2: 'At-Risk Subscriber Retention',
    metric3: '0.84',
    label3: 'Precision / F1-Score'
  },
  risk: {
    title: 'Financial Transaction Outlier & Anomaly Frequency',
    points: 'M 40,250 L 140,240 L 200,80 L 260,250 L 380,230 L 460,50 L 530,240 L 640,245 L 740,90',
    areaPoints: 'M 40,250 L 140,240 L 200,80 L 260,250 L 380,230 L 460,50 L 530,240 L 640,245 L 740,90 L 740,280 L 40,280 Z',
    dots: [
      { cx: 200, cy: 80, val: 'Anomaly #1' },
      { cx: 460, cy: 50, val: 'Critical Spike' },
      { cx: 740, cy: 90, val: 'Flagged Wire' }
    ],
    metric1: '$3.2M',
    label1: 'High-Risk Exposure Prevented',
    metric2: '145',
    label2: 'Critical Anomalies Detected',
    metric3: '99.8%',
    label3: 'Audit & Governance Score'
  },
  clv: {
    title: 'Customer Lifetime Value (Cohort Expansion)',
    points: 'M 40,260 C 140,240 220,190 320,150 C 440,110 560,70 660,50 L 740,40',
    areaPoints: 'M 40,260 C 140,240 220,190 320,150 C 440,110 560,70 660,50 L 740,40 L 740,280 L 40,280 Z',
    dots: [
      { cx: 40, cy: 260, val: '$85' },
      { cx: 320, cy: 150, val: '$245' },
      { cx: 660, cy: 50, val: '$480' },
      { cx: 740, cy: 40, val: '$560' }
    ],
    metric1: '$560',
    label1: 'Average 12-Month CLV',
    metric2: '4.2x',
    label2: 'LTV to CAC Multiple',
    metric3: '+38%',
    label3: 'Repeat Cohort Repurchase'
  }
};

function initAnalyticsLab() {
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const linePath = document.getElementById('labLinePath');
  const areaPath = document.getElementById('labAreaPath');
  const dotsContainer = document.getElementById('labDotsGroup');
  const chartTitle = document.getElementById('labChartTitle');
  const m1 = document.getElementById('labMetric1');
  const l1 = document.getElementById('labLabel1');
  const m2 = document.getElementById('labMetric2');
  const l2 = document.getElementById('labLabel2');
  const m3 = document.getElementById('labMetric3');
  const l3 = document.getElementById('labLabel3');

  if (!tabBtns.length || !linePath) return;

  function setDataset(key) {
    const data = labDatasets[key];
    if (!data) return;

    if (chartTitle) chartTitle.textContent = data.title;
    linePath.setAttribute('d', data.points);
    if (areaPath) areaPath.setAttribute('d', data.areaPoints);

    if (dotsContainer) {
      dotsContainer.innerHTML = data.dots.map(d => `
        <g class="lab-point-group">
          <circle cx="${d.cx}" cy="${d.cy}" r="6" fill="#ef233c" stroke="#ffffff" stroke-width="2" class="animate-pulse"></circle>
          <text x="${d.cx}" y="${d.cy - 12}" fill="#ffffff" font-size="11" font-weight="700" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">${d.val}</text>
        </g>
      `).join('');
    }

    if (m1) m1.textContent = data.metric1;
    if (l1) l1.textContent = data.label1;
    if (m2) m2.textContent = data.metric2;
    if (l2) l2.textContent = data.label2;
    if (m3) m3.textContent = data.metric3;
    if (l3) l3.textContent = data.label3;
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const datasetKey = btn.getAttribute('data-dataset');
      setDataset(datasetKey);
    });
  });

  // Default initialize
  setDataset('revenue');
}

/* ==========================================================================
   Editorial Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  const updateBar = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();
}

/* ==========================================================================
   Smooth Intersection Scroll Reveal System
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-init');
  if (!reveals.length) return;

  const triggerReveal = () => {
    const winH = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= winH * 0.95) {
        el.classList.add('revealed');
      }
    });
  };

  triggerReveal();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '40px 0px 40px 0px',
      threshold: 0.05
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  window.addEventListener('scroll', triggerReveal, { passive: true });
}

/* ==========================================================================
   Case Studies Data & Interactive Modal
   ========================================================================== */
const projectData = {
  '1': {
    index: '01',
    category: 'E-COMMERCE & RETAIL BI',
    title: 'Omnichannel Sales Performance & Revenue Intelligence',
    tech: 'Power BI • PostgreSQL • DAX • Python',
    image: 'project-1-ecommerce.jpg',
    metrics: [
      { value: '+24.8%', label: 'Revenue Growth Identified' },
      { value: '18 hrs', label: 'Weekly Reporting Saved' },
      { value: '$14.8M', label: 'Sales Data Analyzed' }
    ],
    overview: 'Developed an enterprise-grade executive dashboard for a multi-channel retailer processing over 250,000 monthly transactions across physical stores and digital marketplaces. Built automated ETL pipelines to consolidate disparate data silos and generated real-time revenue pacing against quarterly targets.',
    challenge: 'The executive team lacked a single source of truth for cross-channel margin analysis, suffering from 48-hour reporting lag and untracked inventory turnover bottlenecks.',
    solution: 'Designed a star-schema data warehouse in PostgreSQL and connected it to Power BI with optimized DAX measures for dynamic time intelligence, cohort analysis, and product return attribution.',
    tags: ['Power BI', 'DAX', 'SQL', 'PostgreSQL', 'ETL', 'Sales Forecasting', 'Executive Reporting']
  },
  '2': {
    index: '02',
    category: 'PREDICTIVE ANALYTICS & ML',
    title: 'Customer Churn Prediction & Retention Modeling',
    tech: 'Python • Scikit-Learn • Pandas • Seaborn',
    image: 'project-2-churn.jpg',
    metrics: [
      { value: '89.2%', label: 'Prediction Accuracy' },
      { value: '31.4%', label: 'At-Risk Churn Saved' },
      { value: '0.84', label: 'Model F1-Score' }
    ],
    overview: 'Engineered a machine learning pipeline to predict subscriber churn 60 days in advance. Analyzed customer lifetime value (CLV), contract types, usage velocity, and support ticket frequency to isolate high-risk behavior patterns.',
    challenge: 'High customer acquisition costs were being offset by silent subscriber drop-off. The client needed early-warning indicators rather than post-cancellation surveys.',
    solution: 'Preprocessed raw customer logs using Pandas, executed feature engineering for tenure velocity and payment delinquency, and trained an ensemble model (Random Forest & XGBoost) integrated with automated marketing triggers.',
    tags: ['Python', 'Scikit-Learn', 'Pandas', 'Machine Learning', 'Cohort Heatmaps', 'Feature Engineering', 'Seaborn']
  },
  '3': {
    index: '03',
    category: 'FINANCIAL RISK & GOVERNANCE',
    title: 'Executive Financial Risk & Fraud Anomaly Detector',
    tech: 'Tableau • Google BigQuery • Statistical Modeling',
    image: 'project-3-finance.jpg',
    metrics: [
      { value: '$3.2M', label: 'High-Risk Exposure Mitigated' },
      { value: '145', label: 'Critical Anomalies Flagged' },
      { value: '99.8%', label: 'Compliance Audit Score' }
    ],
    overview: 'Architected an automated risk intelligence monitoring system to detect fraudulent wire transfers, cash flow volatility, and liquidity exposure across international subsidiary accounts.',
    challenge: 'Manual compliance reviews resulted in slow anomaly discovery, leaving treasury accounts vulnerable to sudden volatility spikes and wire fraud.',
    solution: 'Implemented streaming ingestion into Google BigQuery with statistical Z-score outlier detection models and built an interactive Tableau command center with automated threshold alerts.',
    tags: ['Tableau', 'BigQuery', 'SQL', 'Anomaly Detection', 'Risk Modeling', 'Cash Flow Analysis', 'Compliance']
  }
};

function initProjectModals() {
  const modalOverlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!modalOverlay) return;

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalImage').src = data.image;
      document.getElementById('modalImage').alt = data.title;

      const metricsContainer = document.getElementById('modalMetrics');
      metricsContainer.innerHTML = data.metrics.map(m => `
        <div class="modal-metric-card">
          <span class="modal-metric-value">${m.value}</span>
          <span class="modal-metric-label">${m.label}</span>
        </div>
      `).join('');

      document.getElementById('modalOverviewText').textContent = data.overview;
      document.getElementById('modalChallengeText').textContent = data.challenge;
      document.getElementById('modalSolutionText').textContent = data.solution;

      const tagsContainer = document.getElementById('modalTags');
      tagsContainer.innerHTML = data.tags.map(tag => `
        <span class="skill-tag">${tag}</span>
      `).join('');

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Certificate Modal Controller
   ========================================================================== */
function initCertificateModal() {
  const certModal = document.getElementById('certificateModal');
  if (!certModal) return;
  const certCloseBtn = document.getElementById('certModalCloseBtn');

  window.openCertModal = function() {
    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (certCloseBtn) {
    certCloseBtn.addEventListener('click', closeCertModal);
  }

  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });
}

/* ==========================================================================
   WhatsApp Direct Launcher
   ========================================================================== */
function initWhatsAppInquiry() {
  const whatsappNumber = '8801621467652';

  const sendWhatsAppMsg = (customText) => {
    const text = customText || 'Hello Jaouadul Karim Himel, I came across your portfolio and would like to discuss a statistical data analysis project with you.';
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${whatsappNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  const whatsappBtns = document.querySelectorAll('[data-whatsapp-btn]');
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const customMsg = btn.getAttribute('data-custom-msg');
      sendWhatsAppMsg(customMsg);
    });
  });

  const screenshotForm = document.getElementById('contactFormScreenshot');
  if (screenshotForm) {
    screenshotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value || 'Client';
      const email = document.getElementById('formEmail')?.value || 'Not provided';
      const service = document.getElementById('formService')?.value || 'Statistical Analysis';
      const message = document.getElementById('formMessage')?.value || '';

      const fullText = `Hello Jaouadul Karim Himel!\n\n*Name:* ${name}\n*Email:* ${email}\n*Service Needed:* ${service}\n*Project Details:* ${message}\n\nI would like to discuss this project with you.`;
      
      const submitBtn = screenshotForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const orig = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>✓ Connecting to WhatsApp...</span>`;
        setTimeout(() => {
          submitBtn.innerHTML = orig;
        }, 2800);
      }

      sendWhatsAppMsg(fullText);
    });
  }
}

/* ==========================================================================
   Smooth Scroll to Anchor Links
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const floatingBackToTop = document.getElementById('floatingBackToTop');
  if (floatingBackToTop) {
    floatingBackToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const checkScrollPosition = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY > 280) {
        floatingBackToTop.classList.add('visible');
      } else {
        floatingBackToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', checkScrollPosition, { passive: true });
    checkScrollPosition();
  }
}

/* ==========================================================================
   Copy to Clipboard Functionality
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span style="color:#10b981;font-weight:700;">✓ Copied!</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });
}

/* ==========================================================================
   Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavCloseBtn');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   Service Card Click - Smooth Scroll & Pre-Select In Contact Form
   ========================================================================== */
function initServiceCardSelection() {
  const serviceCards = document.querySelectorAll('[data-service-select]');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const serviceVal = card.getAttribute('data-service-select');
      const selectEl = document.getElementById('formService');
      if (selectEl && serviceVal) {
        selectEl.value = serviceVal;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
