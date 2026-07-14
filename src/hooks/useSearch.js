import { useState, useMemo } from 'react';

/**
 * Custom hook to filter list of items based on query and search fields
 * @param {Array} items 
 * @param {Array<string>} searchFields 
 * @returns {Object}
 */
export const useSearch = (items = [], searchFields = ['name']) => {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;

    const lowerQuery = query.toLowerCase().trim();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const val = item[field];
        if (val === null || val === undefined) return false;
        return val.toString().toLowerCase().includes(lowerQuery);
      });
    });
  }, [items, query, searchFields]);

  return {
    query,
    setQuery,
    filteredItems,
  };
};
