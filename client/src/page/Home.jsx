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
import { MoreHorizontal, Share2, Archive, Trash2, ChevronLeft, ChevronRight, X, Star, Search, Copy, Check } from "lucide-react"
import dummyData from '../data/dummy-data.json';
import dummyUser from '../data/dummy-user-data.json';
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'

function Home() {

  const [fileStorage, setFileStorage] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedWithUser, setSharedWithUser] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const [activeFilter, setActiveFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const [emailInput, setEmailInput] = useState('') // For email input in share dialog
  const [searchQuery, setSearchQuery] = useState('') // For main search input

  const [starredFiles, setStarredFiles] = useState(new Set());
  const [archivedFiles, setArchivedFiles] = useState(new Set());

  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState([]);
  const [searchInput, setSearchInput] = useState('')
  const [sharedUsers, setSharedUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState(userData)
  const [selectedPermission, setSelectedPermission] = useState('view')

  const PERMISSIONS = ['view', 'comment', 'edit']

  const handleStarFile = (fileName) => {
    const isStarred = starredFiles.has(fileName);

    setStarredFiles(prev => {
      const newSet = new Set(prev);
      if (isStarred) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });

    // Toast after state update
    if (isStarred) {
      toast.success(`Removed ${fileName} from Starred`);
    } else {
      toast.success(`Added ${fileName} to Starred`);
    }
  };

  const handleArchiveFile = (fileName) => {
    const isArchived = archivedFiles.has(fileName);

    setArchivedFiles(prev => {
      const newSet = new Set(prev);
      if (isArchived) {
        newSet.delete(fileName);
      } else {
        newSet.add(fileName);
      }
      return newSet;
    });

    // Toast after state update
    if (isArchived) {
      toast.success(`Unarchived ${fileName}`);
    } else {
      toast.success(`Archived ${fileName}`);
    }
  };

  const handleDeleteFile = (fileName) => {
    setRecentFiles(prev => prev.filter(file => file.name !== fileName));
    toast.success(`Deleted ${fileName}`);
  };

  const clearAllFilter = () => {
    setActiveFilter('');
    setSortOrder('');
    setSearchQuery('');
    setCurrentPage(1);
  }

  const handleSortChange = (sortType) => {
    setSortOrder(sortType);
    setCurrentPage(1);
  }

  const handleFilterClick = (filtertype) => {
    setActiveFilter(activeFilter === filtertype ? '' : filtertype);
    setCurrentPage(1);
  }

  const filteredFiles = recentFiles.filter(file => {
    // Don't show archived files in the main view
    if (archivedFiles.has(file.name)) return false;

    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase());

    if (!activeFilter) return matchesSearch;

    return matchesSearch && file.type.toLowerCase() === activeFilter.toLowerCase();
  });


  // Update sorting and pagination to use filtered files
  const sortedRecentFiles = filteredFiles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (sortOrder === 'latest') {
      return dateB - dateA; // Newest first
    } else if (sortOrder === 'oldest') {
      return dateA - dateB; // Oldest first
    } else {
      // Default behavior when no sort is selected (maintain original order)
      return 0;
    }
  });


  const totalPages = Math.ceil(sortedRecentFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = sortedRecentFiles.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortOrder]);

  const [uploading, setUploading] = useState(false);


  //Pagination
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  //Page Loading Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  //Getting the Dummy Data
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

  useEffect(() => {

    try {
      const dataUser = dummyUser;
      const user = dataUser.map(user => ({
        name: user.name,
        email: user.email
      }));

      setUserData(user);

    } catch (error) {
      console.error('Error processing user data:', error);
      setUserData([]);
    }

  }, []);

  const handleSearchChange = (value) => {
    setSearchInput(value)
    const filtered = userData.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  const addUserFromList = (user) => {
    const alreadyShared = sharedUsers.some((su) => su.id === user.id)
    if (!alreadyShared) {
      setSharedUsers([
        ...sharedUsers,
        {
          ...user,
          permission: selectedPermission,
        },
      ])
    }
    setSearchInput('')
    setFilteredUsers(userData)
  }

  const addUserByEmail = () => {
    if (emailInput.trim()) {
      const alreadyShared = sharedUsers.some((su) => su.email === emailInput)
      if (!alreadyShared) {
        setSharedUsers([
          ...sharedUsers,
          {
            id: Date.now().toString(),
            name: emailInput.split('@')[0],
            email: emailInput,
            permission: selectedPermission,
          },
        ])
      }
      setEmailInput('')
    }
  }

  const removeUser = (email) => {
    setSharedUsers(sharedUsers.filter((user) => user.email !== email))
  }

  const updatePermission = (email, permission) => {
    setSharedUsers(
      sharedUsers.map((user) =>
        user.email === email ? { ...user, permission } : user
      )
    )
  }

  const handleShare = () => {
    console.log('[v0] Sharing with users:', sharedUsers)
    setIsOpen(false)
    // Reset form
    setSharedUsers([])
    setEmailInput('')
    setSearchInput('')
    setSelectedPermission('view')
  }


  const totalStorage = 16;

  const totalSize = fileStorage.reduce((sum, file) => sum + file.size, 0);
  const freeStorage = totalStorage - totalSize;
  const totalfile = fileStorage.reduce((sum, file) => sum + file.number, 0);
  const mostFile = fileStorage.reduce((max, file) => (file.number > max.number ? file : max), { number: 0 });
  const recentFile = recentFiles.length > 0 ? recentFiles.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : { date: '0', name: 'No files' };

  const filesWithPercentage = fileStorage.map(file => ({
    ...file,
    percentage: (file.size / totalStorage) * 100
  }));

  const totalSharedFiles = sharedFiles.length;
  const mostSharedFile = sharedWithUser.reduce(
    (max, file) => (file.sharedWith > max.sharedWith ? file : max),
    { sharedWith: 0 }
  );

  // //Uploading File Handler
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   setUploading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);

  //     const response = await fetch('/api/upload', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       console.log('File uploaded successfully:', result);
  //       event.target.value = '';
  //     } else {
  //       console.error('Upload failed');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  //Uploading File Handler
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      // Show loading toast
      toast.loading(`Uploading ${files.length} file(s)...`, {
        id: "upload-toast"
      });

      // Process each file
      const uploadedFiles = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Simulate upload delay for each file
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('File uploaded successfully:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });

        // Create a new file object
        const newFile = {
          name: file.name,
          type: getFileType(file.name),
          size: formatFileSize(file.size),
          date: new Date().toLocaleDateString(),
          sharedWith: 0
        };

        uploadedFiles.push(newFile);
      }

      // Add all new files to the recent files list
      setRecentFiles(prev => [...uploadedFiles, ...prev]);

      // Clear the input
      event.target.value = '';

      // Show success toast
      toast.success(`${files.length} file(s) uploaded successfully!`, {
        id: "upload-toast",
        description: `Total files: ${files.length}`,
        duration: 4000,
      });

    } catch (error) {
      console.error('Error uploading files:', error);

      // Show error toast
      toast.error("Upload failed", {
        id: "upload-toast",
        description: "Please try again.",
        duration: 4000,
      });
    } finally {
      setUploading(false);
    }
  };

  // Helper function to determine file type from filename
  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'doc':
      case 'docx':
        return 'Word';
      case 'xls':
      case 'xlsx':
        return 'Excel';
      case 'ppt':
      case 'pptx':
        return 'PowerPoint';
      default:
        return 'Unknown';
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


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
                  {filesWithPercentage.length > 0 ? (
                    filesWithPercentage.map((file) => (
                      <div key={file.name} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${file.color}`} />
                        <span className="text-sm font-medium text-slate-700">
                          {file.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 col-span-4 justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300" />
                      <span className="text-sm font-medium text-slate-500">
                        No files uploaded (0%)
                      </span>
                    </div>
                  )}
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
                        {filesWithPercentage.length === 0 ? (
                          <div className="flex items-center justify-center py-10">
                            <Field className="flex flex-col items-center justify-center max-w-xs w-full space-y-4 text-center">
                              <FieldLabel htmlFor="file" className="flex items-center justify-center">
                                No files uploaded.
                              </FieldLabel>
                            </Field>
                          </div>
                        ) : (
                          filesWithPercentage.map((file) => (
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
                          ))
                        )}
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
                  <p className="text-sm font-medium text-slate-400">Recent Files</p>
                  <p className="text-2xl font-bold text-black mt-2">{recentFile.date}</p>
                  <p className="text-xs text-slate-500 mt-1">{recentFile.name}</p>
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
                      {filesWithPercentage.length === 0 ? (
                        <DialogDescription>
                          <div className="flex items-center justify-center py-10">
                            <Field className="flex flex-col items-center justify-center max-w-xs w-full space-y-4 text-center">
                              <FieldLabel htmlFor="file" className="flex items-center justify-center">
                                No recent Files found.
                              </FieldLabel>
                            </Field>
                          </div>
                        </DialogDescription>
                      ) : (
                        <DialogDescription>
                          {filesWithPercentage.map((file) => (
                            <div key={file.name} className="flex items-center justify-between my-5">
                              <span className="text-lg text-black">{file.name}</span>
                              <span className="text-md text-black">{file.number} files</span>
                            </div>
                          ))}
                        </DialogDescription>
                      )}
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
                      {sharedFiles.length === 0 ? (
                        <DialogDescription>
                          <div className='grid grid-cols-2 gap-10'>
                            <div className="relative h-96 border rounded-lg">
                              <div className="h-full overflow-y-auto">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-white z-10 border-b">
                                    <tr>
                                      <th className="text-left p-3 font-medium">File name</th>
                                      <th className="text-right p-3 font-medium">No. of Shared</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={2} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">📂</span>
                                          </div>
                                          <p className="text-gray-600 font-medium">No Shared Files Found</p>
                                          <p className="text-sm text-gray-500">Upload documents to start sharing</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="relative h-96 border rounded-lg">
                              <div className="h-full overflow-y-auto">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-white z-10 border-b">
                                    <tr>
                                      <th className="text-left p-3 font-medium">File Name</th>
                                      <th className="text-right p-3 font-medium">Files Shared Per User</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td colSpan={2} className="text-center py-10">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                            <span className="text-2xl">👥</span>
                                          </div>
                                          <p className="text-gray-600 font-medium">No User Sharing Data</p>
                                          <p className="text-sm text-gray-500">Share files with users to see data here</p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                      ) : (
                        <DialogDescription>
                          <div className='grid grid-cols-2 gap-10'>
                            <div className="relative h-96 border rounded-lg">
                              <div className="h-full overflow-y-auto">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-white z-10 border-b">
                                    <tr>
                                      <th className="text-left p-3 font-medium">File name</th>
                                      <th className="text-right p-3 font-medium">No. of Shared</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sharedFiles.map((file, index) => (
                                      <tr key={index} className="border-b last:border-b-0">
                                        <td className="p-3 font-medium truncate">
                                          {file.name}
                                        </td>
                                        <td className="p-3 text-right">
                                          {file.sharedWith}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="relative h-96 border rounded-lg">
                              <div className="h-full overflow-y-auto">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-white z-10 border-b">
                                    <tr>
                                      <th className="text-left p-3 font-medium">File Name</th>
                                      <th className="text-right p-3 font-medium">Files Shared Per User</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sharedWithUser.sort(
                                      (a, b) => b.sharedWith - a.sharedWith
                                    ).map((file, index) => (
                                      <tr key={index} className="border-b last:border-b-0">
                                        <td className="p-3 font-medium">{file.name}</td>
                                        <td className="p-3 text-right">{file.sharedWith}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </DialogDescription>
                      )}
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm p-5 m-5 h-[59vh] flex-1 rounded-xl md:min-h-min mt-4">
            <div className='w-full flex flex-col gap-3'>
              <h1 className='text-2xl'>Recent Activity</h1>
              <div className='relative'>
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  className='border-2 rounded-full pl-8 p-1 w-full hover:border-black'
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files"
                />
              </div>
              <div className='flex flex-row items-center gap-2'>
                <p>Filter:</p>
                <Button
                  variant={activeFilter === 'Word' ? 'default' : 'outline'}
                  onClick={() => handleFilterClick('Word')}
                  className={activeFilter === 'Word' ? 'bg-blue-500 text-white' : ''}
                >
                  Word
                </Button>
                <Button
                  variant={activeFilter === 'PowerPoint' ? 'default' : 'outline'}
                  onClick={() => handleFilterClick('PowerPoint')}
                  className={activeFilter === 'PowerPoint' ? 'bg-orange-500 text-white' : ''}
                >
                  PowerPoint
                </Button>
                <Button
                  variant={activeFilter === 'Excel' ? 'default' : 'outline'}
                  onClick={() => handleFilterClick('Excel')}
                  className={activeFilter === 'Excel' ? 'bg-green-500 text-white' : ''}
                >
                  Excel
                </Button>
                <Button
                  variant={activeFilter === 'PDF' ? 'default' : 'outline'}
                  onClick={() => handleFilterClick('PDF')}
                  className={activeFilter === 'PDF' ? 'bg-red-500 text-white' : ''}
                >
                  PDF
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Sort By{sortOrder ? `: ${sortOrder === 'latest' ? 'Latest Upload' : 'Oldest Upload'}` : ''}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleSortChange('latest')}
                        className={sortOrder === 'latest' ? 'bg-blue-50 text-blue-600' : ''}
                      >
                        Latest Upload
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange('oldest')}
                        className={sortOrder === 'oldest' ? 'bg-blue-50 text-blue-600' : ''}
                      >
                        Oldest Upload
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>
                  {(activeFilter || sortOrder || searchQuery) && (
                    <Button variant="ghost" onClick={clearAllFilter} className="ml-auto hover:text-red-500">
                      <X className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className='mt-5 flex-1 flex flex-col min-h-0'>
              <Table className="flex-1">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%]">File Name</TableHead>
                    <TableHead className="text-center w-[15%]">File Type</TableHead>
                    <TableHead className="text-center w-[15%]">Date</TableHead>
                    <TableHead className="text-center w-[12%]">Size</TableHead>
                    <TableHead className="text-center w-[13%]">Shared With</TableHead>
                    <TableHead className="text-right w-[10%]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="flex-1">
                  {currentFiles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="h-75 w-full flex items-center justify-center text-gray-500">
                          <Field className="flex flex-col items-center justify-center max-w-xs w-full space-y-4 text-center">
                            <FieldLabel htmlFor="file" className="flex items-center justify-center">
                              No recent files found. Upload Document
                            </FieldLabel>

                            <Input
                              id="file"
                              type="file"
                              accept=".docx, .xlsx, .pptx, .pdf"
                              className="w-full"
                              onChange={handleFileUpload}
                              disabled={uploading}
                              multiple
                            />

                            {uploading && (
                              <p className="text-sm text-blue-600 mt-2">
                                Uploading file...
                              </p>
                            )}

                            <FieldDescription className="text-sm">
                              Select a file to upload (.docx, .xlsx, .pptx, .pdf)
                            </FieldDescription>
                          </Field>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentFiles.map((file, index) => (
                      <TableRow key={startIndex + index}>
                        <TableCell className="w-[35%] truncate" title={file.name}>{file.name}</TableCell>
                        <TableCell className="text-center w-[15%]">{file.type}</TableCell>
                        <TableCell className="text-center w-[15%]">{file.date}</TableCell>
                        <TableCell className="text-center w-[12%]">{file.size}</TableCell>
                        <TableCell className="text-center w-[13%]">{file.sharedWith}</TableCell>
                        <TableCell className="text-right w-[10%]">
                          <TableCell className="text-right w-[10%]">
                            <div className="flex items-center justify-end gap-2">
                              {/* Share Dialog - Remove nested Tooltip */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Share file">
                                    <Share2 className="w-4 h-4" />
                                    <span className="sr-only">Share</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Share File</DialogTitle>
                                    <DialogDescription>
                                      Share this file with others via email or link
                                    </DialogDescription>
                                    <Tabs defaultValue="users" className="w-full">
                                      <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="users">Share with Users</TabsTrigger>
                                        <TabsTrigger value="link">Share Link</TabsTrigger>
                                      </TabsList>
                                      <TabsContent value="users">
                                        <div className="mt-4 space-y-2">
                                          <Label htmlFor="permission">Default Permission</Label>
                                          <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                                            <SelectTrigger className="w-fit">
                                              <SelectValue placeholder="Permission" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="view">View</SelectItem>
                                              <SelectItem value="comment">Comment</SelectItem>
                                              <SelectItem value="edit">Edit</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                          <Label htmlFor="email">Share by Email</Label>
                                          <div className="flex gap-2">
                                            <Input
                                              id="email"
                                              type="email"
                                              value={emailInput}
                                              onChange={(e) => setEmailInput(e.target.value)}
                                              placeholder="Enter email"
                                              onKeyDown={(e) => e.key === 'Enter' && addUserByEmail()}
                                            />
                                            <Button onClick={addUserByEmail} size="sm">
                                              Add
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                          <Label htmlFor="search">Or select from users</Label>
                                          <div className="relative">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                              id="search"
                                              placeholder="Search users..."
                                              className="pl-8"
                                              value={searchInput}
                                              onChange={(e) => handleSearchChange(e.target.value)}
                                            />
                                          </div>
                                          {searchInput && (
                                            <ScrollArea className="h-32 border rounded-md p-2">
                                              <div className="space-y-1">
                                                {filteredUsers.map((user) => (
                                                  <button
                                                    key={user.id}
                                                    onClick={() => addUserFromList(user)}
                                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                                                  >
                                                    <div className="font-medium">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                      {user.email}
                                                    </div>
                                                  </button>
                                                ))}
                                              </div>
                                            </ScrollArea>
                                          )}
                                        </div>

                                        {sharedUsers.length > 0 && (
                                          <div className="space-y-2 my-5">
                                            <Label>Shared With</Label>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                              {sharedUsers.map((user) => (
                                                <div
                                                  key={user.email}
                                                  className="flex items-center justify-between gap-2 p-2 rounded-md border bg-muted/50"
                                                >
                                                  <div className="flex-1 min-w-0">
                                                    <div className="font-sm text-sm">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate">
                                                      {user.email}
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Select
                                                      value={user.permission}
                                                      onValueChange={(val) => updatePermission(user.email, val)}
                                                    >
                                                      <SelectTrigger className="w-28 h-8">
                                                        <SelectValue />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                        {PERMISSIONS.map((permission) => (
                                                          <SelectItem key={permission} value={permission}>
                                                            {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => removeUser(user.email)}
                                                      className="h-8 w-8 p-0"
                                                    >
                                                      <X className="w-4 h-4" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        <div className="flex gap-2 justify-end pt-2">
                                          <Button variant="outline" onClick={() => setIsOpen(false)}>
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleShare}
                                            disabled={sharedUsers.length === 0}
                                          >
                                            Share ({sharedUsers.length})
                                          </Button>
                                        </div>
                                      </TabsContent>
                                      <TabsContent value="link">
                                        <div className="space-y-2">
                                          <Label>Share via Link</Label>
                                          <p className="text-sm text-muted-foreground">
                                            Anyone with this link can access the file
                                          </p>
                                        </div>
                                        <div className="my-4 space-y-2">
                                          <Label htmlFor="share-link">Share Link</Label>
                                          <div className="flex gap-2">
                                            <Input
                                              id="share-link"
                                              value={`https://filerepository.com/share/${file.name}`}
                                              readOnly
                                              className="bg-muted"
                                            />
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="px-3"
                                              onClick={() => {
                                                navigator.clipboard.writeText(`https://filerepository.com/share/${file.name}`);
                                                toast.success("Link copied to clipboard!");
                                              }}
                                            >
                                              <Copy className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        </div>
                                        <div className="my-4 space-y-2">
                                          <Label htmlFor="link-permission">Default Permission</Label>
                                          <Select defaultValue="view">
                                            <SelectTrigger id="link-permission">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="view">View</SelectItem>
                                              <SelectItem value="comment">Comment</SelectItem>
                                              <SelectItem value="edit">Edit</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <Button onClick={() => setIsOpen(false)} className="w-full">Done</Button>
                                      </TabsContent>
                                    </Tabs>
                                  </DialogHeader>
                                </DialogContent>
                              </Dialog>

                              {/* More Actions Dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" title="More actions">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer"
                                      onSelect={() => handleStarFile(file.name)}
                                    >
                                      <Star className={`w-4 h-4 ${starredFiles.has(file.name) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                      {starredFiles.has(file.name) ? 'Unstar' : 'Star'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer"
                                      onSelect={() => handleArchiveFile(file.name)}
                                    >
                                      <Archive className="w-4 h-4" />
                                      {archivedFiles.has(file.name) ? 'Restore' : 'Archive'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                                      onSelect={() => {
                                        if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
                                          handleDeleteFile(file.name);
                                        }
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t shrink-0">
              <div className="text-sm text-gray-500">
                <div className="text-sm text-gray-500">
                  {searchQuery || activeFilter ? (
                    <>
                      Showing {startIndex + 1} to {Math.min(endIndex, sortedRecentFiles.length)} of {sortedRecentFiles.length} results
                      {/* <span className="text-blue-600">
                        {searchQuery && ` (search: "${searchQuery}")`}
                        {activeFilter && ` (filter: ${activeFilter})`}
                        {` (from ${recentFiles.length} total)`}
                      </span> */}
                    </>
                  ) : (
                    `Showing ${startIndex + 1} to ${Math.min(endIndex, sortedRecentFiles.length)} of ${sortedRecentFiles.length} results`
                  )}
                </div>
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
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  )
}

export default Home
