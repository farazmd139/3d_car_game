document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');

    // Quran Page Elements
    const mainMenuContainer = document.getElementById('main-menu');
    const surahPagesContainer = document.getElementById('surah-pages-container');

    // AI Page Elements (نئے عناصر)
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('userInput');
    const sendChatButton = document.querySelector('.input-area button');

    // --- Global Variables ---
    const GEMINI_API_KEY = 'AIzaSyBzReLO6a1AYx2B471lNLHqU-Rd_C_umdQ'; // آپ کی API کلید
    const surahNames = ["الفاتحہ", "البقرہ", "آل عمران", "النساء", "المائدہ", "الأنعام", "الأعراف", "الأنفال", "التوبہ", "یونس", "ہود", "یوسف", "الرعد", "ابراہیم", "الحجر", "النحل", "الإسراء", "الکہف", "مریم", "طہ", "الأنبیاء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنکبوت", "الروم", "لقمان", "السجدہ", "الأحزاب", "سبا", "فاطر", "یٰسٓ", "الصافات", "ص", "الزمر", "غافر", "فصلت", "الشوریٰ", "الزخرف", "الدخان", "الجاثیہ", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق", "الذاریات", "الطور", "النجم", "القمر", "الرحمٰن", "الواقعہ", "الحدید", "المجادلہ", "الحشر", "الممتحنہ", "الصف", "الجمعہ", "المنافقون", "التغابن", "الطلاق", "التحریم", "الملک", "القلم", "الحاقہ", "المعارج", "نوح", "الجن", "المزمل", "المدثر", "القیامہ", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس", "التکویر", "الإنفطار", "المطففین", "الإنشقاق", "البروج", "الطارق", "الأعلیٰ", "الغاشیہ", "الفجر", "البلد", "الشمس", "اللیل", "الضحیٰ", "الشرح", "التین", "العلق", "القدر", "البینہ", "الزلزلہ", "العادیات", "القارعہ", "التکاثر", "العصر", "الہمزہ", "الفیل", "قریش", "الماعون", "الکوثر", "الکافرون", "النصر", "المسد", "الإخلاص", "الفلق", "الناس"];

    // --- Navigation & Page Switching Logic ---
    window.showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        const activePage = document.getElementById(pageId);
        const activeButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);

        if (activePage) activePage.classList.add('active');
        if (activeButton) activeButton.classList.add('active');

        // Stop any ongoing audio when changing pages
        document.querySelectorAll('#surah-pages-container audio').forEach(audio => audio.pause());
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            if (pageId) showPage(pageId);
        });
    });

    // --- Quran Functionality (آپ کا موجودہ کوڈ) ---
    function generateQuranContent() {
        if (!mainMenuContainer) return;
        for (let i = 1; i <= 114; i++) {
            const menuBox = document.createElement('div');
            menuBox.className = `menu-box menu-box-${(i % 8) + 1}`;
            menuBox.onclick = () => showSurahPage(`surah${i}Page`);
            menuBox.innerHTML = `<div class="menu-title">سورة ${surahNames[i-1]}</div>`;
            mainMenuContainer.appendChild(menuBox);

            const surahPage = document.createElement('div');
            surahPage.id = `surah${i}Page`;
            surahPage.className = 'surah-page';
            const audioSurahNumber = String(i).padStart(3, '0');
            surahPage.innerHTML = `
                <button class="back-button" onclick="showPage('quranPage')">⇦ تمام سورتیں</button>
                <header class="header">
                    ${i !== 1 && i !== 9 ? '<h1>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>' : ''}
                    <h1>سورة ${surahNames[i-1]}</h1>
                </header>
                <div class="audio-player-wrapper">
                    <div class="custom-audio-player" data-audio-src="https://server7.mp3quran.net/basit/murattal/${audioSurahNumber}.mp3">
                        <p style="text-align:center; padding: 10px 0;">آڈیو پلیئر لوڈ ہو رہا ہے...</p>
                    </div>
                </div>
                <main class="surah-container"><p style="font-size: 1.5rem; text-align: center;">آیات لوڈ ہو رہی ہیں...</p></main>`;
            surahPagesContainer.appendChild(surahPage);
        }
    }

    window.showSurahPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
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
        try {
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            renderSurah(data.data.ayahs, container);
        } catch (error) {
            container.innerHTML = `<p style="text-align: center; color: #e74c3c;">سورة لوڈ کرنے میں ناکامی ہوئی۔</p>`;
        }
    }

    function renderSurah(ayahs, container) {
        container.innerHTML = ayahs.map(ayah => `
            <div class="ayah-box"><p class="ayah-text">${ayah.text}<span class="ayah-number">﴿${ayah.numberInSurah}﴾</span></p></div>`).join('');
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
        document.querySelectorAll('.ayah-box:not(.visible)').forEach(box => observer.observe(box));
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
        const playPauseBtn = player.querySelector('.play-pause-btn');
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        const progressBar = player.querySelector('.progress-bar');
        const timeDisplay = player.querySelector('.time-display');

        playPauseBtn.addEventListener('click', () => audio.paused ? audio.play() : audio.pause());
        audio.addEventListener('play', () => {
            document.querySelectorAll('#surah-pages-container audio').forEach(a => { if (a !== audio) a.pause(); });
            playIcon.style.display = 'none'; pauseIcon.style.display = 'block';
        });
        audio.addEventListener('pause', () => { playIcon.style.display = 'block'; pauseIcon.style.display = 'none'; });
        
        const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
        audio.addEventListener('loadedmetadata', () => { timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`; });
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
                timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
            }
        });
        player.querySelector('.progress-container').addEventListener('click', (e) => {
            if (audio.duration) audio.currentTime = (e.offsetX / player.querySelector('.progress-container').clientWidth) * audio.duration;
        });
        player.closest('.surah-page').appendChild(audio).style.display = 'none';
    }

    // =================================================
    // 3. نیا AI چیٹ سیکشن کی فعالیت
    // =================================================
    const quranQuotes = [
        `"بے شک، ہر مشکل کے ساتھ آسانی ہے۔" (القرآن 94:6)`,
        `"اور جو اللہ سے ڈرتا ہے، وہ اس کے لیے نکلنے کا راستہ بنا دیتا ہے۔" (القرآن 65:2)`,
        `"اور صبر اور نماز سے مدد طلب کرو۔" (القرآن 2:45)`,
        `"خبردار! اللہ کے ذکر سے ہی دلوں کو سکون ملتا ہے۔" (القرآن 13:28)`
    ];

    function addChatMessage(content, isUser, includeQuote = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        const aiIcon = '<span>&#x262A;</span>'; 
        const userIcon = '👤';
        const avatarContent = isUser ? userIcon : aiIcon;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        if (!isUser && includeQuote && Math.random() > 0.6) {
            const quote = document.createElement('div');
            quote.className = 'quran-quote';
            quote.textContent = quranQuotes[Math.floor(Math.random() * quranQuotes.length)];
            messageContent.appendChild(quote);
        }

        const avatarDiv = document.createElement('div');
        avatarDiv.className = `message-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`;
        avatarDiv.innerHTML = avatarContent;

        if (isUser) {
            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(avatarDiv);
        } else {
            messageDiv.appendChild(avatarDiv);
            messageDiv.appendChild(messageContent);
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addInitialMessage() {
        const initialMessage = `<strong>السلام علیکم!</strong> میں آپ کا اسلامی AI ساتھی ہوں۔ قرآن و حدیث کی روشنی میں، میں آپ کی روحانی سفر میں مدد کے لیے حاضر ہوں۔<br><br>آپ ایمان، نماز، دعا، یا اسلام کے کسی بھی پہلو کے بارے میں کسی بھی زبان میں پوچھ سکتے ہیں۔`;
        addChatMessage(initialMessage, false, true);
    }

    window.sendChatMessage = async () => {
        const input = userInput.value.trim();
        if (!input) return;

        addChatMessage(input, true);
        userInput.value = '';
        addLoadingIndicator();

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `You are an Islamic AI Companion. Respond to the following query in the same language as the input, ensuring the response is respectful and accurate. Query: ${input}` }] }]
                })
            });

            const data = await response.json();
            removeLoadingIndicator();
            if (data.candidates && data.candidates[0].content) {
                addChatMessage(data.candidates[0].content.parts[0].text, false, true);
            } else {
                addChatMessage("معافی چاہتا ہوں، میں آپ کی درخواست پر عمل نہیں کر سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔ جزاک اللہ خیراً۔", false);
            }
        } catch (error) {
            removeLoadingIndicator();
            addChatMessage("ایک خرابی پیش آ گئی ہے۔ براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں یا بعد میں دوبارہ کوشش کریں۔", false);
        }
    }

    function addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        loadingDiv.innerHTML = `<div class="message-avatar ai-avatar"><span>&#x262A;</span></div><div class="message-content"><div class="loading-indicator"><span></span><span></span><span></span></div></div>`;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeLoadingIndicator() {
        const loading = chatMessages.querySelector('.loading');
        if (loading) loading.remove();
    }

    window.handleKeyPress = (event) => {
        if (event.key === 'Enter') sendChatMessage();
    };

    // --- Initial Load ---
    showPage('homePage');
    generateQuranContent();
    addInitialMessage();
});
