
import { useState, useEffect } from 'react';

export default function useLocalStore(initialData) {
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem('joineazy_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('joineazy_data', JSON.stringify(store));
  }, [store]);

  return [store, setStore];
}
