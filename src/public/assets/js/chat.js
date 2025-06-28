import { Usuarios } from "../../services/blocos-services.js";

class ChatApp {
    constructor() {
        this.usuarioService = new Usuarios();

        this.currentUser = null;
        this.currentChatName = null;
        this.allUsers = [];

        this.elements = {
            contactList: document.getElementById('contactList'),
            chatBox: document.getElementById('chatBox'),
            currentChatName: document.getElementById('currentChatName'),
            messageInput: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),

            addContactOrGroupBtn: document.getElementById('createGroupBtn'),

            choiceModal: new bootstrap.Modal(document.getElementById('choiceModal')),
            btnGoToContact: document.getElementById('btnGoToContact'),
            btnGoToGroup: document.getElementById('btnGoToGroup'),

            addContactModal: new bootstrap.Modal(document.getElementById('addContactModal')),
            addContactUserList: document.getElementById('addContactUserList'),

            groupModal: new bootstrap.Modal(document.getElementById('groupModal')),
            groupNameInput: document.getElementById('groupName'),
            groupMemberList: document.getElementById('groupMemberList'),
            confirmGroupBtn: document.getElementById('confirmGroupBtn')
        };

        this.init();
    }

    async init() {
        this.setupEventListeners();
        const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente'));

        if (usuarioCorrente && usuarioCorrente.tipo === 'foliao' && usuarioCorrente.id) {
            try {
                this.currentUser = await this.usuarioService.getUsuario(usuarioCorrente.id);
                this.allUsers = await this.usuarioService.getUsuarios();

                if (!this.currentUser.chat) {
                    this.currentUser.chat = { contacts: [], groups: [], messages: {} };
                }

                this.renderContactList();
                this.selectInitialChat();

            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                alert("Não foi possível carregar os dados do chat.");
            }
        } else {
            alert("Usuário não autenticado. Redirecionando para o login.");
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        this.elements.sendButton.addEventListener('click', () => this.sendMessage());
        this.elements.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        this.elements.addContactOrGroupBtn.addEventListener('click', () => this.elements.choiceModal.show());

        this.elements.btnGoToContact.addEventListener('click', () => this.showAddContactModal());
        this.elements.btnGoToGroup.addEventListener('click', () => this.showCreateGroupModal());

        this.elements.confirmGroupBtn.addEventListener('click', () => this.createGroup());
    }

    renderContactList() {
        this.elements.contactList.innerHTML = '';

        this.currentUser.chat.contacts.forEach(contactName => {
            const li = this.createChatItem(contactName, false);
            this.elements.contactList.appendChild(li);
        });

        this.currentUser.chat.groups.forEach(group => {
            const li = this.createChatItem(group.name, true);
            this.elements.contactList.appendChild(li);
        });
    }

    createChatItem(name, isGroup) {
        const li = document.createElement('li');
        li.className = 'contact';
        li.innerHTML = isGroup ? `<i class="fa-solid fa-users me-2"></i>${name}` : name;
        li.addEventListener('click', () => this.openChat(name));
        return li;
    }

    selectInitialChat() {
        const firstContact = this.currentUser.chat.contacts[0] || this.currentUser.chat.groups[0]?.name;
        if (firstContact) {
            this.openChat(firstContact);
        } else {
            this.elements.currentChatName.textContent = "Nenhum contato";
            this.elements.chatBox.innerHTML = '<p class="text-center text-muted">Adicione contatos ou crie grupos para começar.</p>';
        }
    }

    openChat(chatName) {
        this.currentChatName = chatName;
        this.elements.currentChatName.textContent = chatName;

        document.querySelectorAll('.contact-list .contact').forEach(el => {
            el.classList.remove('active');
            if (el.textContent.trim() === chatName) {
                el.classList.add('active');
            }
        });

        this.renderMessages();
    }

    renderMessages() {
        this.elements.chatBox.innerHTML = '';
        const messages = this.currentUser.chat.messages[this.currentChatName] || [];

        messages.forEach(msg => {
            this.addMessageToUI(msg.sender, msg.text, msg.time);
        });
    }

    addMessageToUI(sender, text, time) {
        const messageDiv = document.createElement('div');
        const messageClass = sender === this.currentUser.nome_completo ? 'sent' : 'received';

        messageDiv.className = `message ${messageClass}`;
        messageDiv.innerHTML = `
            ${sender !== this.currentUser.nome_completo ? `<strong>${sender}</strong>` : ''}
            <p>${text}</p>
            <span class="time">${time}</span>
        `;
        this.elements.chatBox.appendChild(messageDiv);
        this.elements.chatBox.scrollTop = this.elements.chatBox.scrollHeight;
    }

    async sendMessage() {
        const text = this.elements.messageInput.value.trim();
        if (!text || !this.currentChatName) return;

        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newMessage = {
            sender: this.currentUser.nome_completo,
            text: text,
            time: time
        };

        if (!this.currentUser.chat.messages[this.currentChatName]) {
            this.currentUser.chat.messages[this.currentChatName] = [];
        }

        this.currentUser.chat.messages[this.currentChatName].push(newMessage);

        try {
            await this.usuarioService.atualizarUsuario(this.currentUser.id, this.currentUser);
            this.addMessageToUI(newMessage.sender, newMessage.text, newMessage.time);
            this.elements.messageInput.value = '';
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Falha ao enviar mensagem.");
            this.currentUser.chat.messages[this.currentChatName].pop();
        }
    }

    showAddContactModal() {
        this.elements.choiceModal.hide();
        this.elements.addContactUserList.innerHTML = '';

        this.allUsers.forEach(user => {
            if (user.id === this.currentUser.id || this.currentUser.chat.contacts.includes(user.nome_completo)) {
                return;
            }

            const userItem = document.createElement('li');
            userItem.className = 'list-group-item list-group-item-action';
            userItem.textContent = user.nome_completo;
            userItem.style.cursor = 'pointer';
            userItem.addEventListener('click', () => this.addContact(user.nome_completo));
            this.elements.addContactUserList.appendChild(userItem);
        });

        this.elements.addContactModal.show();
    }

    async addContact(userName) {
        if (this.currentUser.chat.contacts.includes(userName)) {
            alert("Este usuário já está na sua lista de contatos.");
            return;
        }

        this.currentUser.chat.contacts.push(userName);

        try {
            await this.usuarioService.atualizarUsuario(this.currentUser.id, this.currentUser);
            this.renderContactList();
            this.elements.addContactModal.hide();
            alert(`"${userName}" foi adicionado aos seus contatos!`);
        } catch (error) {
            console.error("Erro ao adicionar contato:", error);
            alert("Falha ao adicionar contato.");
            this.currentUser.chat.contacts = this.currentUser.chat.contacts.filter(c => c !== userName);
        }
    }

    showCreateGroupModal() {
        this.elements.choiceModal.hide();
        this.elements.groupMemberList.innerHTML = '';

        this.allUsers.forEach(user => {
            if (user.id === this.currentUser.id) return;

            const memberItem = document.createElement('div');
            memberItem.className = 'form-check';
            memberItem.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${user.nome_completo}" id="member-${user.id}">
                <label class="form-check-label" for="member-${user.id}">${user.nome_completo}</label>
            `;
            this.elements.groupMemberList.appendChild(memberItem);
        });
        this.elements.groupModal.show();
    }

    async createGroup() {
        const groupName = this.elements.groupNameInput.value.trim();
        if (!groupName) {
            alert('Por favor, digite um nome para o grupo.');
            return;
        }

        const allMemberInputs = this.elements.groupMemberList.querySelectorAll('input[type="checkbox"]');
        const selectedMembers = [];
        allMemberInputs.forEach(input => {
            if (input.checked) {
                selectedMembers.push(input.value);
            }
        });

        if (selectedMembers.length < 2) {
            alert('Para criar um grupo, você precisa selecionar pelo menos dois usuários.');
            return;
        }

        const allMembers = [this.currentUser.nome_completo, ...selectedMembers];

        const newGroup = {
            name: groupName,
            members: allMembers
        };

        this.currentUser.chat.groups.push(newGroup);
        this.currentUser.chat.messages[groupName] = [];

        try {
            await this.usuarioService.atualizarUsuario(this.currentUser.id, this.currentUser);
            this.renderContactList();
            this.openChat(groupName);
            this.elements.groupModal.hide();
            this.elements.groupNameInput.value = '';
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
            alert("Falha ao criar grupo.");
            this.currentUser.chat.groups.pop();
            delete this.currentUser.chat.messages[groupName];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});