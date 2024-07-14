import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type MyOnChangePluginProps = {
    onChange: (editorState: any) => void;
}

const MyOnChangePlugin: React.FC<MyOnChangePluginProps> = ({ onChange }) => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      return editor.registerUpdateListener(({ editorState }) => {
        onChange(editorState);
      });
    }, [editor, onChange]);
    return null;
  }

export { MyOnChangePlugin };