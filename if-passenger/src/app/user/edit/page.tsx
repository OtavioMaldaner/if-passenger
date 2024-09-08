import { api } from "@/app/api";
import { citiesType, courseType } from "@/app/api/types";
import { getCities } from "@/app/register/_actions/getCities";
import Header from "@/components/default/Header";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import EditProfile from "./_components/EditProfile";

export default async function EditUser() {
  const cities: citiesType[] = await getCities();
  const req = await api.get("/courses");
  const courses: courseType[] = req.data;

  return (
    <main className="flex flex-col items-center justify-center w-full h-full gap-10">
      <Header>
        <Link
          className="flex gap-1 items-center justify-center"
          href="/homepage"
        >
          <ChevronLeft size={18} /> Página Inicial
        </Link>
      </Header>

      <h1 className="text-xl">Editar Perfil</h1>

      <EditProfile cities={cities} courses={courses} />
    </main>
  );
}
