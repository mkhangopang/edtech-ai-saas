import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

export default function CurriculumPage({ params }: PageProps) {
  return (
    <div>
      <h1>Curriculum {params.id}</h1>
      <p>Details for curriculum ID: {params.id}</p>
    </div>
  );
}
