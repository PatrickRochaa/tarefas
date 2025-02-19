import { HTMLProps } from "react"; // Importa o tipo HTMLProps do React para definir as propriedades do textarea
import styles from "./textArea.module.css"; // Importa os estilos do arquivo CSS correspondente

// Define o componente TextArea, que recebe todas as propriedades padrão de um <textarea>
export function TextArea({ ...rest }: HTMLProps<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...rest}></textarea>;
  // Retorna um elemento <textarea> com a classe CSS aplicada e todas as propriedades repassadas via rest
}
