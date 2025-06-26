// assets/js/cadastroo.js
import { BlocosCarnaval } from "../../services/blocos-services.js";
const blocoService = new BlocosCarnaval();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-cadastro');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obter valores dos campos
        const nomeBloco = document.getElementById('fullname').value.trim();
        const nomeResponsavel = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const senha = document.getElementById('password').value.trim();
        
        // Validar campos preenchidos
        if (!nomeBloco || !nomeResponsavel || !email || !cnpj || !senha) {
            alert('Preencha todos os campos');
            return;
        }
        
        // Validar CNPJ (formato básico)
        if (!validarCNPJ(cnpj)) {
            alert('CNPJ inválido. Use o formato 00.000.000/0000-00');
            return;
        }
        
        try {
            // Verificar se email ou CNPJ já existem
            const blocosExistentes = await verificarBlocosExistentes(email, cnpj);
            
            if (blocosExistentes.emailExistente) {
                alert('Este email já está cadastrado');
                return;
            }
            
            if (blocosExistentes.cnpjExistente) {
                alert('Este CNPJ já está cadastrado');
                return;
            }
            
            
            // Criar objeto no formato do JSON Server
            const novoBloco = {
                nome_bloco: nomeBloco,
                descricao_geral: "",
                avaliacao: "",
                data: "",
                publico: "",
                cep: "",
                endereco: "",
                faixa_etaria: "",
                lat: "",
                lng: "",
                estilo_musical: "",
                organizador: [
                    {
                        nome_org: nomeResponsavel,
                        email_org: email,
                        cnpj: cnpj,
                        senha: senha
                    }
                ],
                postagem: [
                    {
                        descricao_card: "",
                        imagens: []
                    }
                ]
            };
            
            // Enviar para o JSON Server
            const response = await blocoService.novoBloco(novoBloco);
            
            if (response && response.id) {
                alert('Bloco cadastrado com sucesso!');
                form.reset();
                window.location.href = 'login.html';
            } else {
                throw new Error('Erro ao cadastrar bloco');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao cadastrar o bloco. Tente novamente.');
        }
    });
    
    // Máscara para CNPJ
    document.getElementById('cnpj').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            value = value.substring(0, 2) + '.' + value.substring(2);
        }
        if (value.length > 6) {
            value = value.substring(0, 6) + '.' + value.substring(6);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '/' + value.substring(10);
        }
        if (value.length > 15) {
            value = value.substring(0, 15) + '-' + value.substring(15, 17);
        }
        
        e.target.value = value;
    });
});

// Função para validar formato do CNPJ
function validarCNPJ(cnpj) {
    const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/;
    return regex.test(cnpj);
}

// Função para verificar se email ou CNPJ já existem
async function verificarBlocosExistentes(email, cnpj) {
    try {
        const blocos = await blocoService.getBlocos();
        
        let emailExistente = false;
        let cnpjExistente = false;
        
        blocos.forEach(bloco => {
            bloco.organizador.forEach(org => {
                if (org.email_org === email) {
                    emailExistente = true;
                }
                if (org.cnpj === cnpj) {
                    cnpjExistente = true;
                }
            });
        });
        
        return { emailExistente, cnpjExistente };
    } catch (error) {
        console.error('Erro ao verificar blocos existentes:', error);
        throw error;
    }
}