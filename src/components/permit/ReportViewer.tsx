import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ReportViewer: React.FC = () => {
  const location = useLocation();
  const metadata = location.state?.metadata;

  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
        <p>No report data available.</p>
        <Button
          className="mt-4"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const renderLine = (label: string, value: any) => (
    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Report Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Permit Analysis Report</h1>
        <p className="text-muted-foreground">
          Clean summary of your uploaded document
        </p>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border">
        {/* General Information */}
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">General Information</h2>
          {renderLine("Issuing Agency", metadata.issuing_agency)}
          {renderLine("Jurisdiction Level", metadata.jurisdiction_level)}
          {renderLine("Permit Type", metadata.permit_type)}
          {renderLine("Status", metadata.status)}
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Contact Information</h2>
          {renderLine("Permittee Legal Name", metadata.permittee_legal_name)}
          {renderLine("Operator Name", metadata.operator_name)}
          {renderLine("Contact Person", metadata.contact_person_name)}
          {renderLine("Email", metadata.contact_email)}
          {renderLine("Phone", metadata.contact_phone)}
        </div>

        {/* Project Details */}
        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Project Details</h2>
          {renderLine("Project Name", metadata.project_name)}
          {renderLine("Site Description", metadata.site_description)}
          {renderLine("Municipality", metadata.municipality)}
          {renderLine("Country", metadata.country)}
          {renderLine("Resource Type", metadata.resource_type)}
          {renderLine("Fuel Type", metadata.fuel_type)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/")}
        >
          Back to Dashboard
        </Button>
        <Button
          className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-6 py-2 rounded-full shadow hover:scale-105 transition-transform"
          onClick={() => window.print()} // Print-friendly for PDF export
        >
          Print / Save as PDF
        </Button>
      </div>
    </div>
  );
};

export default ReportViewer;