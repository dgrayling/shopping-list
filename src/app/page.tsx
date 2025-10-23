'use client';

import { useState } from 'react';
import styles from "./page.module.css";

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
  quantity: number;
};

export default function Home() {
  const [items, setItems] = useState<ListItem[]>(() => [
    { id: '1', text: 'Apples', quantity: 10, completed: false },
    { id: '2', text: 'Honey', quantity: 2, completed: false },
    { id: '3', text: 'Yogurt', quantity: 3, completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = inputValue.trim();

    if (text) {
      const newItem: ListItem = {
        id: Date.now().toString(),
        text,
        completed: false,
        quantity: 1
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

  const updateQuantity = (id: string, newQuantity: number) => {
    const quantity = Math.max(1, Math.min(99, newQuantity)); // Ensure quantity is between 1 and 99
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const decrementQuantity = (id: string): void => {
    const item = items.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity - 1);
  };

  const incrementQuantity = (id: string): void => {
    const item = items.find(i => i.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const value = e.target.value;
    // Only allow numbers and empty string
    if (value === '' || /^\d+$/.test(value)) {
      setTempQuantity(value);
    }
  };

  const handleQuantityBlur = (id: string) => {
    if (tempQuantity === '') {
      // If empty, revert to the last valid quantity
      const item = items.find(i => i.id === id);
      setTempQuantity(item?.quantity.toString() || '1');
    } else {
      const newQuantity = parseInt(tempQuantity, 10);
      if (!isNaN(newQuantity)) {
        updateQuantity(id, newQuantity);
      }
    }
    setEditingQuantityId(null);
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditingQuantityId(null);
    }
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
              <div className={styles.quantityContainer}>
                <button
                  onClick={() => decrementQuantity(item.id)}
                  disabled={item.quantity <= 1}
                  className={item.quantity <= 1 ? styles.disabledButton : ''}
                >
                  -
                </button>
                {editingQuantityId === item.id ? (
                  <input
                    type="text"
                    className={styles.quantityInput}
                    value={tempQuantity}
                    onChange={(e) => handleQuantityChange(e, item.id)}
                    onBlur={() => handleQuantityBlur(item.id)}
                    onKeyDown={(e) => handleQuantityKeyDown(e, item.id)}
                    autoFocus
                  />
                ) : (
                  <span 
                    className={styles.quantityIndicator}
                    onClick={() => {
                      setEditingQuantityId(item.id);
                      setTempQuantity(item.quantity.toString());
                    }}
                  >
                    {item.quantity}
                  </span>
                )}
                <button onClick={() => incrementQuantity(item.id)}>+</button>
              </div>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
              />
              <input
                type="text"
                className={`${styles.itemInput} ${item.completed ? styles.itemTextCompleted : ''}`}
                value={item.text}
                onChange={(e) => {
                  setItems(prevItems =>
                    prevItems.map(i =>
                      i.id === item.id ? { ...i, text: e.target.value } : i
                    )
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
              />
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
