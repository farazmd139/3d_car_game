document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const mainMenuContainer = document.getElementById('main-menu');
    const surahPagesContainer = document.getElementById('surah-pages-container');

    // --- Navigation Logic ---
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = button.dataset.page;
            window.showPage(pageId); // اسے بھی گلوبل کال پر تبدیل کر دیں
        });
    });

    // گلوبل فنکشن تاکہ HTML سے کال کیا جا سکے
    window.showPage = (pageId) => {
        // تمام سورتوں کے صفحات کو چھپائیں
        const allSurahPages = document.querySelectorAll('.surah-page');
        allSurahPages.forEach(p => p.style.display = 'none');

        // تمام مرکزی صفحات کو غیر فعال کریں
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

        // اگر قرآن پیج دکھایا جائے اور وہ خالی ہو تو اس کا مواد لوڈ کریں
        if (pageId === 'quranPage' && !mainMenuContainer.hasChildNodes()) {
            generateQuranMenu();
        }
        
        // کسی بھی دوسرے پیج پر جانے سے آڈیو روک دیں
        const allAudioPlayers = document.querySelectorAll('audio');
        allAudioPlayers.forEach(player => {
            if (player && !player.paused) {
                player.pause();
            }
        });
    }

    // ========================================
    // QURAN SECTION LOGIC
    // ========================================
    const surahNames = [
        "الفاتحہ", "البقرہ", "آل عمران", "النساء", "المائدہ", "الأنعام", "الأعراف", "الأنفال", "التوبہ", "یونس", "ہود", "یوسف", "الرعد", "ابراہیم", "الحجر", "النحل", "الإسراء", "الکہف", "مریم", "طہ", "الأنبیاء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنکبوت", "الروم", "لقمان", "السجدہ", "الأحزاب", "سبا", "فاطر", "یٰسٓ", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشوریٰ", "الزخرف", "الدخان", "الجاثیہ", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاریات", "الطور", "النجم", "القمر", "الرحمٰن", "الواقعہ", "الحدید", "المجادلہ", "الحشر", "الممتحنہ", "الصف", "الجمعہ", "المنافقون", "التغابن", "الطلاق", "التحریم", "الملک", "القلم", "الحاقہ", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القیامہ", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التکویر", "الإنفطار", "المطففین", "الإنشقاق", "البروج", "الطارق", "الأعلیٰ", "الغاشیہ", "الفجر", "البلد", "الشمس", "اللیل", "الضحیٰ", "الشرح", "التین", "العلق", "القدر", "البینہ", "الزلزلہ", "العادیات", "القارعہ", "التکاثر", "العصر", "الہمزہ", "الفیل", "قریش", "الماعون", "الکوثر", "الکافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"
    ];

    function generateQuranMenu() {
        if (mainMenuContainer.hasChildNodes()) return; // اگر پہلے سے بھرا ہے تو دوبارہ نہ بھریں
        for (let i = 1; i <= 114; i++) {
            const menuBox = document.createElement('div');
            menuBox.className = `menu-box menu-box-${(i % 8) + 1}`;
            // *** یہاں تبدیلی کی گئی ہے ***
            menuBox.onclick = () => window.showSurahPage(`surah${i}Page`);
            menuBox.innerHTML = `<div class="menu-title">سورة ${surahNames[i-1]}</div>`;
            mainMenuContainer.appendChild(menuBox);

            const surahPage = document.createElement('div');
            surahPage.id = `surah${i}Page`;
            surahPage.className = 'surah-page';
            const audioSurahNumber = String(i).padStart(3, '0');
            surahPage.innerHTML = `
                <button class="back-button" onclick="window.showPage('quranPage')">⇦ تمام سورتیں</button>
                <header class="header">
                    ${i !== 1 && i !== 9 ? '<h1>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>' : ''}
                    <h1>سورة ${surahNames[i-1]}</h1>
                </header>
                <div class="audio-player-wrapper">
                    <div class="custom-audio-player" data-audio-src="https://download.quranicaudio.com/quran/abdul_basit_murattal/${audioSurahNumber}.mp3">
                        <p style="text-align:center; padding: 10px 0;">آڈیو پلیئر لوڈ ہو رہا ہے...</p>
                    </div>
                </div>
                <main class="surah-container">
                    <p style="font-size: 1.5rem; text-align: center;">لوڈ ہو رہا ہے...</p>
                </main>`;
            surahPagesContainer.appendChild(surahPage);
        }
    }

    // *** یہاں تبدیلی کی گئی ہے ***
    window.showSurahPage = (pageId) => {
        pages.forEach(p => p.classList.remove('active'));
        const allSurahPages = document.querySelectorAll('.surah-page');
        allSurahPages.forEach(p => p.style.display = 'none');
        
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
            const surahNumber = pageId.replace('surah', '').replace('Page', '');
            if (!targetPage.dataset.loaded) {
                loadSurahData(surahNumber, targetPage);
                targetPage.dataset.loaded = 'true';
            }
            const audioPlayerElement = targetPage.querySelector('.custom-audio-player');
            if (audioPlayerElement && !audioPlayerElement.dataset.initialized) {
                initializeSingleAudioPlayer(audioPlayerElement);
            }
        }
    };

    async function loadSurahData(surahNumber, pageElement) {
        const container = pageElement.querySelector('.surah-container');
        const cacheKey = `surah_${surahNumber}`;
        try {
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                renderSurah(JSON.parse(cachedData), container);
                return;
            }
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            const ayahs = data.data.ayahs;
            localStorage.setItem(cacheKey, JSON.stringify(ayahs));
            renderSurah(ayahs, container);
        } catch (error) {
            container.innerHTML = `<p style="text-align: center; color: #e74c3c;">سورة لوڈ کرنے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں.</p>`;
        }
    }

    function renderSurah(ayahs, container) {
        let surahHTML = '';
        ayahs.forEach(ayah => {
            surahHTML += `
                <div class="ayah-box">
                    <p class="ayah-text">
                        ${ayah.text}
                        <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span>
                    </p>
                </div>`;
        });
        container.innerHTML = surahHTML;
        setupIntersectionObserver();
    }
    
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.ayah-box:not(.visible)').forEach(box => {
            observer.observe(box);
        });
    }

    function initializeSingleAudioPlayer(player) {
        const audioSrc = player.dataset.audioSrc;
        if (!audioSrc) return;
        player.dataset.initialized = 'true';
        player.innerHTML = `
            <button class="play-pause-btn">
                <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                <svg class="pause-icon" viewBox="0 0 24 24" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
            </button>
            <div class="progress-container"><div class="progress-bar"></div></div>
            <div class="time-display">00:00 / 00:00</div>`;

        const audio = new Audio(audioSrc);
        audio.preload = 'metadata';
        const playPauseBtn = player.querySelector('.play-pause-btn');
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        const progressContainer = player.querySelector('.progress-container');
        const progressBar = player.querySelector('.progress-bar');
        const timeDisplay = player.querySelector('.time-display');

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) audio.play(); else audio.pause();
        });
        audio.addEventListener('play', () => { playIcon.style.display = 'none'; pauseIcon.style.display = 'block'; });
        audio.addEventListener('pause', () => { playIcon.style.display = 'block'; pauseIcon.style.display = 'none'; });
        
        const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
        audio.addEventListener('loadedmetadata', () => { timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`; });
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        });
        progressContainer.addEventListener('click', (e) => {
            if (audio.duration) audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
        });
        player.closest('.surah-page').appendChild(audio);
        audio.style.display = 'none';
    }

    // --- Initial Load ---
    window.showPage('homePage');
});
