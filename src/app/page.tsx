'use client'

import Image from "next/image";
import styles from "./page.module.css";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key, useState } from "react";

export default function Home() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item = formData.get("item") as string;

    if (item && item.trim() !== '') {
      setItems(prevItems => [...prevItems, item]);
      // Reset the form
      e.currentTarget.reset();
    }
  };

  const [items, setItems] = useState<string[]>([]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Shopping List</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="item"
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
          <button>Add</button>
        </form>
        <ul>
          {items.map((item: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
