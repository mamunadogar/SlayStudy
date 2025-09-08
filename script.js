// Global Variables
let currentTheme = 'light';
let currentQuizData = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let currentFlashcardDeck = [];
let currentCardIndex = 0;
let isCardFlipped = false;
let timerInterval = null;
let currentTimerMode = 'focus';
let timeRemaining = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;

// Utility function to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupThemeToggle();
    setupMobileNavigation();
    setupPageSpecificFeatures();
    loadThemeFromStorage();
    setupAnimations();
}

// Theme Management
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
    }
    
    localStorage.setItem('slaystudy-theme', currentTheme);
}

function loadThemeFromStorage() {
    const savedTheme = localStorage.getItem('slaystudy-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        }
    }
}

// Mobile Navigation
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for anchor links
function setupAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Page-specific feature setup
function setupPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'notes.html':
            setupNotesFeatures();
            break;
        case 'quizzes.html':
            setupQuizFeatures();
            break;
        case 'flashcards.html':
            setupFlashcardFeatures();
            break;
        case 'pomodoro.html':
            setupPomodoroFeatures();
            break;
        case 'ai-chat.html':
            setupAIFeatures();
            break;
    }
}

// Notes Features
function setupNotesFeatures() {
    const generateBtn = document.getElementById('generateNotes');
    const topicInput = document.getElementById('noteTopic');
    const downloadBtn = document.getElementById('downloadNotes');
    
    if (generateBtn && topicInput) {
        generateBtn.addEventListener('click', generateNotes);
        topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateNotes();
            }
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadNotesAsPDF);
    }
}

function generateNotes() {
    const topic = document.getElementById('noteTopic').value.trim();
    
    if (!topic) {
        alert('Please enter a topic to generate notes!');
        return;
    }
    
    showLoading('loadingNotes');
    
    // Simulate AI processing delay
    setTimeout(() => {
        const notes = getNotesContent(topic);
        displayNotes(notes);
        hideLoading('loadingNotes');
    }, 2000);
}

