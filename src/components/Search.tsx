'use client'
import { useState, useRef, useEffect } from 'react';
import SubGoalList from '@/components/demo/SubGoalList';
import { searchGoals } from '@/actions/demo';
import { useProjectStore } from '@/store/projectStore';
import { Goal } from '@/lib/prisma';
import { FaSearch } from 'react-icons/fa'; // 导入搜索图标

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [goalResults, setGoalResults] = useState<Goal[]>([]);
   
    const [activeTab, setActiveTab] = useState<'goals'>('goals');
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const { currentProject } = useProjectStore();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        // 这里添加搜索逻辑，更新 searchResults
        // 示例: setSearchResults(['结果1', '结果2', '结果3']);
        setIsResultsVisible(value.length > 0);
        
        if (value.length > 0 && currentProject) {
            const goals = await searchGoals(currentProject.id, value);
            setGoalResults(goals);
            
        } else {
            setGoalResults([]);
            
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsResultsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={searchRef} className="relative">
            <input
                className="bg-gray-200 w-80 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                type="search"
                placeholder="Search ..."
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => searchTerm.length > 0 && setIsResultsVisible(true)}
            />
            {isResultsVisible && (
                <div className="z-50 absolute min-h-96 max-h-[500px] p-2 top-full left-0 w-full mt-0 bg-white border border-gray-200 rounded shadow-lg overflow-y-auto">
                    <div>
                        <h1 className="font-bold">Search</h1>
                        {goalResults.length > 0 ? (
                            <SubGoalList filteredGoals={goalResults} showadd={false} />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <FaSearch className="text-gray-400 text-3xl mb-2" />
                                <p className="text-gray-500">No goals found</p>
                            </div>
                        )}
                    </div>
                    
                </div>
            )}
        </div>
    )
}

export default Search;

