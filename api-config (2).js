// ==================== OPENROUTER AI CONFIGURATION ====================
// LISA OMA OPENROUTER API VÕTI: https://openrouter.ai/keys

const OPENROUTER_CONFIG = {
    API_KEY: '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',  // ← LISA OMA VÕTI SIIA
    MODEL: 'openai/gpt-5.1-chat',  // Või 'anthropic/claude-3-opus', 'google/gemini-pro' jne
    ENDPOINT: 'https://openrouter.ai/api/v1/chat/completions',
    
    // KOHUSTUSLIKUD väljad OpenRouteris:
    SITE_URL: 'https://energiajook.xyz',  // ← Sinu veebilehe URL
    SITE_NAME: 'energiajook',               // ← Sinu äpi nimi
    
    // Täiendavad seaded:
    MAX_TOKENS: 1000,
    TEMPERATURE: 0.7,
};

// ==================== PEAMINE AI KUTSE FUNKTSIOON ====================
async function callOpenRouter(messages, systemPrompt = null, maxTokens = null) {
    const fullMessages = systemPrompt 
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages;
    
    try {
        const response = await fetch(OPENROUTER_CONFIG.ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_CONFIG.API_KEY}`,
                'HTTP-Referer': OPENROUTER_CONFIG.SITE_URL,      // Kohustuslik!
                'X-Title': OPENROUTER_CONFIG.SITE_NAME            // Kohustuslik!
            },
            body: JSON.stringify({
                model: OPENROUTER_CONFIG.MODEL,
                messages: fullMessages,
                max_tokens: maxTokens || OPENROUTER_CONFIG.MAX_TOKENS,
                temperature: OPENROUTER_CONFIG.TEMPERATURE
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('OpenRouter Error:', error);
            throw new Error(error.error?.message || 'OpenRouter API error');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('OpenRouter API Error:', error);
        throw error; // Viska edasi, et script.js saaks käsitleda
    }
}

// ==================== QUIZ SOOVITUSED ====================
async function getQuizRecommendations(quizAnswers) {
    console.log('🤖 Getting AI recommendations for quiz...');
    
    const budgetText = {
        'low': 'Kuni 10,000€',
        'medium': '10,000€ - 25,000€',
        'high': '25,000€ - 50,000€',
        'premium': 'Üle 50,000€'
    };
    
    const typeText = {
        'sedan': 'Sedaan',
        'suv': 'SUV/Maastur',
        'hatchback': 'Hatchback',
        'sport': 'Sportauto',
        'van': 'Pereauto/Van',
        'electric': 'Elektri/Hübriid'
    };
    
    const usageText = {
        'city': 'Linnasõit',
        'highway': 'Pikad maanteesõidud',
        'family': 'Perega reisimine',
        'offroad': 'Maastikusõit',
        'business': 'Ärisõiduk'
    };
    
    const priorityText = {
        'efficiency': 'Kütusesäästlikkus',
        'safety': 'Turvalisus',
        'comfort': 'Mugavus',
        'performance': 'Jõudlus',
        'tech': 'Tehnoloogia'
    };
    
    const prompt = `
Kasutaja otsib autot järgmiste parameetritega:
- Eelarve: ${budgetText[quizAnswers.budget] || quizAnswers.budget}
- Auto tüüp: ${typeText[quizAnswers.type] || quizAnswers.type}
- Kasutusotstarve: ${usageText[quizAnswers.usage] || quizAnswers.usage}
- Prioriteet: ${priorityText[quizAnswers.priority] || quizAnswers.priority}

Anna täpselt 3 parimat auto soovitust JSON formaadis. Ole konkreetne ja realistlik Eesti turu kohta.

JSON formaat PEAB olema täpselt selline:
[
  {
    "name": "Täpne auto mudel ja aasta (nt Toyota Corolla 2020)",
    "description": "Lühike kirjeldus (1-2 lauset)",
    "price": "Realistlik hinnaklass (nt 12,000€ - 15,000€)",
    "fuel": "Kütusekulu (nt 5.5L/100km või 16 kWh/100km elektriautole)",
    "safety": "Turvahinne (nt 5/5 ⭐)"
  }
]

OLULINE: Vasta AINULT JSON massiiviga, ilma lisatekstita!
`;
    
    const systemPrompt = `Sa oled Eesti autoturu ekspert. 
Anna soovitusi, mis arvestavad:
- Eesti kliimat ja teid
- Realistlikke hindu Eesti turul
- Saadavust Eestis
- Hoolduse kättesaadavust
Ole täpne ja konkreetne. Vasta ainult puhta JSON formaadis.`;
    
    const messages = [{ role: 'user', content: prompt }];
    
    try {
        const response = await callOpenRouter(messages, systemPrompt, 2000);
        
        // Otsi JSON osa vastusest
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const recommendations = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully got', recommendations.length, 'recommendations');
            return recommendations;
        }
        
        console.error('No valid JSON found in response:', response);
        return null;
        
    } catch (error) {
        console.error('Error getting quiz recommendations:', error);
        return null;
    }
}

// ==================== AUTODE VÕRDLUS ====================
async function getCarComparison(carsList) {
    console.log('🤖 Comparing cars with AI:', carsList.join(', '));
    
    const prompt = `
Võrdle järgmisi autosid detailselt ja objektiivselt:
${carsList.map((car, i) => `${i + 1}. ${car}`).join('\n')}

Anna võrdlus JSON formaadis koos tabeliga JA insights'iga.

JSON formaat PEAB olema täpselt selline:
{
  "table": {
    "Hind": ["auto1 hinnaklass", "auto2 hinnaklass", "auto3 hinnaklass"],
    "Mootor": ["auto1 mootor", "auto2 mootor", "auto3 mootor"],
    "Võimsus": ["auto1 võimsus", "auto2 võimsus", "auto3 võimsus"],
    "Kütusekulu": ["auto1 kulu", "auto2 kulu", "auto3 kulu"],
    "Kiirendus 0-100": ["auto1 aeg", "auto2 aeg", "auto3 aeg"],
    "CO2 heide": ["auto1 heide", "auto2 heide", "auto3 heide"],
    "Turvahinne": ["auto1 hinne", "auto2 hinne", "auto3 hinne"],
    "Garantii": ["auto1 garantii", "auto2 garantii", "auto3 garantii"]
  },
  "insights": "<h4>🎯 AI Soovitus</h4><p>Parim valik on <strong>auto nimi</strong>, sest...</p><h4>💡 Tehnilised näitajad lihtsalt:</h4><p>Selgita peamised erinevused...</p>"
}

OLULINE: 
- Vasta AINULT JSON formaadis
- insights peab olema HTML formaadis
- Selgita tehnilisi näitajaid lihtsalt
- Anna konkreetne soovitus
`;
    
    const systemPrompt = `Sa oled autotehnoloogia ekspert, kes:
- Võrdleb autosid objektiivselt
- Selgitab tehnilisi näitajaid arusaadavalt
- Annab praktilisi soovitusi
- Kasutab realistlikke andmeid
Vasta ainult puhta JSON formaadis.`;
    
    const messages = [{ role: 'user', content: prompt }];
    
    try {
        const response = await callOpenRouter(messages, systemPrompt, 2500);
        
        // Otsi JSON osa vastusest
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const comparison = JSON.parse(jsonMatch[0]);
            console.log('✅ Successfully got comparison data');
            return comparison;
        }
        
        console.error('No valid JSON found in response:', response);
        return null;
        
    } catch (error) {
        console.error('Error getting car comparison:', error);
        return null;
    }
}

// ==================== CHATBOT VESTLUS ====================
let conversationHistory = [];

async function getChatbotResponse(userMessage) {
    console.log('🤖 Getting chatbot response for:', userMessage);
    
    // Lisa kasutaja sõnum ajalukku
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });
    
    // Hoia ajalugu mõistliku pikkusega (viimased 6 sõnumit = 3 vestlust)
    if (conversationHistory.length > 6) {
        conversationHistory = conversationHistory.slice(-6);
    }
    
    const systemPrompt = `Sa oled AutoValik'u AI assistent. 

Sinu ülesanded:
- Aita kasutajatel leida sobivat autot
- Võrrelda erinevaid mudeleid
- Selgitada tehnilisi näitajaid lihtsalt
- Anda praktilisi soovitusi auto ostmisel

Reeglid:
- Ole sõbralik ja abivaimas
- Kasuta eestikeelset professionaalset stiili
- Selgita tehnilist infot lihtsalt
- Anna konkreetseid vastuseid
- Kui ei tea, ütle ausalt
- Küsi täpsustavaid küsimusi
- Kasuta emoji'sid mõõdukalt

Kontekst: Eesti autoturg, Eesti kliima ja teed.`;
    
    try {
        const response = await callOpenRouter(conversationHistory, systemPrompt, 800);
        
        // Lisa AI vastus ajalukku
        conversationHistory.push({
            role: 'assistant',
            content: response
        });
        
        console.log('✅ Got chatbot response');
        return response;
        
    } catch (error) {
        console.error('Error getting chatbot response:', error);
        throw error;
    }
}

// Lähtesta vestluse ajalugu
function resetChatHistory() {
    conversationHistory = [];
    console.log('🔄 Chat history reset');
}

// ==================== LISAFUNKTSIOONID ====================

// Kontrolli kas API võti on seadistatud
function isAPIConfigured() {
    return OPENROUTER_CONFIG.API_KEY && 
           !OPENROUTER_CONFIG.API_KEY.includes('YOUR_') &&
           OPENROUTER_CONFIG.API_KEY.startsWith('sk-or-v1-');
}

// Hangi praegune mudel
function getCurrentModel() {
    return OPENROUTER_CONFIG.MODEL;
}

// Vaheta mudelit (kui soovid kasutajale võimaldada valida)
function setModel(modelName) {
    OPENROUTER_CONFIG.MODEL = modelName;
    console.log('🔄 Model changed to:', modelName);
}

// Saadaolevad mudelid (näited)
const AVAILABLE_MODELS = {
    'GPT-4': 'openai/gpt-4',
    'GPT-3.5 Turbo': 'openai/gpt-3.5-turbo',
    'Claude 3 Opus': 'anthropic/claude-3-opus',
    'Claude 3 Sonnet': 'anthropic/claude-3-sonnet',
    'Gemini Pro': 'google/gemini-pro',
    'Llama 3 70B': 'meta-llama/llama-3-70b-instruct'
};