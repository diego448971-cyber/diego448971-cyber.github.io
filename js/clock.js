/* ================================================================
   A.D.N.D — Real-Time Clock Widget
   ================================================================ */

const ClockWidget = (() => {
  const DAYS   = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  let timeEl = null;
  let dateEl = null;
  let ticker = null;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function update() {
    const now = new Date();

    if (timeEl) {
      timeEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }

    if (dateEl) {
      const day  = DAYS[now.getDay()];
      const date = pad(now.getDate());
      const mon  = MONTHS[now.getMonth()];
      const year = now.getFullYear();
      dateEl.textContent = `${day}, ${date} ${mon} ${year}`;
    }
  }

  function init() {
    timeEl = document.getElementById('clock-time');
    dateEl = document.getElementById('clock-date');

    if (!timeEl && !dateEl) return;

    update();
    ticker = setInterval(update, 1000);
  }

  function destroy() {
    if (ticker) clearInterval(ticker);
  }

  return { init, destroy };
})();
