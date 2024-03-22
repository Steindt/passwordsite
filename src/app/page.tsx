import Textfield from '@/components/Textfield';
import styles from './page.module.css'
import { redirect } from 'next/navigation';

export default function Home() {
  const getUser = async (formData: FormData) => {
    "use server";

    redirect("search?username=" + formData.get("result"));
  }

  return (
    <main className={styles.main}>
      <h1>You are authenticated! </h1>
      <Textfield buttonText={"Search"} placeholder={"Username"} func={getUser}/>
      {/* <form action={getUser}>
        <input type="text" name="username" required></input>
        <button type="submit">Search</button>
      </form> */}
    </main>
  );
}
