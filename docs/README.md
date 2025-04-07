# Introdução

Informações básicas do projeto.

* **Projeto:** Carnalivre
* **Repositório GitHub:** https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2025-1-ti1-2010200-hermes_sentry.git
* **Membros da equipe:**

1. [Davi Martins de Almeida ](https://github.com/davimartins27)
2. [Henrique Pereira Resende Rocha](https://github.com/Rickyzadas)
3. [João Prado Campos](https://github.com/Joao-Prado0)
4. [Lucas Gabriel de Oliveira Franco](https://github.com/lucasfrgabriel)
5. [Luiz Fernando Cunha Maia](https://github.com/LuizMaia-PUC)
6. [Pedro Henrique Nogueira Ferreira](https://github.com/PedroHNFerreira)

A documentação do projeto é estruturada da seguinte forma:

1. Introdução
2. Contexto
3. Product Discovery
4. Product Design
5. Metodologia
6. Solução
7. Referências Bibliográficas

✅ [Documentação de Design Thinking (MIRO)](files/processo-dt.pdf)

# Contexto

O carnaval é um dos símbolos do nosso país, são cinco dias em que o povo brasileiro se extravaza e faz uma das festas mais bonitas e democráticas do mundo. Marcado pelos blocos de carnaval, música boa e clima quente, a festa atrai milhões de brasileiros para as ruas, além de se tornar uma atração para turistas que pretendem conhecer mais da cultura brasileira. Porém, com o enorme número de pessoas que participam da festa, se torna muito difícil para gestão pública gerenciar a folia, e é nessa dificuldade que nasce a maioria dos problemas relacionados ao feriado.

## Problema

Os principais problemas apontados envolvem a falta de segurança no carnaval, como furtos, brigas e assédios, mas há também diversas dúvidas sobre a organização dos blocos de carnaval, das forças de segurança e de saúde, e da infaestrutura da cidade para eventos grandes.

## Objetivos

A finalidade do CarnaLivre é desenvolver um software para solucionar o problema de falta de informações e segurança sobre o carnaval de Belo Horizonte. Com base nisso, o sistema recebe informações sobre os blocos de carnaval, cadastradas pelos próprios organizadores, analisa e classifica essas informações em categorias, e permite que os usuários acessem essas informações. Além disso, o sistema contém uma seção de comentários para que os foliões compartilhem suas experiências e uma aba dedicada a denúncias, para casos mais graves, promovendo um ambiente mais seguro para todos.

## Justificativa

A escolha do tema segurança no carnaval surgiu devido todos os participantes do grupo conhecerem alguém que já passou por experiencias ruins no carnaval. O carnaval de Belo Horizonte cada vez mais vem crescendo, recebendo uma grande quantidade de pessoas de várias cidades vizinhas, mas junto a esse grande número de foliões, também temos problemas como furtos, assédios, brigas e muita desinformação. Muita gente não sabe onde estão os blocos, quais são mais tranquilos ou como pedir ajuda em caso de problemas. Pensando nisso, pensamos em um sistema simples e acessível que reúne informações dos blocos, permite comentários dos foliões, e ainda oferece uma aba para denúncias, ajudando a criar um carnaval mais seguro, participativo e consciente para todo mundo.

## Público-Alvo

O CarnaLivre é voltado principalmente para dois públicos: os foliões, que buscam informações seguras e atualizadas sobre os blocos de carnaval, além de um canal para compartilhar experiências e fazer denúncias; e os organizadores de blocos, que precisam de uma plataforma prática para divulgar seus eventos, atrair mais público e colaborar com a organização e segurança da festa. Ambos se beneficiam da proposta do sistema, já que ele promove uma comunicação mais clara, fortalece a confiança entre participantes e ajuda a tornar o carnaval mais seguro e bem estruturado para todos.

# Product Discovery

## Etapa de Entendimento

* **Matriz CSD**: ![image](https://github.com/user-attachments/assets/4bf94b56-3c18-4a16-a158-27151bca36a9)
* **Mapa de stakeholders**: ![image](https://github.com/user-attachments/assets/6c6e216a-08ed-40f0-ad9d-577b5977674c)
* **Entrevistas qualitativas**: ![Entendimento - Empatia 2](https://github.com/user-attachments/assets/2d661889-0d63-4fbb-8d73-370dc443b54d)
![Entendimento - Empatia 3](https://github.com/user-attachments/assets/7127e2ff-7eb7-4060-a6cc-665d6db38b94)
* **Highlights de pesquisa**: ![Entendimento - Empatia 4](https://github.com/user-attachments/assets/e6d957b1-2656-41b8-a807-7084f5e28abb)


## Etapa de Definição

### Personas

| Persona 1 | Persona 2 |
| ------- | ------- |
| ![Persona1](https://github.com/user-attachments/assets/608eb868-6b0b-4805-951a-859e422dfe1c) | ![Persona2](https://github.com/user-attachments/assets/0acf91b6-3b52-4b7e-848f-bcedc5c1e41d) |

| Persona 3 | Persona 4 |
| --------- | --------- |
| ![Persona3](https://github.com/user-attachments/assets/89c63d6c-fb77-4865-b414-d6265b5aed04) | ![Persona4](https://github.com/user-attachments/assets/518aa30d-f215-48a9-8383-62bc0e84bded) |

| Persona 5 | Persona 6 |
| --------- | --------- |
| ![Persona5](https://github.com/user-attachments/assets/713ba46f-a926-47dc-b601-a6eae51b5c85) | ![Persona6](https://github.com/user-attachments/assets/92ade2f5-c3c8-4f1e-a17f-f4f8768f3d78) |

# Product Design

Nesse momento, vamos transformar os insights e validações obtidos em soluções tangíveis e utilizáveis. Essa fase envolve a definição de uma proposta de valor, detalhando a prioridade de cada ideia e a consequente criação de wireframes, mockups e protótipos de alta fidelidade, que detalham a interface e a experiência do usuário.

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

| EU COMO...`PERSONA` | QUERO/PRECISO ...`FUNCIONALIDADE`        | PARA ...`MOTIVO/VALOR`               |
| --------------------- | ------------------------------------------ | -------------------------------------- |
| Usuário: Folião   | Preciso do sistema de denuncias do site | Me sentir mais amparada e protegida em caso de qualquer problemas |
| Usuário: Folião   | Um mapa interativo (API Google Maps) | Não me perder pela cidade enquanto procuro os blocos |
| Usuário: Folião   | Um sistema de pesquisa de blocos | Encontrar informações sobre blocos |
| Usuário: Folião   | Filtros de pesquisa | Para selecionar blocos que atendem aos meus interesses e gostos |
| Usuário: Folião   | Ver o feedback dos blocos  | Para saber qual é o mais animado |
| Usuário: Representante de bloco   | Cadastro dos blocos | Divulgar informações sobre o bloco que organiza, e aumentar seu alcance |
| Usuário: Folião   | Categoria e Feedback dos blocos | Para conseguir curtir em segurança com a minha família |
| Usuário: Folião   | Preciso saber quais lugares/ruas estarao fechados e abertos durante o carnaval | Me organizar durante o periodo da folia|
| Usuário: Folião   | Criar grupos de usuários com meus amigos | Conseguirmos nos encontrar com maior facilidade nos blocos |

## Proposta de Valor

##### Proposta para Persona 1: Vitoria

![Proposta1](https://github.com/user-attachments/assets/0e1cee70-13ff-4e2f-b2da-3a54c4142478)


##### Proposta para Persona 2: Juliana

![Proposta2](https://github.com/user-attachments/assets/82bc1070-53f0-4aff-b255-16e1f9d8b38e)


##### Proposta para Persona 3: Guilherme

![Proposta3](https://github.com/user-attachments/assets/3e65bca7-9c17-42fa-a5bf-705a4e5a0d1c)


##### Proposta para Persona 4: Marcelo

![Proposta4](https://github.com/user-attachments/assets/8ae59a5d-7187-4739-a337-0e24c492c852)


##### Proposta para Persona 5: Maria Jeronima

![Proposta5](https://github.com/user-attachments/assets/175589d5-0a7d-463a-bee3-75182abdac15)


##### Proposta para Persona 6: Pedro

![Proposta6](https://github.com/user-attachments/assets/3a58f43a-0980-42ff-ba4c-ff1e6e7d6a58)

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais


| ID     | Descrição do Requisito                                   | Prioridade |
| ------ | ---------------------------------------------------------- | ---------- |
| RF-001 | O sistema deve ter integração com a API do Google Maps, assim proporcionando mapas interativos e informativos. | ALTA |
| RF-003 | O sistema deve permitir que organizadores cadastrem blocos, informando nome, localização, público esperado, faixa etária média, estilo musical e anexando imagens. | MÉDIA |
| RF-002 | O sistema deve armazenar as infromações cadastradas pelos organizadores do bloco e organizar elas nos mapas. | ALTA |
| RF-004 | O site deve conter cadastro diferente para organizadores de bloco, deve exigir email, senha, CNPJ da organização (para verificação),captcha. | MÉDIA |
| RF-005 | O sistema deve conter cadastramento dos demais usuários, solicitando email, nome completo, senha e nome de usuário. | ALTA |
| RF-006 | O sistema deve conter espaço para login daqueles que já possuem conta (Email e senha). | BAIXA |
| RF-007 | O sistema deve permitir que usuários avaliem os blocos com notas de uma a cinco estrelas, façam comentários sobre os blocos e compartilhem as páginas de eventos. | MÉDIA |
| RF-008 | O sistema deve permitir que usuários registrem denúncias informando local, crime ocorrido, horário e bloco associado. | ALTA |
| RF-009 | O sistema deve permitir que usuários pesquisem os blocos por nome. A pesquisa deve também incluir filtros de pesquisa, sendo eles: tamanho do bloco, região, horário, estilo musical, faixa etária, avaliação e se acontece no dia da pesquisa. | MÉDIA |
| RF-010 | O sistema deve ser capaz de validar o CNPJ informado no cadastro dos organizadores, verificando se é válido segundo as regras da Receita Federal. | BAIXA |

### Requisitos não Funcionais
| ID      | Descrição do Requisito                                                             | Prioridade |
| ------- | ---------------------------------------------------------------------------------- | ---------- |
| RNF-001 | Desenvolvimento em HTML, CSS e JavaScript.(código organizado e eficiente). | MÉDIA |
| RNF-002 | Páginas devem abrir em menos de 5 segundos. | BAIXA |
| RNF-003 | Alta usabilidade, tendo em vista o diverso público alvo que o sistema vai atender. | BAIXA |
| RNF-004 | O site deve ser responsivo para as diferentes telas. | BAIXA |
| RNF-005 | O sistema deve garantir 99,5% de uptime mensal, monitorado por ferramentas de observabilidade. | ALTA |

## Projeto de Interface

Artefatos relacionados com a interface e a interacão do usuário na proposta de solução.

### Wireframes

Estes são os protótipos de telas do sistema.

Login
![Tela-Login](https://github.com/user-attachments/assets/8aa11ebf-b199-401d-a9de-3542abedea91)

Cadastro
![Cadastro](https://github.com/user-attachments/assets/270c238f-d574-4a9d-8451-98a1990018c3)

Cadastro do Bloco
![Cadastro-Bloco](https://github.com/user-attachments/assets/60f91d99-9e83-4c27-a8c5-9e6d391e564e)

Home
![Home](https://github.com/user-attachments/assets/a1b41eaa-57f5-4b94-a14c-63c888d57b51)

Blocos
![Blocos](https://github.com/user-attachments/assets/a567e4de-da93-4d65-9c95-fe2d399c6f51)

Descrição dos Blocos
![Descricao-Blocos](https://github.com/user-attachments/assets/2cb67940-55da-4164-ace2-36803c617bc5)

Profile
![Profile](https://github.com/user-attachments/assets/8a33e2b0-2d36-4710-a2a4-05e4461bd3a9)

Login Bloco
![Login Bloco](https://github.com/user-attachments/assets/8066a682-6276-4da2-8871-8918b6829c0e)

Selecionar
![Selecionar](https://github.com/user-attachments/assets/573d1ed3-9860-4a49-8baf-b041d7f3a87c)

Home Bloco
![Home-Bloco](https://github.com/user-attachments/assets/e2f50e16-690d-4764-84c1-0edbf909bf4f)

Denúncia
![Denuncia](https://github.com/user-attachments/assets/d50aa16f-dbb7-459c-a433-3af261d49d0f)

Profile-Bloco
![Profile-Bloco](https://github.com/user-attachments/assets/58d67806-554b-4474-972e-c043a9317559)


### Protótipos de Tela

##### TELA INICIAL

Tela inicial do sistema para login e/ou cadastro de usuário.

![Inicial](https://github.com/user-attachments/assets/09498386-fdab-4db5-8aba-75cff748e9ac)

##### TELA DE CADASTRO: Seleção

Tela para realizar cadastro, solicita ao usuário que informe o tipo de cadastro: bloco ou folião.

![image](https://github.com/user-attachments/assets/c9f8c9bd-2c19-4924-bde2-50625306d5cf)

##### TELA DE CADASTRO: Cadastro

Tela para realizar cadastro de folião ou bloco, solicita ao usuário as informações necessárias para o cadastro.

| Folião | Bloco |
| ----- | ------ |
| ![image](https://github.com/user-attachments/assets/d25e3f6a-5534-4a77-be16-8ab1268ed102) | ![image](https://github.com/user-attachments/assets/644cdab6-abf3-4e7d-b76b-d26e17c256f8) |

##### TELA INICIAL

Tela inicial do sistema, mostra ao usuário informações principais:
- Imangens do bloco, para representantes de bloco
- Mapa para foliões

| Folião | Bloco |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/e1cb34e0-3aac-46a4-965c-6ea18106c84b) | ![image](https://github.com/user-attachments/assets/f7e8b545-e487-4000-bcd8-ae66bc86d02c) |

##### TELA DE CONFIGURAÇÕES

Tela de configurações, permite que o usuário altere sua senha de acesso.

| Folião | Bloco |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/de7d0a6d-cb40-4795-928b-3a653d117468) | ![image](https://github.com/user-attachments/assets/bf7619db-73a3-46df-92ec-484a4bc38a0e) |

##### TELA DE DENÚNCIAS

Tela de denúncias, permite que o usuário realize uma denúncia.

| Folião | Bloco |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/60116bcc-dd33-4374-a21e-5b477b636db0) | ![image](https://github.com/user-attachments/assets/05d3bf2d-93df-4e1b-a89e-4f235cbf7c5f) |

##### TELA DE CONVERSAS

Tela de conversas, permite que o usuário se conecte e converse com outros usuários.

| Folião | Bloco |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/872821b9-e350-4bef-8646-6c0e7dc65cc7) | ![image](https://github.com/user-attachments/assets/ee916703-60d8-4b0d-9f45-257ccae53348) |

##### TELA DE PERFIL

Tela de perfil, permite que o usuário acesse e altere suas configurações do perfil, como foto, nome de usuário, email.

| Folião | Bloco |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/3be8c906-f592-41e6-becd-23eb98397926) | ![image](https://github.com/user-attachments/assets/34bf911c-6b80-4d15-bb32-386762601b86) |

##### TELA DE CONSULTA DE BLOCOS: Folião

Tela de consulta de blocos, permite que o folião veja todos os blocos cadastrados e, ao selecionar um bloco, veja informações detalhadas sobre ele.

| Consulta de blocos | Bloco selecionado |
| ------ | ----- |
| ![image](https://github.com/user-attachments/assets/7752ed48-3840-4302-8dc5-789ccc73d237) | ![image](https://github.com/user-attachments/assets/ef3e2e94-d846-43ae-a449-4d1000bfea06) |


### User Flow

![fluxo de telas](https://github.com/user-attachments/assets/0b7dbdcb-2fb5-4cf6-9572-a56b3f13fe8a)

### Protótipo Interativo

**✳️✳️✳️ COLOQUE AQUI UM IFRAME COM SEU PROTÓTIPO INTERATIVO ✳️✳️✳️**

✅ [Protótipo Interativo (MarvelApp)](https://marvelapp.com/prototype/4hd6091?emb=1&iosapp=false&frameless=false)  ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Um protótipo interativo apresenta o projeto de interfaces e permite ao usuário navegar pelas funcionalidades como se estivesse lidando com o software pronto. Utilize as mesmas ferramentas de construção de wireframes para montagem do seu protótipo interativo. Inclua o link para o protótipo interativo do projeto.

# Metodologia

API do Google Maps
API de clima

## Ferramentas

| Ambiente                    | Plataforma | Link de acesso                                     |
| --------------------------- | ---------- | -------------------------------------------------- |
| Processo de Design Thinking | Miro       |  https://miro.com/app/board/uXjVIZ5HaSk=/?share_link_id=934339239127 |
| Repositório de código     | GitHub     | https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2025-1-ti1-2010200-hermes_sentry |
| Hospedagem do site          | Render     | https://site.render.com/XXXXXXX ⚠️ EXEMPLO ⚠️ |
| Protótipo Interativo       | MarvelApp  | https://marvelapp.com/XXXXXXX ⚠️ EXEMPLO ⚠️   |
|                             |            |                                                    |

## Gerenciamento do Projeto

Divisão de papéis no grupo e apresentação da estrutura da ferramenta de controle de tarefas (Kanban).

![Exemplo de Kanban](images/exemplo-kanban.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Nesta parte do documento, você deve apresentar  o processo de trabalho baseado nas metodologias ágeis, a divisão de papéis e tarefas, as ferramentas empregadas e como foi realizada a gestão de configuração do projeto via GitHub.
>
> Coloque detalhes sobre o processo de Design Thinking e a implementação do Framework Scrum seguido pelo grupo. O grupo poderá fazer uso de ferramentas on-line para acompanhar o andamento do projeto, a execução das tarefas e o status de desenvolvimento da solução.
>
> **Orientações**:
>
> - [Sobre Projects - GitHub Docs](https://docs.github.com/pt/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects)
> - [Gestão de projetos com GitHub | balta.io](https://balta.io/blog/gestao-de-projetos-com-github)
> - [(460) GitHub Projects - YouTube](https://www.youtube.com/playlist?list=PLiO7XHcmTsldZR93nkTFmmWbCEVF_8F5H)
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)

# Solução Implementada

Esta seção apresenta todos os detalhes da solução criada no projeto.

## Vídeo do Projeto

O vídeo a seguir traz uma apresentação do problema que a equipe está tratando e a proposta de solução. ⚠️ EXEMPLO ⚠️

[![Vídeo do projeto](images/video.png)](https://www.youtube.com/embed/70gGoFyGeqQ)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> O video de apresentação é voltado para que o público externo possa conhecer a solução. O formato é livre, sendo importante que seja apresentado o problema e a solução numa linguagem descomplicada e direta.
>
> Inclua um link para o vídeo do projeto.

## Funcionalidades

Esta seção apresenta as funcionalidades da solução.Info

##### Funcionalidade 1 - Cadastro de Contatos ⚠️ EXEMPLO ⚠️

Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#ti_ed_contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login
  * Acesse o menu principal e escolha a opção Cadastros
  * Em seguida, escolha a opção Contatos
* **Tela da funcionalidade**:

![Tela de Funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) titulos e descrição da funcionalidade; (2) Estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

## Estruturas de Dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info

##### Estrutura de Dados - Contatos   ⚠️ EXEMPLO ⚠️

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de Dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema

```json
  {
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    email: "admin@abc.com",
    id: "eed55b91-45be-4f2c-81bc-7686135503f9",
    login: "admin",
    nome: "Administrador do Sistema",
    senha: "123"
  }
```

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação quanto outras estruturas que foram criadas para algum tipo de configuração
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.
>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

## Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) Frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.

# Referências

As referências utilizadas no trabalho foram:

* SOBRENOME, Nome do autor. Título da obra. 8. ed. Cidade: Editora, 2000. 287 p ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESSA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.
>
> **Orientações**:
>
> - [Formato ABNT](https://www.normastecnicas.com/abnt/trabalhos-academicos/referencias/)
> - [Referências Bibliográficas da ABNT](https://comunidade.rockcontent.com/referencia-bibliografica-abnt/)
