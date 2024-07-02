import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<any>(null);

  const handleImageInsert = () => {
    const editor = quillRef.current?.getEditor();
    const range = editor?.getSelection();
    const url = prompt('Enter the image URL');
    if (url && range) {
      editor.insertEmbed(range.index, 'image', url);
    }
  };

  const handleVideoInsert = () => {
    const editor = quillRef.current?.getEditor();
    const range = editor?.getSelection();
    const url = prompt('Enter the YouTube URL');
    if (url && range) {
      editor.insertEmbed(range.index, 'video', url);
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ align: [] }],
      ],
      handlers: {
        image: handleImageInsert,
        video: handleVideoInsert,
      },
    },
  };

  return (
    <ReactQuill
      ref={(el) => {
        if (el) {
          quillRef.current = el;
        }
      }}
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
    />
  );
};

export { RichTextEditor };
