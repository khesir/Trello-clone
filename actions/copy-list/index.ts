"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createSafeAction } from "@/lib/create-safe-action"
import { CopyList } from "./schema"
import { redirect } from "next/navigation"
import { ACTION, ENTITY_TYPE, List } from "@prisma/client"
import { createAuditLog } from "@/lib/create-audit-log"

const handler = async (data: InputType): Promise<ReturnType> =>{
    const {userId, orgId} = auth()

    if( !userId || !orgId){
        return{
            error: "Unauthorized"
        }
    }

    const { id, boardId } = data;

    let list : List;

    try{
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId
                },
            },
            include: {
                cards: true,
            }
        })
        
        if(!listToCopy){
            return { error: "List no found" };
        }

        const lastList = await db.list.findFirst({
            where: {boardId},
            orderBy: {order: "desc"},
            select: {order: true}
        });

        const newOrder = lastList ? lastList.order + 1: 1;
         // Create the new list without cards
        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
            },
        });
        if (listToCopy.cards.length > 0) {
            const cardsData = listToCopy.cards.map((card) => ({
                title: card.title,
                description: card.description,
                order: card.order,
                listId: list.id,
            }));
    
            await db.card.createMany({
                data: cardsData,
            });
    
            // Re-fetch the list with cards included
            list = await db.list.findUnique({
                where: {
                    id: list.id,
                },
                include: {
                    cards: true,
                }
            });
        }
        await createAuditLog({
            entityId: list.id,
            entityTitle: list.title,
            entityType: ENTITY_TYPE.LIST,
            action: ACTION.CREATE
        })
    } catch (error){
        console.log(error)
        return {
            error: "Failed to copy."
        }
    }
    revalidatePath(`/board/${boardId}`);
    return { data: list}
}


export const copyList = createSafeAction(CopyList, handler);