import './App.css';
import React, { useState } from 'react';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [base64File, setBase64File] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');

  // Handle JSON input change
  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  // Handle base64 file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Extract Base64 data
        setBase64File(`data:${file.type};base64,${base64String}`);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponseData(null);

    // Validate JSON input
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData.data)) {
        setError('Invalid JSON: "data" must be an array.');
        return;
      }
    } catch (err) {
      setError('Invalid JSON format');
      return;
    }

    // Prepare request payload
    const requestBody = {
      data: JSON.parse(jsonData).data,
      file_b64: base64File || null
    };

    // Make API request
    try {
      const response = await fetch('http://localhost:1729/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      const result = await response.json();
      setResponseData(result);
    } catch (err) {
      setError('Error submitting the request');
    }
  };

  return (
    <div className="App">
      <h1>Submit Data</h1>
      <form onSubmit={handleSubmit}>
        {/* JSON Input */}
        <div>
          <label htmlFor="jsonData">JSON Data:</label>
          <textarea
            id="jsonData"
            value={jsonData}
            onChange={handleJsonChange}
            placeholder='{"data": ["A", "B", "1", "2"]}'
            rows="5"
            cols="50"
          />
        </div>

        <div>
          <label htmlFor="fileInput">Upload a file:</label>
          <input type="file" id="fileInput" onChange={handleFileChange} />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {/* Display Response */}
      {responseData && (
      <div className="response">
        <h2>Response</h2>
        <ul>
          {Object.entries(responseData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong>: {Array.isArray(value) ? value.join(', ') : value.toString()}
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}

export default App;
