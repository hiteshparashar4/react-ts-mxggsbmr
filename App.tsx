import React, { useState } from 'react';
import DocumentExplorer from './DocumentExplorer';
import { generateSections } from './mockData';

function App() {
  const [sections] = useState(() => generateSections(500));

  const [selectedId, setSelectedId] = useState<string>();

  return (
    <DocumentExplorer
      sections={sections}
      selectedSectionId={selectedId}
      onSelectSection={(section) => {
        setSelectedId(section.id);
      }}
      onStatusChange={async (sectionId, status) => {
        console.log(`Updated ${sectionId} to ${status}`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  );
}

export default App;
