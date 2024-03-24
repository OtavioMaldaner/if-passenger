import { carsType } from "@/app/api/types";
import { getCars } from "./_actions/getCars";
import RegisterForm from "./_components/RegisterForm";

export default async function Register() {
  const brands: carsType[] = await getCars();

  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="font-bold text-2xl p-2">IF Passenger</h1>
      </header>
      <RegisterForm brands={brands} />
    </main>
  );
}
