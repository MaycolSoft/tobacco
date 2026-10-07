import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { leaves } from '../data/leaves.js';
import { localizeLeaf } from './localizeLeaf.js';

export function useLocalizedLeaves() {
  const { t } = useTranslation('leaves');
  return useMemo(() => leaves.map(leaf => localizeLeaf(leaf, t)), [t]);
}
