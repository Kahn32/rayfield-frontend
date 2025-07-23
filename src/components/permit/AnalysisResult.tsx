import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, MapPin, Leaf, FileText, MessageSquare } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AnalysisResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const metadata = location.state?.metadata; // 👈 get from navigate()

  console.log("📦 AnalysisResult metadata:", metadata);
  console.log("📦 Analysis Modes:", metadata?.analysis_modes);

  if (!metadata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-muted-foreground">
        <p>No analysis data available.</p>
        <Button
          className="mt-4"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    );
  }

  // 🆕 Always render fields with fallback text
  const renderField = (label: string, value: any, icon?: JSX.Element) => {
    const displayValue = value ? value : <span className="text-muted-foreground">Not Mentioned</span>;

    return (
      <div className="flex items-start gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          {Array.isArray(value) && value.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {value.map((item, idx) => (
                <Badge
                  key={idx}
                  className="bg-primary/10 text-primary border-primary/20 rounded-xl px-3 py-1 text-xs"
                >
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-foreground font-semibold text-base mt-1">{displayValue}</p>
          )}
        </div>
      </div>
    );
  };

  // 🆕 Render extra cards for analysis_modes
  const renderExtraCards = () => {
    const modes = metadata.analysis_modes || {};
    return Object.keys(modes).map((modeKey, idx) => {
      const modeData = modes[modeKey];

      return (
        <Card
          key={idx}
          className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-primary">
              {modeKey.replace(/-/g, " ").toUpperCase()}
            </h2>

            <p className="text-foreground font-medium">{modeData.summary}</p>

            {/* 📝 Render table if present */}
            {modeData.table && modeData.table.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Details Table</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead className="bg-muted">
                      <tr>
                        {Object.keys(modeData.table[0]).map((header, i) => (
                          <th
                            key={i}
                            className="text-left px-4 py-2 border-b text-muted-foreground text-sm font-medium"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modeData.table.map((row: any, rowIdx: number) => (
                        <tr key={rowIdx} className="hover:bg-muted/50">
                          {Object.values(row).map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="px-4 py-2 border-b text-foreground text-sm"
                            >
                              {typeof cell === "object" ? JSON.stringify(cell) : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 📝 Render notes if present */}
            {modeData.notes && modeData.notes.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Notes</h3>
                <ul className="list-disc list-inside text-foreground text-sm space-y-1">
                  {modeData.notes.map((note: string, noteIdx: number) => (
                    <li key={noteIdx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-10">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-md text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Permit Analysis
        </h1>
        <p className="text-white/90 text-lg mt-2">
          Here's the detailed breakdown of your document
        </p>
      </div>

      {/* Core Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-2xl font-bold text-primary">General Information</h2>
            {renderField("Issuing Agency", metadata.issuing_agency, <Globe size={20} />)}
            {renderField("Jurisdiction Level", metadata.jurisdiction_level, <MapPin size={20} />)}
            {renderField("Permit Type", metadata.permit_type, <FileText size={20} />)}
            {renderField(
              "Status",
              metadata.status,
              <Badge className={`${
                metadata.status === "Issued" ? "bg-green-500" : "bg-yellow-500"
              } text-white px-2 py-1 rounded-full text-xs`}>
                {metadata.status || "Not Mentioned"}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 space-y-5">
            <h2 className="text-2xl font-bold text-primary">Contact Information</h2>
            {renderField("Permittee Legal Name", metadata.permittee_legal_name, <Globe size={20} />)}
            {renderField("Operator Name", metadata.operator_name, <Globe size={20} />)}
            {renderField("Contact Person", metadata.contact_person_name, <Badge className="bg-primary text-primary-foreground">👤</Badge>)}
            {renderField("Email", metadata.contact_email, <Mail size={20} />)}
            {renderField("Phone", metadata.contact_phone, <Phone size={20} />)}
          </CardContent>
        </Card>
      </div>

      {/* 🆕 Project Details Card */}
      <Card className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6 space-y-5">
          <h2 className="text-2xl font-bold text-primary">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderField("Project Name", metadata.project_name, <FileText size={20} />)}
            {renderField("Site Description", metadata.site_description, <MapPin size={20} />)}
            {renderField("Municipality", metadata.municipality, <Globe size={20} />)}
            {renderField("Country", metadata.country, <Globe size={20} />)}
            {renderField("Resource Type", metadata.resource_type, <Leaf size={20} />)}
            {renderField("Fuel Type", metadata.fuel_type, <Leaf size={20} />)}
          </div>
        </CardContent>
      </Card>

      {/* 🆕 Extra Cards for Analysis Modes */}
      {renderExtraCards()}

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="rounded-full px-6 py-2 text-primary border-primary hover:bg-primary/10"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() =>
            navigate("/permit/chat", {
              state: { metadata: metadata },
            })
          }
        >
          <MessageSquare className="w-4 h-4" />
          Start Chat
        </Button>
      </div>
      {/* Back Button */}
      <a
        href="rayfieldleaseai.vercel.app" 
        className="mt-6 block text-center"
      >
        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
          ← Back to Lease AI Tool
        </Button>
      </a>
    </div>
  );
};

export default AnalysisResult;