import React from "react";

type SmilesDisplayProps = {
  smiles: string;
};

const SmilesDisplay: React.FC<SmilesDisplayProps> = ({ smiles }) => {
  return (
    <div>
      (
      <div>
        <h3>SMILES Representation</h3>
        <p>{smiles}</p>
      </div>
      );
    </div>
  );
};

export default SmilesDisplay;
