'use client';

import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';

export default function ChatInput() {
  const [message, setMessage] = React.useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const addMessage = () => {
    setMessage('');
  };

  return (
    <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
      <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
        <div className='relative flex flex-col w-full flex-grow p-4'>
          <div className='relative'>
            <Textarea
              rows={1}
              ref={textareaRef}
              autoFocus
              onChange={handleInputChange}
              value={message}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addMessage();
                  textareaRef.current?.focus();
                }
              }}
              placeholder='Enter your question...'
              className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
            />

            <Button
              disabled={false}
              className='absolute bottom-1.5 right-[8px]'
              aria-label='send message'
              onClick={() => {
                addMessage();
                textareaRef.current?.focus();
              }}
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
