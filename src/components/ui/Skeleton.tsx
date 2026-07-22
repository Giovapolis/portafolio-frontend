"use client";

type Props = {
  lines?: number;
  height?: string;
};

const widths = [85, 75, 92, 70, 88, 80];

export function CardSkeleton({ lines = 3, height = "160px" }: Props) {
  return (
    <div className="card mb-4" aria-hidden="true">
      <div className="card-body p-4">
        <div className="placeholder-glow mb-3">
          <span className="placeholder col-4" style={{ height: "14px" }} />
        </div>
        <div className="placeholder-glow">
          {Array.from({ length: lines }).map((_, i) => (
            <span
              key={i}
              className="placeholder col-12 d-block mb-2"
              style={{ height: "12px", width: `${widths[i % widths.length]}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="cv-page">
      <div className="placeholder-glow mb-5">
        <span className="placeholder col-3 d-block mb-3" style={{ height: "12px" }} />
        <span className="placeholder col-6 d-block mb-3" style={{ height: "32px" }} />
        <span className="placeholder col-4 d-block mb-2" style={{ height: "14px" }} />
        <span className="placeholder col-8 d-block" style={{ height: "14px" }} />
      </div>
      <CardSkeleton lines={3} />
      <CardSkeleton lines={2} />
      <CardSkeleton lines={4} />
    </div>
  );
}
