import { Badge } from './components/Badge/Badge';
import { CaseCard } from './components/CaseCard/CaseCard';

export default function App() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 32, display: 'grid', gap: 24 }}>
      <Badge tone="live">Vincentius Alan · Design System</Badge>
      <p>Components live in Storybook. Run <code>pnpm storybook</code>.</p>
      <CaseCard
        title="When to ask for the microphone"
        summary="Moving one permission prompt to the moment of need changed how long people stayed."
        metric={{ before: '43 s', after: '16 min', label: 'Median session length' }}
        readMinutes={6}
        featured
      />
    </main>
  );
}
