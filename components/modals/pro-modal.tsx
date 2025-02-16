"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-actions";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
    const proModal = useProModal();

    const { execute, isLoading } =useAction(stripeRedirect,{
        onSuccess: (data) => {
            window.location.href =data;
        },
        onError: (error) =>{
            toast.error(error)
        }
    })
    const onClick = () => {
        execute({})
    }
    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                    <Image
                        src = "/hero.png"
                        alt="Hero"
                        className="object-cover"
                        fill
                    />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className="font-semibold text-xl">
                        Upgrade to Trewoo Pro Today!
                    </h2>
                    <p className="text-xs font-semibold text-neutral-600">
                        Explore the best of Trewoo
                    </p>
                    <div className="pl-3">
                        <ul className="text-sm list-disc">
                        <li>Unlimited boards</li>
                        <li>Advanced Checklists</li>
                        <li>Admin and security features</li>
                        <li>and more!</li>
                        </ul>
                    </div>
                    <Button className="w-full" variant={"primary"} disabled={isLoading} onClick={onClick}>
                        Upgrade
                    </Button>
                </div>
            </DialogContent>

        </Dialog>
    )
}