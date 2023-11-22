import styles from './page.module.css'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const getUser = async (formData: FormData) => {
    "use server";

    redirect("search?username=" + formData.get("username"));
  }

  return (
    <main className={styles.main}>
      <h1>You are authenticated! </h1>
      <form action={getUser}>
        <input type="text" name="username" required></input>
        <button type="submit">Search</button>
      </form>
    </main>
  );
}
