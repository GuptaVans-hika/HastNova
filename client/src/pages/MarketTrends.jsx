import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TrendsPanel from '../components/TrendsPanel.jsx';
import Select from '../components/ui/Select.jsx';

export default function MarketTrends() {
  const { user } = useAuth();
  const { craftOptions } = useCrafts();
  const [craftId, setCraftId] = useState(user.primaryCraft || 'pottery');

  return (
    <div>
      <PageHeader
        title="Market Trends"
        icon="📈"
        subtitle="What buyers want right now - so you can make what sells and price it right."
        action={
          <Select
            className="w-full sm:w-64"
            aria-label="Choose craft"
            value={craftId}
            onChange={(e) => setCraftId(e.target.value)}
            options={craftOptions}
          />
        }
      />
      <TrendsPanel craftId={craftId} />
    </div>
  );
}
