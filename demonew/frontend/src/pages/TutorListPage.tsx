import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Tutor {
    id: number;
    headline: string;
    description: string;
    hourlyRate: number;
    user: {
        username: string;
    };
}

const TutorListPage: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [subject, setSubject] = useState('');
    const [maxRate, setMaxRate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/profiles/tutor');
            setTutors(response.data);
        } catch (error) {
            console.error('Failed to fetch tutors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.get('/api/profiles/tutor/search', {
                params: { subject, maxRate: maxRate || null },
            });
            setTutors(response.data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Find Your Perfect Tutor</h2>
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by subject or keyword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Max Hourly Rate ($)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading tutors...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.length > 0 ? tutors.map((tutor) => (
                        <div key={tutor.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tutor.headline}</h3>
                                <p className="text-sm text-gray-600 mb-2">Tutor: {tutor.user.username}</p>
                                <p className="text-gray-700 mb-4 h-16 overflow-hidden">{tutor.description}</p>
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-bold text-indigo-600">${tutor.hourlyRate}/hr</p>
                                    <Link to={`/tutor/${tutor.id}`} className="bg-indigo-100 text-indigo-800 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-200 transition duration-300">
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 md:col-span-3">No tutors found. Try adjusting your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorListPage;
