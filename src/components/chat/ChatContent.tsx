import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatContentProps {
  content: string;
  onButtonClick: (buttonText: string) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({ content, onButtonClick }) => {
  // 分割内容和问题列表
  const [markdownContent, questionList] = content.split('QUESTIONLIST:');
  
  // 提取按钮行
  const buttonLines = questionList
    ? questionList.trim().split('\n').map(line => line.trim())
    : [];

  // 处理按钮行，去掉开头的 '-'
  const cleanedButtonLines = buttonLines.map(line => line.replace(/^-\s*/, '').trim());

  return (
    <div className="flex flex-col justify-start">
      <div className="markdown-container overflow-x-auto max-w-96">
        <ReactMarkdown className="rich-text-content break-words">{markdownContent.trim()}</ReactMarkdown>
      </div>
      
      {cleanedButtonLines.length > 0 && 
      <div className="flex flex-col items-start mt-2">
        {cleanedButtonLines.map((line, index) => (
          <div className="flex items-center" key={index}>
            <span className="mr-1 text-blue-600">•</span>
            <a
              key={index}
              href="#"
              className="text-blue-600 hover:underline text-xs mb-1"
              onClick={(e) => {
                e.preventDefault();
                onButtonClick(line);
              }}
            >
              {line}
            </a>
          </div>
        ))}
      </div>
      }
    </div>
  );
};

export default ChatContent;
