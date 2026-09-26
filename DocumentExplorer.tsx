import React, { useEffect, useMemo, useState } from 'react';

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

interface DocumentExplorerProps {
  sections: DocumentSection[];
  selectedSectionId?: string;
  onSelectSection: (section: DocumentSection) => void;
  onStatusChange: (sectionId: string, status: ReviewStatus) => Promise<void>;
}

function calculateRiskScore(riskFactors: number[]): number {
  let result = 0;

  for (let i = 0; i < 100_000; i++) {
    result += riskFactors.reduce(
      (total, riskFactor) => total + Math.sqrt(riskFactor * i),
      0
    );
  }

  return Math.round(result);
}

export default function DocumentExplorer({
  sections,
  selectedSectionId,
  onSelectSection,
  onStatusChange,
}: DocumentExplorerProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [localSections, setLocalSections] = useState(sections);

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  const filteredSections = localSections
    .filter((section) => {
      const matchesSearch =
        section.title.toLowerCase().includes(searchText.toLowerCase()) ||
        section.content.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || section.category === selectedCategory;

      const matchesStatus = !showOnlyPending || section.status === 'pending';

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((first, second) => first.title.localeCompare(second.title));

  const categories = [
    'all',
    ...new Set(localSections.map((section) => section.category)),
  ];

  const handleToggleSection = (sectionId: string) => {
    if (expandedSections.indexOf(sectionId) !== -1) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId));
    } else {
      setExpandedSections([...expandedSections, sectionId]);
    }
  };

  const handleStatusChange = async (
    sectionId: string,
    status: ReviewStatus
  ) => {
    setLocalSections(
      localSections.map((section) =>
        section.id === sectionId ? { ...section, status } : section
      )
    );

    await onStatusChange(sectionId, status);
  };

  return (
    <div>
      <div className="toolbar">
        <input
          value={searchText}
          placeholder="Search sections"
          onChange={(event) => setSearchText(event.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={showOnlyPending}
            onChange={(event) => setShowOnlyPending(event.target.checked)}
          />
          Pending only
        </label>
      </div>

      <div>
        {filteredSections.map((section) => {
          const riskScore = calculateRiskScore(section.riskFactors);

          const isExpanded = expandedSections.indexOf(section.id) !== -1;

          return (
            <div
              key={section.id}
              className={selectedSectionId === section.id ? 'selected' : ''}
              onClick={() => onSelectSection(section)}
            >
              <h3>{section.title}</h3>

              <span>Risk score: {riskScore}</span>

              <select
                value={section.status}
                onChange={(event) =>
                  handleStatusChange(
                    section.id,
                    event.target.value as ReviewStatus
                  )
                }
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button onClick={() => handleToggleSection(section.id)}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>

              {isExpanded && (
                <div>
                  <p>{section.content}</p>

                  {section.comments.map((comment, index) => (
                    <div key={index}>{comment}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
