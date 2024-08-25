"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { College } from '@/types';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface AutoTableData {
  section: string;
  column: { index: number };
  row: { index: number };
  cell: {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
  };
}

const CollegeTable: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [displayedColleges, setDisplayedColleges] = useState<College[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof College>('ranking');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [minFees, setMinFees] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [minRank, setMinRank] = useState('');
  const [maxRank, setMaxRank] = useState('');
  const loader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      const res = await fetch('/collegeData.json');
      const data = await res.json();
      setColleges(data);
      setDisplayedColleges(data.slice(0, 10));
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    const filteredColleges = colleges.filter((college) => {
      const nameMatch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
      const feesMatch = (minFees === '' || college.fees >= parseInt(minFees)) &&
                        (maxFees === '' || college.fees <= parseInt(maxFees));
      const ratingMatch = (minRating === '' || college.userRating >= parseFloat(minRating)) &&
                          (maxRating === '' || college.userRating <= parseFloat(maxRating));
      const rankMatch = (minRank === '' || college.ranking >= parseInt(minRank)) &&
                        (maxRank === '' || college.ranking <= parseInt(maxRank));
      return nameMatch && feesMatch && ratingMatch && rankMatch;
    });

    const sortedColleges = filteredColleges.sort((a, b) => {
      if (sortBy in a && sortBy in b) {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
      }
      return 0;
    });

    setDisplayedColleges(sortedColleges.slice(0, page * 10));
  }, [colleges, searchTerm, sortBy, sortOrder, page, minFees, maxFees, minRating, maxRating, minRank, maxRank]);

  const handleSort = (key: keyof College) => {
    setSortBy(key);
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);


  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Rank', 'College', 'Fees', 'Placement', 'User Rating']],
      body: displayedColleges.map(college => [
        college.ranking,
        `${college.name}\n${college.location}\n${college.approvals}${college.featured ? '\nFeatured' : ''}`,
        `₹${college.fees.toLocaleString()}`,
        `Avg: ₹${college.averagePackage.toLocaleString()}\nHighest: ₹${college.highestPackage.toLocaleString()}`,
        `${college.userRating}/10\n${college.userReviews} reviews\nBest in ${college.bestIn}`
      ]),
      styles: { cellPadding: 3, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30 },
        3: { cellWidth: 50 },
        4: { cellWidth: 40 }
      },
      margin: { top: 20 },
      didDrawCell: (data: AutoTableData) => {
        if (data.section === 'body' && data.column.index === 1 && displayedColleges[data.row.index].featured) {
          doc.setFillColor(255, 255, 0);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          doc.setTextColor(0, 0, 0);
          doc.text(data.cell.text, data.cell.x + 2, data.cell.y + 5);
        }
      }
    });
    doc.save("college_comparison.pdf");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-2xl font-bold">College Comparison</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Fees"
              value={minFees}
              onChange={(e) => setMinFees(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Fees"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Rating"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Rating"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min Rank"
              value={minRank}
              onChange={(e) => setMinRank(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Rank"
              value={maxRank}
              onChange={(e) => setMaxRank(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={exportToPDF} className="mb-4">
          Export to PDF
        </Button>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('ranking')}>Rank</th>
                <th className="border p-2">College</th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('fees')}>Fees</th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('averagePackage')}>Placement</th>
                <th className="border p-2 cursor-pointer" onClick={() => handleSort('userRating')}>User Rating</th>
              </tr>
            </thead>
            <tbody>
              {displayedColleges.map((college) => (
                <tr key={college.id} className={`${college.featured ? 'bg-yellow-100' : 'odd:bg-muted'} hover:bg-muted-foreground/10 transition-colors`}>
                  <td className="border p-2">{college.ranking}</td>
                  <td className="border p-2">
                    <div className="font-bold">{college.name}</div>
                    <div className="text-sm text-muted-foreground">{college.location}</div>
                    <div className="text-sm text-muted-foreground">{college.approvals}</div>
                    {college.featured && <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">Featured</span>}
                  </td>
                  <td className="border p-2">₹{college.fees.toLocaleString()}</td>
                  <td className="border p-2">
                    <div>Avg: ₹{college.averagePackage.toLocaleString()}</div>
                    <div className="font-semibold">Highest: ₹{college.highestPackage.toLocaleString()}</div>
                  </td>
                  <td className="border p-2">
                    <div className="text-lg font-semibold">{college.userRating}/10</div>
                    <div className="text-sm text-muted-foreground">{college.userReviews} reviews</div>
                    <div className="text-sm text-green-600">Best in {college.bestIn}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div ref={loader} className="text-center py-4">Loading more...</div>
      </CardContent>
    </Card>
  );
};

export default CollegeTable;