export interface College {
    id: number;
    name: string;
    location: string;
    approvals: string;
    course: string;
    cutoff: number | null;
    fees: number;
    averagePackage: number;
    highestPackage: number;
    userRating: number;
    userReviews: number;
    bestIn: string;
    ranking: number;
    featured: boolean;
  }