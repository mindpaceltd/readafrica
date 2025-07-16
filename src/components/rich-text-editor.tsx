// src/components/rich-text-editor.tsx
'use client'

import { useState, useEffect, useMemo } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);

// Dynamically import html-to-draftjs only on the client
const htmlToDraft = typeof window === 'object' 
    ? require('html-to-draftjs').default 
    : () => null;


interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // When the component mounts, convert the initial HTML value to Draft.js state
        if (value && typeof window === 'object') {
            const contentBlock = htmlToDraft(value);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const initialState = EditorState.createWithContent(contentState);
                setEditorState(initialState);
            }
        }
    // We only want to run this once when the initial value is set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted]);

    const onEditorStateChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        const html = stateToHTML(newEditorState.getCurrentContent());
        onChange(html);
    };

    if (!isMounted) {
        return <div className="bg-background text-foreground rounded-md border min-h-[268px] animate-pulse"></div>;
    }

    return (
        <div className="bg-background text-foreground rounded-md border">
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                wrapperClassName="w-full"
                editorClassName="p-4 min-h-[200px]"
                toolbarClassName="!border-0 !border-b"
                placeholder={placeholder || "Type your uplifting message here..."}
                toolbar={{
                    options: ['inline', 'list', 'textAlign', 'link', 'history'],
                    inline: { inDropdown: false, options: ['bold', 'italic', 'underline'] },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                  }}
            />
        </div>
    );
}
