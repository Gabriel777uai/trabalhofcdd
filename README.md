# Estoque Inteligente - Frontend

![Banner](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

O **Estoque Inteligente** é um sistema moderno de gestão de estoque e vendas, projetado para oferecer controle total sobre produtos, clientes, fornecedores e transações financeiras. Esta é a interface frontend da aplicação, focada em uma experiência de usuário fluida e responsiva.

---

## 🚀 Funcionalidades Principais

- **📦 Gestão de Estoque**: Cadastro, edição e visualização detalhada de produtos com alertas de estoque mínimo e ideal.
- **💰 PDV (Ponto de Venda)**: Interface otimizada para vendas rápidas, com controle de carrinho e finalização de pedidos.
- **👥 Cadastro de Clientes & Fornecedores**: Gerenciamento completo de parceiros comerciais.
- **📊 Relatórios & Dashboards**: Visualização gráfica de desempenho e fluxos de caixa.
- **🔐 Controle de Acesso**: Autenticação segura via JWT com níveis de acesso (roles) dinâmicos.
- **⚙️ Configurações**: Personalização do sistema e gestão de usuários.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as melhores práticas de desenvolvimento web moderno:

- **HTML5 & CSS3**: Estrutura e estilização customizada.
- **Bootstrap 5**: Framework CSS para layout responsivo e componentes modernos.
- **JavaScript (ES6+)**: Lógica de interface e manipulação dinâmica do DOM.
- **jQuery**: Utilizado para simplificar interações e chamadas AJAX.
- **JWT (JSON Web Tokens)**: Segurança e autenticação no tráfego de dados.
- **SweetAlert2**: Modais elegantes para feedback operacional.
- **Bootstrap Icons**: Conjunto de ícones semânticos.

---

## 📁 Estrutura do Projeto

```text
trabalhofcdd/
├── assets/             # Recursos estáticos
│   ├── css/            # Estilos customizados (login, inicial, vendas)
│   ├── js/             # Lógica JavaScript por módulo
│   ├── img/            # Imagens e logotipos
│   └── vendor/         # Bibliotecas de terceiros (Bootstrap, jQuery)
├── pages/              # Páginas HTML dos módulos internos
├── index.html          # Página de Login (entrada)
├── recuperation.html   # Recuperação de senha
└── manifest.json       # Configurações de PWA/Web App
```

---

## 🏁 Como Começar

### Pré-requisitos
Como este é um projeto frontend estático, você só precisa de um servidor web local (como WAMP, XAMPP ou a extensão Live Server do VS Code).

### Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/Gabriel777uai/trabalhofcdd.git
   ```
2. Navegue até a pasta do projeto:
   ```bash
   cd trabalhofcdd
   ```
3. Abra o `index.html` em seu servidor local.

> [!IMPORTANT]
> Certifique-se de que o backend esteja rodando e que as URLs das chamadas AJAX nos arquivos `assets/js/*.js` estejam apontando para o servidor correto.

---

## 🔐 Autenticação e Segurança

O sistema utiliza **JWT (JSON Web Token)** para garantir que apenas usuários autorizados acessem os dados. 
- O token é armazenado localmente e enviado no cabeçalho `Authorization` de cada requisição.
- O arquivo `menu_roles.js` gerencia a visibilidade dos menus baseando-se no papel (role) do usuário logado.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por [Gabriel](https://github.com/Gabriel777uai) e equipe.
