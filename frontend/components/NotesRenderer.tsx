import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const NotesRenderer = ({ content }) => {
  // Simple preprocessing to fix some of the most egregious formatting issues
  const preprocessText = (text) => {
    if (!text) return '';
    
    // Convert ***Section*** to proper Markdown headers
    let processed = text.replace(/\*\*\*([^:*]+):\s*\*\*\*/g, '## $1');
    
    // Fix bullet points with excessive asterisks
    processed = processed.replace(/\*\s+\*+\s*\**(.*?):\s*\*+/g, '* **$1:**');
    
    // Remove any standalone triple asterisks
    processed = processed.replace(/\*\*\*/g, '');
    
    return processed;
  };

  const processedContent = preprocessText(content);

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc ml-6 my-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal ml-6 my-2" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          p: ({ node, ...props }) => <p className="my-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default NotesRenderer;

