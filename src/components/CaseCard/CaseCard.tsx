import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import './CaseCard.css';

export interface CaseCardProps {
  title: string;
  summary: string;
  /** Short tags such as role or year. */
  tags?: string[];
  /** Headline result. Always pair the new value with its baseline. */
  metric?: { before: string; after: string; label: string };
  /** Minutes, computed at build time in the real site. */
  readMinutes?: number;
  featured?: boolean;
  onOpen?: () => void;
}

/** Pattern: a case-study card composed from Badge and Button. */
export function CaseCard({
  title,
  summary,
  tags = [],
  metric,
  readMinutes,
  featured = false,
  onOpen,
}: CaseCardProps) {
  return (
    <article className="au-case">
      <div className="au-case__meta">
        {featured && <Badge tone="accent">Featured</Badge>}
        {tags.map((t) => (
          <Badge key={t}>{t}</Badge>
        ))}
        {readMinutes !== undefined && <Badge mono>{readMinutes} min read</Badge>}
      </div>

      <h3 className="au-case__title">{title}</h3>
      <p className="au-case__summary">{summary}</p>

      {metric && (
        <p className="au-case__metric">
          <span className="au-case__metric-value">
            {metric.before} <span aria-hidden="true">→</span>
            <span className="visually-hidden"> to </span> {metric.after}
          </span>
          <span className="au-case__metric-label">{metric.label}</span>
        </p>
      )}

      <div className="au-case__footer">
        <Button variant={featured ? 'primary' : 'secondary'} size="sm" onClick={onOpen}>
          Read case study
        </Button>
      </div>
    </article>
  );
}
