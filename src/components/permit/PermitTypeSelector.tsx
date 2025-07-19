import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Wind, Droplets, FileText } from "lucide-react";

const permitTypes = [
  {
    id: "solar",
    name: "Solar Permit",
    icon: Sun,
    description: "Best for solar panel installations and grid connections",
  },
  {
    id: "wind",
    name: "Wind Permit",
    icon: Wind,
    description: "Ideal for wind turbine and wind farm development",
  },
  {
    id: "oil-gas",
    name: "Oil & Gas Permit",
    icon: Droplets,
    description: "For drilling, extraction, and pipeline permits",
  },
  {
    id: "generic",
    name: "Generic Energy Permit",
    icon: FileText,
    description: "For other energy infrastructure projects",
  },
];

interface PermitTypeSelectorProps {
  selectedPermit: string;
  onPermitSelect: (permitId: string) => void;
}

const PermitTypeSelector = ({
  selectedPermit,
  onPermitSelect,
}: PermitTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Permit Type
      </h3>
      <div className="flex flex-wrap gap-4">
        {permitTypes.map((permit) => {
          const Icon = permit.icon;
          const isSelected = selectedPermit === permit.id;

          return (
            <button
              key={permit.id}
              onClick={() => onPermitSelect(permit.id)}
              className={`flex flex-col items-center justify-center rounded-lg border p-5 w-40 text-center transition-all duration-200
              ${
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-card hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{permit.name}</span>
            </button>
          );
        })}
      </div>

      {selectedPermit && (
        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {
              permitTypes.find((p) => p.id === selectedPermit)
                ?.description
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PermitTypeSelector;