import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

import heroImg from "../assets/ordem-de-servico.png";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConnection";

interface HomeProps {
  posts: number; // Variável para armazenar a quantidade de posts
  comments: number; // Variável para armazenar a quantidade de comentários
}

export default function Home({ comments, posts }: HomeProps) {
  return (
    <div className={styles.container}>
      {/* Meta informações do cabeçalho da página */}
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil.</title>
      </Head>

      <main className={styles.main}>
        {/* Contêiner da imagem de logo */}
        <div className={styles.logoContent}>
          <Image
            className={styles.hero} // Estilo para a imagem do logo
            alt="logo tarefas+" // Texto alternativo para a imagem
            src={heroImg} // Fonte da imagem
            priority // Marca a imagem como prioridade para o carregamento
          />
        </div>

        {/* Título principal */}
        <h1 className={styles.title}>
          Sistema feito para você organizar
          <br /> seus estudos e tarefas.
        </h1>

        {/* Exibe as informações de quantidade de posts e comentários */}
        <div className={styles.infoContent}>
          <span className={styles.box}>+ {posts} posts</span> {/* Exibe a quantidade de posts */}
          <span className={styles.box}>+ {comments} comentários</span> {/* Exibe a quantidade de comentários */}
        </div>
      </main>
    </div>
  );
}

// Função que busca dados no servidor para popular as propriedades da página
export const getStaticProps: GetStaticProps = async () => {
  // Referências para as coleções de "comments" e "tarefas" no Firebase
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tarefas");

  // Obtendo os documentos de cada coleção
  const commentSnapshot = await getDocs(commentRef); // Snapshot com os comentários
  const postSnapshot = await getDocs(postRef); // Snapshot com os posts

  return {
    props: {
      posts: postSnapshot.size || 0, // Passa a quantidade de posts (tamanho do snapshot)
      comments: commentSnapshot.size || 0, // Passa a quantidade de comentários (tamanho do snapshot)
    },
    revalidate: 60, // Tempo para revalidar os dados em segundos (a cada 60 segundos)
  };
};
