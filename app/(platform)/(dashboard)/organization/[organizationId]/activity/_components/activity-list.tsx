import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ActivityList = async () => {
    const {orgId} = auth();

    if(!orgId){
        return redirect("/select-org");
    }

    const auditlogs = await db.auditLog.findMany({
        where: {
            orgId,
        },
        orderBy: {
            createAt: "desc"
        }
    })

    return (
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
                No Activity found inside this organization
            </p>
            {auditlogs.map((log) => (
                <ActivityItem key={log.id} data={log} />
            ))}
        </ol>
    )
}

ActivityList.Skeleton = function ActivityListSkeleton(){
    return (
        <ol className="space-y-4 mt-4">
            <Skeleton className="w-[80%] h-14"/>
            <Skeleton className="w-[50%] h-14"/>
            <Skeleton className="w-[70%] h-14"/>
            <Skeleton className="w-[80%] h-14"/>
            <Skeleton className="w-[75%] h-14"/>
            <Skeleton className="w-[80%] h-14"/>
        </ol>
    )
}