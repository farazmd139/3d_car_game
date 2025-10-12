document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');

    window.showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        const activePage = document.getElementById(pageId);
        const activeButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);
        
        if (activePage) {
            activePage.classList.add('active');
        }
        if (activeButton) {
            activeButton.classList.add('active');
        }
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    showPage('homePage');
});
