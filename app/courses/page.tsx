'use client';
import { useState, useEffect } from 'react';
import CourseCard from '@/components/ui/CourseCard';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  status: string;
  isFeatured: boolean;
  instructorId: string;
  created_at: string;
  updated_at: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  console.log(`${process.env.NEXT_PUBLIC_API_URL}`);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const x =`${process.env.NEXT_PUBLIC_API_URL}/courses/`;
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/`);
        if (!response.data) {
          throw new Error('Failed to get courses');
        }
        const data = await response.data;
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="courses-page">
        <div className="container" style={{ paddingTop: '120px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f4f6',
              borderTop: '4px solid #6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p>Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="container" style={{ paddingTop: '120px' }}>
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }}></i>
            <h3>Error loading courses</h3>
            <p>{error}</p>
            <button 
              onClick={() => {
                window.location.reload()
                console.log('try again');
              }} 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="container" style={{ paddingTop: '120px' }}>
        {/* Header Section */}
        <div className="header-content">
          <h1>Explore Our Courses</h1>
          <p>Discover courses taught by expert instructors</p>
          
          {/* Search Bar */}
          <div className="search-section" style={{ margin: '2rem 0' }}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Search for courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                style={{
                  padding: '12px 20px',
                  border: '1px solid var(--border)',
                  borderRadius: '25px',
                  fontSize: '1rem',
                  width: '100%',
                  maxWidth: '500px'
                }}
              />
              <i className="fas fa-search" style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}></i>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="header-actions">
            <button
              className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Courses
            </button>
            <button
              className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </button>
            <button
              className={`filter-btn ${statusFilter === 'draft' ? 'active' : ''}`}
              onClick={() => setStatusFilter('draft')}
            >
              Draft
            </button>
            <button
              className={`filter-btn ${statusFilter === 'featured' ? 'active' : ''}`}
              onClick={() => setStatusFilter('featured')}
            >
              Featured
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info" style={{ 
          textAlign: 'center', 
          margin: '2rem 0',
          color: 'var(--text-secondary)'
        }}>
          <p>Showing {filteredCourses.length} of {courses.length} courses</p>
        </div>

        {/* Courses Grid */}
        <div className="courses-container">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: 'var(--text-secondary)'
          }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h3>No courses found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Load More Button - if you want to implement pagination later */}
        {filteredCourses.length > 0 && (
          <div className="view-all-container">
            <button className="btn btn-outline btn-lg">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}