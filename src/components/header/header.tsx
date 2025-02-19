// Importa os estilos do arquivo CSS específico para este componente
import styles from "./header.module.css";

// Importa o componente Link do Next.js para navegação sem recarregar a página
import Link from "next/link";

// Importa funções e hooks do NextAuth para autenticação
import { useSession, signIn, signOut } from "next-auth/react";

// Define o componente Header
export function Header() {
  // Obtém os dados da sessão do usuário e o status da autenticação
  const { data: session, status } = useSession();

  return (
    // Define o cabeçalho com a classe CSS correspondente
    <header className={styles.header}>
      <section className={styles.content}>
        {/* Navegação principal do site */}
        <nav className={styles.nav}>
          {/* Link para a página inicial */}
          <Link href="/">
            <h1 className={styles.logo}>
              Tarefas<span>+</span>
            </h1>
          </Link>

          {/* Se o usuário estiver autenticado, exibe o link para o painel */}
          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Meu Painel
            </Link>
          )}
        </nav>

        {/* Controle de exibição do botão de login/logout baseado no status da autenticação */}
        {status === "loading" ? (
          // Se o status for "loading", não exibe nada (pode ser substituído por um indicador de carregamento)
          <></>
        ) : session ? (
          // Se o usuário estiver autenticado, exibe um botão para sair da conta
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá, {session?.user?.name} {/* Exibe o nome do usuário */}
          </button>
        ) : (
          // Se o usuário não estiver autenticado, exibe um botão para fazer login com o Google
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
