document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // AI CHAT INTEGRATION VARIABLES & API SETUP
    // ===========================================
    
    // ** YOUR GEMINI API KEY **
    const GEMINI_API_KEY = 'AIzaSyBzReLO6a1AYx2B471lNLHqU-Rd_C_umdQ'; 
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // AI Chat DOM Elements
    const aiChatModal = document.getElementById('aiChatModal');
    const closeChatModalButton = document.getElementById('closeChatModal');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendChatButton = document.getElementById('send-chat-button');

    // Quranic Quotes for AI responses (Halal Touch)
    const quranQuotes = [
        `"فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا" (بے شک تنگی کے ساتھ آسانی ہے۔) - القرآن 94:6`,
        `"وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًۭا" (اور جو کوئی اللہ سے ڈرتا ہے وہ اس کے لیے نکلنے کا راستہ بنا دیتا ہے۔) - القرآن 65:2`,
        `"وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ" (اور صبر اور نماز سے مدد طلب کرو۔) - القرآن 2:45`,
        `"أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ" (خبردار! اللہ کے ذکر سے ہی دلوں کو اطمینان حاصل ہوتا ہے۔) - القرآن 13:28`
    ];
    
    // ===========================================
    // ORIGINAL APP FUNCTIONS & VARIABLES (Retained)
    // ===========================================
    
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Tasbih Elements
    const tasbihCounter = document.getElementById('tasbih-counter');
    const tasbihBead = document.getElementById('tasbih-bead');
    const resetButton = document.getElementById('reset-button');
    const tasbihSelect = document.getElementById('tasbih-select');
    const targetDisplay = document.getElementById('target-display');
    let tasbihCount = 0;
    let tasbihTarget = 100;
    
    // Placeholder Data (You should define your actual data arrays here)
    const surahsData = [{ id: 1, arabic: "الفاتحة", urdu: "فاتحہ", verses: 7, audioUrl: "audio/fatiha.mp3" }];
    const kalmasData = [{ title: "کلمہ طیب", arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ", urdu: "اللہ کے سوا کوئی عبادت کے لائق نہیں، محمد اللہ کے رسول ہیں۔" }];
    const namesData = [{ name: "ٱللَّهُ", transliteration: "Allah", ur_meaning: "اللہ" }];
    const sahabaData = [{ id: 1, title: "حضرت ابوبکر صدیق", content: "پہلے خلیفہ اور رسول اللہ ﷺ کے ساتھی۔" }];
    const sawalJawabData = [{ question: "وضو کا طریقہ کیا ہے؟", answer: "وضو میں چار فرض ہیں: چہرہ دھونا، کہنیوں سمیت ہاتھ دھونا، سر کا مسح کرنا، اور ٹخنوں سمیت پاؤں دھونا۔" }];

    // --- Core Navigation Function ---
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.add('active');
            
            navButtons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-page') === pageId && pageId !== 'aiPage') { // AI page is a modal, so don't mark as active page
                    button.classList.add('active');
                }
            });
            window.scrollTo(0, 0); 
        }
        // Ensure modal is closed when navigating between pages
        hideChatModal(); 
    }

    // --- Original Functions (Simplified Examples) ---
    function fetchSurahList() { /* ... implementation ... */ }
    function openSurah(surahId) { /* ... implementation ... */ }
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
                // alert("ماشاءاللہ! آپ کا ہدف پورا ہوا!");
            }
        }
    }
    function loadKalmeContent() { /* ... implementation ... */ }
    function displayNames(names) { /* ... implementation ... */ }
    function displaySahabaStories() { /* ... implementation ... */ }
    function loadSawalJawab(searchTerm = '') { /* ... implementation ... */ }

    // --- Event Listeners for Navigation ---
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            
            if (pageId === 'aiPage') {
                toggleChatModal(); // Call modal toggle function
            } else {
                showPage(pageId);
            }
        });
    });
    
    // Other event listeners
    document.getElementById('tasbihBead')?.addEventListener('click', countTasbih);
    document.getElementById('reset-button')?.addEventListener('click', updateTarget);
    document.getElementById('backToSurahList')?.addEventListener('click', () => {
        document.getElementById('surahContainer').style.display = 'none';
        document.getElementById('surah-list').style.display = 'flex';
    });


    // ===========================================
    // AI CHAT MODAL FUNCTIONS (New)
    // ===========================================
    
    function showChatModal() {
        aiChatModal.style.display = 'flex';
        // Only load initial message if chat is empty
        if (chatMessages.children.length === 0) {
            addInitialAIMessage();
        }
        // Focus on input when modal opens
        setTimeout(() => chatInput.focus(), 300); 
    }

    function hideChatModal() {
        aiChatModal.style.display = 'none';
    }

    function toggleChatModal() {
        if (aiChatModal.style.display === 'flex') {
            hideChatModal();
        } else {
            showChatModal();
        }
    }

    // Modal closing events
    closeChatModalButton.addEventListener('click', hideChatModal);
    
    // Close modal if user clicks outside the chat box (on the overlay)
    aiChatModal.addEventListener('click', (e) => {
        if (e.target === aiChatModal) {
            hideChatModal();
        }
    });

    // Function to add a message to the chat interface
    function addChatMessage(content, isUser, includeQuote = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const aiIcon = '🌙'; 
        const userIcon = '👤';
        const avatarContent = isUser ? userIcon : aiIcon;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        // Add a random Quranic quote
        if (!isUser && includeQuote && Math.random() > 0.6) {
            const quoteText = quranQuotes[Math.floor(Math.random() * quranQuotes.length)];
            const quote = document.createElement('div');
            // The CSS for .quran-quote is in the style.css you received
            quote.className = 'quran-quote'; 
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

    // Event listeners for AI chat input
    sendChatButton.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            sendChatMessage();
        }
    });

    // ===========================================
    // INITIALIZATION
    // ===========================================
    
    // Initial page and data load
    showPage('homePage');
    // Calling placeholder functions for initial data load:
    if (document.getElementById('surah-list')) fetchSurahList();
    if (document.getElementById('tasbih-bead')) updateTarget();
    if (document.getElementById('kalma-list')) loadKalmeContent();
    if (document.getElementById('names-container')) displayNames(namesData); 
    if (document.getElementById('sahaba-stories-container')) displaySahabaStories();
    if (document.getElementById('sawal-jawab-container')) loadSawalJawab('');
});
