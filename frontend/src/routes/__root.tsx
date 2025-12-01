import {createRootRouteWithContext, Outlet} from "@tanstack/react-router";
import {Toaster} from "@/components/ui/sonner.tsx";

type RootRouteContext = {
    title?: string;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
    component:RootLayoutComponent
});

function RootLayoutComponent() {
    return <WholeApp />
}

function WholeApp(){
    return (
        <div className="max-w-[1400px] flex mx-auto px-6 py-8 w-screen border-[#CBBEAA] border-3 bg-[#fffdf6] text-[#3B3024]">
            <Toaster />
            <Outlet />
        </div>
    )
}