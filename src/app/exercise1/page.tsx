import Link from 'next/link';
import { connection } from 'next/server';
import { Range } from '@/components/organisms/Range/Range';
import { getRange } from '@/services/range';

export default async function Exercise1Page() {
  // Fetch at request time: the mock API is served by this same app, so it is not up during `next build`.
  await connection();
  const { min, max } = await getRange();

  return (
    <main className="mx-auto max-w-[40rem] px-4 py-8">
      <h1>Exercise 1: normal range</h1>
      <Range min={min} max={max} />
      <Link href="/">Back</Link>
    </main>
  );
}
