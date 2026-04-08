import React, { useState } from 'react';
import { MessageSquare, StickyNote, Plus, X, ThumbsUp, Reply } from 'lucide-react';

interface CommentsPanelProps {
  paperId: string;
}

export function CommentsPanel({ paperId }: CommentsPanelProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'notes'>('comments');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');

  const mockComments = [
    {
      id: '1',
      author: '张涵',
      avatar: '张',
      content: 'This attention mechanism is quite innovative. Worth exploring further in our research.',
      timestamp: '2 hours ago',
      likes: 3,
    },
    {
      id: '2',
      author: '李明',
      avatar: '李',
      content: 'The multi-head attention concept could be applied to our current project.',
      timestamp: '1 day ago',
      likes: 5,
    },
    {
      id: '3',
      author: 'John Smith',
      avatar: 'J',
      content: 'Great explanation of the encoder-decoder architecture. The residual connections are key.',
      timestamp: '2 days ago',
      likes: 2,
    },
  ];

  const mockNotes = [
    {
      id: '1',
      content: 'Key insight: Self-attention allows parallel computation unlike RNNs.',
      timestamp: '3 hours ago',
      color: 'yellow',
    },
    {
      id: '2',
      content: 'Compare this approach with BERT and GPT architectures.',
      timestamp: '1 day ago',
      color: 'yellow',
    },
    {
      id: '3',
      content: 'TODO: Implement scaled dot-product attention in our model.',
      timestamp: '2 days ago',
      color: 'blue',
    },
  ];

  const handleAdd = () => {
    if (newContent.trim()) {
      // In real app, this would save to backend
      console.log('Adding:', activeTab, newContent);
      setNewContent('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'comments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Comments</span>
              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                {mockComments.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <StickyNote className="w-4 h-4" />
              <span>Notes</span>
              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                {mockNotes.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'comments' ? (
          <div className="space-y-4">
            {mockComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
              </div>
            ) : (
              mockComments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      {comment.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-11 mt-2">
                    <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors">
                      <Reply className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {mockNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <StickyNote className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No notes yet</p>
                <p className="text-xs text-gray-400 mt-1">Create your first note</p>
              </div>
            ) : (
              mockNotes.map((note) => (
                <div 
                  key={note.id} 
                  className={`rounded-lg p-3 border ${
                    note.color === 'yellow' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-blue-50 border-blue-200'
                  } hover:shadow-sm transition-shadow group`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm text-gray-800 leading-relaxed flex-1">
                      {note.content}
                    </p>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">{note.timestamp}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'comments' ? 'Comment' : 'Note'}</span>
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder={`Write a ${activeTab === 'comments' ? 'comment' : 'note'}...`}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewContent('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}