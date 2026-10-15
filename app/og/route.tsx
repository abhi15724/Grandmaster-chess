import { ImageResponse } from 'next/og';
import { SITE_BRAND } from '@/lib/site-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') || 'Play Chess Online Free').slice(0, 90);
  const label = (searchParams.get('label') || 'Free online chess').slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#161512',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          color: '#f4f4f5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 20, height: 56, background: '#81b64c', borderRadius: 6, display: 'flex' }} />
          <div style={{ fontSize: 40, fontWeight: 800, display: 'flex' }}>
            Grandmaster<span style={{ color: '#81b64c' }}>chess</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 26, color: '#81b64c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, display: 'flex' }}>
            {label}
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, display: 'flex' }}>{title}</div>
        </div>
        <div style={{ fontSize: 28, color: '#a1a1aa', display: 'flex' }}>
          {SITE_BRAND.toLowerCase()}.in · Free · No sign-up
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
    }
  );
}
