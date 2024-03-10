import { getCars } from "./_actions/getCars";
import { getCities } from "./_actions/getCities";
import RegisterForm from "./_components/RegisterForm";

export type carsType = {
  codigo: string;
  nome: string;
};

export type citiesType = {
  id: number;
  nome: string;
};

export default async function Register() {
  const brands: carsType[] = await getCars();
  const cities: citiesType[] = await getCities();

  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="font-bold text-2xl p-2">IF Passenger</h1>
      </header>
      <RegisterForm brands={brands} cities={cities} />
    </main>
  );
}
