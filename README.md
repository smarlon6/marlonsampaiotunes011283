# PET-MT — Registro Público de Pets e Tutores  
**Projeto Avaliativo — Desenvolvedor Front End (SPA React)**

Este projeto consiste em uma **Single Page Application (SPA)** desenvolvida em **React + TypeScript**, cujo objetivo é consumir a **API pública de registro de Pets e Tutores** do Estado de Mato Grosso, avaliando a capacidade do candidato em **cadastrar, editar, excluir e apresentar dados**, seguindo boas práticas de arquitetura, organização e escalabilidade.

API oficial (Swagger):  
👉 https://pet-manager-api.geia.vip/q/swagger-ui/

Link Vercel (aplicação rodando)
https://marlonsampaiotunes011283.vercel.app/login

---

## 1. Dados da Inscrição

- **Projeto:** PET-MT — Registro Público de Pets  
- **Vaga:** Desenvolvedor Front End  
- **Tecnologia escolhida:** React (SPA)  
- **Autor:** Marlon Sampaio Tunes  
- **Repositório:** https://github.com/smarlon6/marlonsampaiotunes011283  

---

## 2. Visão Geral da Aplicação

A aplicação permite:

- Listar pets cadastrados em formato de **cards**
- Buscar pets por nome
- Paginar resultados
- Visualizar detalhes completos de um pet
- Cadastrar, editar e excluir pets
- Cadastrar, editar e gerenciar tutores
- Vincular e desvincular pets a tutores
- Autenticação com **JWT (access + refresh token)**
- Execução totalmente **containerizada com Docker**

---

## 3. Arquitetura da Solução

A aplicação segue uma arquitetura **em camadas**, priorizando **manutenibilidade, extensibilidade e separação de responsabilidades**:

### Camadas principais

- **UI / Pages (React)**
  - Responsável pela renderização e interação do usuário

- **State Management (RxJS + BehaviorSubject)**
  - Stores reativos por feature (`pets.store.ts`, `auth.store.ts`, etc.)

- **Facade (Camada de acesso à API)**
  - Encapsula toda comunicação HTTP (`pets.facade.ts`, `tutores.facade.ts`, `auth.facade.ts`)

- **Infra / Lib**
  - Configuração HTTP centralizada com interceptors (`http.ts`)
  - Gerenciamento de tokens e autenticação

Essa abordagem facilita:
- Evolução do projeto
- Substituição de API
- Testes
- Reuso de código

---

## 4. Tecnologias Utilizadas

- **React** (SPA)
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **Axios**
- **RxJS / BehaviorSubject**
- **Docker**
- **Docker Compose**
- **Nginx (proxy reverso + SPA)**

---

## 5. Organização do Projeto

Estrutura baseada em **features**, conforme boas práticas de projetos escaláveis:

src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
│
├── assets/
│   └── imagens, ícones e arquivos estáticos
│
├── features/
│   ├── auth/
│   │   ├── api/        # Comunicação com endpoints de autenticação
│   │   ├── pages/      # Telas de login e autenticação
│   │   └── state/      # Gerenciamento de estado (BehaviorSubject)
│   │
│   ├── pets/
│   │   ├── api/        # Facade de acesso à API de pets
│   │   ├── components/# Componentes reutilizáveis (cards, formulários)
│   │   ├── pages/      # Listagem, detalhamento e edição de pets
│   │   ├── state/      # Estado global de pets (BehaviorSubject)
│   │   └── types/      # Tipagens TypeScript
│   │
│   └── tutores/
│       ├── api/        # Facade de acesso à API de tutores
│       ├── pages/      # Cadastro, edição e vínculo pet-tutor
│       └── state/      # Gerenciamento de estado dos tutores
│
├── lib/
│   ├── http.ts         # Cliente HTTP (Axios + interceptors)
│   ├── tokenStorage.ts# Persistência e controle de tokens
│   └── helpers        # Funções utilitárias
│
├── pages/
│   └── Páginas globais (fallbacks, erros, etc.)
│
├── shared/
│   └── components/
│       ├── Sidebar.tsx
│       ├── Topbar.tsx
│       └── Componentes compartilhados da UI
│
└── tests/
    └── Testes unitários básicos (ex: componentes e páginas)
    

## 6. Atendimento aos Requisitos do Edital

### ✅ Requisitos Gerais

| Requisito | Status |
|----------|-------|
Requisição em tempo real (Axios) | ✅ |
Layout responsivo | ✅ |
TailwindCSS | ✅ |
Lazy Loading de rotas | ✅ |
Paginação | ✅ |
TypeScript | ✅ |
Boas práticas e componentização | ✅ |
Testes unitários básicos | ✅ |

---

### ✅ Requisitos Específicos

#### 1. Tela Inicial — Listagem de Pets
- `GET /v1/pets`
- Cards com foto, nome, raça e idade
- Paginação (10 por página)
- Busca por nome

#### 2. Tela de Detalhamento do Pet
- Navegação por clique no card
- `GET /v1/pets/{id}`
- Exibição de tutores vinculados
- Destaque visual para o nome do pet

#### 3. Cadastro/Edição de Pet
- `POST /v1/pets`
- `PUT /v1/pets/{id}`
- Campos: nome, espécie, idade, raça
- Upload de foto
- Máscaras e validações básicas

#### 4. Cadastro/Edição de Tutor
- `POST /v1/tutores`
- `PUT /v1/tutores/{id}`
- Campos completos (nome, telefone, endereço, email, cpf)
- Upload de foto
- Vinculação e remoção de pets

#### 5. Autenticação
- Login via `POST /autenticacao/login`
- Refresh token via `PUT /autenticacao/refresh`
- Rotas protegidas
- Logout automático em caso de token inválido

---

## 7. Requisitos Sênior

### a) Health Checks / Liveness / Readiness
- Aplicação containerizada com Nginx
- Ambiente validado via inicialização correta do container
- Proxy funcional para API externa

### b) Testes Unitários
- Testes básicos incluídos para componentes
- Estrutura preparada para expansão de cobertura

### c) Padrão Facade + BehaviorSubject
- Facades para acesso à API
- Estado centralizado e reativo com RxJS
- Separação clara entre UI, estado e infraestrutura

---

## 8. Infraestrutura e DevOps (Docker)

O projeto foi **totalmente containerizado**, sem necessidade de Node.js local.

### Tecnologias
- **Docker**
- **Docker Compose**
- **Nginx** como servidor de produção
- Proxy reverso para a API pública

---

## 9. Como Executar o Projeto

### Pré-requisitos
- Git
- Docker Desktop (20.10+)
- Docker Compose (v2+)

### Passos

```bash
git clone https://github.com/smarlon6/marlonsampaiotunes011283
cd marlonsampaiotunes011283
docker compose up -d --build

Acesse:
👉 http://localhost:8080
