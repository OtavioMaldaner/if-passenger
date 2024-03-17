import { api } from "../api";
import { carsType, citiesType, courseType } from "../api/types";
import { getCars } from "./_actions/getCars";
import { getCities } from "./_actions/getCities";
import RegisterForm from "./_components/RegisterForm";

export default async function Register() {
  const brands: carsType[] = await getCars();
  const cities: citiesType[] = await getCities();
  const req = await api.get("/courses");
  const courses: courseType[] = req.data;

  return (
    <main className="flex flex-col gap-5">
      <header>
        <h1 className="font-bold text-2xl p-2">IF Passenger</h1>
      </header>
      <RegisterForm courses={courses} brands={brands} cities={cities} />
    </main>
  );
}
