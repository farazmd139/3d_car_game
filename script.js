document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const storiesContainer = document.getElementById('stories-container');
    const duaCategoriesContainer = document.getElementById('dua-categories');
    const contentDisplayArea = document.getElementById('content-display-area');
    const sawalJawabContainer = document.getElementById('sawal-jawab-container');
    const surahList = document.getElementById('surah-list');
    const surahHeader = document.getElementById('surahHeader');
    const surahContainer = document.getElementById('surahContainer');
    const mainAudioPlayer = document.getElementById('mainAudioPlayer');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');

    // --- Data (Simplified for this version) ---
    const storyData = {
        title_arabic: "حضرت ابو بکر صدیقؓ",
        title_english: "Hazrat Abu Bakr (RA)",
        story: "حضرت ابو بکر صدیق رضی اللہ عنہ، رسول اللہ صلی اللہ علیہ وسلم کے سب سے قریبی اور وفادار ساتھی تھے۔ آپ مردوں میں سب سے پہلے اسلام قبول کرنے والے تھے اور آپ کو 'صدیق' کا لقب ملا کیونکہ آپ نے معراج کے واقعہ کی بغیر کسی ہچکچاہٹ کے تصدیق کی تھی۔ ہجرت کے موقع پر آپ غار ثور میں رسول اللہ ﷺ کے ساتھ تھے۔ رسول اللہ ﷺ کے وصال کے بعد، آپ کو پہلا خلیفہ منتخب کیا گیا۔ آپ نے جھوٹے نبیوں کے خلاف جنگیں لڑیں اور اسلامی ریاست کو مستحکم کیا۔ آپ نے ہی قرآن مجید کو ایک کتابی شکل میں جمع کرنے کا کام شروع کروایا۔"
    };

    const duaData = { category: "دعائیں", arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", translation: "اے ہمارے رب! ہمیں دنیا میں بھلائی عطا فرما اور آخرت میں بھلائی عطا فرما اور ہمیں آگ کے عذاب سے بچا۔", reference: "البقرہ: 201" };
    const kalmaData = { category: "کلمے", arabic: "لَا إِلٰهَ إِلَّا اللهُ مُحَمَّدٌ رَسُولُ اللهِ", translation: "اللہ کے سوا کوئی عبادت کے لائق نہیں، محمد (ﷺ) اللہ کے رسول ہیں۔", reference: "پہلا کلمہ طیب" };
    const hadeesData = { category: "احادیث", arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", translation: "اعمال کا دارومدار نیتوں پر ہے۔", reference: "صحیح بخاری: 1" };
    const namesData = { name: "الرحمن", transliteration: "Ar-Rahman", ur_meaning: "بہت مہربان" };
    const sawalJawabData = { question: "اسلام کے بنیادی ارکان کیا ہیں؟", answer: "اسلام کے پانچ بنیادی ارکان ہیں: کلمہ شہادت، نماز، زکوٰۃ، روزہ، اور حج۔", reference: "صحیح بخاری" };

    const duaPageContent = [duaData, kalmaData, hadeesData];

    // --- Navigation Logic ---
    window.showPage = (pageId) => {
        pages.forEach(page => page.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));
        const activePage = document.getElementById(pageId);
        const activeButton = document.querySelector(`.nav-button[data-page="${pageId}"]`);
        if (activePage) activePage.classList.add('active');
        if (activeButton) activeButton.classList.add('active');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.dataset.page;
            if (pageId) showPage(pageId);
        });
    });

    // --- Home Page Logic ---
    function displayStory() {
        storiesContainer.innerHTML = `
            <div class="card" onclick="openModal('story-modal')">
                <h2 class="card-title">${storyData.title_arabic}</h2>
                <p class="card-translation">${storyData.title_english}</p>
            </div>
        `;
    }

    // --- Dua Page Logic ---
    function setupDuaPage() {
        const categories = ["سوال جواب", ...new Set(duaPageContent.map(item => item.category))];
        duaCategoriesContainer.innerHTML = '';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category;
            button.onclick = () => {
                document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (category === "سوال جواب") {
                    showPage('sawalJawabPage');
                } else {
                    displayDuaContent(category);
                }
            };
            duaCategoriesContainer.appendChild(button);
        });
        // Initially display the first category
        if (duaCategoriesContainer.firstChild) {
            duaCategoriesContainer.firstChild.click();
        }
    }

    function displayDuaContent(category) {
        const item = duaPageContent.find(i => i.category === category);
        contentDisplayArea.innerHTML = `
            <div class="card">
                <h2 class="card-title">${item.category}</h2>
                <p class="card-arabic">${item.arabic}</p>
                <p class="card-translation">${item.translation}</p>
                <p class="card-reference">${item.reference}</p>
            </div>
        `;
    }
    
    // --- Sawal Jawab Page Logic ---
    function displaySawalJawabPage() {
        sawalJawabContainer.innerHTML = `
            <div class="card">
                <h2 class="card-title">${sawalJawabData.question}</h2>
                <p class="card-arabic">${sawalJawabData.answer}</p>
                <p class="card-reference">${sawalJawabData.reference}</p>
            </div>
        `;
    }

    // --- Quran Page Logic (from your original code) ---
    async function fetchSurahList() {
        try {
            const response = await fetch('https://api.alquran.cloud/v1/surah');
            const data = await response.json();
            surahList.innerHTML = '';
            data.data.forEach(surah => {
                const listItem = document.createElement('li');
                listItem.className = 'surah-list-item';
                listItem.innerHTML = `
                    <div class="surah-info">
                        <span class="surah-number">${surah.number}</span>
                        <div class="surah-name-details">
                            <h3>${surah.englishName}</h3>
                            <p>${surah.englishNameTranslation} - ${surah.numberOfAyahs} Ayahs</p>
                        </div>
                    </div>
                    <span class="surah-arabic-name">${surah.name}</span>`;
                listItem.onclick = () => loadSurah(surah.number);
                surahList.appendChild(listItem);
            });
        } catch (error) {
            surahList.innerHTML = '<p>Error loading Surahs.</p>';
        }
    }

    async function loadSurah(surahNumber) {
        showPage('surahDetailPage');
        surahHeader.innerHTML = '<h1>لوڈ ہو رہا ہے...</h1>';
        surahContainer.innerHTML = '';
        try {
            const [versesRes, audioRes] = await Promise.all([
                fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
                fetch(`https://api.quran.com/api/v4/chapter_recitations/7/${surahNumber}`)
            ]);
            const versesData = await versesRes.json();
            const audioData = await audioRes.json();
            
            surahHeader.innerHTML = `<h1>${versesData.data.name}</h1>`;
            mainAudioPlayer.src = audioData.audio_file.audio_url;
            mainAudioPlayer.play().catch(e => console.log("Autoplay prevented."));

            versesData.data.ayahs.forEach(ayah => {
                const box = document.createElement('div');
                box.className = 'ayah-box';
                box.innerHTML = `<p class="ayah-text">${ayah.text}<span class="ayah-number">﴿${ayah.numberInSurah}﴾</span></p>`;
                surahContainer.appendChild(box);
            });
        } catch (error) {
            surahHeader.innerHTML = '<h1>Error loading Surah.</h1>';
        }
    }

    // --- AI Chat Logic (Simplified) ---
    sendChatButton.addEventListener('click', () => {
        const userMessage = chatInput.value.trim();
        if (userMessage) {
            addMessageToChat(userMessage, 'user');
            chatInput.value = '';
            // Placeholder for AI response
            setTimeout(() => {
                addMessageToChat("معافی چاہتا ہوں، میں ابھی آپ کے سوال کا جواب نہیں دے سکتا۔", 'ai');
            }, 1000);
        }
    });

    function addMessageToChat(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // --- Modal Logic ---
    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = ''; // Clear previous content

        if (modalId === 'story-modal') {
            modalContent.innerHTML = `
                <span class="close-button" onclick="closeModal('story-modal')">&times;</span>
                <h2>${storyData.title_arabic}</h2>
                <div class="modal-body"><p>${storyData.story.replace(/\n/g, '<br>')}</p></div>
            `;
        } else if (modalId === 'names-modal') {
            modalContent.innerHTML = `
                <span class="close-button" onclick="closeModal('names-modal')">&times;</span>
                <h2>اللہ کے نام</h2>
                <div class="modal-body">
                    <div class="card">
                        <h3 class="card-title">${namesData.name}</h3>
                        <p class="card-translation">${namesData.transliteration} - ${namesData.ur_meaning}</p>
                    </div>
                </div>
            `;
        }
        modal.style.display = 'flex';
    };

    window.closeModal = (modalId) => {
        document.getElementById(modalId).style.display = 'none';
    };

    // --- Initial App Load ---
    function initialize() {
        showPage('homePage');
        displayStory();
        setupDuaPage();
        displaySawalJawabPage();
        fetchSurahList();
    }

    initialize();
});
