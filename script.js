document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // AI CHAT INTEGRATION VARIABLES & API SETUP
    // ===========================================
    
    // ** YOUR GEMINI API KEY **
    const GEMINI_API_KEY = 'AIzaSyBzReLO6a1AYx2B471lNLHqU-Rd_C_umdQ'; 
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // AI Chat DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');
    const aiPage = document.getElementById('aiPage');

    // Quranic Quotes for AI responses (Halal Touch)
    const quranQuotes = [
        `"فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا" (بے شک تنگی کے ساتھ آسانی ہے۔) - القرآن 94:6`,
        `"وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًۭا" (اور جو کوئی اللہ سے ڈرتا ہے وہ اس کے لیے نکلنے کا راستہ بنا دیتا ہے۔) - القرآن 65:2`,
        `"وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ" (اور صبر اور نماز سے مدد طلب کرو۔) - القرآن 2:45`,
        `"أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ" (خبردار! اللہ کے ذکر سے ہی دلوں کو اطمینان حاصل ہوتا ہے۔) - القرآن 13:28`
    ];
    
    // ===========================================
    // ORIGINAL APP FUNCTIONS & VARIABLES
    // ===========================================
    
    // --- Global Variables ---
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    // ... [Add your original DOM element variables here] ...
    const surahList = document.getElementById('surah-list');
    const surahHeader = document.getElementById('surahHeader');
    const surahContainer = document.getElementById('surahContainer');
    const mainAudioPlayer = document.getElementById('mainAudioPlayer');
    
    // Tasbih Elements
    const tasbihCounter = document.getElementById('tasbih-counter');
    const tasbihBead = document.getElementById('tasbih-bead');
    const resetButton = document.getElementById('reset-button');
    const tasbihSelect = document.getElementById('tasbih-select');
    const targetDisplay = document.getElementById('target-display');
    let tasbihCount = 0;
    let tasbihTarget = 100;
    
    // Dua Elements
    const duaCategoriesContainer = document.getElementById('dua-categories');
    const duaListContainer = document.getElementById('dua-list');
    
    // Names Elements
    const namesContainer = document.getElementById('names-container');
    
    // Sahaba Elements
    const sahabaStoriesContainer = document.getElementById('sahaba-stories-container');
    const storyDetailContainer = document.getElementById('story-detail-container');
    const storyTitle = document.getElementById('storyTitle');
    const storyContent = document.getElementById('storyContent');

    // Sawal Jawab Elements
    const sawalJawabContainer = document.getElementById('sawal-jawab-container');
    const sawalJawabSearchInput = document.getElementById('sawal-jawab-search-input');
    
    // --- Data (Example) ---
    // Note: You will need to define your actual data arrays (surahsData, kalmasData, duaData, namesData, sahabaData, sawalJawabData) here or load them from a separate file.
    // For now, I'll use placeholders.
    const surahsData = [
        { id: 1, arabic: "الفاتحة", urdu: "فاتحہ", verses: 7, audioUrl: "audio/fatiha.mp3" },
        // ... more surahs
    ];
    
    const kalmasData = [
        { title: "کلمہ طیب", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ", urdu: "اللہ کے سوا کوئی عبادت کے لائق نہیں، محمد اللہ کے رسول ہیں۔" },
        // ... more kalmas
    ];
    
    const duaData = {
        'SubahSham': { name: 'صبح و شام کی دعائیں', duas: [ { arabic: '...', urdu: '...' }, ] },
        // ... more dua categories
    };
    
    const namesData = [
        { name: "ٱللَّهُ", transliteration: "Allah", ur_meaning: "اللہ" },
        // ... more names
    ];
    
    const sahabaData = [
        { id: 1, title: "حضرت ابوبکر صدیق", content: "پہلے خلیفہ اور رسول اللہ ﷺ کے ساتھی۔" },
        // ... more sahaba
    ];

    const sawalJawabData = [
        { question: "وضو کا طریقہ کیا ہے؟", answer: "وضو میں چار فرض ہیں: چہرہ دھونا، کہنیوں سمیت ہاتھ دھونا، سر کا مسح کرنا، اور ٹخنوں سمیت پاؤں دھونا۔" },
        // ... more sawal jawab
    ];

    // --- Core Navigation Function ---
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            
            navButtons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-page') === pageId) {
                    button.classList.add('active');
                }
            });
            window.scrollTo(0, 0); // Scroll to top when page changes
        }
    }

    // --- Event Listeners for Navigation ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            showPage(pageId);
            
            // Initial AI message load when navigating to AI page
            if (pageId === 'aiPage' && chatMessages.children.length <= 1) {
                addInitialAIMessage();
            }
        });
    });
    
    // ... [Add your original specific functions like fetchSurahList, openSurah, playAudio, etc. here] ...
    
    // --- Quran Functions (Example structure) ---
    function fetchSurahList() {
        surahList.innerHTML = '';
        surahsData.forEach(surah => {
            const item = document.createElement('div');
            item.className = 'list-item surah-item';
            item.innerHTML = `<h3>${surah.arabic} - ${surah.urdu}</h3><p>${surah.verses} آیات</p>`;
            item.addEventListener('click', () => openSurah(surah.id));
            surahList.appendChild(item);
        });
    }

    function openSurah(surahId) {
        const surah = surahsData.find(s => s.id === surahId);
        if (surah) {
            document.getElementById('surahHeader').textContent = surah.urdu;
            document.getElementById('surahText').innerHTML = 'قرآن کی آیات یہاں لوڈ ہوں گی۔'; // Actual loading logic needed
            mainAudioPlayer.src = surah.audioUrl;
            surahList.style.display = 'none';
            surahContainer.style.display = 'block';
        }
    }
    
    // --- Tasbih Functions ---
    function updateTarget() {
        tasbihTarget = parseInt(tasbihSelect.value);
        targetDisplay.textContent = tasbihTarget;
        tasbihCount = 0;
        tasbihCounter.textContent = tasbihCount;
        tasbihBead.classList.remove('complete');
    }
    
    function countTasbih() {
        if (tasbihCount < tasbihTarget) {
            tasbihCount++;
            tasbihCounter.textContent = tasbihCount;
            if (tasbihCount === tasbihTarget) {
                tasbihBead.classList.add('complete');
                alert("ماشاءاللہ! آپ کا ہدف پورا ہوا!");
            }
        } else {
            // Optional: loop back or prompt to reset
            alert("ہدف پورا ہو چکا ہے۔ ری سیٹ کریں؟");
        }
    }

    // --- Event Listeners for Tasbih ---
    tasbihSelect.addEventListener('change', updateTarget);
    tasbihBead.addEventListener('click', countTasbih);
    resetButton.addEventListener('click', updateTarget);
    
    // ... [Add your original Kalme, Dua, Names, Sahaba, Sawal Jawab functions here] ...
    
    // --- Kalme Functions ---
    function loadKalmeContent() {
        const kalmeList = document.getElementById('kalma-list');
        kalmeList.innerHTML = '';
        kalmasData.forEach((kalma, index) => {
            const item = document.createElement('div');
            item.className = 'list-item dua-item';
            item.innerHTML = `<h3>${index + 1}. ${kalma.title}</h3><p style="font-size:1.5rem;">${kalma.arabic}</p><p>${kalma.urdu}</p>`;
            kalmeList.appendChild(item);
        });
    }

    // --- Names Functions ---
    function displayNames(names) {
        namesContainer.innerHTML = '';
        names.forEach(name => {
            const nameCard = document.createElement('div');
            nameCard.className = 'name-card';
            nameCard.innerHTML = `<p class="name-arabic">${name.name}</p><p class="name-translation">${name.transliteration} - ${name.ur_meaning}</p>`;
            namesContainer.appendChild(nameCard);
        });
    }
    
    // --- Sahaba Functions ---
    function displaySahabaStories() {
        sahabaStoriesContainer.innerHTML = '';
        sahabaData.forEach(story => {
            const item = document.createElement('div');
            item.className = 'list-item sahaba-item';
            item.innerHTML = `<h3>${story.title}</h3><p>مزید پڑھیں</p>`;
            item.addEventListener('click', () => openStory(story));
            sahabaStoriesContainer.appendChild(item);
        });
    }
    
    function openStory(story) {
        storyTitle.textContent = story.title;
        storyContent.textContent = story.content;
        sahabaStoriesContainer.style.display = 'none';
        storyDetailContainer.style.display = 'block';
    }

    // --- Sawal Jawab Functions ---
    function loadSawalJawab(searchTerm = '') {
        sawalJawabContainer.innerHTML = '';
        const filteredData = sawalJawabData.filter(item => 
            item.question.includes(searchTerm) || item.answer.includes(searchTerm)
        );
        
        filteredData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'list-item sawal-jawab-item';
            div.innerHTML = `<h3>سوال: ${item.question}</h3><p>جواب: ${item.answer}</p>`;
            sawalJawabContainer.appendChild(div);
        });
    }
    
    sawalJawabSearchInput.addEventListener('input', (e) => {
        loadSawalJawab(e.target.value);
    });

    // ===========================================
    // NEW AI CHAT INTEGRATION FUNCTIONS
    // ===========================================

    // Function to add a message to the chat interface
    function addChatMessage(content, isUser, includeQuote = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        // AI icon is Crescent Moon and Star (&#x262A;). User icon is a standard emoji (👤).
        const aiIcon = '🌙'; 
        const userIcon = '👤';
        const avatarContent = isUser ? userIcon : aiIcon;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        // Add a random Quranic quote to the AI response for a spiritual touch
        if (!isUser && includeQuote && Math.random() > 0.6) {
            const quoteText = quranQuotes[Math.floor(Math.random() * quranQuotes.length)];
            const quote = document.createElement('div');
            quote.className = 'quran-quote'; // You may need to add CSS for .quran-quote
            quote.innerHTML = `<br><em>${quoteText}</em>`;
            messageContent.appendChild(quote);
        }

        const avatarDiv = document.createElement('div');
        avatarDiv.className = `avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`;
        avatarDiv.innerHTML = `<span>${avatarContent}</span>`;
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Initial welcome message for the AI page
    function addInitialAIMessage() {
        const initialMessage = `<strong>السلام علیکم ورحمۃ اللہ!</strong> میں آپ کا اسلامی رھبر ہوں۔ میری کوشش ہو گی کہ آپ کو قرآن و حدیث کی روشنی میں صحیح رہنمائی دوں۔ آپ اپنے سوالات پوچھ سکتے ہیں۔`;
        addChatMessage(initialMessage, false, true);
    }

    // Function to handle sending a message to the Gemini API
    async function sendChatMessage() {
        const input = chatInput.value.trim();
        if (!input) return;

        addChatMessage(input, true);
        chatInput.value = '';
        addLoadingMessage();

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an Islamic AI Companion. Provide answers in URDU language only. Your name is 'Islamic Rehber'. Base your answers on authentic Islamic sources (Quran, Sunnah/Hadith). The response must be respectful and aligned with Islamic teachings. If the user asks a non-Islamic question, gently redirect them to Islamic topics. Query: ${input}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            removeLoadingMessage();
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addChatMessage(aiResponse, false, true);
            } else {
                addChatMessage("معذرت، میں آپ کے سوال کا جواب نہیں دے پایا۔ براہ کرم دوبارہ کوشش کریں یا سوال کو آسان بنائیں۔ جزاک اللہ خیراً۔", false);
            }
        } catch (error) {
            removeLoadingMessage();
            addChatMessage("ایک خرابی پیش آئی۔ براہ کرم اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں۔", false);
            console.error('Gemini API Error:', error);
        }
    }
    
    // Loading indicator logic
    function addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.className = 'message ai-message loading-message';
        loadingDiv.innerHTML = `<span class="avatar ai-avatar">🌙</span><div class="message-content loading-content">سوچ رہا ہوں... اللہ ہمیں صحیح رہنمائی دے۔</div>`;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeLoadingMessage() {
        const loading = document.getElementById('loading-indicator');
        if (loading) loading.remove();
    }

    // Event listeners for AI chat
    sendChatButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents new line in input
            sendChatMessage();
        }
    });

    // ===========================================
    // INITIALIZATION
    // ===========================================
    
    document.addEventListener('DOMContentLoaded', () => {
        showPage('homePage');
        
        // Load initial data for other pages
        fetchSurahList();
        updateTarget();
        loadKalmeContent();
        displayNames(namesData); // Assuming namesData is defined
        displaySahabaStories();
        loadSawalJawab(''); // Load initial sawal jawab
        
        // Initial AI message is added only when the AI page is opened for the first time
    });
});
