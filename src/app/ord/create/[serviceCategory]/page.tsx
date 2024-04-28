import {getServiceCategories, getStoreData} from "@/commons/utility_functions";
import {Dialog, DialogContent, DialogOverlay, DialogPortal} from "@/components/ui/dialog";
import PaymentMethod from "@/components/transactions/PaymentMethod";
import {Loader2} from "lucide-react";
import Toaster from "@/components/ui/toaster";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {cn} from "@/lib/utils";
import Container from "@/components/Container";

export default async function Page({params}: Readonly<{params: Record<any, any>}>) {
    const storedata = await getStoreData()
    const serviceCategories =  await getServiceCategories()
    const serviceCategory = params ? `${params.serviceCategory}` : ''
    return (
        <>
            <Container
                className="xl:px-0"
                parentClassName="mt-32 pt-4 pb-32 bg-white w-full"
            >
                <Tabs defaultValue={serviceCategory}>
                    <div className="flex flex-col space-y-2 w-auto whitespace-nowrap">
                        <p className="text-xs px-1 font-sans">Choose service type:</p>
                        <TabsList className="p-1.5 h-14 divide-x-2 max-w-xl">
                            {serviceCategories.map((sc) => (
                                <TabsTrigger
                                    key={sc._id}
                                    value={sc.slug}
                                    className={cn(
                                        "font-sans",
                                        'rounded-none data-[state=active]:rounded-sm data-[state=active]:ring-blue-500 data-[state=active]:ring-1 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:bg-bermuda/90 data-[state=active]:shadow-blue-200 p-3',
                                    )}
                                >
                                    {sc.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                    </div>
                </Tabs>
            </Container>
            <Dialog
                open={false}
                defaultOpen={false}
            >
                <DialogContent className="sm:max-w-[425px]">
                    {/*<PaymentMethod amount={tot}/>*/}
                </DialogContent>
            </Dialog>
            <Dialog open={false} defaultOpen={false}>
                <DialogPortal>
                    <DialogOverlay className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-12 w-12 text-zinc-500 animate-spin"/>
                    </DialogOverlay>
                </DialogPortal>
            </Dialog>
            <Toaster/>
        </>
    )
}

