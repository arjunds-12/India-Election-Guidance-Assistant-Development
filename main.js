document.addEventListener('DOMContentLoaded', () => {
    // --- Assistant Chatbot Logic ---
    const assistantTrigger = document.getElementById('assistantTrigger');
    const assistantPanel = document.getElementById('assistantPanel');
    const closeAssistant = document.getElementById('closeAssistant');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatBody = document.getElementById('chatBody');

    // Toggle Assistant
    assistantTrigger.addEventListener('click', () => {
        assistantPanel.style.display = assistantPanel.style.display === 'flex' ? 'none' : 'flex';
        if (assistantPanel.style.display === 'flex') {
            chatInput.focus();
            assistantTrigger.style.transform = 'scale(0)';
        }
    });

    closeAssistant.addEventListener('click', () => {
        assistantPanel.style.display = 'none';
        assistantTrigger.style.transform = 'scale(1)';
    });

    // Indian Election FAQ Responses
    const responses = {
        'epic': "EPIC stands for Electoral Photo Identity Card. It's your official Voter ID issued by the Election Commission of India.",
        'aadhaar': "You can link your Aadhaar with your Voter ID using Form 6B. It's voluntary but recommended for authentication. You can do this via the Voter Helpline App or NVSP portal.",
        'missing': "If your name is missing from the electoral roll, you must fill Form 6 to apply for inclusion. Make sure to do this before the final roll is published!",
        'register': "To register as a new voter, fill out Form 6 online at the NVSP portal or via the Voter Helpline App. You'll need age proof, address proof, and a photo.",
        'deadline': "Voter registration is a continuous process, but if an election is announced, the deadline to register is typically the last date for filing nominations by candidates.",
        'nri': "Yes, NRIs can vote! Fill Form 6A to register as an overseas elector. You must be physically present at your polling station in India to cast your vote.",
        'blo': "BLO stands for Booth Level Officer. They are local officials who maintain the electoral roll and physically verify voter registration applications.",
        'hello': "Namaste! 🙏 I can help with voter registration (Form 6), linking Aadhaar, understanding EPIC, or finding deadlines. What do you need help with?",
        'default': "That's a good question. For specific details about your constituency, I recommend checking the official ECI website (eci.gov.in) or the Voter Helpline App."
    };

    function addMessage(text, isUser = false) {
        // Remove suggested chips if user sends a message
        const chips = document.querySelector('.suggested-chips');
        if (chips && isUser) {
            chips.remove();
        }

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user' : 'bot'} mt-2`;
        bubble.textContent = text;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend(text = null) {
        const query = (text || chatInput.value).trim();
        const lowerQuery = query.toLowerCase();
        if (!query) return;

        if (!text) {
            addMessage(chatInput.value, true);
            chatInput.value = '';
        } else {
            addMessage(text, true);
        }

        // Simple typing indicator simulation
        setTimeout(() => {
            let response = responses.default;
            for (const key in responses) {
                if (lowerQuery.includes(key)) {
                    response = responses[key];
                    break;
                }
            }
            addMessage(response);
        }, 600);
    }

    sendBtn.addEventListener('click', () => handleSend());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Suggested Chips logic
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            handleSend(chip.textContent);
        });
    });

    // --- Eligibility Checker Logic ---
    let isCitizen = null;
    const optionBtns = document.querySelectorAll('.option-btn');
    const ageGroup = document.getElementById('ageGroup');
    const checkEligibilityBtn = document.getElementById('checkEligibilityBtn');
    const ageInput = document.getElementById('ageInput');
    const eligibilityResult = document.getElementById('eligibilityResult');

    optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            optionBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            isCitizen = e.target.getAttribute('data-val') === 'yes';
            
            if (isCitizen) {
                ageGroup.style.display = 'block';
                eligibilityResult.innerHTML = '';
            } else {
                ageGroup.style.display = 'none';
                eligibilityResult.innerHTML = `<div style="padding: 10px; background: rgba(211,47,47,0.2); border-left: 4px solid var(--secondary-light); color: white; border-radius: 4px;">
                    Only Indian Citizens are eligible to vote in India.
                </div>`;
            }
        });
    });

    checkEligibilityBtn.addEventListener('click', () => {
        const age = parseInt(ageInput.value);
        if (isNaN(age)) {
            eligibilityResult.innerHTML = '<span style="color:#FF9933">Please enter a valid age.</span>';
            return;
        }

        if (age >= 18) {
            eligibilityResult.innerHTML = `<div style="padding: 10px; background: rgba(19,136,8,0.2); border-left: 4px solid var(--secondary); color: white; border-radius: 4px;">
                ✅ You are eligible to vote! Please ensure you are registered in the Electoral Roll (fill Form 6).
            </div>`;
        } else {
            eligibilityResult.innerHTML = `<div style="padding: 10px; background: rgba(255,153,51,0.2); border-left: 4px solid var(--primary); color: white; border-radius: 4px;">
                ⏳ You must be 18 years old as of Jan 1st of the revision year to vote. You will be eligible in ${18 - age} year(s). Keep preparing!
            </div>`;
        }
    });

    // --- Polling Booth Finder Logic (Mock) ---
    const findBoothBtn = document.getElementById('findBoothBtn');
    const pinInput = document.getElementById('pinInput');
    const boothResult = document.getElementById('boothResult');

    findBoothBtn.addEventListener('click', () => {
        const pin = pinInput.value.trim();
        if (pin.length !== 6 || isNaN(pin)) {
            boothResult.innerHTML = '<span style="color:#FF9933">Please enter a valid 6-digit Indian PIN code.</span>';
            return;
        }

        // Mock result
        boothResult.innerHTML = `<div style="padding: 10px; background: rgba(0,71,171,0.2); border-left: 4px solid var(--accent); color: white; border-radius: 4px;">
            <strong>Mock Result for PIN ${pin}:</strong><br>
            📍 Government Primary School, Block A<br>
            Booth No: 142<br>
            <em>(Note: In a real app, this connects to the ECI API)</em>
        </div>`;
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll reveal for timeline
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item, .step-card, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});
