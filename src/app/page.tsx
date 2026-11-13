import type { Metadata } from 'next';
import Stage from '@/components/Stage';
import { TITLES } from '@/lib/routes';

export const metadata: Metadata = { title: TITLES[''] };

export default function Home() {
  return <Stage slug="" />;
}
