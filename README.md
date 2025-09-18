# Ótica Isis - E-commerce

Um e-commerce moderno para ótica desenvolvido com React, TypeScript, Vite e integração com Shopify Storefront API.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **Shopify Storefront API** - API para integração com loja Shopify
- **Supabase** - Backend como serviço para autenticação e dados
- **React Router** - Roteamento para aplicações React
- **Zustand** - Gerenciamento de estado
- **Lucide React** - Ícones modernos

## 📦 Funcionalidades

- ✅ Catálogo de produtos integrado com Shopify
- ✅ Carrinho de compras com Shopify Cart API
- ✅ Checkout redirecionado para Shopify
- ✅ Autenticação de usuários com Supabase
- ✅ Design responsivo e moderno
- ✅ Busca e filtros de produtos
- ✅ Lista de desejos
- ✅ Páginas de produto detalhadas

## ⚙️ Configuração do Ambiente

### 1. Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd shopify

# Instale as dependências
npm install
```

### 2. Configuração do Shopify

Para integrar com sua loja Shopify, você precisa configurar as seguintes variáveis de ambiente:

1. **Crie um arquivo `.env` na raiz do projeto:**

```env
# Shopify Storefront API
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=5b813100797e5a0bbce8bf21d862cdd4
VITE_SHOPIFY_DOMAIN=otica-isis.myshopify.com
```

**⚠️ Token Configurado**: O token `5b813100797e5a0bbce8bf21d862cdd4` já está configurado no projeto. Se você precisar usar um token diferente, substitua o valor no arquivo `.env`.

2. **Como obter as credenciais do Shopify:**

   **a) Storefront Access Token:**
   - Acesse o painel administrativo da sua loja Shopify
   - Vá em `Apps` → `Manage private apps` (ou `Apps and sales channels` → `Develop apps`)
   - Crie uma nova app privada ou use uma existente
   - Na seção `Storefront API`, marque as permissões necessárias:
     - `Read products, variants and collections`
     - `Read customer tags`
     - `Read and modify checkouts`
   - Copie o `Storefront access token`

   **b) Store Domain:**
   - Use o domínio da sua loja no formato: `sua-loja.myshopify.com`
   - Substitua `sua-loja` pelo nome da sua loja

### 3. Configuração do Supabase (Opcional)

Se você quiser usar autenticação e dados adicionais:

```env
# Supabase (opcional)
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
```

### 4. Executar o Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🛍️ Integração com Shopify

Este projeto utiliza a **Shopify Storefront API** para:

- **Produtos**: Busca produtos, coleções e variantes
- **Carrinho**: Criação e gerenciamento do carrinho
- **Checkout**: Redirecionamento para checkout nativo do Shopify

### Fluxo de Compra

1. **Navegação**: Cliente navega pelos produtos
2. **Carrinho**: Adiciona produtos ao carrinho (Shopify Cart API)
3. **Checkout**: Clica em "Finalizar Compra"
4. **Redirecionamento**: É redirecionado para o checkout do Shopify
5. **Pagamento**: Completa o pagamento no Shopify
6. **Confirmação**: Recebe confirmação e e-mails do Shopify

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Cart, Auth)
├── hooks/              # Hooks customizados
├── lib/                # Configurações e serviços
│   └── shopify.ts      # Cliente e serviços Shopify
├── pages/              # Páginas da aplicação
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🚨 Troubleshooting

### Erro: "Storefront access token is invalid"
- Verifique se o token está correto no arquivo `.env`
- Confirme se as permissões da Storefront API estão habilitadas
- Certifique-se de que a app privada está ativa

### Erro: "Store domain not found"
- Verifique se o domínio está no formato correto: `sua-loja.myshopify.com`
- Confirme se a loja está ativa e acessível

### Produtos não aparecem
- Verifique se há produtos publicados na sua loja Shopify
- Confirme se os produtos estão disponíveis no canal "Online Store"
- Verifique as permissões da Storefront API

## 📝 Licença

Este projeto está sob a licença MIT.
