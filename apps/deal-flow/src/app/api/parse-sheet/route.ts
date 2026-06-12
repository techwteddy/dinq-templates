import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // Google Sheets URL
  const sheetsMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  // Google Drive file URL
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);

  let csvUrl: string;
  if (sheetsMatch) {
    csvUrl = `https://docs.google.com/spreadsheets/d/${sheetsMatch[1]}/export?format=csv`;
  } else if (driveMatch) {
    csvUrl = `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
  } else {
    return NextResponse.json({ error: 'Invalid URL. Paste a Google Sheets or Google Drive file URL.' }, { status: 400 });
  }

  try {
    const res = await fetch(csvUrl, { redirect: 'follow' });
    if (!res.ok) {
      return NextResponse.json({ error: 'Could not fetch file. Make sure it is shared publicly.' }, { status: 400 });
    }
    const text = await res.text();
    return NextResponse.json({ csv: text });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch the file.' }, { status: 500 });
  }
}
