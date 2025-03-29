import React from 'react';
import { MessageSquarePlus, Trash2 } from 'lucide-react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversation,
  onSelect,
  onNew,
  onDelete,
}: ConversationListProps) {
  return (
    <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
      <button
        onClick={onNew}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <MessageSquarePlus className="w-4 h-4" />
        New Chat
      </button>
      <div className="mt-4 space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              activeConversation === conv.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSelect(conv.id)}
          >
            <span className="text-sm truncate">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}