// lib/exportService.js

/**
 * Export words to CSV format
 * @param {Array} words - Array of word objects
 */
export const exportToCSV = (words) => {
  const headers = ['German', 'English', 'Type', 'Tags', 'Gender'];
  const csvRows = [headers.join(',')];

  words.forEach((word) => {
    const row = [
      `"${word.german}"`,
      `"${word.english}"`,
      word.type || 'word',
      `"${(word.tags || []).join('; ')}"`,
      word.gender || '',
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  downloadFile(csvString, 'german-vocabulary.csv', 'text/csv');
};

/**
 * Export words to JSON format
 * @param {Array} words - Array of word objects
 */
export const exportToJSON = (words) => {
  const jsonString = JSON.stringify(words, null, 2);
  downloadFile(jsonString, 'german-vocabulary.json', 'application/json');
};

/**
 * Helper function to trigger file download
 * @param {string} content - File content
 * @param {string} fileName - Name of the file
 * @param {string} mimeType - MIME type of the file
 */
const downloadFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
