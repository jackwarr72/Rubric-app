import { Sheet, ParsedRubric, ParsedCriterion } from '../types';

export function parseRubricSheet(sheet: Sheet): ParsedRubric {
  const rows = sheet.rows;
  const title = rows[0][0];

  // Heuristic: Find the header row. It usually contains "Criteria" or "Performance Criteria"
  let headerRowIndex = -1;
  for (let i = 0; i < rows.length; i++) {
    const firstCell = rows[i][0] || "";
    if (firstCell.toLowerCase().includes("criteria") || firstCell.toLowerCase().includes("student name")) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    return { title, criteria: [] };
  }

  const headerRow = rows[headerRowIndex];
  // Determine levels from columns 1, 2, 3...
  // Assumes format: [Criteria Name, Level 1, Level 2, Level 3]
  // We try to parse the score from the header text if possible (e.g. "Needs Work (1)")
  
  const criteria: ParsedCriterion[] = [];

  // Iterate through rows after header until we hit "TOTAL" or end
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    const criteriaLabel = row[0];

    // Stop conditions
    if (!criteriaLabel) continue; // Skip empty spacing rows
    if (criteriaLabel.toUpperCase().includes("TOTAL SCORE")) break;
    if (criteriaLabel.toUpperCase().includes("NOTES FOR INSTRUCTION")) break;

    // If it's a valid criteria row, it should have content in other columns corresponding to headers
    const levels = [];
    for (let col = 1; col < row.length; col++) {
      if (row[col] && headerRow[col]) {
        // Extract score from header or column index
        // Simple heuristic: column index is the score (1-based index)
        // Or try to regex the header
        const headerText = headerRow[col];
        let score = col; 
        const match = headerText.match(/\((\d+)\)/);
        if (match) {
            score = parseInt(match[1], 10);
        } else if (headerText.toLowerCase().includes("1")) score = 1;
        else if (headerText.toLowerCase().includes("2")) score = 2;
        else if (headerText.toLowerCase().includes("3")) score = 3;

        levels.push({
          score: score,
          label: headerText,
          description: row[col]
        });
      }
    }

    if (levels.length > 0) {
      criteria.push({
        id: `crit_${i}`,
        label: criteriaLabel,
        levels
      });
    }
  }

  return {
    title,
    criteria
  };
}
