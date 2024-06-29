import ChatWrapper from '@/components/chat/chat-wrapper';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 pb-6 pt-8 backdrop-blur-2xl dark:from-inherit bg-grid-zinc-50'>
      <div className='z-10 md:max-w-2xl items-center justify-center font-mono text-sm w-[99vw] h-full'>
        <ChatWrapper />
      </div>
    </main>
  );
}
