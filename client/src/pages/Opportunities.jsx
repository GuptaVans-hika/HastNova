import PageHeader from '../components/PageHeader.jsx';
import OpportunityList from '../components/OpportunityList.jsx';

export default function Opportunities() {
  return (
    <div>
      <PageHeader
        title="Workshops & NGOs"
        icon="🤝"
        subtitle="Learn from masters and get support from organisations that work for artisans."
      />
      <OpportunityList />
    </div>
  );
}