function getNotesContent(topic) {
    const notesDatabase = {
        'photosynthesis': {
            title: 'Photosynthesis',
            content: `
                <h3>📚 Definition</h3>
                <p>Photosynthesis is the process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water.</p>
                
                <h3>🧪 Chemical Equation</h3>
                <p><strong>6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂</strong></p>
                
                <h3>🔬 Key Components</h3>
                <ul>
                    <li><strong>Chlorophyll:</strong> Green pigment that captures light energy</li>
                    <li><strong>Chloroplasts:</strong> Cell organelles where photosynthesis occurs</li>
                    <li><strong>Stomata:</strong> Pores that allow gas exchange</li>
                </ul>
                
                <h3>⚡ Two Main Stages</h3>
                <ol>
                    <li><strong>Light Reactions:</strong> Convert light energy to chemical energy (ATP and NADPH)</li>
                    <li><strong>Calvin Cycle:</strong> Use ATP and NADPH to fix carbon dioxide into glucose</li>
                </ol>
                
                <h3>🌱 Importance</h3>
                <p>Photosynthesis is crucial for life on Earth as it produces oxygen and forms the base of most food chains.</p>
            `
        },
        'world war 2': {
            title: 'World War II',
            content: `
                <h3>📅 Timeline (1939-1945)</h3>
                <p>World War II was a global conflict that involved most of the world's nations.</p>
                
                <h3>🌍 Major Theaters</h3>
                <ul>
                    <li><strong>European Theater:</strong> Germany vs. Allied forces</li>
                    <li><strong>Pacific Theater:</strong> Japan vs. Allied forces</li>
                    <li><strong>African Theater:</strong> North African campaign</li>
                </ul>
                
                <h3>⚔️ Key Events</h3>
                <ol>
                    <li><strong>1939:</strong> Germany invades Poland, war begins</li>
                    <li><strong>1941:</strong> Pearl Harbor attack, US enters war</li>
                    <li><strong>1942:</strong> Battle of Stalingrad begins</li>
                    <li><strong>1944:</strong> D-Day invasion of Normandy</li>
                    <li><strong>1945:</strong> Germany surrenders, atomic bombs dropped, Japan surrenders</li>
                </ol>
                
                <h3>🤝 Major Alliances</h3>
                <ul>
                    <li><strong>Axis Powers:</strong> Germany, Italy, Japan</li>
                    <li><strong>Allied Powers:</strong> UK, USSR, USA, France, China</li>
                </ul>
                
                <h3>💭 Consequences</h3>
                <p>The war resulted in significant political changes, the establishment of the UN, and the beginning of the Cold War.</p>
            `
        },
        'calculus': {
            title: 'Introduction to Calculus',
            content: `
                <h3>📊 What is Calculus?</h3>
                <p>Calculus is the mathematical study of continuous change, dealing with derivatives and integrals.</p>
                
                <h3>🧮 Two Main Branches</h3>
                <ul>
                    <li><strong>Differential Calculus:</strong> Studies rates of change (derivatives)</li>
                    <li><strong>Integral Calculus:</strong> Studies accumulation of quantities (integrals)</li>
                </ul>
                
                <h3>📈 Key Concepts</h3>
                <ol>
                    <li><strong>Limits:</strong> The foundation of calculus</li>
                    <li><strong>Derivatives:</strong> Rate of change at a point</li>
                    <li><strong>Integrals:</strong> Area under a curve</li>
                    <li><strong>Fundamental Theorem:</strong> Links derivatives and integrals</li>
                </ol>
                
                <h3>🔧 Applications</h3>
                <ul>
                    <li>Physics: Motion, force, energy</li>
                    <li>Engineering: Optimization problems</li>
                    <li>Economics: Marginal analysis</li>
                    <li>Biology: Population growth models</li>
                </ul>
                
                <h3>💡 Important Formulas</h3>
                <p><strong>Power Rule:</strong> d/dx(xⁿ) = nxⁿ⁻¹</p>
                <p><strong>Chain Rule:</strong> d/dx[f(g(x))] = f'(g(x)) · g'(x)</p>
            `
        }
    };
    
    const lowerTopic = topic.toLowerCase();
    const matchedTopic = Object.keys(notesDatabase).find(key => 
        lowerTopic.includes(key) || key.includes(lowerTopic)
    );
    
    if (matchedTopic) {
        return notesDatabase[matchedTopic];
    }
    
    // Generic notes for unmatched topics
    // Sanitize user input to prevent XSS
    const safeTopic = escapeHtml(topic);
    return {
        title: safeTopic,
        content: `
            <h3>📚 Study Notes for ${safeTopic}</h3>
            <p>Here are comprehensive study notes generated for your topic.</p>
            
            <h3>🎯 Key Points</h3>
            <ul>
                <li>Understand the fundamental concepts and definitions</li>
                <li>Learn the historical context and development</li>
                <li>Master the practical applications</li>
                <li>Practice problem-solving techniques</li>
            </ul>
            
            <h3>📖 Study Strategy</h3>
            <ol>
                <li>Read through the material carefully</li>
                <li>Take notes on important concepts</li>
                <li>Create flashcards for key terms</li>
                <li>Practice with examples and exercises</li>
                <li>Review regularly to reinforce learning</li>
            </ol>
            
            <h3>💡 Pro Tips</h3>
            <p>Use active recall techniques, spaced repetition, and teach concepts to others to improve retention.</p>
        `
    };
}

function displayNotes(notes) {
    const notesResult = document.getElementById('notesResult');
    const notesContent = document.getElementById('notesContent');
    
    if (notesResult && notesContent) {
        // Clear existing content
        notesContent.innerHTML = '';
        
        // Create title element
        const titleElement = document.createElement('h2');
        titleElement.textContent = notes.title;
        notesContent.appendChild(titleElement);
        
        // Create content container and safely insert HTML
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = notes.content; // Safe here as content comes from controlled database
        notesContent.appendChild(contentDiv);
        
        notesResult.classList.remove('hidden');
        notesResult.scrollIntoView({ behavior: 'smooth' });
    }
}

