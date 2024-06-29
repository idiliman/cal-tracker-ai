import ChatWrapper from '@/components/chat/chat-wrapper';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 md:pb-6 md:pt-8 pt-1 pb-1 backdrop-blur-2xl dark:from-inherit bg-grid-zinc-50'>
      <div className='z-10 md:max-w-2xl items-center justify-center font-mono text-sm w-[100vw] h-full'>
        <ChatWrapper />
      </div>
    </main>
  );
}
