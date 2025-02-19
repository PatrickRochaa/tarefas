import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import styles from "./task.module.css";

import { db } from "../../services/firebaseConnection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc
} from "firebase/firestore";

import { TextArea } from "../../components/textArea/textArea";
import { FaTrash } from "react-icons/fa";

// Interface para os dados da tarefa, a qual é passada como prop para o componente
interface TaskProps {
  item: {
    tarefa: string; // Descrição da tarefa
    created: string; // Data de criação da tarefa (em formato string)
    public: boolean; // Indica se a tarefa é pública ou não
    user: string; // Email do usuário responsável pela tarefa
    taskId: string; // ID único da tarefa
  };
  allComments: CommentProps[]; // Lista de comentários da tarefa, que será exibida
}

// Interface para os dados de cada comentário relacionado a uma tarefa
// Esta interface é usada dentro do componente e também no "getServerSideProps" para obter os comentários
interface CommentProps {
  id: string; // ID único do comentário
  comment: string; // Conteúdo do comentário
  taskId: string; // ID da tarefa à qual o comentário pertence
  user: string; // Email do usuário que fez o comentário
  name: string; // Nome do usuário que fez o comentário
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession(); // Pegando a sessão do usuário logado

  const [input, setInput] = useState(""); // Estado para o conteúdo do comentário
  const [comments, setComments] = useState<CommentProps[]>(allComments || []); // Estado para armazenar os comentários

  // Função que lida com a submissão de um novo comentário
  async function handleComment(event: FormEvent) {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página

    if (input === "") return; // Se o campo de comentário estiver vazio, não faz nada

    if (!session?.user?.email || !session?.user?.name) return; // Verifica se o usuário está logado

    try {
      // Adiciona o comentário na coleção 'comments' do Firebase
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      // Cria um objeto para o novo comentário
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      };

      // Atualiza o estado de comentários com o novo comentário
      setComments((oldItems) => [...oldItems, data]);
      setInput(""); // Limpa o campo de entrada de texto
    } catch (err) {
      console.log(err); // Exibe um erro caso algo dê errado
    }
  }

  // Função para deletar um comentário
  async function handleDeletComment(id: string) {
    try {
      // Pega a referência do comentário a ser excluído no Firebase
      const commentRef = doc(db, "comments", id);
      // Deleta o comentário
      await deleteDoc(commentRef);

      // Remove o comentário da lista local de comentários
      const deleteComment = comments.filter((item) => item.id !== id);
      setComments(deleteComment);

      alert("Comentário deletado com sucesso"); // Exibe uma mensagem de sucesso
    } catch (err) {
      console.log(err); // Exibe erro se a operação falhar
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefa - Detalhes da tarefa</title>
      </Head>

      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p> {/* Exibe a tarefa */}
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar comentário</h2>

        <form onSubmit={handleComment}> {/* Formulário para envio de comentário */}
          <TextArea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value) // Atualiza o estado do comentário com o valor digitado
            }
            placeholder="Digite seu comentário..."
          />
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentário
          </button> {/* Botão para enviar o comentário */}
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span> // Exibe mensagem caso não haja comentários
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            {/* Container de cada comentário */}
            <div className={styles.headComment}>
              {/* Container do nome e botão de excluir */}
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button className={styles.buttonTrash}
                  onClick={() => handleDeletComment(item.id)}> {/* Botão para deletar o comentário */}
                  <FaTrash size={18} color="#EA3140" />
                </button>
              )}
            </div>
            <p>{item.comment}</p> {/* Exibe o texto do comentário */}
          </article>
        ))}
      </section>
    </div>
  );
}

// Função que é chamada para recuperar os dados do servidor antes de renderizar a página
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string; // Pega o ID da tarefa que foi passado como parâmetro
  const docRef = doc(db, "tarefas", id); // Pega a referência da tarefa no Firebase

  // Consulta todos os comentários relacionados a essa tarefa no Firebase
  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = []; // Lista de todos os comentários

  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef); // Recupera os dados da tarefa

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }; // Se a tarefa não existir, redireciona para a página inicial
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }; // Se a tarefa não for pública, também redireciona
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000; // Converte o timestamp para data

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(), // Formata a data de criação
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task, // Passa os dados da tarefa como prop
      allComments: allComments, // Passa os comentários como prop
    },
  };
};