// AI Chat Features
function setupAIFeatures() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessage');
    const chatStatus = document.getElementById('chatStatus');
    
    if (chatStatus) {
        chatStatus.textContent = 'Online';
        chatStatus.className = 'chat-status online';
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    if (chatInput) {
        chatInput.focus();
    }
}


async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await getAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'ai');
    } catch (error) {
        hideTypingIndicator();
        addMessage('Sorry, I encountered an error. Please check your API key and try again. Error: ' + error.message, 'ai');
    }
}

async function getAIResponse(userMessage) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: userMessage
        })
    });
    
    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.error);
    }
    
    return data.response;
}

function addMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'ai' ? '🤖' : '👤';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${escapeHtml(content)}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'message ai-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// PDF Download functionality using jsPDF
function downloadNotesAsPDF() {
    const notesContent = document.getElementById('notesContent');
    if (!notesContent || notesContent.children.length === 0) {
        alert('Please generate notes first before downloading!');
        return;
    }
    
    // Create a clean version of content for PDF
    const title = notesContent.querySelector('h2')?.textContent || 'Study Notes';
    const content = notesContent.querySelector('div');
    
    if (!content) {
        alert('No content to download!');
        return;
    }
    
    // Simple text-based PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: 'Arial', sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                h2, h3 { color: #4f46e5; margin-top: 20px; }
                ul, ol { margin-left: 20px; }
                li { margin: 5px 0; }
                p { margin: 10px 0; }
                strong { color: #1f2937; }
                @media print {
                    body { margin: 20px; }
                    h1 { page-break-after: avoid; }
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            ${content.innerHTML}
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #e5e7eb;">
            <p style="text-align: center; color: #6b7280; font-size: 12px;">Generated by SlayStudy - Slay Your Studies in Style 💅📚</p>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Close the window after printing
        setTimeout(() => printWindow.close(), 100);
    }, 500);
}

// Quiz Features
function setupQuizFeatures() {
    const startBtn = document.getElementById('startQuiz');
    const subjectInput = document.getElementById('quizSubject');
    const nextBtn = document.getElementById('nextQuestion');
    const retakeBtn = document.getElementById('retakeQuiz');
    const newQuizBtn = document.getElementById('newQuiz');
    
    if (startBtn && subjectInput) {
        startBtn.addEventListener('click', startQuiz);
        subjectInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startQuiz();
            }
        });
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (retakeBtn) retakeBtn.addEventListener('click', retakeQuiz);
    if (newQuizBtn) newQuizBtn.addEventListener('click', newQuiz);
}

function startQuiz() {
    const subject = document.getElementById('quizSubject').value.trim();
    
    if (!subject) {
        alert('Please enter a subject for your quiz!');
        return;
    }
    
    showLoading('loadingQuiz');
    
    setTimeout(() => {
        currentQuizData = generateQuizData(subject);
        currentQuestionIndex = 0;
        quizScore = 0;
        hideLoading('loadingQuiz');
        showQuizContainer();
        displayQuestion();
    }, 2000);
}

