import React, { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Search, X, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import dummyData from "../../data/dummy-data.json"

function Starred() {
    const [loading, setLoading] = useState(true);
    const [starredFiles, setStarredFiles] = useState([]);
    const [starredSet, setStarredSet] = useState(new Set());
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12); // You can make this configurable

    useEffect(() => {
        try {
            const starredFileData = dummyData.filter(file => file.starred === true);
            const starredNames = new Set(starredFileData.map(file => file.name));

            setStarredFiles(starredFileData);
            setStarredSet(starredNames);
        } catch (error) {
            console.error("Error loading starred files:", error);
            setStarredFiles([]);
            setStarredSet(new Set());
        }
    }, []);

    const handleStarFile = (fileName) => {
        const isStarred = starredSet.has(fileName);

        setStarredSet(prev => {
            const newSet = new Set(prev);
            if (isStarred) {
                newSet.delete(fileName);
            } else {
                newSet.add(fileName);
            }
            return newSet;
        });

        // Update the starred files list
        if (isStarred) {
            // Remove from starred files
            setStarredFiles(prev => prev.filter(file => file.name !== fileName));
            toast.success(`Removed ${fileName} from Starred`);
        } else {
            // Add to starred files (find from original data)
            const fileToAdd = dummyData.find(file => file.name === fileName);
            if (fileToAdd) {
                setStarredFiles(prev => [...prev, fileToAdd]);
                toast.success(`Added ${fileName} to Starred`);
            }
        }
    };

    // Pagination calculations
    const totalFiles = starredFiles.length;
    const totalPages = Math.ceil(totalFiles / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFiles = starredFiles.slice(startIndex, endIndex);

    // Pagination functions
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset to first page when files change
    useEffect(() => {
        setCurrentPage(1);
    }, [starredFiles.length]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {loading ? (
                <div className="animate-pulse">
                    <div className="bg-muted/50 h-[89vh] flex-1 rounded-xl p-5 m-5" />
                </div>
            ) : (
                <div>
                    <div className="bg-white m-5 p-5 rounded-xl h-[89vh] flex flex-col">
                        <div className='w-full flex flex-col gap-3'>
                            <h1 className='text-2xl'>Starred Files</h1>
                            <div className='relative'>
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    className='border-2 rounded-full pl-8 p-1 w-full hover:border-black'
                                    type="text"
                                    id="search"
                                    placeholder="Search starred files"
                                />
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <p>Filter:</p>
                                <Button variant="outline">Word</Button>
                                <Button variant="outline">PowerPoint</Button>
                                <Button variant="outline">Excel</Button>
                                <Button variant="outline">PDF</Button>
                                <div>
                                    <Button variant="ghost" className="ml-auto hover:text-red-500">
                                        <X className="w-4 h-4" />
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Table with flex-1 to take remaining space */}
                        <div className="mt-5 flex-1 flex flex-col min-h-0">
                            <Table className="flex-1">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">File Name</TableHead>
                                        <TableHead className="w-[20%]">File Type</TableHead>
                                        <TableHead className="w-[20%]">Size</TableHead>
                                        <TableHead className="text-right w-[20%]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {starredFiles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-10">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Star className="w-12 h-12 text-gray-300" />
                                                    <p className="text-gray-500">No starred files found</p>
                                                    <p className="text-sm text-gray-400">Star files to see them here</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentFiles.map((file, index) => (
                                            <TableRow key={startIndex + index}>
                                                <TableCell className="font-medium truncate" title={file.name}>
                                                    {file.name}
                                                </TableCell>
                                                <TableCell>{file.type}</TableCell>
                                                <TableCell>{file.size}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStarFile(file.name)}
                                                        className="h-8 w-8 p-0"
                                                        title="Remove from starred"
                                                    >
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination - Fixed at bottom */}
                        {starredFiles.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t shrink-0 ">
                                <div className="text-sm text-gray-500">
                                    Showing {startIndex + 1} to {Math.min(endIndex, totalFiles)} of {totalFiles} starred files
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNumber;
                                            if (totalPages <= 5) {
                                                pageNumber = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNumber = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNumber = totalPages - 4 + i;
                                            } else {
                                                pageNumber = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNumber}
                                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => goToPage(pageNumber)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {pageNumber}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Toaster
                position="top-right"
                expand={true}
                richColors
                closeButton
            />
        </div>
    )
}

export default Starred