// src/components/rich-text-editor.tsx
'use client'

import { useMemo } from 'react';
import 'react-quill/dist/quill.snow.css'; // import styles

// Since react-quill is not SSR-compatible, we need to import it dynamically
import dynamic from 'next/dynamic';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Dynamically import ReactQuill to avoid SSR issues
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link'],
          ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link'
    ];

    return (
        <div className="bg-background text-foreground rounded-md">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || "Type your uplifting message here..."}
                className="[&_.ql-editor]:min-h-[200px]"
            />
        </div>
    );
}
