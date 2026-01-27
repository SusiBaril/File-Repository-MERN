import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { MoreHorizontal, Share2, Archive, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import dummyData from '../data/dummy-data.json';
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function Home() {

  const [fileStorage, setFileStorage] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedWithUser, setSharedWithUser] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const sortedRecentFiles = recentFiles.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.ceil(sortedRecentFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = sortedRecentFiles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Remove the fetch and use the imported dummyData directly
    try {
      const data = dummyData; // Use imported data

      const shared = data.map(file => ({
        name: file.name,
        sharedWith: file.sharedWith
      }));

      const sharedWith = data.map(file => ({
        name: file.name,
        sharedWith: file.sharedWith
      }));

      const individualFiles = data.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        date: file.date || new Date().toLocaleDateString(),
        sharedWith: file.sharedWith || 0
      }))

      const storage = Object.values(
        data.reduce((acc, file) => {
          if (!acc[file.type]) {
            acc[file.type] = {
              name: file.type,
              color: '',
              size: 0,
              number: 0
            };
            // Assign colors for charts
            if (file.type === 'PDF') acc[file.type].color = 'bg-red-400';
            if (file.type === 'Word') acc[file.type].color = 'bg-blue-400';
            if (file.type === 'Excel') acc[file.type].color = 'bg-green-400';
            if (file.type === 'PowerPoint') acc[file.type].color = 'bg-orange-400';
          }
          // Convert MB/GB to GB
          let sizeGB = file.size.includes('MB') ? parseFloat(file.size) / 1024 : parseFloat(file.size);
          acc[file.type].size += sizeGB;
          acc[file.type].number += 1;
          return acc;
        }, {})
      );

      setSharedFiles(shared);
      setSharedWithUser(sharedWith);
      setFileStorage(storage);
      setRecentFiles(individualFiles);

    } catch (error) {
      console.error('Error processing data:', error);
      // Set empty arrays as fallback
      setSharedFiles([]);
      setSharedWithUser([]);
      setFileStorage([]);
      setRecentFiles([]);
    }
  }, []);

  const totalStorage = 16;

  const totalSize = fileStorage.reduce((sum, file) => sum + file.size, 0);
  const freeStorage = totalStorage - totalSize;
  const totalfile = fileStorage.reduce((sum, file) => sum + file.number, 0);
  const mostFile = fileStorage.reduce((max, file) => (file.number > max.number ? file : max), { number: 0 });
  const leastFile = fileStorage.reduce((min, file) => (file.number < min.number ? file : min), { number: 0 });

  const filesWithPercentage = fileStorage.map(file => ({
    ...file,
    percentage: (file.size / totalStorage) * 100
  }));

  const totalSharedFiles = sharedFiles.length;
  const mostSharedFile = sharedWithUser.reduce(
    (max, file) => (file.sharedWith > max.sharedWith ? file : max),
    { sharedWith: 0 }
  );




  return (
    <div>
      {loading ? (
        <div className="animate-pulse">
          <div className="grid auto-rows-min gap-4 m-5 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min mt-4" />
        </div>
      ) : (
        <div>
          <div className="grid auto-rows-min gap-4 m-5 md:grid-cols-3">
            <div className="bg-white shadow-sm aspect-video p-5 rounded-xl flex flex-col">
              {/* Header */}
              <h1 className="text-3xl mb-4">Storage</h1>

              {/* Main Content */}
              <div>

                <div className="flex rounded-full overflow-hidden h-8 bg-slate-200">
                  {filesWithPercentage.map((file) => (
                    <div
                      key={file.name}
                      className={`${file.color} transition-all duration-500 ease-out`}
                      style={{ width: `${file.percentage}%` }}
                      title={`${file.name}: ${file.size.toFixed(1)}GB`}
                    />
                  ))}

                  <div
                    className="bg-gray-300"
                    style={{ width: `${(freeStorage / totalStorage) * 100}%` }}
                    title={`Free: ${freeStorage.toFixed(2)}GB`}
                  />
                </div>


                <div className="flex justify-end text-sm mt-2">
                  <span className="font-semibold text-slate-700">
                    {freeStorage.toFixed(2)} GB / 16GB
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-5">
                  {filesWithPercentage.map((file) => (
                    <div key={file.name} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${file.color}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-end">
                <Dialog>
                  <DialogTrigger
                    className="relative cursor-pointer inline-block
        after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0
        after:bg-current after:transition-[width] after:duration-300
        after:ease-out hover:after:w-full"
                  >
                    View Details
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Storage Details</DialogTitle>

                      <DialogDescription>
                        {filesWithPercentage.map((file) => (
                          <div
                            key={file.name}
                            className="flex items-center justify-between gap-3 mb-3"
                          >
                            {/* File name */}
                            <span className="w-16 text-sm">{file.name}</span>

                            {/* Progress bar */}
                            <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`${file.color} h-full rounded-full
                    transition-all duration-500 ease-out`}
                                style={{ width: `${file.percentage}%` }}
                              />
                            </div>

                            {/* Size */}
                            <span className="w-20 text-right text-sm">
                              {file.size.toFixed(2)} GB
                            </span>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>


            <div className="bg-white shadow-sm aspect-video p-5 rounded-xl flex flex-col">
              {/* Header */}
              <h1 className="text-3xl">File Count</h1>

              {/* Content */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Total Files</p>
                  <p className="text-3xl font-bold text-black mt-2">{totalfile.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">files stored</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Most Files</p>
                  <p className="text-3xl font-bold text-black mt-2">{mostFile.number}</p>
                  <p className="text-xs text-slate-500 mt-1">{mostFile.name}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Least Files</p>
                  <p className="text-3xl font-bold text-black mt-2">{leastFile.number}</p>
                  <p className="text-xs text-slate-500 mt-1">{leastFile.name}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto border-t flex justify-end pt-4">
                <Dialog>
                  <DialogTrigger className="relative cursor-pointer inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full">
                    View Details
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="border-b pb-5">Files Details</DialogTitle>
                      <DialogDescription>
                        {filesWithPercentage.map((file) => (
                          <div key={file.name} className="flex items-center justify-between my-5">
                            <span className="text-lg text-black">{file.name}</span>
                            <span className="text-md text-black">{file.number} files</span>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="bg-white shadow-sm aspect-video p-5 rounded-xl flex flex-col">
              <h1 className="text-3xl">Shared File</h1>

              {/* Content */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Total Shared Files</p>
                  <p className="text-3xl font-bold text-black mt-2">{totalSharedFiles.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">Shared Files</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Top Shared File</p>
                  <p className="text-3xl font-bold text-black mt-2">{mostSharedFile.sharedWith}</p>
                  <p className="text-xs text-slate-500 mt-1">{mostSharedFile.name}</p>
                </div>
              </div>

              <div className="mt-auto border-t flex justify-end pt-4">
                <Dialog>
                  <DialogTrigger className="relative cursor-pointer inline-block after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full">
                    View Details
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-5xl p-6">
                    <DialogHeader>
                      <DialogTitle className="border-b pb-5">Shared File Details</DialogTitle>
                      <DialogDescription>
                        <div className='grid grid-cols-2 gap-10'>
                          <div className="max-h-96 overflow-y-auto">
                            <Table className="w-full">
                              <TableHeader className="sticky top-0 bg-white">
                                <TableRow>
                                  <TableHead className="w-25">File name</TableHead>
                                  <TableHead className="text-end">No. of Shared</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sharedFiles.map((file, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium truncate">
                                      {file.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {file.sharedWith}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            <Table className="w-full">
                              <TableHeader className="sticky top-0 bg-white">
                                <TableRow>
                                  <TableHead className="w-25">File Name</TableHead>
                                  <TableHead className="text-end">Files Shared Per User</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {sharedWithUser.sort(
                                  (a, b) => b.sharedWith - a.sharedWith
                                ).map((file, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{file.name}</TableCell>
                                    <TableCell className="text-right">{file.sharedWith}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm p-5 m-5 h-[59vh] flex-1 rounded-xl md:min-h-min mt-4">
            <div className='w-full flex flex-col gap-3'>
              <h1 className='text-2xl'>Recent Activity</h1>
              <input
                className='border-2 border-black rounded-full p-2 w-full'
                type="text"
                placeholder='Search'
              />
              <div>
                <input type="submit" value="Filter" className='cursor-pointer' />

              </div>
            </div>
            <div className='mt-5 flex-1 flex flex-col'>
              <Table className="flex-1">
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead className="text-center">File Type</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Size</TableHead>
                    <TableHead className="text-center">Shared With</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex-1">
                  {currentFiles.length === 0 ? (
                    <TableRow className="h-full">
                      <TableCell colSpan={6} className="text-center h-75 align-middle">
                        <div className='flex flex-col items-center justify-center h-full text-gray-500 space-y-4'>
                          <Field className="flex flex-col items-center justify-center max-w-xs w-full space-y-2">
                            <FieldLabel htmlFor="file" className="text-center">No recent files found. Upload Document</FieldLabel>
                            <Input
                              id="file"
                              type="file"
                              accept=".docx, .xlsx, .pptx, .pdf"
                              className="w-full"
                            />
                            <FieldDescription className="text-center text-sm">
                              Select a file to upload (.docx, .xlsx, .pptx, .pdf)
                            </FieldDescription>
                          </Field>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentFiles.map((file, index) => (
                      <TableRow key={startIndex + index}>
                        <TableCell className="">{file.name}</TableCell>
                        <TableCell className="text-center">{file.type}</TableCell>
                        <TableCell className="text-center">{file.date}</TableCell>
                        <TableCell className="text-center">{file.size}</TableCell>
                        <TableCell className="text-center">{file.sharedWith}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="cursor-pointer h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Share2 className="w-4 h-4" />
                                  Share File
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Archive className="w-4 h-4" />
                                  Archive
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                  Delete
                                </DropdownMenuItem>

                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedRecentFiles.length)} of {sortedRecentFiles.length} results
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
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNum}
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

          </div>

        </div>
      )}
    </div>
  )
}

export default Home
