// ==================== QUIZ FUNCTIONALITY ====================
let currentQuestion = 1;
let quizAnswers = {
    budget: '',
    type: '',
    usage: '',
    priority: ''
};

// quiz
document.addEventListener('DOMContentLoaded', function() {
    updateQuizNavigation();
    initializeOptionButtons();
});

function initializeOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove selected class
            const siblings = this.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class
            this.classList.add('selected');
            
            // Save answer
            const questionNum = this.closest('.question-card').dataset.question;
            const value = this.dataset.value;
            
            if (questionNum == 1) quizAnswers.budget = value;
            if (questionNum == 2) quizAnswers.type = value;
            if (questionNum == 3) quizAnswers.usage = value;
            if (questionNum == 4) quizAnswers.priority = value;
            
            // Auto advance after selection
            setTimeout(() => {
                if (currentQuestion < 4) {
                    changeQuestion(1);
                } else {
                    showResults();
                }
            }, 500);
        });
    });
}

function changeQuestion(direction) {
    const currentCard = document.querySelector(`.question-card[data-question="${currentQuestion}"]`);
    currentCard.classList.remove('active');
    
    currentQuestion += direction;
    
    const nextCard = document.querySelector(`.question-card[data-question="${currentQuestion}"]`);
    if (nextCard) {
        nextCard.classList.add('active');
    }
    
    updateStepIndicator();
    updateQuizNavigation();
}

function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentQuestion) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNum === currentQuestion) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function updateQuizNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentQuestion > 1 ? 'block' : 'none';
        nextBtn.style.display = currentQuestion < 4 ? 'block' : 'none';
    }
}

function showResults() {
    currentQuestion = 'results';
    document.querySelectorAll('.question-card').forEach(card => card.classList.remove('active'));
    document.querySelector('.question-card[data-question="results"]').classList.add('active');
    
    // Generate results - KASUTAB NÜÜD AI-d
    generateQuizResults();
}

// ==================== UUENDATUD: AI QUIZ RESULTS ====================
async function generateQuizResults() {
    const resultsContainer = document.getElementById('quiz-results');
    
    // Näita laadimise animatsiooni
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="loading-spinner"></div>
            <p style="margin-top: 1rem; color: var(--text-gray); font-size: 1.1rem;">
                🤖 AI otsib sulle parimaid autosid...
            </p>
        </div>
    `;
    
    try {
        // KASUTAB ai-config.js funktsiooni
        const recommendations = await getQuizRecommendations(quizAnswers);
        
        if (!recommendations || recommendations.length === 0) {
            throw new Error('No recommendations received');
        }
        
        displayRecommendations(recommendations);
        
    } catch (error) {
        console.error('Error generating AI results:', error);
        
        // Fallback: Kasuta mock andmeid kui AI ei tööta
        resultsContainer.innerHTML = `
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <p style="color: #856404; margin: 0;">
                    ⚠️ AI teenus ei ole hetkel saadaval. Näitame sulle põhisoovitused:
                </p>
            </div>
        `;
        const mockResults = getMockCarRecommendations(quizAnswers);
        displayRecommendations(mockResults);
    }
}

// UUENDATUD: Tulemuste kuvamine
function displayRecommendations(recommendations) {
    const resultsContainer = document.getElementById('quiz-results');
    
    let resultsHTML = '';
    recommendations.forEach((car, index) => {
        resultsHTML += `
            <div class="result-card" style="animation-delay: ${index * 0.15}s">
                <h4>🚗 ${car.name}</h4>
                <p>${car.description}</p>
                <div class="result-specs">
                    <div class="spec-item">
                        💰 <strong>Hind:</strong> ${car.price}
                    </div>
                    <div class="spec-item">
                        ⛽ <strong>Kütusekulu:</strong> ${car.fuel}
                    </div>
                    <div class="spec-item">
                        🛡️ <strong>Turvahinne:</strong> ${car.safety}
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = resultsHTML;
}

