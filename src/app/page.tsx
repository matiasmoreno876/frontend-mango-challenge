import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-[40rem] px-4 py-8">
      <h1>Mango Range</h1>
      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>
          <Link href="/exercise1">Exercise 1: normal range</Link>
        </li>
        <li>
          <Link href="/exercise2">Exercise 2: fixed values range</Link>
        </li>
      </ul>
    </main>
  );
}
