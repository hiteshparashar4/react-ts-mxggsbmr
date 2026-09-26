type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface DocumentSection {
  id: string;
  title: string;
  content: string;
  category: string;
  status: ReviewStatus;
  riskFactors: number[];
  comments: string[];
  updatedAt: string;
}

const categories = [
  'Regulatory',
  'Submission',
  'Safety',
  'Clinical',
  'Quality',
  'Manufacturing',
];

const statuses: ReviewStatus[] = ['pending', 'approved', 'rejected'];

export function generateSections(count: number): DocumentSection[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `section-${index + 1}`,
    title: `Document Section ${index + 1}`,
    content: `
      This is a sample content for section ${index + 1}.
      It contains regulatory submission information,
      FDA guidance references, validation details,
      and clinical compliance requirements.
    `,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    riskFactors: [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
    ],
    comments: [`Reviewer comment ${index + 1}`, `QA note ${index + 1}`],
    updatedAt: new Date(Date.now() - index * 60000).toISOString(),
  }));
  
}
