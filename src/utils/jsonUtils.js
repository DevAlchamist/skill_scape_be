export function extractJson(text) {
    const codeBlock = text.match(/```json([\s\S]*?)```/);
    if (codeBlock) return codeBlock[1].trim();
  
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    return text.slice(first, last + 1);
  }
  