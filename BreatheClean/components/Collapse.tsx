import React, { useState } from 'react';

interface CollapsibleProps {
  title: string;
  initiallyExpanded?: boolean; // Add this line
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, initiallyExpanded = false, children }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {title}
      </button>
      {isExpanded && <div>{children}</div>}
    </div>
  );
};

export default Collapsible;