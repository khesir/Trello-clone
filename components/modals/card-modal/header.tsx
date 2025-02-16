"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-actions";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
    data: CardWithList
}

export const Header = ({
    data
}: HeaderProps) => {
    
    const queryClient = useQueryClient();
    const params = useParams();
    
    const {execute} = useAction(updateCard,{
        onSuccess: (newData) =>{
            queryClient.invalidateQueries({
                queryKey: ["card",newData.id]
            });

            queryClient.invalidateQueries({
                queryKey: ["card-logs",newData.id]
            });

            toast.success(`Rename to "${newData.title}"`);
            setTitle(newData.title)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const inputRef = useRef<ElementRef<"input">>(null);

    const onBlur = () => {
        inputRef.current?.form?.requestSubmit();
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = params.boardId as string;
        console.log({
            title,
            boardId,
            id: data.id,
        })
        if (title === data.title){
            return
        }
        
        execute({
            title,
            boardId,
            id: data.id,
        })
    }


    const [title, setTitle] = useState(data.title);
    
    return(
        <div className="flex items-start gap-x-3 mb-6 w-full">
            <Layout className="h-5 w-5 mt-1 text-neutral-700"/>
            <div className="w-full">
                <form action={onSubmit}>
                    <FormInput
                        onBlur={onBlur}
                        ref={inputRef}                
                        id="title"
                        defaultValue={title}
                        className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
                    />
                </form>
                <p className="text-sm text-muted-foreground">
                    in list <span className="underline">{data.list.title}</span>
                </p>
            </div>
        </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200"/>
            <div>
                <Skeleton className="h-6 w-24 mb-1 bg-neutral-200"/>
                <Skeleton className="h-6 w-12  bg-neutral-200"/>
            </div>
        </div>
    )
}