import React, { useState, useEffect } from 'react'
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FolderPlus } from "lucide-react";


function Folders() {

    const [loading, setLoading] = useState(true);

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
                <div className="bg-white h-[89vh] flex-1 rounded-xl p-5 m-5">
                    <div className='border-b flex items-end justify-end pb-5'>
                        <Dialog>
                            <DialogTrigger>
                                <div className='flex items-center gap-2 text-sm font-medium transition-colors hover:shadow-lg border rounded-lg px-3 py-2'>
                                    <FolderPlus />Add Folder
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Folder</DialogTitle>
                                    <DialogDescription>
                                        <Field>
                                            <FieldLabel htmlFor="File">Folder Name</FieldLabel>
                                            <Input
                                                id="input-field-folder"
                                                type="text"
                                                placeholder="Enter Folder Name"
                                            />
                                            <FieldDescription>Name Of the Folder</FieldDescription>
                                        </Field>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Folders