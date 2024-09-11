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
    setResponse(null); // Reset response on new search
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

  const renderProductDetails = (product, title) => (
    <div className={styles.product}>
      <h3>{title}</h3>
      <p><strong>Product:</strong> {product.Product || 'N/A'}</p>
      <p><strong>Effective Area:</strong> {product['Effective Area'] || 'N/A'}</p>
      <p><strong>Collection:</strong> {product.Collection || 'N/A'}</p>
      <p><strong>Korean Greenhouse Gas Law kgCO2eq(GWP):</strong> {product['Korean Greenhouse Gas Law kgCO2eq(GWP)'] || 'N/A'}</p>
      <p><strong>AR6:</strong> {product.AR6 || 'N/A'}</p>
      <p><strong>AR5:</strong> {product.AR5 || 'N/A'}</p>
      <p><strong>Data Source:</strong> {product['Data Source'] || 'N/A'}</p>
      <p><strong>Similarity:</strong> {product.Similarity || 'N/A'}</p>
    </div>
  );

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
      {loading && <div className={styles.loading}>Loading...</div>}
      {response ? (
        <div className={styles.results}>
          <h2>Results:</h2>
          {renderProductDetails(response['Primary Result'], 'Main Product')}
          {response['Lowest AR6 Product'] 
            ? renderProductDetails(response['Lowest AR6 Product'], 'Lowest AR6 Product') 
            : <div className={styles.noAltProduct}>No lower AR6 product found.</div>}
        </div>
      ) : (
        !loading && !error && <div className={styles.noResults}>No matching products found.</div>
      )}
    </div>
  );
}
