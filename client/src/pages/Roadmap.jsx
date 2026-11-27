import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCrafts } from '../context/CraftsContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RoadmapView from '../components/RoadmapView.jsx';
import Select from '../components/ui/Select.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Roadmap() {
  const { craftId } = useParams();
  const { user } = useAuth();
  const { getCraft, craftOptions, loading } = useCrafts();
  const navigate = useNavigate();

  const activeId = craftId || user.primaryCraft;
  const craft = getCraft(activeId);

  if (!craft) {
    if (loading) return <Skeleton className="h-64 rounded-card" />;
    return <Navigate to="/explore" replace />;
  }

  return (
    <div>
      <PageHeader
        title={`${craft.name} Roadmap`}
        icon={craft.emoji}
        subtitle="Your personal learning path. Tick each step when you finish it - your progress is saved."
        action={
          <Select
            className="w-full sm:w-64"
            aria-label="Choose craft roadmap"
            value={activeId}
            onChange={(e) => navigate(`/roadmap/${e.target.value}`)}
            options={craftOptions}
          />
        }
      />
      <RoadmapView key={activeId} craftId={activeId} />
    </div>
  );
}
