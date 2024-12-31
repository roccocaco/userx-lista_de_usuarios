UserX - Lista de Usuários

Este projeto é uma aplicação simples para exibir, filtrar, adicionar e remover usuários em uma lista. A lista é alimentada com dados fictícios de uma API externa, e permite ao usuário realizar busca por nome, filtragem por cidade e adição de novos usuários.

## Funcionalidades Implementadas

- **Exibição de Usuários**: Exibe os dados de usuários (nome, e-mail, cidade) de uma API externa (JSONPlaceholder).
- **Busca por Nome**: O usuário pode buscar por nome, filtrando a lista de usuários em tempo real.
- **Filtragem por Cidade**: Permite filtrar os usuários por cidade.
- **Adicionar Novo Usuário**: Permite adicionar um novo usuário à lista, com campos para nome, e-mail e cidade.
- **Remover Usuário**: Cada usuário tem um botão de "Remover" que, ao ser clicado, remove o usuário da lista.
- **Persistência de Dados**: Utiliza `localStorage` para salvar a consulta de busca e a filtragem por cidade, garantindo que o estado da aplicação seja mantido após recarregar a página.
- **Interface Responsiva**: A interface se adapta para dispositivos móveis, com ajustes no layout para telas menores.

## Como Executar o Projeto

1. **Clonar o repositório**:
2. **Abrir o arquivo `index.html`**:
   Abra o arquivo `index.html` diretamente em seu navegador para visualizar a aplicação.
3. **Pré-requisitos**:

- Nenhum backend necessário. Os dados são consumidos diretamente de uma API pública (JSONPlaceholder).

## Como Funciona

### Buscar por Nome

Digite o nome do usuário desejado no campo de busca. A lista será filtrada conforme o texto inserido.

### Filtrar por Cidade

Selecione uma cidade no menu de filtragem. A lista de usuários será atualizada para exibir apenas os usuários dessa cidade.

### Adicionar Usuário

Clique no botão **Adicionar Usuário**, preencha o nome, e-mail e cidade do novo usuário, e clique em **Adicionar** para adicioná-lo à lista.

### Remover Usuário

Clique no botão **Remover** ao lado de qualquer usuário para removê-lo da lista.

## Notas para Expansão

- **Validação de Dados**: Atualmente, a validação de dados do usuário é simples. A validação pode ser expandida para garantir que o e-mail seja válido, por exemplo.
- **Armazenamento Backend**: No momento, os usuários são armazenados localmente no navegador. Para expandir a aplicação, considere integrar um banco de dados real para persistir os dados dos usuários.
- **Autenticação de Usuário**: Para uma versão mais avançada, seria interessante adicionar autenticação de usuário para que cada usuário tenha seu próprio conjunto de dados.
- **Melhorias na UI/UX**: A interface pode ser aprimorada com a utilização de bibliotecas de UI, como o **Material UI** ou **Bootstrap**, para tornar o design mais robusto e moderno.
- **Paginação**: Quando a lista de usuários crescer, a adição de paginação ajudará a melhorar a performance e a experiência do usuário.

## Arquivos do Projeto

- **HTML5**: Estruturação da página.
- **CSS3**: Estilização responsiva e animações.
- **JavaScript**: Lógica de filtragem, busca, adição e remoção de usuários.
- **API Externa**: Dados dos usuários são carregados a partir da API pública JSONPlaceholder.
