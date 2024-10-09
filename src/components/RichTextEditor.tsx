import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  initialValue: string;
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onSave }) => {
  const [content, setContent] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  // 添加取消编辑的处理函数
  const handleCancel = () => {
    setContent(initialValue);
    setIsEditing(false);
  };

  return (
    <div className="rich-text-editor text-xs">
      {isEditing ? (
        <>
          <ReactQuill theme="snow" value={content} onChange={setContent} />
          <div className="flex space-x-2 mt-2">
            <button onClick={handleSave} className="text-xs px-4 py-1 bg-blue-500 text-white rounded-full">
              保存
            </button>
            <button onClick={handleCancel} className="text-xs px-4 py-1 bg-gray-300 text-gray-700 rounded-full">
              取消
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            onDoubleClick={() => setIsEditing(true)}
            className=" rich-text-content"
            dangerouslySetInnerHTML={{ __html: content || 'Double click to edit...' }}
          />
          
        </>
      )}
    </div>
  );
};

export default RichTextEditor;