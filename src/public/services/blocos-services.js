export class BlocosCarnaval {

    constructor() {
        this.urlBase = "/blocos";
    }

    async getBlocos() {
        const resposta = await fetch(this.urlBase);
        return resposta.json();
    }

    async getBloco(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`);
        return resposta.json();
    }

    async novoBloco(bloco) {
        const resposta = await fetch(this.urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bloco),
        });
        return resposta.json();
    }

    async atualizarBloco(id, bloco) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bloco),
        });
        return resposta.json();
    }

    async excluirBloco(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "DELETE",
        });
        return resposta.json();
    }
}

export class Usuarios {

    constructor() {
        this.urlBase = "/usuarios";
    }

    async getUsuarios() {
        const resposta = await fetch(this.urlBase);
        return resposta.json();
    }

    async getUsuario(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`);
        return resposta.json();
    }

    async novoUsuario(usuario) {
        const resposta = await fetch(this.urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        return resposta.json();
    }

    async atualizarUsuario(id, usuario) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        return resposta.json();
    }

    async excluirUsuario(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "DELETE",
        });
        return resposta.json();
    }
}

export class Denuncias {

    constructor() {
        this.urlBase = "/denuncias";
    }

    async getDenuncias() {
        const resposta = await fetch(this.urlBase);
        return resposta.json();
    }

    async novaDenuncia(denuncia) {
        const resposta = await fetch(this.urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(denuncia),
        });
        return resposta.json();
    }
}

export class Comentarios {

    constructor() {
        this.urlBase = "/comentarios";
    }

    async getComentarios() {
        const resposta = await fetch(this.urlBase);
        return resposta.json();
    }

    async getComentario(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`);
        return resposta.json();
    }

    async novoComentario(comentario) {
        const resposta = await fetch(this.urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comentario),
        });
        return resposta.json();
    }

    async atualizarComentario(id, comentario) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(comentario),
        });
        return resposta.json();
    }

    async excluirComentario(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "DELETE",
        });
        return resposta.json();
    }
}

export class Chat {

    constructor() {
        this.urlBase = "/chat";
    }

    async getChats() {
        const resposta = await fetch(this.urlBase);
        return resposta.json();
    }

    async getChat(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`);
        return resposta.json();
    }

    async novoChat(chat) {
        const resposta = await fetch(this.urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chat),
        });
        return resposta.json();
    }

    async atualizarChat(id, chat) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(chat),
        });
        return resposta.json();
    }

    async excluirChat(id) {
        const resposta = await fetch(`${this.urlBase}/${id}`, {
            method: "DELETE",
        });
        return resposta.json();
    }
}