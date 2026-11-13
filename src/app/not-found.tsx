import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 16 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--ys-f-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 56, margin: 0, color: '#fff' }}>
          PAGE NOT FOUND
        </h1>
        <p>
          <Link href="/" style={{ color: '#a6a6a6' }}>
            Back home
          </Link>
        </p>
      </div>
    </main>
  );
}
