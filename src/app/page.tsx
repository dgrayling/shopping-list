'use client';

import { FormEvent, useState } from 'react';
import styles from "./page.module.css";
import useStore from '@/store';
import ShoppingListItem from '@/components/ShoppingListItem';

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

// ListItem type is now imported from itemsSlice

export default function Home() {
  // Zustand store state and actions
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Get state and actions from the store
  const {
    // From items slice
    items,
    inputValue,
    setInputValue,
    addItem,
    toggleComplete,
    deleteItem,
    updateQuantity,
    decrementQuantity,
    incrementQuantity,
    addCategoryValue,
    removeCategoryValue,

    // From categories slice
    categorizations,
    newCategory,
    newValues,
    setNewCategory,
    setNewValues,
    addCategory,
    deleteCategory,
    editingCategory,
    startEditingCategory,
    updateCategory,
    editTempValue,
    setEditTempValue,
    editingValue,
    startEditingValue,
    updateValue,
    addValueToCategory,
    deleteValue
  } = useStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addItem(inputValue);
    }
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (editingValue) {
      updateValue(editingValue.category, editingValue.index, value);
    }
  };

  const handleEditTempCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTempValue(e.target.value);
  };

  const handleEditTempValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTempValue(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      return value;
    }
    return '';
  };

  const handleQuantityBlur = (id: string, tempQty: string) => {
    if (tempQty === '') {
      // If empty, revert to the last valid quantity
      const item = items.find((item: ListItem) => item.id === id);
      return item?.quantity.toString() || '1';
    } else {
      const newQuantity = parseInt(tempQty, 10);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        updateQuantity(id, newQuantity);
      }
      return tempQty;
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleAddCategory = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    addCategory();
  };

  const handleAddValue = (event: FormEvent<HTMLFormElement>, category: string): void => {
    event.preventDefault();
    if (newValues[category]?.trim()) {
      const handleValueChange = (category: string, value: string) => {
        setNewValues({
          ...newValues,
          [category]: value
        });
      };
      addValueToCategory(category);
      handleValueChange(category, '');
    }
  };

  const startEditCategory = (category: string): void => {
    startEditingCategory(category);
    setEditTempValue(category);
  };

  const saveCategoryEdit = (): void => {
    if (!editingCategory) return;
    updateCategory(editingCategory, editTempValue);
    setEditTempValue('');
  };

  const cancelEditCategory = (): void => {
    startEditingCategory('');
  };

  const startEditValue = (category: string, index: number): void => {
    if (categorizations[category]) {
      startEditingValue(category, index);
    }
  };

  const saveValueEdit = (): void => {
    if (!editingValue) return;
    const { category, index } = editingValue;
    updateValue(category, index, editTempValue);
  };

  const cancelEditValue = (): void => {
    startEditingValue('', 0);
  };

  const handleValueKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onEnter?: () => void): void => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
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
          <form className={styles.formGroup} onSubmit={handleSubmit}>
            <input
              id="new-item-input"
              name="newItem"
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
              aria-label="New item"
            />
            <button 
              type="submit" 
              className={styles.button}
              aria-label="Add item to list"
            >
              Add
            </button>
          </form>
          <ul className={styles.list}>
            {items.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                onToggleComplete={toggleComplete}
                onDelete={deleteItem}
                onUpdateQuantity={updateQuantity}
                onDecrement={decrementQuantity}
                onIncrement={incrementQuantity}
                onAddCategoryValue={(itemId) => {
                  if (selectedCategory) {
                    const value = categorizations[selectedCategory]?.[0];
                    if (value) {
                      addCategoryValue(itemId, selectedCategory, value);
                    }
                  }
                }}
                onRemoveCategoryValue={removeCategoryValue}
                selectedItemId={selectedItemId}
                setSelectedItemId={setSelectedItemId}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categorizations={categorizations}
              />
            ))}
          </ul>
        </main>

        <aside className={styles.aside}>
          <form onSubmit={handleAddCategory} className={styles.categoryForm}>
            <h3>Add New Category</h3>
            <div className={styles.formGroup}>
              <input
                id="new-category-input"
                name="newCategory"
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name"
                required
                aria-label="New category name"
              />
              <button 
                type="submit"
                aria-label="Add new category"
              >
                Add Category
              </button>
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
                              id={`edit-value-${category}-${index}`}
                              name={`edit-value-${category}-${index}`}
                              type="text"
                              value={editTempValue}
                              onChange={(e) => setEditTempValue(e.target.value)}
                              onKeyDown={(e) => handleValueKeyDown(e, saveValueEdit)}
                              autoFocus
                              className={styles.editInput}
                              aria-label={`Edit value for ${category}`}
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