// Mock andmed (fallback kui AI ei tööta)
function getMockCarRecommendations(answers) {
    const recommendations = {
        low: [
            {
                name: 'Toyota Corolla 2019',
                description: 'Usaldusväärne ja säästlik sedaan linnasõiduks. Madal hoolduskulu ja hea kütusesäästlikkus.',
                price: '8,000€ - 12,000€',
                fuel: '5.2L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Volkswagen Golf 2018',
                description: 'Kompaktne ja praktiline hatchback igapäevaseks kasutamiseks.',
                price: '9,000€ - 13,000€',
                fuel: '5.5L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Skoda Octavia 2017',
                description: 'Suur pagasiruum ja usaldusväärne pereauto mõistliku hinnaga.',
                price: '7,500€ - 11,000€',
                fuel: '5.8L/100km',
                safety: '5/5 ⭐'
            }
        ],
        medium: [
            {
                name: 'Honda Accord 2021',
                description: 'Mugav ja tehnoloogiaküllane sedaan kõrgel tasemel.',
                price: '18,000€ - 22,000€',
                fuel: '6.1L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Mazda CX-5 2020',
                description: 'Stiilne ja naudinguväärne SUV premium tunnetus.',
                price: '20,000€ - 24,000€',
                fuel: '6.8L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Toyota RAV4 Hybrid 2021',
                description: 'Ökonoomne hübriid-SUV, ideaalne pereauto.',
                price: '22,000€ - 26,000€',
                fuel: '4.9L/100km',
                safety: '5/5 ⭐'
            }
        ],
        high: [
            {
                name: 'Audi A4 2022',
                description: 'Premium sedaan kõrgetasemelise sisustusega.',
                price: '32,000€ - 38,000€',
                fuel: '6.5L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'BMW X3 2022',
                description: 'Sportlik SUV premium tunnetus ja jõudlusega.',
                price: '35,000€ - 42,000€',
                fuel: '7.2L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Mercedes-Benz C-Class 2022',
                description: 'Luksuslik sedaan tipptasemel tehnoloogiaga.',
                price: '38,000€ - 45,000€',
                fuel: '6.8L/100km',
                safety: '5/5 ⭐'
            }
        ],
        premium: [
            {
                name: 'Tesla Model 3 2023',
                description: 'Elektriline sedaan tuleviku tehnoloogiaga.',
                price: '45,000€+',
                fuel: '15 kWh/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'Porsche Cayenne 2023',
                description: 'Sportlik luksus-SUV võimsusega.',
                price: '80,000€+',
                fuel: '11.7L/100km',
                safety: '5/5 ⭐'
            },
            {
                name: 'BMW 5 Series 2023',
                description: 'Executive sedaan maksimaalse mugavusega.',
                price: '60,000€+',
                fuel: '7.1L/100km',
                safety: '5/5 ⭐'
            }
        ]
    };
    
    return recommendations[answers.budget] || recommendations.medium;
}

function resetQuiz() {
    currentQuestion = 1;
    quizAnswers = { budget: '', type: '', usage: '', priority: '' };
    
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.question-card').forEach(card => card.classList.remove('active'));
    document.querySelector('.question-card[data-question="1"]').classList.add('active');
    
    updateStepIndicator();
    updateQuizNavigation();
}

// ==================== COMPARISON FUNCTIONALITY ====================
let selectedCars = [];

function addCarToCompare(carNumber) {
    const input = document.getElementById(`car${carNumber}Input`);
    const carName = input.value.trim();
    
    if (!carName) {
        alert('Palun sisesta auto mudel');
        return;
    }
    
    selectedCars[carNumber - 1] = carName;
    input.style.borderColor = 'var(--success-color)';
    
    // Visual feedback
    setTimeout(() => {
        input.style.borderColor = '';
    }, 2000);
}

// ==================== UUENDATUD: AI COMPARISON ====================
async function compareAllCars() {
    const validCars = selectedCars.filter(car => car);
    
    if (validCars.length < 2) {
        alert('Palun vali vähemalt 2 autot võrdlemiseks');
        return;
    }
    
    const compareBtn = document.querySelector('.btn-compare');
    const originalText = compareBtn.innerHTML;
    compareBtn.innerHTML = `
        <div class="loading-spinner-small"></div>
        <span style="margin-left: 10px;">AI võrdleb autosid...</span>
    `;
    compareBtn.disabled = true;
    
    try {
        // KASUTAB ai-config.js funktsiooni
        const comparisonData = await getCarComparison(validCars);
        
        if (comparisonData && comparisonData.table) {
            // Genereeri tabel AI andmetest
            generateComparisonTableFromAI(validCars, comparisonData.table);
            
            // Näita AI insights
            document.getElementById('aiInsights').innerHTML = comparisonData.insights || 
                '<p>AI analüüs ei õnnestunud. Kasutame põhiandmeid.</p>';
        } else {
            throw new Error('Invalid comparison data');
        }
        
    } catch (error) {
        console.error('Comparison error:', error);
        
        // Fallback: mock andmed
        showComparisonWarning();
        generateComparisonTable(validCars);
        generateAIInsights(validCars);
    }
    
    // Näita tulemused
    document.getElementById('comparisonResults').style.display = 'block';
    document.getElementById('comparisonResults').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Reset button
    compareBtn.innerHTML = originalText;
    compareBtn.disabled = false;
}

