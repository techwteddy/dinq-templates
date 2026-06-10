import WeddingStory from '@/components/wedding/WeddingStory';
import ClientOnly from '@/components/ClientOnly';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <ClientOnly fallback={
        <div className="w-full h-screen bg-gradient-to-br from-dusty-blue to-blue-300 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-script mb-4">Koketso 💙 Neo</h1>
            <p className="text-lg font-body">Loading our story...</p>
          </div>
        </div>
      }>
        <WeddingStory />
      </ClientOnly>
    </main>
  );
}
