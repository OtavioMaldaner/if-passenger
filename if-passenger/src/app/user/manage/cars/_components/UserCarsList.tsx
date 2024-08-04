import { user_car_type } from "@/app/api/types";
import CarItem from "./CarItem";

export default function UserCarsList({ cars }: { cars: user_car_type[] }) {
  return (
    <section className="max-w-[92%] w-full flex items-center justify-center flex-col gap-5">
      {cars.length == 0 ? (
        <span className="text-center">
          Você ainda não possui nenhum carro registrado! <br />
          Para utilizar um veículo próprio em uma viagem, registre um agora
          mesmo!
        </span>
      ) : (
        cars.map((car) => {
          return <CarItem car={car} key={car.id} />;
        })
      )}
    </section>
  );
}
