// First line in your component file
'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Home() {
  const [activityName, setActivityName] = useState('');
  const [region, setRegion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://211.210.203.164:8000';
    try {
      const result = await axios.post(`${apiUrl}/activities/`, {
        activity_name: activityName,
        region: region
      });
      setResponse(result.data);
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to fetch data. Please try again.';
      setError(message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>Activity Finder</h1>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter activity name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Enter region (optional)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} disabled={loading} className={styles.button}>
          {loading ? 'Loading...' : 'Find Activity'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {response && (
        <div className={styles.results}>
          <h2>Results:</h2>
          <pre className={styles.pre}>{JSON.stringify(response, null, 2)}</pre>

          {/* 메인 제품 정보 표시 */}
          <div className={styles.product}>
            <h3>Main Product</h3>
            <p><strong>Product:</strong> {response.Product}</p>
            <p><strong>Effective Area:</strong> {response['Effective Area']}</p>
            <p><strong>Collection:</strong> {response.Collection}</p>
            <p><strong>Korean Greenhouse Gas Law kgCO2eq(GWP):</strong> {response['Korean Greenhouse Gas Law kgCO2eq(GWP)']}</p>
            <p><strong>AR6:</strong> {response.AR6}</p>
            <p><strong>AR5:</strong> {response.AR5}</p>
            <p><strong>Data Source:</strong> {response['Data Source']}</p>
            <p><strong>Similarity:</strong> {response.Similarity}</p>
          </div>

          {/* 대체 제품 정보 표시 */}
          {response['Alternative Product'] && (
            <div className={styles.alternativeProduct}>
              <h3>Alternative Product</h3>
              <p><strong>Product:</strong> {response['Alternative Product'].Product}</p>
              <p><strong>Effective Area:</strong> {response['Alternative Product']['Effective Area']}</p>
              <p><strong>Collection:</strong> {response['Alternative Product'].Collection}</p>
              <p><strong>Korean Greenhouse Gas Law kgCO2eq(GWP):</strong> {response['Alternative Product']['Korean Greenhouse Gas Law kgCO2eq(GWP)']}</p>
              <p><strong>AR6:</strong> {response['Alternative Product'].AR6}</p>
              <p><strong>AR5:</strong> {response['Alternative Product'].AR5}</p>
              <p><strong>Data Source:</strong> {response['Alternative Product']['Data Source']}</p>
              <p><strong>Similarity:</strong> {response['Alternative Product'].Similarity}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
