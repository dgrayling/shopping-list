'use client';

import { useState } from 'react';
import styles from "./page.module.css";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();
    
    if (text) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        text,
        completed: false
      };
      
      setItems(prevItems => [...prevItems, newItem]);
      setInputValue('');
    }
  };

  const toggleComplete = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1 className={styles.header}>Shopping List</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add an item..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) {
                  form.requestSubmit();
                }
              }
            }}
          />
          <button type="submit" className={styles.button}>Add</button>
        </form>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
              />
              <span className={item.completed ? styles.itemTextCompleted : styles.itemText}>
                {item.text}
              </span>
              <button 
                className={styles.deleteButton}
                onClick={() => deleteItem(item.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
