'use client';

import React from 'react';
import { LearningMaterial as LearningMaterialType } from '@/lib/learningMaterialsData';

interface LearningMaterialProps {
  material: LearningMaterialType;
}

export const LearningMaterial: React.FC<LearningMaterialProps> = ({ material }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const overviewTextStyle: React.CSSProperties = {
    fontSize: '15px',
    color: '#374151',
    lineHeight: '1.8',
    marginBottom: '16px',
  };

  const strategiesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const strategyItemStyle: React.CSSProperties = {
    borderLeft: '4px solid var(--current-exam-primary, #3A6EA5)',
    paddingLeft: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
  };

  const strategyTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '8px',
  };

  const strategyDescStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '8px',
  };

  const exampleLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: '4px',
  };

  const exampleTextStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#374151',
    fontStyle: 'italic',
    paddingLeft: '12px',
    borderLeft: '2px solid #D1D5DB',
  };

  const conceptBoxStyle: React.CSSProperties = {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  };

  const conceptTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: '12px',
  };

  const conceptContentStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
  };

  return (
    <>
      {/* Concept Overview */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>
          <span>📚</span>
          Concept Overview
        </div>
        <div style={overviewTextStyle}>
          {material.conceptOverview}
        </div>
      </div>

      {/* Key Strategies */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>
          <span>💡</span>
          Key Strategies
        </div>
        <div style={strategiesContainerStyle}>
          {material.strategies.map((strategy) => (
            <div key={strategy.id} style={strategyItemStyle}>
              <div style={strategyTitleStyle}>✓ {strategy.title}</div>
              <div style={strategyDescStyle}>
                {strategy.description}
              </div>
              {strategy.example && (
                <>
                  <div style={exampleLabelStyle}>Example:</div>
                  <div style={exampleTextStyle}>
                    {strategy.example}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Important Concepts / Formulas */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>
          <span>📋</span>
          Important Concepts & Formulas
        </div>
        {material.concepts.map((concept) => (
          <div key={concept.id} style={conceptBoxStyle}>
            <div style={conceptTitleStyle}>{concept.title}</div>
            <div style={conceptContentStyle}>
              {concept.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LearningMaterial;
