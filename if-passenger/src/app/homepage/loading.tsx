import Header from "@/components/default/Header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex flex-col w-screen justify-center items-center">
      <Header></Header>
      <section className="text-white flex flex-col justify-center gap-7 w-full max-w-xs">
        <div>
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </section>
    </div>
  );
}
