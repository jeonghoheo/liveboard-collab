import type { Card as CardModel } from "@liveboard/shared";
import { Card } from "./Card";

interface ColumnProps {
  title: string;
  cards: CardModel[];
}

export function Column({ title, cards }: ColumnProps) {
  return (
    <section className="column" aria-label={title}>
      <header className="column-header">
        <h2>{title}</h2>
        <span className="column-count">{cards.length}</span>
      </header>

      <div className="column-cards">
        {cards.length === 0 ? (
          <p className="column-empty">카드 없음</p>
        ) : (
          cards.map((card) => <Card key={card.id} card={card} />)
        )}
      </div>
    </section>
  );
}
