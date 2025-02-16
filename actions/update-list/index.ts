"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { UpdateList } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ENTITY_TYPE, ACTION } from "@prisma/client"

const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId, orgId} = auth()

    if( !userId || !orgId){
        return{
            error: "Unauthorized"
        }
    }

    const {title, id, boardId } = data;
    console.log(data)
    let list; 

    try{
        list = await db.list.update({
            where: {
                id,
                boardId,
                board: {
                    orgId
                }
            },
            data: {
                title,
            }
        });
        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.UPDATE
        })
    } catch (error){
        console.log(error)
        return {
            error: "Failed to update."
        }
    }
    revalidatePath(`/board/${boardId}`);
    return { data : list }
}


export const updateList = createSafeAction(UpdateList, handler);