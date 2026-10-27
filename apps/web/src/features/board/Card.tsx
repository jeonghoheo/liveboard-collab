import type { Card as CardModel } from "@liveboard/shared";

interface CardProps {
  card: CardModel;
}

export function Card({ card }: CardProps) {
  return (
    <article className="card">
      <h3>{card.title}</h3>
      {card.body ? <p>{card.body}</p> : null}
    </article>
  );
}
