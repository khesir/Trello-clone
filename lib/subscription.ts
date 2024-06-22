import { auth } from "@clerk/nextjs/server";

import { db } from "./db";
import { isValid } from "date-fns";

const DAY_IN_MS = 84_400_000;

export const checkSubscription = async () => {
    const { orgId } =auth()

    if(!orgId){
        return false;
    }

    const orgSubscription = await db.orgSubscription.findUnique({
        where: {
            orgId,
        },
        select: {
            stripeCustomerID: true,
            stripeCurrentPerioudEnd: true,
            stripeSubscriptionId: true,
            stripePriceId: true
        },
    });

    if (!orgSubscription){
        return false;
    }
    
    const isValid = 
        orgSubscription.stripePriceId && 
        orgSubscription.stripeCurrentPerioudEnd?.getTime()! + DAY_IN_MS > Date.now()
 
    return !!isValid;    
}