function generateQuizData(subject) {
    const quizDatabase = {
        'biology': [
            {
                question: "What is the powerhouse of the cell?",
                options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
                correct: 1
            },
            {
                question: "Which molecule carries genetic information?",
                options: ["RNA", "DNA", "Protein", "Lipid"],
                correct: 1
            },
            {
                question: "What process do plants use to make food?",
                options: ["Respiration", "Photosynthesis", "Digestion", "Transpiration"],
                correct: 1
            },
            {
                question: "How many chambers does a human heart have?",
                options: ["2", "3", "4", "5"],
                correct: 2
            },
            {
                question: "What is the basic unit of life?",
                options: ["Atom", "Molecule", "Cell", "Tissue"],
                correct: 2
            }
        ],
        'history': [
            {
                question: "In which year did World War II end?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "Who was the first President of the United States?",
                options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
                correct: 2
            },
            {
                question: "Which empire was ruled by Julius Caesar?",
                options: ["Greek Empire", "Roman Empire", "Byzantine Empire", "Ottoman Empire"],
                correct: 1
            },
            {
                question: "When did the Berlin Wall fall?",
                options: ["1987", "1988", "1989", "1990"],
                correct: 2
            },
            {
                question: "Who painted the Sistine Chapel ceiling?",
                options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
                correct: 2
            }
        ],
        'mathematics': [
            {
                question: "What is the value of π (pi) to two decimal places?",
                options: ["3.14", "3.15", "3.16", "3.17"],
                correct: 0
            },
            {
                question: "What is the square root of 144?",
                options: ["11", "12", "13", "14"],
                correct: 1
            },
            {
                question: "In algebra, what does 'x' typically represent?",
                options: ["A constant", "A variable", "A coefficient", "An operation"],
                correct: 1
            },
            {
                question: "What is 15% of 200?",
                options: ["25", "30", "35", "40"],
                correct: 1
            },
            {
                question: "What type of angle measures exactly 90 degrees?",
                options: ["Acute", "Right", "Obtuse", "Straight"],
                correct: 1
            }
        ]
    };
    
    const lowerSubject = subject.toLowerCase();
    const matchedSubject = Object.keys(quizDatabase).find(key => 
        lowerSubject.includes(key) || key.includes(lowerSubject)
    );
    
    if (matchedSubject) {
        return quizDatabase[matchedSubject];
    }
    
    // Generic quiz for unmatched subjects
    return [
        {
            question: `What is a key concept in ${subject}?`,
            options: ["Fundamental principles", "Basic theories", "Core methodologies", "All of the above"],
            correct: 3
        },
        {
            question: `Which skill is most important when studying ${subject}?`,
            options: ["Memorization", "Critical thinking", "Pattern recognition", "All of the above"],
            correct: 3
        },
        {
            question: `How can you best improve in ${subject}?`,
            options: ["Regular practice", "Reading extensively", "Seeking help when needed", "All of the above"],
            correct: 3
        },
        {
            question: `What resource is most helpful for ${subject}?`,
            options: ["Textbooks", "Online tutorials", "Practice exercises", "All of the above"],
            correct: 3
        },
        {
            question: `What mindset helps most with ${subject}?`,
            options: ["Growth mindset", "Fixed mindset", "Perfectionist mindset", "Competitive mindset"],
            correct: 0
        }
    ];
}

function showQuizContainer() {
    document.getElementById('quizStart').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
}

function displayQuestion() {
    const question = currentQuizData[currentQuestionIndex];
    
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = currentQuizData.length;
    document.getElementById('currentScore').textContent = quizScore;
    
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'answer-option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('nextQuestion').disabled = true;
}

function selectAnswer(selectedIndex) {
    const options = document.querySelectorAll('.answer-option');
    const question = currentQuizData[currentQuestionIndex];
    
    // Remove previous selections
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Mark selected answer
    options[selectedIndex].classList.add('selected');
    
    // Show correct/incorrect
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Update score
    if (selectedIndex === question.correct) {
        quizScore++;
        document.getElementById('currentScore').textContent = quizScore;
    }
    
    // Enable next button
    document.getElementById('nextQuestion').disabled = false;
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuizData.length) {
        displayQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('quizResults').classList.remove('hidden');
    
    const finalScore = document.getElementById('finalScore');
    const scoreMessage = document.getElementById('scoreMessage');
    
    finalScore.textContent = quizScore;
    
    const percentage = (quizScore / currentQuizData.length) * 100;
    
    if (percentage >= 80) {
        scoreMessage.textContent = "Excellent work! 🌟";
    } else if (percentage >= 60) {
        scoreMessage.textContent = "Good job! Keep it up! 👍";
    } else if (percentage >= 40) {
        scoreMessage.textContent = "Not bad, but there's room for improvement! 📚";
    } else {
        scoreMessage.textContent = "Keep studying and try again! 💪";
    }
    
    document.getElementById('quizResults').scrollIntoView({ behavior: 'smooth' });
}

function retakeQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    displayQuestion();
}

function newQuiz() {
    document.getElementById('quizResults').classList.add('hidden');
    document.getElementById('quizStart').classList.remove('hidden');
    document.getElementById('quizSubject').value = '';
}

// Flashcards Features
function setupFlashcardFeatures() {
    const deckSelect = document.getElementById('deckSelect');
    const flashcard = document.getElementById('flashcard');
    const prevBtn = document.getElementById('prevCard');
    const nextBtn = document.getElementById('nextCard');
    const shuffleBtn = document.getElementById('shuffleDeck');
    
    if (deckSelect) {
        deckSelect.addEventListener('change', loadDeck);
        loadDeck(); // Load initial deck
    }
    
    if (flashcard) {
        flashcard.addEventListener('click', flipCard);
    }
    
    if (prevBtn) prevBtn.addEventListener('click', previousCard);
    if (nextBtn) nextBtn.addEventListener('click', nextCard);
    if (shuffleBtn) shuffleBtn.addEventListener('click', shuffleDeck);
}

function loadDeck() {
    const deckType = document.getElementById('deckSelect').value;
    currentFlashcardDeck = getFlashcardDeck(deckType);
    currentCardIndex = 0;
    isCardFlipped = false;
    
    updateFlashcardDisplay();
    updateDeckInfo(deckType);
}

function getFlashcardDeck(deckType) {
    const decks = {
        'science': [
            { question: "What is the chemical symbol for water?", answer: "H₂O" },
            { question: "What force keeps us on Earth?", answer: "Gravity" },
            { question: "What is the center of an atom called?", answer: "Nucleus" },
            { question: "What gas do plants absorb from the atmosphere?", answer: "Carbon dioxide (CO₂)" },
            { question: "What is the hardest natural substance?", answer: "Diamond" },
            { question: "What is the speed of light?", answer: "299,792,458 meters per second" },
            { question: "What planet is known as the Red Planet?", answer: "Mars" },
            { question: "What is the most abundant gas in Earth's atmosphere?", answer: "Nitrogen" },
            { question: "What type of bond holds water molecules together?", answer: "Hydrogen bonds" },
            { question: "What is the process of converting liquid to gas called?", answer: "Evaporation" }
        ],
        'history': [
            { question: "When did the American Civil War begin?", answer: "1861" },
            { question: "Who was the first person to walk on the moon?", answer: "Neil Armstrong" },
            { question: "In which year did the Titanic sink?", answer: "1912" },
            { question: "Who was the first woman to win a Nobel Prize?", answer: "Marie Curie" },
            { question: "What year did the Berlin Wall fall?", answer: "1989" },
            { question: "Who wrote the Declaration of Independence?", answer: "Thomas Jefferson" },
            { question: "Which war was fought between the North and South in America?", answer: "The Civil War" },
            { question: "Who was the first President of the United States?", answer: "George Washington" },
            { question: "In which year did World War I begin?", answer: "1914" },
            { question: "Who was known as the Iron Lady?", answer: "Margaret Thatcher" }
        ],
        'math': [
            { question: "What is 15 × 8?", answer: "120" },
            { question: "What is the value of π to 3 decimal places?", answer: "3.142" },
            { question: "What is the square root of 64?", answer: "8" },
            { question: "What is 25% of 80?", answer: "20" },
            { question: "What is the area of a circle with radius 5?", answer: "25π or approximately 78.54" },
            { question: "What is 7!?", answer: "5,040" },
            { question: "What is the sum of angles in a triangle?", answer: "180 degrees" },
            { question: "What is the derivative of x²?", answer: "2x" },
            { question: "What is the Pythagorean theorem?", answer: "a² + b² = c²" },
            { question: "What is the quadratic formula?", answer: "x = (-b ± √(b²-4ac)) / 2a" }
        ],
        'literature': [
            { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
            { question: "What is the first book in the Harry Potter series?", answer: "Harry Potter and the Philosopher's Stone" },
            { question: "Who wrote '1984'?", answer: "George Orwell" },
            { question: "What is the opening line of 'Pride and Prejudice'?", answer: "It is a truth universally acknowledged..." },
            { question: "Who wrote 'To Kill a Mockingbird'?", answer: "Harper Lee" },
            { question: "What is a haiku?", answer: "A Japanese poem with 3 lines (5-7-5 syllables)" },
            { question: "Who wrote 'The Great Gatsby'?", answer: "F. Scott Fitzgerald" },
            { question: "What is an allegory?", answer: "A story with hidden meaning or symbolism" },
            { question: "Who wrote 'Jane Eyre'?", answer: "Charlotte Brontë" },
            { question: "What is iambic pentameter?", answer: "A rhythmic pattern of 10 syllables per line" }
        ]
    };
    
    return decks[deckType] || decks['science'];
}

function updateFlashcardDisplay() {
    const card = currentFlashcardDeck[currentCardIndex];
    
    document.getElementById('cardQuestion').textContent = card.question;
    document.getElementById('cardAnswer').textContent = card.answer;
    document.getElementById('cardProgress').textContent = `${currentCardIndex + 1} / ${currentFlashcardDeck.length}`;
    
    // Reset card to front
    document.getElementById('flashcard').classList.remove('flipped');
    isCardFlipped = false;
    
    // Update stats
    updateStudyStats();
}

function updateDeckInfo(deckType) {
    const deckNames = {
        'science': 'Science Basics',
        'history': 'World History',
        'math': 'Mathematics',
        'literature': 'Literature'
    };
    
    document.getElementById('currentDeck').textContent = deckNames[deckType] || 'Science Basics';
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped');
    isCardFlipped = !isCardFlipped;
}

function previousCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateFlashcardDisplay();
    }
}

