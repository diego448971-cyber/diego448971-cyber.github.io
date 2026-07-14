/* ================================================================
   A.D.N.D — Budget Cart System
   ================================================================ */

const Cart = (() => {
  const WA_NUMBER   = '5598999120388';
  const STORAGE_KEY = 'adnd-cart';

  let items = [];

  /* ── Persistence ─────────────────────────────────────────── */
  function load() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      items = saved ? JSON.parse(saved) : [];
    } catch { items = []; }
  }

  function save() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /* ── Operations ──────────────────────────────────────────── */
  function add(serviceName) {
    if (items.includes(serviceName)) {
      showFeedback(`"${serviceName}" já está no orçamento.`, 'info');
      return;
    }
    items.push(serviceName);
    save();
    updateBadge();
    renderItems();
    showFeedback(`✓ "${serviceName}" adicionado ao orçamento!`, 'success');

    // Auto-open sidebar if first item
    if (items.length === 1) {
      setTimeout(openSidebar, 600);
    }
  }

  function remove(index) {
    if (index < 0 || index >= items.length) return;
    items.splice(index, 1);
    save();
    updateBadge();
    renderItems();
  }

  function clear() {
    items = [];
    save();
    updateBadge();
    renderItems();
  }

  /* ── UI Updates ──────────────────────────────────────────── */
  function updateBadge() {
    const badge = document.getElementById('cart-badge');
    const count = document.getElementById('cart-count');

    if (badge) {
      badge.textContent = items.length;
      badge.style.display = items.length > 0 ? 'flex' : 'none';
    }
    if (count) count.textContent = items.length;

    // Update send button state
    const sendBtn = document.getElementById('cart-whatsapp-btn');
    if (sendBtn) {
      sendBtn.disabled = items.length === 0;
      sendBtn.style.opacity = items.length === 0 ? '0.5' : '1';
    }
  }

  function renderItems() {
    const list = document.getElementById('cart-items-list');
    if (!list) return;

    if (items.length === 0) {
      list.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-cart-shopping"></i>
          <p>Nenhum serviço adicionado</p>
          <span>Navegue pelos serviços e adicione ao orçamento</span>
        </div>
      `;
      return;
    }

    list.innerHTML = items.map((item, i) => `
      <div class="cart-item" data-index="${i}">
        <div class="cart-item-icon"><i class="fas fa-check-circle"></i></div>
        <div class="cart-item-name">${item}</div>
        <button class="cart-item-remove" onclick="Cart.remove(${i})" aria-label="Remover ${item}">
          <i class="fas fa-xmark"></i>
        </button>
      </div>
    `).join('');
  }

  /* ── Sidebar ─────────────────────────────────────────────── */
  function openSidebar() {
    const sidebar  = document.getElementById('cart-sidebar');
    const overlay  = document.getElementById('cart-overlay');
    renderItems();
    sidebar?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── WhatsApp ────────────────────────────────────────────── */
  function sendToWhatsApp() {
    if (items.length === 0) {
      showFeedback('Adicione pelo menos um serviço ao orçamento.', 'info');
      return;
    }

    const list    = items.map((item) => `• ${item}`).join('\n');
    const message = `Olá!\n\nTenho interesse nos seguintes serviços:\n\n${list}\n\nGostaria de solicitar um orçamento.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
  }

  /* ── Feedback Toast ──────────────────────────────────────── */
  function showFeedback(text, type = 'success') {
    const existing = document.querySelector('.cart-feedback');
    existing?.remove();

    const el = document.createElement('div');
    el.className = `cart-feedback feedback-${type}`;
    el.innerHTML = type === 'success'
      ? `<i class="fas fa-circle-check"></i> ${text}`
      : `<i class="fas fa-circle-info"></i> ${text}`;

    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));

    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 350);
    }, 3000);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    load();
    updateBadge();

    // Toggle button
    document.getElementById('cart-toggle-btn')?.addEventListener('click', () => {
      const isOpen = document.getElementById('cart-sidebar')?.classList.contains('open');
      isOpen ? closeSidebar() : openSidebar();
    });

    // Close button
    document.getElementById('cart-close')?.addEventListener('click', closeSidebar);

    // Overlay
    document.getElementById('cart-overlay')?.addEventListener('click', closeSidebar);

    // Send button
    document.getElementById('cart-whatsapp-btn')?.addEventListener('click', sendToWhatsApp);

    // Clear button
    document.getElementById('cart-clear-btn')?.addEventListener('click', clear);

    // Expose globally for onclick attributes in service cards
    window.Cart = { add, remove, sendToWhatsApp };
  }

  return { init, add, remove, clear, sendToWhatsApp };
})();
