import Link from 'next/link';
import { connection } from 'next/server';
import { Range } from '@/components/organisms/Range/Range';
import { getRangeValues } from '@/services/range';

export default async function Exercise2Page() {
  // Fetch at request time: the mock API is served by this same app, so it is not up during `next build`.
  await connection();
  const values = await getRangeValues();

  return (
    <main className="mx-auto max-w-[40rem] px-4 py-8">
      <h1>Exercise 2: fixed values range</h1>
      <Range values={values} />
      <Link href="/">Back</Link>
    </main>
  );
}