// UUENDATUD: AI andmetest tabeli genereerimine
function generateComparisonTableFromAI(cars, tableData) {
    const table = document.getElementById('comparisonTable');
    
    let html = '<thead><tr><th>Omadus</th>';
    cars.forEach(car => {
        html += `<th>${car}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Genereeri read AI andmetest
    Object.keys(tableData).forEach(feature => {
        html += `<tr><td><strong>${feature}</strong></td>`;
        tableData[feature].slice(0, cars.length).forEach(value => {
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

// Hoiatuse kuvamine
function showComparisonWarning() {
    const resultsDiv = document.getElementById('comparisonResults');
    const warningHTML = `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
            <p style="color: #856404; margin: 0;">
                ⚠️ AI teenus ei ole hetkel saadaval. Näitame põhivõrdlust:
            </p>
        </div>
    `;
    
    // Lisa hoiatus tulemuste algusesse
    if (!resultsDiv.querySelector('.ai-warning')) {
        const warning = document.createElement('div');
        warning.className = 'ai-warning';
        warning.innerHTML = warningHTML;
        resultsDiv.insertBefore(warning, resultsDiv.firstChild);
    }
}

// Mock võrdlus (fallback)
function generateComparisonTable(cars) {
    const table = document.getElementById('comparisonTable');
    
    const comparisonData = {
        'Hind': ['25,000€', '28,000€', '22,000€'],
        'Mootor': ['2.0L Turbo', '2.5L Hybrid', '1.8L'],
        'Võimsus': ['250 hj', '200 hj', '140 hj'],
        'Kütusekulu': ['6.5L/100km', '4.8L/100km', '5.2L/100km'],
        'Kiirendus 0-100': ['6.2s', '7.8s', '9.1s'],
        'CO2 heide': ['148 g/km', '112 g/km', '121 g/km'],
        'Turvahinne': ['5/5 ⭐', '5/5 ⭐', '4/5 ⭐'],
        'Garantii': ['5 aastat', '7 aastat', '3 aastat']
    };
    
    let html = '<thead><tr><th>Omadus</th>';
    cars.forEach(car => {
        html += `<th>${car}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    Object.keys(comparisonData).forEach(feature => {
        html += `<tr><td><strong>${feature}</strong></td>`;
        comparisonData[feature].slice(0, cars.length).forEach(value => {
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

function generateAIInsights(cars) {
    const insightsDiv = document.getElementById('aiInsights');
    
    insightsDiv.innerHTML = `
        <h4>🎯 Soovitus</h4>
        <p>Sinu valitud autode võrdluse põhjal soovitame <strong>${cars[0]}</strong>, kuna see pakub head tasakaalu hinna ja kvaliteedi vahel.</p>
        
        <h4>💡 Tehnilised näitajad lihtsalt:</h4>
        <p><strong>Võimsus (hj):</strong> Mootori jõud. 140 hj sobib linnasõiduks, 200+ hj sportlikumaks sõiduks ja kiirendamiseks.</p>
        <p><strong>Kütusekulu:</strong> Mida madalam, seda vähem kulud. Hübriidid kulutavad 4-5L/100km, tavalised bensiiniautod 6-9L/100km.</p>
        <p><strong>CO2 heide:</strong> Keskkonnamõju näitaja. Madalam on parem ja võib tähendada väiksemaid makse.</p>
        <p><strong>Kiirendus 0-100km/h:</strong> Auto sportlikkuse näitaja. Alla 7 sekundi on sportlik, üle 9 sekundi rahulikum.</p>
        
        <h4>✅ Peamised erinevused:</h4>
        <ul>
            <li><strong>${cars[0]}</strong> on kõige võimsam ja kiireim, sobib sportliku sõidustiili jaoks</li>
            <li><strong>${cars[1] || cars[0]}</strong> on kõige säästlikum kütusekulu poolest, ideaalne igapäevaseks sõiduks</li>
            <li>Kõik valitud mudelid omavad head turvahinnangut ja on usaldusväärsed</li>
        </ul>
    `;
}

// ==================== CHATBOT FUNCTIONALITY ====================
let chatbotOpen = false;

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.classList.add('active');
        // Fokusseeri input
        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 300);
    } else {
        chatbot.classList.remove('active');
    }
}

// ==================== UUENDATUD: AI CHATBOT ====================
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Lisa kasutaja sõnum
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Näita typing indicator
    const typingIndicator = addMessageToChat('AI mõtleb...', 'bot', true);
    
    try {
        // KASUTAB ai-config.js funktsiooni
        const response = await getChatbotResponse(message);
        
        // Eemalda typing indicator
        typingIndicator.remove();
        
        // Lisa AI vastus
        addMessageToChat(response, 'bot');
        
    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        addMessageToChat('Vabandust, hetkel ei saa vastata. Palun proovi hiljem uuesti. 😔', 'bot');
    }
}

function addMessageToChat(message, type, isTyping = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';
    
    if (isTyping) {
        messageDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
            ${message}
        `;
    } else {
        messageDiv.textContent = message;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
}

// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

});
