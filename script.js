document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');

    // --- Navigation Logic ---
    // اس فنکشن کو گلوبل بنانا تاکہ HTML سے بھی کال کیا جا سکے
    window.showPage = (pageId) => {
        // تمام صفحات کو چھپائیں اور بٹن سے 'active' کلاس ہٹائیں
        pages.forEach(page => page.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        // مطلوبہ صفحہ اور بٹن کو دکھائیں
        const activePage = document.getElementById(pageId);
        const activeButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);
        
        if (activePage) {
            activePage.classList.add('active');
        }
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    // تمام نیویگیشن بٹن پر ایونٹ لسنر لگائیں
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // --- Initial App Load ---
    // ایپ کھلنے پر ہوم پیج دکھائیں
    showPage('homePage');
});
