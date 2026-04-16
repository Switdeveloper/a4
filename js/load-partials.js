// Load partials (header/footer) into pages
document.addEventListener('DOMContentLoaded', async () => {
    // Load header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        try {
            const response = await fetch('partials/header.html');
            const headerHTML = await response.text();
            headerContainer.innerHTML = headerHTML;
            
            // Add mobile menu toggle after header loads
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenuBtn && mobileMenu) {
                mobileMenuBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        } catch (e) {
            console.log('Header loaded inline');
        }
    }
    
    // Load footer
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        try {
            const response = await fetch('partials/footer.html');
            const footerHTML = await response.text();
            footerContainer.innerHTML = footerHTML;
        } catch (e) {
            console.log('Footer loaded inline');
        }
    }
});
// Initialize FAQ Accordions if they exist on the page
function initFAQ() {
    const faqBtns = document.querySelectorAll('.faq-btn');
    if (faqBtns.length === 0) return;

    faqBtns.forEach(btn => {
        // Prevent multiple listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => {
            const content = newBtn.nextElementSibling;
            const icon = newBtn.querySelector('.faq-icon');

            // Close all other FAQs
            const allBtns = document.querySelectorAll('.faq-btn');
            allBtns.forEach(otherBtn => {
                if (otherBtn !== newBtn) {
                    otherBtn.nextElementSibling.classList.add('hidden');
                    const otherIcon = otherBtn.querySelector('.faq-icon');
                    if (otherIcon) otherIcon.className = 'fas fa-plus text-gray-400 faq-icon';
                    otherBtn.classList.remove('bg-gray-50');
                    otherBtn.classList.add('bg-white');
                }
            });

            // Toggle current FAQ
            content.classList.toggle('hidden');

            if (content.classList.contains('hidden')) {
                if (icon) icon.className = 'fas fa-plus text-gray-400 faq-icon';
                newBtn.classList.remove('bg-gray-50');
                newBtn.classList.add('bg-white');
            } else {
                if (icon) icon.className = 'fas fa-minus text-primary-red faq-icon';
                newBtn.classList.add('bg-gray-50');
                newBtn.classList.remove('bg-white');
            }
        });
    });
}

// Call initFAQ when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
} else {
    initFAQ();
}
