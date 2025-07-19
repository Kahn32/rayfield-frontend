import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle } from "lucide-react";

const analysisModes = [
  {
    id: "standard-extraction",
    name: "Standard Clause Extraction",
    description: "Extracts clauses grouped by phase (General, Development, Construction, Operational). Outputs structured tables with summaries, categories, and tags.",
    defaultChecked: true
  },
  {
    id: "data-parsing",
    name: "Data Parsing & Mapping",
    description: "Pulls metadata (Permit ID, Acreage, Legal, Contacts) for clean tables or API-ready JSON.",
    defaultChecked: false
  },
  {
    id: "redlining",
    name: "Redlining / Deviation Detection",
    description: "Compares permit to standard templates. Highlights additions, removals, and deviations for legal review.",
    defaultChecked: false
  },
  {
    id: "obligations-matrix",
    name: "Obligations Matrix",
    description: "Breaks obligations by party/phase. Outputs a timeline-ready matrix of enforceability.",
    defaultChecked: false
  },
  {
    id: "renewal-timeline",
    name: "Renewal & Expiry Timeline",
    description: "Auto-detects dates/renewals. Generates timeline and setup alerts.",
    defaultChecked: false
  },
  {
    id: "legal-review",
    name: "Legal Review Risk Flagging",
    description: "Flags vague/unusual clauses and explains risks — trained on typical disputes.",
    defaultChecked: true
  }
];

interface AnalysisModeSelectorProps {
  selectedModes: string[];
  onModeToggle: (modeId: string) => void;
}

const AnalysisModeSelector = ({ selectedModes, onModeToggle }: AnalysisModeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        ANALYSIS MODES
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysisModes.map((mode) => {
          const isSelected = selectedModes.includes(mode.id);
          
          return (
            <Card 
              key={mode.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => onModeToggle(mode.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onModeToggle(mode.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{mode.name}</h4>
                      <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AnalysisModeSelector;