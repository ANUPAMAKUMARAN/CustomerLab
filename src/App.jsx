

import React, { useState } from "react";
import "./App.css";

const SCHEMA_OPTIONS = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState("");

  const availableSchemas = SCHEMA_OPTIONS.filter(
    (opt) => !selectedSchemas.includes(opt.value)
  );

  const handleAddSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      setSelectedSchemas([...selectedSchemas, currentSchema]);
      setCurrentSchema("");
    }
  };

  const handleSchemaChange = (index, value) => {
    const newSchemas = [...selectedSchemas];
    newSchemas[index] = value;
    setSelectedSchemas(newSchemas);
  };



  const handleSaveSegment = async () => {
    const schemaData = selectedSchemas.map((val) => {
      const label = SCHEMA_OPTIONS.find((o) => o.value === val)?.label;
      return { [val]: label };
    });

    const payload = {
      segment_name: segmentName,
      schema: schemaData,
    };

    // Webhook URL
    const webhookUrl = "https://webhook.site/fc9bf63f-c3c5-43c0-aab5-fed3b460dbf8";

  try {
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  alert("Segment saved successfully!");
  setShowPopup(false);
  setSegmentName("");
  setSelectedSchemas([]);
} catch (err) {
  alert("Error saving segment.");
  console.error("Save error:", err);
}

  };

  return (
    <div className="app-container">
      <button className="save-btn" onClick={() => setShowPopup(true)}>
        Save Segment
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Save Segment</h2>
            <input
              type="text"
              placeholder="Enter segment name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
            />

            <div className="blue-box">
              {selectedSchemas.map((schema, index) => (
                <select
                  key={index}
                  value={schema}
                  onChange={(e) => handleSchemaChange(index, e.target.value)}
                >
                  {SCHEMA_OPTIONS.filter(
                    (opt) =>
                      !selectedSchemas.includes(opt.value) ||
                      opt.value === schema
                  ).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>

            <div className="dropdown-row">
              <select
                value={currentSchema}
                onChange={(e) => setCurrentSchema(e.target.value)}
              >
                <option value="">Add schema to segment</option>
                {availableSchemas.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button className="add-btn" onClick={handleAddSchema}>
                + Add new schema
              </button>
            </div>

            <div className="actions">
              <button className="cancel" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button className="save" onClick={handleSaveSegment}>
                Save the segment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default App;