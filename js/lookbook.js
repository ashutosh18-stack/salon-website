/**
 * HAIR STORY — Lookbook Gallery Engine
 * Category filtering, smooth transitions, and high-definition lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterPills = document.querySelectorAll('.lookbook-filter-pill');
  const cards = document.querySelectorAll('.lookbook-card');

  // Filter logic
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.filter;

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
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

  // Lightbox click on cards
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img')?.src;
      const title = card.querySelector('.lookbook-title')?.textContent || 'Couture Silhouette';
      const script = card.querySelector('.lookbook-script-tag')?.textContent || 'Hair Story Atelier';
      const stylist = card.querySelector('.lookbook-stylist')?.textContent || 'Master Director';
      const desc = card.dataset.desc || 'Bespoke precision sculpt tailored to organic bone structure and dimensional tone.';

      const content = `
        <div style="text-align: center;">
          <div style="height: 480px; overflow: hidden; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid rgba(0,0,0,0.08);">
            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" alt="${title}">
          </div>
          <div style="font-family: var(--font-script-priestacy); font-size: 2rem; color: #B88E3E; margin-bottom: 0.2rem;">${script}</div>
          <h3 style="font-family: var(--font-serif-couture); font-size: 1.8rem; color: #181512; margin-bottom: 0.4rem;">${title}</h3>
          <div style="font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; color: #966F26; font-weight: 700; margin-bottom: 1rem;">${stylist}</div>
          <p style="font-size: 0.92rem; color: #5C544C; line-height: 1.6; max-width: 500px; margin: 0 auto 1.8rem;">${desc}</p>
          <a href="booking.html" class="btn-luxury-primary">Reserve Similar Transformation</a>
        </div>
      `;

      if (window.openLuxuryModal) {
        window.openLuxuryModal(title, content);
      }
    });
  });
});
