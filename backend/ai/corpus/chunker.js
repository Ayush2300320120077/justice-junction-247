/**
 * Legal Section-Aware Text Chunker
 * Splits legal text (Bare Acts, Statutes, Code Sections) into semantically coherent sections
 * rather than arbitrary character lengths.
 */

/**
 * Extracts sections from a legal text file.
 * @param {string} text Full text content of the legal document
 * @param {string} sourceFile File name or path (e.g., 'Consumer_Protection_Act_2019.txt')
 * @param {object} options Additional options (e.g., defaultActName, maxChunkSize)
 * @returns {Array<{ text: string, metadata: { actName: string, sectionNumber: string, sectionTitle: string, sourceFile: string } }>}
 */
function chunkLegalText(text, sourceFile = '', options = {}) {
  if (!text || typeof text !== 'string') return [];

  // Infer Act Name from filename or top header
  let actName = options.defaultActName || '';
  if (!actName && sourceFile) {
    actName = sourceFile
      .replace(/\.[^/.]+$/, '') // strip extension
      .replace(/_/g, ' ')
      .trim();
  }

  // Regex pattern matching common Indian & international legal section headers:
  // Examples:
  // "Section 2.", "Section 12 - Definitions", "Sec. 5.", "CHAPTER II", "Chapter 3: Appeals", "Article 21."
  const sectionHeaderRegex = /(?:^|\n)(?=(?:SECTION|Section|SEC\.|Sec\.|CHAPTER|Chapter|ARTICLE|Article)\s+([0-9A-Za-z]+)[\s:\.\-–]*([^\n]*))/g;

  // Split text by section boundaries
  const matches = [...text.matchAll(sectionHeaderRegex)];

  const chunks = [];

  if (matches.length === 0) {
    // Fallback: If no explicit section headers are detected, chunk by paragraphs/double newlines
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    paragraphs.forEach((p, idx) => {
      chunks.push({
        text: p.trim(),
        metadata: {
          actName: actName || 'Legal Document',
          sectionNumber: `${idx + 1}`,
          sectionTitle: `Paragraph ${idx + 1}`,
          sourceFile
        }
      });
    });
    return chunks;
  }

  // Check if there is preamble/intro text before the first matched section
  const firstMatchIndex = matches[0].index;
  if (firstMatchIndex > 0) {
    const preamble = text.substring(0, firstMatchIndex).trim();
    if (preamble.length > 30) {
      chunks.push({
        text: preamble,
        metadata: {
          actName: actName || 'Legal Document',
          sectionNumber: 'Preamble',
          sectionTitle: 'Preamble / Introduction',
          sourceFile
        }
      });
    }
  }

  // Process matched sections
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const startIndex = match.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;

    const rawChunkText = text.substring(startIndex, endIndex).trim();
    const sectionNumber = match[1] ? match[1].trim() : `${i + 1}`;
    let sectionTitle = match[2] ? match[2].trim() : `Section ${sectionNumber}`;

    // Clean section title if it ends with punctuation or starts with dashes
    sectionTitle = sectionTitle.replace(/^[\s:\.\-–]+|[\s:\.\-–]+$/g, '');

    // Format chunk text with metadata header for better semantic embedding quality
    const fullChunkContent = `[${actName} - Section ${sectionNumber}: ${sectionTitle || 'General'}]\n${rawChunkText}`;

    chunks.push({
      text: fullChunkContent,
      metadata: {
        actName: actName || 'Legal Document',
        sectionNumber,
        sectionTitle: sectionTitle || `Section ${sectionNumber}`,
        sourceFile
      }
    });
  }

  return chunks;
}

module.exports = {
  chunkLegalText
};
