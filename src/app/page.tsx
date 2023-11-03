import Image from 'next/image'
import styles from './page.module.css'
import { cookies } from 'next/headers';
import Auth from '@/components/Auth';
import { redirect, useSearchParams } from 'next/navigation';

export default function Home() {
  if (cookies().get("accessToken") === undefined) {
    redirect("auth");
  }

  return (
    <main className={styles.main}>
    </main>
  )
}