function nextCard() {
    if (currentCardIndex < currentFlashcardDeck.length - 1) {
        currentCardIndex++;
        updateFlashcardDisplay();
    }
}

function shuffleDeck() {
    // Fisher-Yates shuffle algorithm
    for (let i = currentFlashcardDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentFlashcardDeck[i], currentFlashcardDeck[j]] = [currentFlashcardDeck[j], currentFlashcardDeck[i]];
    }
    
    currentCardIndex = 0;
    updateFlashcardDisplay();
}

function updateStudyStats() {
    // Simple stat tracking
    let cardsStudied = parseInt(localStorage.getItem('slaystudy-cards-studied') || '0');
    cardsStudied++;
    localStorage.setItem('slaystudy-cards-studied', cardsStudied.toString());
    document.getElementById('cardsStudied').textContent = cardsStudied;
}

// Pomodoro Timer Features
function setupPomodoroFeatures() {
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    const modeButtons = document.querySelectorAll('.mode-btn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTimerMode(btn.dataset.mode));
    });
    
    updateTimerDisplay();
    loadPomodoroStats();
}

function switchTimerMode(mode) {
    if (isTimerRunning) {
        pauseTimer();
    }
    
    currentTimerMode = mode;
    
    // Update active button
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    
    // Set time based on mode
    const times = {
        'focus': 25 * 60,      // 25 minutes
        'short': 5 * 60,       // 5 minutes
        'long': 15 * 60        // 15 minutes
    };
    
    timeRemaining = times[mode];
    
    // Update display
    const modeNames = {
        'focus': 'Focus Time',
        'short': 'Short Break',
        'long': 'Long Break'
    };
    
    document.getElementById('timerMode').textContent = modeNames[mode];
    updateTimerDisplay();
    resetTimerProgress();
}

