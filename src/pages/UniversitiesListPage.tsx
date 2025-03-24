
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, University as UniversityIcon, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { University, universitiesAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const UniversitiesListPage = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setIsLoading(true);
        const data = await universitiesAPI.getUniversities();
        setUniversities(data);
        setFilteredUniversities(data);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load universities. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUniversities(universities);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = universities.filter(
        university =>
          university.name.toLowerCase().includes(lowercasedSearch) ||
          university.location.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, universities]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      <main className="pt-24 pb-20">
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Maharashtra Universities</h1>
                <p className="text-xl text-gray-600">
                  Browse through all universities in Maharashtra and access their study materials
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for universities by name or location..."
                  className="pl-12 py-6 text-lg rounded-full shadow-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-pulse text-xl">Loading universities...</div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-8">All Universities ({filteredUniversities.length})</h2>

                {filteredUniversities.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUniversities.map((university, index) => (
                      <motion.div
                        key={university.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="cursor-pointer"
                        onClick={() => navigate(`/university/${university.id}`)}
                      >
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="h-48 overflow-hidden">
                            <img
                              src={university.imageUrl}
                              alt={university.name}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <CardContent className="p-5">
                            <h3 className="text-xl font-bold mb-2">{university.name}</h3>
                            <div className="flex items-center text-gray-500 text-sm mb-3">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{university.location}</span>
                              <span className="mx-2">•</span>
                              <span>Est. {university.established}</span>
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-2">{university.description}</p>
                            <div className="flex items-center text-blue-600">
                              <BookOpen className="h-4 w-4 mr-1.5" />
                              <span className="font-medium">{university.resourceCount} study resources</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
                    <UniversityIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No universities found</h3>
                    <p className="text-gray-500 mb-6">
                      We couldn't find any universities matching your search criteria.
                    </p>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default UniversitiesListPage;
