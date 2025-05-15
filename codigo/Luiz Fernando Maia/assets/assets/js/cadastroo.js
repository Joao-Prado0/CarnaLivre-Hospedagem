document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.querySelector('form');
    
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const usuario = {
            nomeCompleto: document.getElementById('fullname').value,
            nomeUsuario: document.getElementById('username').value,
            email: document.getElementById('email').value,
            dataNascimento: document.getElementById('birthdate').value,
            senha: document.getElementById('password').value
        };
        
        
        if (!validarCampos(usuario)) {
            return;
        }
        
        
        armazenarLocalmente(usuario);
        
        
        enviarParaJSON(usuario);
    });
    
    function validarCampos(usuario) {
        if (!usuario.nomeCompleto || !usuario.nomeUsuario || !usuario.email || !usuario.dataNascimento || !usuario.senha) {
            alert('Por favor, preencha todos os campos!');
            return false;
        }
        
        if (usuario.senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return false;
        }
        
        if (!validarEmail(usuario.email)) {
            alert('Por favor, insira um e-mail válido!');
            return false;
        }
        
        return true;
    }
    
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function armazenarLocalmente(usuario) {
        
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        
        const usuarioExistente = usuarios.find(u => u.email === usuario.email || u.nomeUsuario === usuario.nomeUsuario);
        
        if (usuarioExistente) {
            alert('Este e-mail ou nome de usuário já está cadastrado!');
            return;
        }
        
        
        usuarios.push(usuario);
        
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        alert('Cadastro realizado com sucesso!');
        formCadastro.reset();
    }
    
    function enviarParaJSON(bloco) {
    fetch('/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bloco)
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => { throw new Error(data.mensagem); });
        }
        return res.json();
    })
    .then(data => {
        alert(data.mensagem); // Só mostra se quiser
    })
    .catch(err => {
        alert('Erro: ' + err.message);
    });
}

});

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
}
document.querySelector("form").addEventListener("submit", function (e) {
    const cnpjInput = document.querySelector("#cnpj");
    const cnpjValue = cnpjInput.value;

    if (!validarCNPJ(cnpjValue)) {
        e.preventDefault(); 
        cnpjInput.setCustomValidity("CNPJ inválido.Tente novamente.");
        cnpjInput.reportValidity(); 
    } else {
        cnpjInput.setCustomValidity(""); 
    }
});
const dados = {
  nomeDoBloco: "Bloco da Alegria",
  nomeDoResponsavel: "Maria Silva",
  email: "maria@email.com",
  cnpj: "12345678000100",
  senha: "123456"
};

fetch('http://localhost:3000/blocos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dados)
})
.then(res => {
  if (res.ok) {
    alert("Bloco cadastrado com sucesso!");
  } else {
    alert("Erro ao cadastrar.");
  }
});
