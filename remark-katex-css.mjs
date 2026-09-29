const source = "katex/dist/katex.min.css";

const hasMath = (node) =>
  node.type === "math" ||
  node.type === "inlineMath" ||
  (node.children ?? []).some(hasMath);

// Imports KaTeX's stylesheet only into MDX posts that contain math.
export function remarkKatexCss() {
  return function (tree, file) {
    if (!file.path?.endsWith(".mdx") || !hasMath(tree)) return;
    tree.children.unshift({
      type: "mdxjsEsm",
      value: `import "${source}";`,
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              specifiers: [],
              source: { type: "Literal", value: source, raw: `"${source}"` },
            },
          ],
        },
      },
    });
  };
}
