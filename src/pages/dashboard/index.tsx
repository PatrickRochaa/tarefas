import { GetServerSideProps } from "next";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { TextArea } from "../../components/textArea/textArea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

// Conexão com Firebase
import { db } from "../../services/firebaseConnection";

// Métodos do Firestore
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

// Definição das propriedades do usuário
interface HomeProps {
  user: {
    email: string;
  };
}

// Definição da estrutura de uma tarefa
interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  // Estado para armazenar a nova tarefa
  const [input, setInput] = useState("");
  // Estado para verificar se a tarefa é pública
  const [publicTask, setPublicTask] = useState(false);
  // Estado para armazenar as tarefas do usuário
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  // useEffect para buscar as tarefas do usuário logado no Firestore
  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas"); // Referência à coleção "tarefas"
      const q = query(
        tarefasRef,
        orderBy("created", "desc"), // Ordena por data de criação (mais recentes primeiro)
        where("user", "==", user?.email) // Filtra apenas as tarefas do usuário logado
      );

      // Observa mudanças na coleção de tarefas em tempo real
      onSnapshot(q, (snapshot) => {
        let lista = [] as TasksProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            created: doc.data().created,
            public: doc.data().public,
            tarefa: doc.data().tarefa,
            user: doc.data().user,
          });
        });
        setTasks(lista); // Atualiza o estado com as tarefas do usuário
      });
    }
    loadTarefas();
  }, [user?.email]);

  // Função para marcar/desmarcar a opção "tarefa pública"
  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  // Função para adicionar uma nova tarefa ao Firestore
  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") {
      alert("Não é possível adicionar tarefa vazia"); // Evita adicionar tarefas vazias
      return;
    }

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user.email,
        public: publicTask,
      });

      setInput(""); // Limpa o campo de entrada
      setPublicTask(false); // Reseta o checkbox
      alert("Tarefa adicionada com sucesso!");
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  }

  // Função para copiar o link da tarefa pública para a área de transferência
  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );
    alert("URL Copiada com sucesso!");
  }

  // Função para deletar uma tarefa
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
    alert("Tarefa deletada com sucesso!");
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className={styles.main}>
        {/* Área de adição de tarefa */}
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Nova tarefa</h1>
            <form onSubmit={handleRegisterTask}>
              <TextArea
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
                placeholder="Digite sua nova tarefa..."
              />
              <div className={styles.checkBoxArea}>
                <input
                  type="checkbox"
                  id="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label htmlFor="checkbox">Deixar tarefa pública</label>
              </div>

              <button className={styles.button} type="submit">
                Adicionar
              </button>
            </form>
          </div>
        </section>

        {/* Área que exibe as tarefas */}
        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>
          {tasks.map((item) => (
            <article key={item.id} className={styles.task}>
              {/* Indica quando a tarefa é pública */}
              {item.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICO</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(item.id)}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {item.public ? (
                  <Link href={`/task/${item.id}`}>
                    <p>{item.tarefa}</p>
                  </Link>
                ) : (
                  <p>{item.tarefa}</p>
                )}

                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(item.id)}
                >
                  <FaTrash size={24} color="#ea3140" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

// Função que roda no servidor antes de renderizar a página
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
