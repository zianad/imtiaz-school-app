import React, { useMemo } from 'react';
import { useTranslation } from '../../../../packages/core/i18n';
import { SearchResult } from '../../../../packages/core/types';

interface SearchHeaderProps {
    schoolName: string;
    query: string;
    onQueryChange: (query: string) => void;
    isSearching: boolean;
    results: SearchResult[];
    onResultClick: (result: SearchResult) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ schoolName, query, onQueryChange, isSearching, results, onResultClick }) => {
    const { t } = useTranslation();

    const groupedResults = useMemo(() => {
        return results.reduce((acc, result) => {
            const key = result.type;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(result);
            return acc;
        }, {} as Record<string, SearchResult[]>);
    }, [results]);

    const showResults = query.length >= 2;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4" dir="rtl">
            <div className="relative max-w-2xl mx-auto">
                <div className="relative flex items-center">
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={t('searchPlaceholder', { schoolName })}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-300 text-gray-800 dark:text-gray-100"
                        aria-label="Search"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {isSearching ? (
                            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </div>

                {showResults && (
                    <div className="absolute top-full mt-2 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[60vh] overflow-y-auto animate-fade-in-fast">
                        {isSearching && results.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">...</div>
                        ) : !isSearching && results.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">{t('noResultsFound')}</div>
                        ) : (
                            Object.entries(groupedResults).map(([type, items]) => (
                                <div key={type} className="p-2">
                                    <h3 className="px-3 py-1 text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t(type as any)}</h3>
                                    <ul>
                                        {items.map((result, index) => (
                                            <li key={`${type}-${index}`}>
                                                <button onClick={() => onResultClick(result)} className="w-full text-right p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                                                    <span className="text-xl">{result.icon}</span>
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{result.title}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{result.description}</p>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
             <style>{`
                @keyframes animate-fade-in-fast {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-fast {
                    animation: animate-fade-in-fast 0.2s ease-out forwards;
                }
            `}</style>
        </header>
    );
};

export default SearchHeader;