function startTimer() {
    isTimerRunning = true;
    document.getElementById('startTimer').classList.add('hidden');
    document.getElementById('pauseTimer').classList.remove('hidden');
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        updateTimerProgress();
        
        if (timeRemaining <= 0) {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('startTimer').classList.remove('hidden');
    document.getElementById('pauseTimer').classList.add('hidden');
}

function resetTimer() {
    pauseTimer();
    
    const times = {
        'focus': 25 * 60,
        'short': 5 * 60,
        'long': 15 * 60
    };
    
    timeRemaining = times[currentTimerMode];
    updateTimerDisplay();
    resetTimerProgress();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timeDisplay').textContent = display;
}

function updateTimerProgress() {
    const totalTime = {
        'focus': 25 * 60,
        'short': 5 * 60,
        'long': 15 * 60
    }[currentTimerMode];
    
    const progress = 1 - (timeRemaining / totalTime);
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference * (1 - progress);
    
    document.getElementById('timerProgress').style.strokeDashoffset = offset;
}

function resetTimerProgress() {
    const circumference = 2 * Math.PI * 90;
    document.getElementById('timerProgress').style.strokeDashoffset = circumference;
}

function timerComplete() {
    pauseTimer();
    
    // Update stats
    if (currentTimerMode === 'focus') {
        updatePomodoroStats();
    }
    
    // Show completion message
    alert(`${currentTimerMode === 'focus' ? 'Focus session' : 'Break'} complete! 🎉`);
    
    // Auto-switch to break or focus
    if (currentTimerMode === 'focus') {
        // Check if it's time for a long break (every 4 sessions)
        const sessions = parseInt(localStorage.getItem('slaystudy-sessions-today') || '0');
        if (sessions % 4 === 0 && sessions > 0) {
            switchTimerMode('long');
        } else {
            switchTimerMode('short');
        }
    } else {
        switchTimerMode('focus');
    }
}

function updatePomodoroStats() {
    // Sessions today
    let sessionsToday = parseInt(localStorage.getItem('slaystudy-sessions-today') || '0');
    sessionsToday++;
    localStorage.setItem('slaystudy-sessions-today', sessionsToday.toString());
    document.getElementById('sessionsToday').textContent = sessionsToday;
    
    // Total focus time
    let totalMinutes = parseInt(localStorage.getItem('slaystudy-total-focus') || '0');
    totalMinutes += 25;
    localStorage.setItem('slaystudy-total-focus', totalMinutes.toString());
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    document.getElementById('totalFocusTime').textContent = `${hours}h ${minutes}m`;
    
    // Current streak
    let currentStreak = parseInt(localStorage.getItem('slaystudy-current-streak') || '0');
    currentStreak++;
    localStorage.setItem('slaystudy-current-streak', currentStreak.toString());
    document.getElementById('currentStreak').textContent = currentStreak;
}

function loadPomodoroStats() {
    const sessionsToday = localStorage.getItem('slaystudy-sessions-today') || '0';
    const totalMinutes = parseInt(localStorage.getItem('slaystudy-total-focus') || '0');
    const currentStreak = localStorage.getItem('slaystudy-current-streak') || '0';
    
    document.getElementById('sessionsToday').textContent = sessionsToday;
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    document.getElementById('totalFocusTime').textContent = `${hours}h ${minutes}m`;
    
    document.getElementById('currentStreak').textContent = currentStreak;
    
    // Reset daily stats at midnight
    const lastReset = localStorage.getItem('slaystudy-last-reset');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
        localStorage.setItem('slaystudy-sessions-today', '0');
        localStorage.setItem('slaystudy-current-streak', '0');
        localStorage.setItem('slaystudy-last-reset', today);
        
        document.getElementById('sessionsToday').textContent = '0';
        document.getElementById('currentStreak').textContent = '0';
    }
}

// Utility Functions
function showLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
}

function hideLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}