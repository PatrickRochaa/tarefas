

# **Projeto Tarefas**  

Este é um projeto para organizar e gerenciar tarefas de forma eficiente, com funcionalidades para criar, visualizar e comentar nas tarefas. O projeto foi desenvolvido como um módulo de Next.js do Matheus Fraga (Sujeito Programador) e usa o Firebase como banco de dados em tempo real.  

---

## **Tecnologias Utilizadas**  

- **Next.js** – Framework React para construção de interfaces rápidas, escaláveis e com renderização do lado do servidor (SSR).  
- **Firebase** – Banco de dados em tempo real para armazenar tarefas e comentários.  
- **React** – Biblioteca JavaScript para construção da interface de usuário.  
- **Firebase Firestore** – Para gerenciar dados em tempo real (tarefas e comentários).  
- **CSS Modules** – Estilização modularizada para evitar conflitos de classes.  
- **NextAuth.js** – Para gerenciar a autenticação de usuários, utilizando o login via Google.  
- **React Icons** – Biblioteca de ícones para melhorar a UI/UX do sistema.  

---

## **Funcionalidades**  

- **Autenticação de Usuário:**  
  - Através do **NextAuth.js**, os usuários podem se autenticar utilizando o Google.  
  - **Somente usuários autenticados podem cadastrar e comentar nas tarefas**.  

- **Gerenciamento de Tarefas:**  
  - O sistema permite **criar e visualizar tarefas**.  

- **Comentários em Tarefas:**  
  - **Apenas usuários logados** podem comentar nas tarefas.  
  - O **usuário que fez o comentário pode excluir seu próprio comentário**.  

- **Interface Responsiva:**  
  - Design adaptável para diferentes tamanhos de tela (**mobile-first**).  

---

## **Outras Informações**  

- **Revalidate:** O projeto utiliza **revalidate** para garantir a atualização dos dados de forma eficiente.  
- **Controle de Acesso:** É **obrigatório estar logado** para cadastrar e comentar nas tarefas.
