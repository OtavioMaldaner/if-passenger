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
  registrationNumber: number,
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

export type trip_type = {
  id: string,
  AddressFrom: {
    name: string,
  },
  AddressTo: {
    name: string,
  },
  driver: {
    name: string,
    id: string,
    image: string,
    registrationNumber: number,
    course: {
      name: string,
    },
  },
  price: number,
  when: string
}

export type user_type = {
  id: string,
  name: string,
  course: string,
  city: string,
  image: string,
  email: string,
  description: string,
  registrationNumber: number,
  followers: number,
  following: number,
  followedByUser: boolean
}

export type follow_type = {
  user: {
    id: string,
    name: string,
    image: string,
    registrationNumber: number,
    course: { name: string }
  }
}

export type single_trip_type = {
  driver: {
    name: string,
    id: string,
    image: string,
    registrationNumber: number,
    course: {
      name: string
    },
  },
  AddressFrom: {
    name: string
  },
  AddressTo: {
    name: string
  },
  when: string,
  price: string,
  id: string,
  maxPassengers: number,
  notes: string,
  passengers: {
    id: string,
  }[]
}