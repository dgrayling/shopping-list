'use client';

import { FormEvent, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import styles from "./page.module.css";

// Define types for commit objects
type CommitInfo = {
  hash: string;
  message: string;
  date?: string;
};

// Parse the commit history from environment variables
const currentCommit: CommitInfo | null = process.env.NEXT_PUBLIC_CURRENT_COMMIT
  ? JSON.parse(process.env.NEXT_PUBLIC_CURRENT_COMMIT)
  : null;
const commitHistory: CommitInfo[] = process.env.NEXT_PUBLIC_COMMIT_HISTORY
  ? JSON.parse(process.env.NEXT_PUBLIC_COMMIT_HISTORY)
  : [];

type ListItem = {
  id: string;
  text: string;
  completed: boolean;
  quantity: number;
  aisle?: string;
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
  // Categories with their possible values
  type Categorizations = {
    [key: string]: string[];
  };

  const [categorizations, setCategorizations] = useState<Categorizations>({});
  const [newCategory, setNewCategory] = useState('');
  const [newValues, setNewValues] = useState<{[key: string]: string}>({});
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{category: string; index: number} | null>(null);
  const [editTempValue, setEditTempValue] = useState('');

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

  function handleAddCategory(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const category = newCategory.trim();
    
    if (category && !categorizations[category]) {
      setCategorizations(prev => ({
        ...prev,
        [category]: []
      }));
      setNewValues(prev => ({
        ...prev,
        [category]: ''
      }));
      setNewCategory('');
    }
  }

  function handleAddValue(event: FormEvent<HTMLFormElement>, category: string): void {
    event.preventDefault();
    const value = newValues[category]?.trim();
    
    if (value && categorizations[category]) {
      setCategorizations(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), value]
      }));
      
      // Clear the input for this category
      setNewValues(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  }

  function handleValueChange(category: string, value: string): void {
    setNewValues(prev => ({
      ...prev,
      [category]: value
    }));
  }

  function startEditCategory(category: string): void {
    setEditingCategory(category);
    setEditTempValue(category);
  }

  function saveCategoryEdit(oldCategory: string, newCategoryName: string): void {
    if (newCategoryName && newCategoryName !== oldCategory) {
      setCategorizations(prev => {
        const { [oldCategory]: values, ...rest } = prev;
        return { ...rest, [newCategoryName]: values };
      });
      
      // Update any newValues reference
      setNewValues(prev => {
        const { [oldCategory]: value, ...rest } = prev;
        return { ...rest, [newCategoryName]: value || '' };
      });
    }
    setEditingCategory(null);
  }

  function cancelEditCategory(): void {
    setEditingCategory(null);
  }

  function startEditValue(category: string, index: number): void {
    setEditingValue({ category, index });
    setEditTempValue(categorizations[category][index]);
  }

  function saveValueEdit(): void {
    if (!editingValue) return;
    
    const { category, index } = editingValue;
    if (editTempValue && editTempValue !== categorizations[category][index]) {
      setCategorizations(prev => {
        const updatedValues = [...prev[category]];
        updatedValues[index] = editTempValue;
        return { ...prev, [category]: updatedValues };
      });
    }
    
    setEditingValue(null);
  }

  function cancelEditValue(): void {
    setEditingValue(null);
  }

  function handleValueKeyDown(e: React.KeyboardEvent, handler: () => void): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      handler();
    } else if (e.key === 'Escape') {
      cancelEditValue();
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.mainContent}>
        <main className={styles.container}>
          <div className={styles.header}>
            <h1>Shopping List</h1>
          </div>
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
                <div className={styles.itemContent}>
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
                </div>
                {item.aisle && (
                  <span className={styles.aisle}>{item.aisle}</span>
                )}
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

        <aside className={styles.aside}>
          <form onSubmit={handleAddCategory} className={styles.categoryForm}>
            <h3>Add New Category</h3>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
              />
              <button type="submit">Add Category</button>
            </div>
          </form>

          <div className={styles.categories}>
            {Object.entries(categorizations).map(([category, values]) => (
              <div key={category} className={styles.category}>
                <div className={styles.categoryHeader}>
                  {editingCategory === category ? (
                    <div className={styles.editForm}>
                      <input
                        type="text"
                        value={editTempValue}
                        onChange={(e) => setEditTempValue(e.target.value)}
                        onKeyDown={(e) => handleValueKeyDown(e, () => saveCategoryEdit(category, editTempValue))}
                        autoFocus
                        className={styles.editInput}
                      />
                      <div className={styles.editActions}>
                        <button 
                          onClick={() => saveCategoryEdit(category, editTempValue)}
                          className={styles.saveButton}
                          disabled={!editTempValue.trim()}
                        >
                          ✓
                        </button>
                        <button 
                          onClick={cancelEditCategory}
                          className={styles.cancelButton}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.categoryTitle}>
                      <h3>{category}</h3>
                      <button 
                        onClick={() => startEditCategory(category)}
                        className={styles.editButton}
                        title="Edit category"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
                
                {values.length > 0 && (
                  <ul className={styles.valuesList}>
                    {values.map((value, index) => (
                      <li key={`${category}-${index}`} className={styles.valueItem}>
                        {editingValue?.category === category && editingValue?.index === index ? (
                          <div className={styles.editForm}>
                            <input
                              type="text"
                              value={editTempValue}
                              onChange={(e) => setEditTempValue(e.target.value)}
                              onKeyDown={(e) => handleValueKeyDown(e, saveValueEdit)}
                              autoFocus
                              className={styles.editInput}
                            />
                            <div className={styles.editActions}>
                              <button 
                                onClick={saveValueEdit}
                                className={styles.saveButton}
                                disabled={!editTempValue.trim()}
                              >
                                ✓
                              </button>
                              <button 
                                onClick={cancelEditValue}
                                className={styles.cancelButton}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.valueContent}>
                            <span>{value}</span>
                            <button 
                              onClick={() => startEditValue(category, index)}
                              className={styles.editButton}
                              title="Edit value"
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                
                <form 
                  onSubmit={(e) => handleAddValue(e, category)}
                  className={styles.valueForm}
                >
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      value={newValues[category] || ''}
                      onChange={(e) => handleValueChange(category, e.target.value)}
                      placeholder={`Add to ${category}...`}
                      className={styles.valueInput}
                    />
                    <button 
                      type="submit"
                      className={styles.addButton}
                      disabled={!newValues[category]?.trim()}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>


        </aside>
      </div>

      <footer className={styles.footer}>
        <div className={styles.commitHistory}>
          <h3>Version History</h3>
          {currentCommit && (
            <div className={styles.currentCommit}>
              <div className={styles.commitHeader}>
                <span className={styles.commitHash} title={currentCommit.hash}>
                  {currentCommit.hash}
                </span>
                <span className={styles.commitDate}>Current Version</span>
              </div>
              <p className={styles.commitMessage}>{currentCommit.message}</p>
            </div>
          )}

          {commitHistory.length > 0 && (
            <div className={styles.historyList}>
              {commitHistory.map((commit: CommitInfo, index: number) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.commitHeader}>
                    <span className={styles.commitHash} title={commit.hash}>
                      {commit.hash}
                    </span>
                    <span className={styles.commitDate}>{commit.date}</span>
                  </div>
                  <p className={styles.commitMessage}>{commit.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
