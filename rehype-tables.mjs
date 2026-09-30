const text = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(text).join("");

const rows = (node) =>
  (node.children ?? []).flatMap((child) =>
    child.tagName === "tr" ? [child] : rows(child),
  );

const cells = (row) =>
  row.children.filter((child) => ["th", "td"].includes(child.tagName));

// 82%, 3.2, +0.20, -1.10, 1,000, 0/15
const numeric = /^[+\-−]?[\d,]*\.?\d+%?$|^\d+\/\d+$/;

// Wraps tables so wide ones scroll on their own, and marks columns whose body cells
// are all numbers so they can be right-aligned.
export function rehypeTables() {
  return function transform(node) {
    (node.children ?? []).forEach((child, index) => {
      if (child.tagName !== "table") return transform(child);

      const [head, ...body] = rows(child);
      const width = cells(head ?? { children: [] }).length;
      for (let column = 0; column < width; column++) {
        const values = body
          .map((row) => text(cells(row)[column] ?? {}).trim())
          .filter(Boolean);
        if (!values.length || !values.every((value) => numeric.test(value))) {
          continue;
        }
        for (const row of [head, ...body]) {
          const cell = cells(row)[column];
          if (cell) cell.properties.className = ["num"];
        }
      }

      node.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["table-scroll"],
          role: "region",
          ariaLabel: "Table",
          tabIndex: 0,
        },
        children: [child],
      };
    });
  };
}
