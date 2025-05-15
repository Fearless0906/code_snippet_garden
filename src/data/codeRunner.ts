export function runJavaScriptCode(code: string): string {
    try {
      const result = new Function(code)(); // Runs the code
      return result !== undefined ? String(result) : "Code executed.";
    } catch (err: any) {
      return ` Error: ${err.message}`;
    }
  }
  