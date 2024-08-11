import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font=Poppins({
    subsets: ['latin'],
    weight: ["200", "300", "400", "500", "600","800"]
})


export const Logo=()=>{
    return (
        <div className="flex flex-col items-center gap-y-4 pb-4">
            <div className="bg-white rounded-full p-1">
                <Image src="/spooky.svg" alt="GameHub" width="70" height="70"/>
            </div>
            <div className="flex flex-col items-center">
                <p className={cn(
                    "text-xl font-semibold ",
                    font.className
                )}>
                    KalieDoScope
                </p>
                <p className={
                    cn(
                        "text-sm text-muted-foreground",
                        font.className
                    )}>
                        Let&apos;s Stream
                </p>
            </div>
        </div>
    )
}