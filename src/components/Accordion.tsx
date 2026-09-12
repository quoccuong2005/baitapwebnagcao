import React, { createContext, useContext, useState, ReactNode } from 'react';

// 1. Định nghĩa Context State
interface AccordionContextType {
  activeId: string | null;
  togglePanel: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Hook nội bộ để các sub-components truy cập Context
const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion sub-components must be wrapped in <Accordion />');
  }
  return context;
}

// 2. Main Parent Component
interface AccordionProps {
  children: ReactNode;
  defaultActiveId?: string | null;
}

export const Accordion = ({ children, defaultActiveId = null }: AccordionProps) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId);

  // Xử lý toggle: Nếu nhấp vào panel đang mở -> đóng lại (null), ngược lại -> mở panel mới
  const togglePanel = (id: string) => {
    setActiveId((prevId) => (prevId === id ? null : id));
  };

  return (
    <AccordionContext.Provider value={{ activeId, togglePanel }}>
      <div className="accordion-group">{children}</div>
    </AccordionContext.Provider>
  );
};

// 3. Sub-component: Item (Bọc mỗi cặp Header & Panel)
interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

const ItemContext = createContext<{ id: string } | undefined>(undefined);

Accordion.Item = function AccordionItem({ id, children }: AccordionItemProps) {
  return (
    <ItemContext.Provider value={{ id }}>
      <div className="accordion-item">{children}</div>
    </ItemContext.Provider>
  );
};

// 4. Sub-component: Header (Nút bấm toggle)
interface AccordionHeaderProps {
  children: ReactNode;
}

Accordion.Header = function AccordionHeader({ children }: AccordionHeaderProps) {
  const { activeId, togglePanel } = useAccordionContext();
  const itemContext = useContext(ItemContext);

  if (!itemContext) {
    throw new Error('<Accordion.Header /> must be wrapped in <Accordion.Item />');
  }

  const { id } = itemContext;
  const isOpen = activeId === id;

  return (
    <button
      type="button"
      className={`accordion-header ${isOpen ? 'active' : ''}`}
      onClick={() => togglePanel(id)}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
};

// 5. Sub-component: Panel (Nội dung chi tiết)
interface AccordionPanelProps {
  children: ReactNode;
}

Accordion.Panel = function AccordionPanel({ children }: AccordionPanelProps) {
  const { activeId } = useAccordionContext();
  const itemContext = useContext(ItemContext);

  if (!itemContext) {
    throw new Error('<Accordion.Panel /> must be wrapped in <Accordion.Item />');
  }

  const isOpen = activeId === itemContext.id;

  if (!isOpen) return null;

  return <div className="accordion-panel">{children}</div>;
};