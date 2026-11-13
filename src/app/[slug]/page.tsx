import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Stage from '@/components/Stage';
import { SUB_PAGES, TITLES } from '@/lib/routes';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SUB_PAGES.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = TITLES[slug];
  return { title, openGraph: { title, type: 'website' } };
}

export default async function SubPage({ params }: Props) {
  const { slug } = await params;
  if (!SUB_PAGES.includes(slug)) notFound();
  return <Stage slug={slug} />;
}
