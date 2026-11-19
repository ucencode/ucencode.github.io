/**
 * Rehype plugin that turns a paragraph holding only an image with a title,
 * e.g. `![alt](/path.webp "Caption")`, into a numbered figure:
 * `<figure><img><figcaption>Figure N. Caption</figcaption></figure>`.
 * Numbering restarts in every document. The first figure loads eagerly, the rest lazily.
 */
export default function rehypeFigure() {
  return (tree) => {
    let count = 0;
    const visit = (node) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element' && child.tagName === 'p') {
          const content = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
          const img = content[0];
          if (content.length === 1 && img.type === 'element' && img.tagName === 'img' && img.properties?.title) {
            const caption = String(img.properties.title);
            delete img.properties.title;
            count += 1;
            // The first figure is often visible on page load, so it loads eagerly; later ones lazily.
            img.properties.loading = count === 1 ? 'eager' : 'lazy';
            return {
              type: 'element',
              tagName: 'figure',
              properties: {},
              children: [
                img,
                {
                  type: 'element',
                  tagName: 'figcaption',
                  properties: {},
                  children: [
                    { type: 'element', tagName: 'span', properties: { className: ['figure-label'] }, children: [{ type: 'text', value: `Figure ${count}. ` }] },
                    { type: 'text', value: caption },
                  ],
                },
              ],
            };
          }
        }
        visit(child);
        return child;
      });
    };
    visit(tree);
  };
}
