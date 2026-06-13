'use client';
/**
 * src/app/(app)/settings/export/page.tsx
 * Página de exportación dentro de ajustes.
 */

import ExportPanel from '@/components/export/ExportPanel';

export default function ExportPage() {
  return (
    <main style={{ padding: '16px', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{
        fontSize: 22, fontWeight: 800, color: '#f4f4f5',
        marginBottom: 20,
      }}>
        Exportar datos
      </h1>
      <ExportPanel />
    </main>
  );
}
