import { useState, useRef, useEffect } from 'react';
import { ListItem } from '../store/slices/itemsSlice';
import styles from '../app/page.module.css';

interface ShoppingListItemProps {
  item: ListItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onDecrement: (id: string) => void;
  onIncrement: (id: string) => void;
  onAddCategoryValue: (itemId: string) => void;
  onRemoveCategoryValue: (itemId: string, category: string) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categorizations: Record<string, string[]>;
}

export default function ShoppingListItem({
  item,
  onToggleComplete,
  onDelete,
  onUpdateQuantity,
  onDecrement,
  onIncrement,
  onAddCategoryValue,
  onRemoveCategoryValue,
  selectedItemId,
  setSelectedItemId,
  selectedCategory,
  setSelectedCategory,
  categorizations,
}: ShoppingListItemProps) {
  const [editingQuantityId, setEditingQuantityId] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState('');
  const intervalRef = useRef<number | null>(null);
  const buttonActionRef = useRef<() => void>();

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startAction = (action: () => void) => {
    // Execute action immediately
    action();

    // Set a timeout before starting the interval
    const timeoutId = window.setTimeout(() => {
      // Then set up the interval for continuous action
      intervalRef.current = window.setInterval(action, 100); // Adjust speed as needed
    }, 300); // Wait 300ms before starting the interval

    // Store the timeout ID to clear it if needed
    intervalRef.current = timeoutId;
  };

  const stopAction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleQuantityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, itemId: string) => {
    const currentValue = parseInt(e.currentTarget.value, 10) || 0;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const newQuantity = parseInt(tempQuantity, 10);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        onUpdateQuantity(itemId, newQuantity);
        setEditingQuantityId(null);
      }
    } else if (e.key === 'Escape') {
      setEditingQuantityId(null);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = currentValue + 1;
      setTempQuantity(newValue.toString());
      onUpdateQuantity(itemId, newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = Math.max(1, currentValue - 1);
      setTempQuantity(newValue.toString());
      onUpdateQuantity(itemId, newValue);
    }
  };

  return (
    <li className={styles.listItem}>
      <div className={styles.quantityContainer}>
        <button
          onMouseDown={() => {
            if (item.quantity > 1) {
              startAction(() => onDecrement(item.id));
            }
          }}
          onMouseUp={stopAction}
          onMouseLeave={stopAction}
          onTouchStart={() => {
            if (item.quantity > 1) {
              startAction(() => onDecrement(item.id));
            }
          }}
          onTouchEnd={stopAction}
          disabled={item.quantity <= 1}
          className={`${styles.quantityButton} ${item.quantity <= 1 ? styles.disabledButton : ''}`}
        >
          -
        </button>
        {editingQuantityId === item.id ? (
          <input
            type="number"
            value={tempQuantity}
            onChange={(e) => setTempQuantity(e.target.value)}
            onKeyDown={(e) => handleQuantityKeyDown(e, item.id)}
            onBlur={() => {
              const newQuantity = parseInt(tempQuantity, 10);
              if (!isNaN(newQuantity) && newQuantity > 0) {
                onUpdateQuantity(item.id, newQuantity);
              }
              setEditingQuantityId(null);
            }}
            className={styles.quantityInput}
            min="1"
            step="1"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <span
            className={styles.quantityIndicator}
            onClick={() => {
              setTempQuantity(item.quantity.toString());
              setEditingQuantityId(item.id);
            }}
          >
            {item.quantity}
          </span>
        )}
        <button
          onMouseDown={() => startAction(() => onIncrement(item.id))}
          onMouseUp={stopAction}
          onMouseLeave={stopAction}
          onTouchStart={() => startAction(() => onIncrement(item.id))}
          onTouchEnd={stopAction}
          className={styles.quantityButton}
        >
          +
        </button>
      </div>

      <span
        className={`${styles.itemText} ${item.completed ? styles.completed : ''}`}
        onClick={() => onToggleComplete(item.id)}
      >
        {item.text}
      </span>

      <div className={styles.categoryBubbles} onClick={(e) => e.stopPropagation()}>
        {item.categoryValues?.map((cv, idx) => (
          <span
            key={`${item.id}-${cv.category}`}
            className={styles.categoryBubble}
            title={`${cv.category}: ${cv.value}`}
          >
            {cv.category}: {cv.value}
            <button
              className={styles.removeBubble}
              onClick={() => onRemoveCategoryValue(item.id, cv.category)}
            >
              ×
            </button>
          </span>
        ))}

        {selectedItemId === item.id ? (
          <div className={styles.addCategoryValue}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="">Select a category</option>
              {Object.entries(categorizations).map(([category, values]) => (
                values.length > 0 && (
                  <option key={category} value={category}>
                    {category}
                  </option>
                )
              ))}
            </select>

            {selectedCategory && categorizations[selectedCategory]?.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onAddCategoryValue(item.id);
                    setSelectedCategory('');
                    setSelectedItemId(null);
                  }
                }}
                className={styles.valueSelect}
              >
                <option value="">Select a value</option>
                {categorizations[selectedCategory]?.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            )}

            <button
              className={styles.cancelAddBubble}
              onClick={() => {
                setSelectedItemId(null);
                setSelectedCategory('');
              }}
            >
              ×
            </button>
          </div>
        ) : (
          <button
            className={styles.addBubbleButton}
            onClick={() => setSelectedItemId(item.id)}
            title="Add category value"
          >
            + Add
          </button>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className={styles.deleteButton}
      >
        ×
      </button>
    </li>
  );
}
