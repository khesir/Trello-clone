import { Info } from "../_components/info"
import { Suspense } from "react"

import { ActivityList } from "./_components/activity-list"
import { Separator } from "@/components/ui/separator"

const ActivityPage = () =>{
    return(
        <div className="w-full">
            <Info />
            <Separator className="my-2"/>
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList/>
            </Suspense> 
        </div>
    )
}

export default ActivityPage

