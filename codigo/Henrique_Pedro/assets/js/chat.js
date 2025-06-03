class ChatSystem {
    constructor() {
        this.dbPath = 'db/dbchat.json';
        this.currentChat = null;
        this.isGroupChat = false;
        this.chatData = {
            contacts: ["João", "Pedro", "Luiz", "Henrique"],
            groups: [],
            messages: {
                "João": [
                    { sender: "João", text: "Olá! Como você está?", time: "10:00" }
                ]
            }
        };

        this.initElements();
        this.initEvents();
        this.loadChatData();
    }

    initElements() {
        this.elements = {
            contactList: document.getElementById('contactList'),
            chatBox: document.getElementById('chatBox'),
            currentChatName: document.getElementById('currentChatName'),
            messageInput: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),
            createGroupBtn: document.getElementById('createGroupBtn'),
            groupModal: new bootstrap.Modal('#groupModal'),
            groupNameInput: document.getElementById('groupName'),
            groupMemberList: document.getElementById('groupMemberList'),
            confirmGroupBtn: document.getElementById('confirmGroupBtn')
        };
    }

    initEvents() {
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.elements.createGroupBtn.addEventListener('click', () => this.showGroupModal());
        this.elements.confirmGroupBtn.addEventListener('click', () => this.createGroup());
    }

    async loadChatData() {
        try {
            const response = await fetch(this.dbPath);
            if (!response.ok) throw new Error('Erro ao carregar dados');
            this.chatData = await response.json();
            this.updateContactList();
            if (this.chatData.contacts.length > 0) {
                this.openChat(this.chatData.contacts[0], false);
            }
        } catch (error) {
            console.error("Erro ao carregar dbchat.json:", error);
            this.updateContactList();
        }
    }

    async saveChatData() {
        try {
            localStorage.setItem('chatDataBackup', JSON.stringify(this.chatData));
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
    }

    updateContactList() {
        this.elements.contactList.innerHTML = '';
        
        this.chatData.contacts.forEach(contact => {
            const li = document.createElement('li');
            li.className = 'contact' + (this.currentChat === contact && !this.isGroupChat ? ' active' : '');
            li.textContent = contact;
            li.addEventListener('click', () => this.openChat(contact, false));
            this.elements.contactList.appendChild(li);
        });
        
        this.chatData.groups.forEach(group => {
            const li = document.createElement('li');
            li.className = 'contact' + (this.currentChat === group.name && this.isGroupChat ? ' active' : '');
            li.innerHTML = `<i class="fa-solid fa-users"></i> ${group.name}`;
            li.addEventListener('click', () => this.openChat(group.name, true));
            this.elements.contactList.appendChild(li);
        });
    }

    openChat(name, isGroup) {
        this.currentChat = name;
        this.isGroupChat = isGroup;
        this.elements.currentChatName.textContent = name;
        this.loadMessages();
    }

    loadMessages() {
        this.elements.chatBox.innerHTML = '';
        
        if (!this.chatData.messages[this.currentChat]) {
            this.chatData.messages[this.currentChat] = [];
        }
        
        this.chatData.messages[this.currentChat].forEach(msg => {
            const isReceived = msg.sender !== 'Você' && msg.sender !== this.currentChat;
            this.addMessageToChat(msg.sender, msg.text, msg.time, isReceived);
        });
    }

    addMessageToChat(sender, text, time, isReceived) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isReceived ? 'received' : 'sent'}`;
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${time}</span>
        `;
        this.elements.chatBox.appendChild(messageDiv);
        this.elements.chatBox.scrollTop = this.elements.chatBox.scrollHeight;
    }

    async sendMessage() {
        const text = this.elements.messageInput.value.trim();
        if (!text || !this.currentChat) return;
        
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        if (!this.chatData.messages[this.currentChat]) {
            this.chatData.messages[this.currentChat] = [];
        }
        
        this.chatData.messages[this.currentChat].push({
            sender: 'Você',
            text: text,
            time: time
        });
        
        await this.saveChatData();
        this.addMessageToChat('Você', text, time, false);
        this.elements.messageInput.value = '';
    }

   