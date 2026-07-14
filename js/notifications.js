/* ================================================================
   A.D.N.D — Smart Notification System
   ================================================================ */

const NotificationSystem = (() => {
  const WA = '5598999120388';

  const MESSAGES = [
    { text: 'Alguém acabou de solicitar um orçamento.',        icon: 'fa-file-invoice',       color: 'neon' },
    { text: 'Novo cliente entrou em contato via WhatsApp.',     icon: 'fa-whatsapp fab',       color: 'green' },
    { text: 'Cliente visualizando Criação de Sites.',           icon: 'fa-eye',                color: 'neon' },
    { text: 'Cartão de Visita Digital adicionado ao carrinho.', icon: 'fa-id-card',            color: 'gold' },
    { text: 'Novo orçamento recebido para Tráfego Pago.',       icon: 'fa-bullhorn',           color: 'neon' },
    { text: 'Cliente consultando Cardápio Digital.',            icon: 'fa-utensils',           color: 'gold' },
    { text: 'Pedido de App para Celular recebido.',             icon: 'fa-mobile-alt',         color: 'neon' },
    { text: 'Arte para Redes Sociais adicionada ao orçamento.', icon: 'fa-paint-brush',        color: 'gold' },
    { text: 'Novo contato de Chapadinha — MA.',                 icon: 'fa-map-marker-alt',     color: 'neon' },
    { text: 'Diagnóstico Tecnológico sendo visualizado.',       icon: 'fa-tools',              color: 'gold' },
    { text: 'Cliente adicionou VSL Comercial ao orçamento.',    icon: 'fa-video',              color: 'neon' },
    { text: 'Solicitação de Foto 3x4 recebida.',                icon: 'fa-portrait',           color: 'gold' },
    { text: 'Cliente consultando Seu Negócio no Google Maps.',  icon: 'fa-map',                color: 'neon' },
    { text: 'Novo pedido de Panfleto Express.',                 icon: 'fa-file-alt',           color: 'gold' },
    { text: 'Cliente visualizando Trabalhos Escolares.',        icon: 'fa-graduation-cap',     color: 'neon' },
  ];

  let container = null;
  let timeout   = null;
  let lastIndex = -1;

  function getRandom() {
    let idx;
    do { idx = Math.floor(Math.random() * MESSAGES.length); } while (idx === lastIndex);
    lastIndex = idx;
    return MESSAGES[idx];
  }

  function getDelay() {
    return Math.floor(Math.random() * 8000) + 6000; // 6–14 s
  }

  function show() {
    if (!container) return;
    const msg = getRandom();

    const toast = document.createElement('div');
    toast.className = `notification-toast toast-${msg.color}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    const iconClass = msg.icon.includes('fab') ? `fab fa-${msg.icon.replace(' fab', '')}` : `fas ${msg.icon}`;

    toast.innerHTML = `
      <div class="toast-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="toast-body">
        <div class="toast-label"><i class="fas fa-circle-dot"></i> A.D.N.D · Ao Vivo</div>
        <div class="toast-text">${msg.text}</div>
      </div>
      <button class="toast-close" aria-label="Fechar notificação">
        <i class="fas fa-xmark"></i>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => dismiss(toast));
    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => dismiss(toast), 7500);
    scheduleNext();
  }

  function dismiss(toast) {
    toast.classList.remove('show');
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 450);
  }

  function scheduleNext() {
    clearTimeout(timeout);
    timeout = setTimeout(show, getDelay());
  }

  function init() {
    container = document.getElementById('notification-container');
    if (!container) return;

    // First notification after 4 seconds
    timeout = setTimeout(show, 4000);
  }

  return { init };
})();
