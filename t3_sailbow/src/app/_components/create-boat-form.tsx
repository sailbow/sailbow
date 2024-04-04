"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type CreateBoat, createBoatSchema, type BoatBanner } from "@/lib/schemas/boat";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react"
import BannerModal from "./banner-modal";
import BoatBannerView from "./boat-banner-view";
import { useState } from "react";

const defaultBanner: BoatBanner = {
    bannerType: "color",
    bannerValue: "#99f6e4"
}
export function CreateBoatForm() {
    const router = useRouter();
    const { toast } = useToast();
    const { isLoading, mutate } = api.dock.createBoat.useMutation({
        onSuccess: (res) => {
            router.push(`/dock/${res.boatId}`)
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Oops!",
                description: "Something went wrong, please try again later",
            })
        }
    })
    const [banner, setBanner] = useState<BoatBanner>(defaultBanner)

    const form = useForm<CreateBoat>({
        resolver: zodResolver(createBoatSchema),
        defaultValues: {
            ...defaultBanner,
            name: "",
            description: "",
            crewInvites: [],
            // bannerPosition: 0,
        },
    });

    function onSubmit(values: CreateBoat) {
        mutate(values);
    }


    return (
        <Form {...form}>
            <SheetHeader>
                <SheetTitle>
                    Create a boat
                </SheetTitle>
            </SheetHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="relative h-[250px] w-full">
                    <BoatBannerView banner={banner} />
                    <div className="absolute bottom-0">
                        <BannerModal onBannerChange={(b) => {
                            setBanner(b)
                            form.setValue("bannerType", b.bannerType)
                            form.setValue("bannerValue", b.bannerValue)
                        }} />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field as TextareaProps}
                                    placeholder="A description of your trip"
                                    className="min-h-32"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <SheetFooter>
                    {isLoading
                        ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Save
                            </Button>
                        )
                        : (
                            <Button type="submit">Save</Button>
                        )
                    }
                </SheetFooter>
            </form>
        </Form>
    )
}
