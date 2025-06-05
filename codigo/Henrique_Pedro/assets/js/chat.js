class ChatSystem {
    constructor() {
        this.apiBase = 'http://localhost:3000';
        this.currentChat = null;
        this.isGroupChat = false;
        this.chatData = {
            contacts: [],
            groups: [],
            messages: {}
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
           
            const contactsRes = await fetch(`${this.apiBase}/contacts`);
            this.chatData.contacts = await contactsRes.json();

          
            const groupsRes = await fetch(`${this.apiBase}/groups`);
            this.chatData.groups = await groupsRes.json();

            
            const messagesRes = await fetch(`${this.apiBase}/messages`);
            const messagesArr = await messagesRes.json();

           
            this.chatData.messages = {};
            messagesArr.forEach(msg => {
                if (!this.chatData.messages[msg.chat]) {
                    this.chatData.messages[msg.chat] = [];
                }
                this.chatData.messages[msg.chat].push(msg);
            });

            this.updateContactList();
            if (this.chatData.contacts.length > 0) {
                this.openChat(this.chatData.contacts[0], false);
            }
        } catch (error) {
            console.error("Erro ao carregar dados do JSON Server:", error);
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

        const newMessage = {
            chat: this.currentChat,
            sender: 'Você',
            text: text,
            time: time
        };

        try {
           
            const res = await fetch(`${this.apiBase}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMessage)
            });

            if (!res.ok) throw new Error('Falha ao enviar mensagem');

           
            if (!this.chatData.messages[this.currentChat]) {
                this.chatData.messages[this.currentChat] = [];
            }
            this.chatData.messages[this.currentChat].push(newMessage);

            this.addMessageToChat('Você', text, time, false);
            this.elements.messageInput.value = '';
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Erro ao enviar mensagem.");
        }
    }

    showGroupModal() {
        this.elements.groupMemberList.innerHTML = '';
        this.chatData.contacts.forEach(contact => {
            const memberItem = document.createElement('div');
            memberItem.className = 'group-member-item';
            memberItem.innerHTML = `
                <input type="checkbox" id="member-${contact}" value="${contact}">
                <label for="member-${contact}">${contact}</label>
            `;
            this.elements.groupMemberList.appendChild(memberItem);
        });
        this.elements.groupModal.show();
    }

    async createGroup() {
        const groupName = this.elements.groupNameInput.value.trim();
        if (!groupName) {
            alert('Por favor, digite um nome para o grupo');
            return;
        }
        
        const members = Array.from(this.elements.groupMemberList.querySelectorAll('input:checked'))
                            .map(el => el.value);
        
        if (members.length < 2) {
            alert('Selecione pelo menos 2 membros para o grupo');
            return;
        }

        const newGroup = {
            name: groupName,
            members: members
        };

        try {
            
            const res = await fetch(`${this.apiBase}/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGroup)
            });
            if (!res.ok) throw new Error('Falha ao criar grupo');

           
            this.chatData.groups.push(newGroup);

        
            this.chatData.messages[groupName] = [];

            this.updateContactList();
            this.elements.groupModal.hide();
            this.elements.groupNameInput.value = '';
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
            alert("Erro ao criar grupo.");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ChatSystem());
