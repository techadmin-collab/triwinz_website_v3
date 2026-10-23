"use client";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import React, { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
  MenuButtonStrikethrough,
  MenuButtonOrderedList,
  MenuButtonBulletedList,
  MenuButtonBlockquote,
  MenuButtonCode,
  MenuButtonHorizontalRule,
  MenuButtonUndo,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
} from "mui-tiptap";

const MessageEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      onChange?.(editor.getText());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getText()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />

            <MenuButtonStrikethrough />
            <MenuDivider />

            <MenuButtonOrderedList />
            <MenuButtonBulletedList />
            <MenuDivider />
            <MenuButtonBlockquote />
            <MenuButtonCode />
            <MenuButtonHorizontalRule />
            <MenuDivider />

            <MenuButtonUndo />
            <MenuButtonRedo />
            <MenuDivider />

            <MenuButtonRemoveFormatting />
          </MenuControlsContainer>
        }
      />
    </RichTextEditorProvider>
  );
};
export default MessageEditor;
