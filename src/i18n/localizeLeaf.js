export const localizeLeaf = (leaf, t) => ({ ...leaf, description: t(`leaves:items.${leaf.id}.description`, { defaultValue: leaf.description }) });
