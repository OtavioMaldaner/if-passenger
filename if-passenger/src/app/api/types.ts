export type carsType = {
  codigo: string;
  nome: string;
};

export type citiesType = {
  id: number;
  nome: string;
};

export type courseType = {
  id: string,
  name: string,
}

export type JWTToken = {
  name: string,
  course: string,
  city: string,
  profilePic: string,
  email: string,
  exp: number,
  sub: string,
  iat: number,
  finishedRegister: boolean,
  description: string | null
}

export type address_type = {
  id: string,
  name: string,
}

export type user_car_type = {
  brand: string,
  id: string,
  licensePlate: string,
  model: string,
  passengers: number,
  fuelConsumption: number,
}

export type default_vehicles_type = {
  id: number,
  name: string,
}