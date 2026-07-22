"use client";

import { Button } from "react-bootstrap";

type Props = {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon = "📭", title, description, actionLabel, onAction }: Props) {
  return (
    <div className="text-center py-5 px-3">
      <div style={{ fontSize: "3rem" }}>{icon}</div>
      <h5 className="mt-3 text-muted">{title}</h5>
      {description && <p className="text-muted small mb-3">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="outline-primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
