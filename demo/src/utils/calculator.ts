export function calculateSectionConsensus(upvotes: number, downvotes: number, totalUsers: number, type: 'approval' | 'removal') {
  if (type === 'approval') {
  return (upvotes - downvotes) / totalUsers;
  }
  return (downvotes - upvotes) / totalUsers;
}

/**
 * Calculates the consensus of score of a document as the average of section consensus scores.
 * @param sectionConsensuses Array of section consensus scores
 * @returns The consensus score of the document
 */
export function calculateDocumentConsensus(sectionConsensuses: number[]) {
  return sectionConsensuses.reduce((a, b) => a + b, 0) / sectionConsensuses.length;
}

/**
 * Calculates the minimum difference between upvotes and downvotes required for a vote to pass.
 * @param consensus The consensus score of the document
 * @param totalUsers total number of users who have interacted with the document
 */
export function calculateNewThreshold(consensus: number, totalUsers: number) {
  return consensus * totalUsers;
}