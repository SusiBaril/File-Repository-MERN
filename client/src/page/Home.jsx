import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const totalStorage = 16;

  const fileStorage = [
    { name: 'PDF', color: 'bg-red-400', size: 2.5, number: 24 },
    { name: 'Word', color: 'bg-blue-400', size: 2.5, number: 15 },
    { name: 'Excel', color: 'bg-green-400', size: 1.5, number: 45 },
    { name: 'PowerPoint', color: 'bg-orange-400', size: 3.5, number: 3 },
  ];

  const totalSize = fileStorage.reduce((sum, file) => sum + file.size, 0);
  const freeStorage = totalStorage - totalSize;
  const totalfile = fileStorage.reduce((sum, file) => sum + file.number, 0);
  const mostFile = fileStorage.reduce((max, file) => file.number > max.number ? file : max);
  const leastFile = fileStorage.reduce((min, file) => file.number < min.number ? file : min);

  const files = fileStorage.map(file => ({
    ...file,
    percentage: (file.size / totalStorage) * 100
  }));

  const sharedFiles = [
    { name: 'ProjectPlan.pdf', sharedWith: 5 },
    { name: 'Budget.xlsx', sharedWith: 3 },
    { name: 'Presentation.pptx', sharedWith: 8 },
    { name: 'Report.docx', sharedWith: 2 },
  ];

  // const sharedWithUser = [
  //   {}
  // ];


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
                {/* Storage Bar */}
                <div className="flex rounded-full overflow-hidden h-8 bg-slate-200">
                  {files.map((file) => (
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

                {/* Free storage */}
                <div className="flex justify-end text-sm mt-2">
                  <span className="font-semibold text-slate-700">
                    {freeStorage.toFixed(2)} GB free
                  </span>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-4 gap-4 mt-5">
                  {files.map((file) => (
                    <div key={file.name} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${file.color}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
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
                        {files.map((file) => (
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
                      <DialogTitle className="border-b pb-5">Storage Details</DialogTitle>
                      <DialogDescription>
                        {files.map((file) => (
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
                  <p className="text-3xl font-bold text-black mt-2">{totalfile.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-1">files stored</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <p className="text-sm font-medium text-slate-400">Shared With Users</p>
                  <p className="text-3xl font-bold text-black mt-2">{mostFile.number}</p>
                  <p className="text-xs text-slate-500 mt-1">{mostFile.name}</p>
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
                      <DialogTitle className="border-b pb-5">Storage Details</DialogTitle>
                      <DialogDescription>
                        {files.map((file) => (
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
          </div>

          <div className="bg-white shadow-sm p-5 m-5 h-[59vh] flex-1 rounded-xl md:min-h-min mt-4">
            Actual page content goes here
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
