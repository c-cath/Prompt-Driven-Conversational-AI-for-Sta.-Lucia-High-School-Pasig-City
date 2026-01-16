document.addEventListener('DOMContentLoaded', function() {
    addBotMessage("Welcome to the <b>Sta. Lucia High School - Pasig City Infobot! </b> I'm Lucy, your friendly AI assistant. I'm here to provide you with all the information you need about our school, from admission procedures to extracurricular activities and beyond. Feel free to ask me anything, and I'll do my best to guide you.", 'infobot1.png');
});

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim()) {
        addUserMessage(userInput);
        document.getElementById('user-input').value = '';

        // Add the typing indicator
        addTypingIndicator();

        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            // Remove the typing indicator before adding the bot's message
            removeTypingIndicator();
            addBotMessage(formatMessage(data.reply), 'infobot1.png');
        })
        .catch(error => {
            console.error('Error:', error);
            removeTypingIndicator();
            addBotMessage('Sorry, something went wrong.', 'infobot1.png');
        });
    }
}

function addTypingIndicator() {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', 'bot-message'); // Use bot-message styles

    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = '<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';

    messageWrapper.appendChild(typingIndicator); // Append typingIndicator directly

    document.getElementById('chat-box').appendChild(messageWrapper);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addUserMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', 'user-message');

    const message = document.createElement('div');
    message.classList.add('message');

    const messageContent = document.createElement('p');
    messageContent.innerHTML = text;

    message.appendChild(messageContent);
    messageWrapper.appendChild(message);

    document.getElementById('chat-box').appendChild(messageWrapper);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function addBotMessage(text, avatarSrc) {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message-wrapper', 'bot-message');

    const avatar = document.createElement('img');
    avatar.src = avatarSrc;
    avatar.alt = 'Bot Avatar';
    avatar.classList.add('avatar');

    const message = document.createElement('div');
    message.classList.add('message');

    const messageContent = document.createElement('p');
    messageContent.innerHTML = text;

    message.appendChild(messageContent);
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(message);

    document.getElementById('chat-box').appendChild(messageWrapper);
    document.getElementById('chat-box').scrollTop = document.getElementById('chat-box').scrollHeight;
}

function formatMessage(message) {
    message = message.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    message = message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    message = message.replace(/(?<!\*)\*(.*?)\*(?!\*)/g, '<i>$1</i>');
    message = message.replace(/(?:^|\n)\*\s+(.+)/g, '<li>$1</li>');

    if (message.includes('<li>')) {
        message = `<ul>${message}</ul>`;
    }

    message = message.replace(/(?<!["'>])\b(https?:\/\/[^\s<>]+)\b/g, '<a href="$1" target="_blank">$1</a>');

    return message;
}