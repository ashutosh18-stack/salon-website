/**
 * HAIR STORY — VIP Reservation Concierge
 * Multi-step booking engine with live total calculation, artisan selection, and voucher receipt
 */

document.addEventListener('DOMContentLoaded', () => {
  const serviceCheckboxes = document.querySelectorAll('.booking-service-check');
  const artisanRadios = document.querySelectorAll('input[name="artisan"]');
  const slotButtons = document.querySelectorAll('.time-slot-btn');
  const selectedSlotInput = document.getElementById('selectedTimeSlot');
  const totalPriceElem = document.getElementById('bookingTotalPrice');
  const totalDurationElem = document.getElementById('bookingTotalDuration');
  const bookingForm = document.getElementById('luxuryBookingForm');
  const confirmationVoucher = document.getElementById('bookingConfirmationVoucher');

  // Multi-step logic
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const stepPanels = document.querySelectorAll('.booking-step-panel');
  let currentStep = 1;

  function updateTotals() {
    let price = 0;
    let duration = 0;

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        price += parseInt(cb.dataset.price || '0', 10);
        duration += parseInt(cb.dataset.duration || '0', 10);
      }
    });

    if (totalPriceElem) totalPriceElem.textContent = `₹${price.toLocaleString('en-IN')}`;
    if (totalDurationElem) totalDurationElem.textContent = `${duration} mins`;
  }

  serviceCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateTotals);
  });

  // Time Slot Selection
  slotButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slotButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedSlotInput) selectedSlotInput.value = btn.dataset.time;
    });
  });

  // Step Navigation
  window.goToBookingStep = function(step) {
    if (step < 1 || step > 4) return;
    currentStep = step;

    stepPanels.forEach(panel => {
      if (parseInt(panel.dataset.step, 10) === currentStep) {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    stepIndicators.forEach(ind => {
      const s = parseInt(ind.dataset.step, 10);
      if (s === currentStep) {
        ind.classList.add('active');
        ind.classList.remove('completed');
      } else if (s < currentStep) {
        ind.classList.add('completed');
        ind.classList.remove('active');
      } else {
        ind.classList.remove('active', 'completed');
      }
    });

    // Scroll to form top smoothly
    const wizard = document.querySelector('.booking-wizard-card');
    if (wizard) wizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Form submission & Voucher Generation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('guestName')?.value || 'Guest';
      const email = document.getElementById('guestEmail')?.value || '';
      const phone = document.getElementById('guestPhone')?.value || '';
      const date = document.getElementById('bookingDate')?.value || new Date().toISOString().split('T')[0];
      const time = selectedSlotInput?.value || '11:00 AM';
      const artisan = document.querySelector('input[name="artisan"]:checked')?.value || 'Lead Haute Coiffure Master';
      const beverage = document.querySelector('input[name="beverage"]:checked')?.value || 'Laurent-Perrier Champagne';
      
      const selectedServices = [];
      serviceCheckboxes.forEach(cb => {
        if (cb.checked) selectedServices.push(cb.dataset.name);
      });

      if (selectedServices.length === 0) {
        alert('Please select at least one signature atelier service to proceed.');
        window.goToBookingStep(1);
        return;
      }

      const bookingRef = 'HS-' + Math.floor(100000 + Math.random() * 900000);

      // Render Confirmation Voucher
      if (confirmationVoucher) {
        confirmationVoucher.innerHTML = `
          <div style="background: #FFFFFF; border: 2px solid #B88E3E; border-radius: 16px; padding: 3rem; text-align: center; box-shadow: var(--shadow-lg); max-width: 650px; margin: 0 auto;">
            <div style="font-family: var(--font-brand-cinzel); font-size: 1.8rem; color: #181512; letter-spacing: 0.15em; font-weight: 700;">HAIR STORY</div>
            <div style="font-family: var(--font-script-priestacy); font-size: 2.2rem; color: #B88E3E; margin: 0.2rem 0 1rem;">Haute Coiffure VIP Reservation</div>
            
            <div style="display: inline-block; background: rgba(184, 142, 62, 0.1); border: 1px dashed #B88E3E; padding: 0.5rem 1.4rem; border-radius: 9999px; font-weight: 700; letter-spacing: 0.18em; font-size: 0.85rem; color: #966F26; margin-bottom: 2rem;">
              CONFIRMATION: ${bookingRef}
            </div>

            <div style="text-align: left; background: #FAF8F5; border-radius: 12px; padding: 1.8rem; margin-bottom: 2rem; border: 1px solid rgba(0,0,0,0.06); font-size: 0.92rem; line-height: 1.9;">
              <div><strong>Distinguished Guest:</strong> ${name}</div>
              <div><strong>Date & Time:</strong> ${date} at ${time}</div>
              <div><strong>Artisan Stylist:</strong> ${artisan}</div>
              <div><strong>Curated Rituals:</strong> ${selectedServices.join(', ')}</div>
              <div><strong>Complimentary Ambiance Amenity:</strong> ${beverage}</div>
              <div><strong>Total Investment:</strong> ${totalPriceElem ? totalPriceElem.textContent : '₹1,800'} (${totalDurationElem ? totalDurationElem.textContent : '75 mins'})</div>
              <div><strong>Atelier Address:</strong> 3rd floor, Indu Dreams, Unit no. 308, Rajarampuri 3rd Lane, Kolhapur, Maharashtra 416008 • Valet Parking Reserved</div>
            </div>

            <p style="font-size: 0.88rem; color: #685F56; margin-bottom: 2rem;">A private SMS & calendar invite has been dispatched to ${phone || email}. Our concierge will have your preferred suite and chilled beverage prepared upon arrival.</p>

            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <button onclick="window.print()" class="btn-luxury-primary">Print VIP Pass</button>
              <a href="index.html" class="btn-luxury-outline">Return to Atelier Home</a>
            </div>
          </div>
        `;
        confirmationVoucher.style.display = 'block';
        bookingForm.style.display = 'none';
        stepIndicators.forEach(s => s.classList.add('completed'));
      }
    });
  }

  // Preselect service if query param exists (e.g. ?service=balayage)
  const urlParams = new URLSearchParams(window.location.search);
  const requestedService = urlParams.get('service');
  if (requestedService) {
    const targetCheckbox = document.querySelector(`.booking-service-check[data-code="${requestedService}"]`);
    if (targetCheckbox) {
      targetCheckbox.checked = true;
      updateTotals();
    }
  }
});
