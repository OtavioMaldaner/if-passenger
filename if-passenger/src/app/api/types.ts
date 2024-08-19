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
  price: number,
  id: string,
  maxPassengers: number,
  notes: string,
  passengers: {
    id: string,
    User?: {
      image: string,
      name: string,
      id: string,
      registrationNumber: number,
      course: {
        name: string
      },
      Following: {
        userId: string
      }
    }
  }[],
  car?: {
    brand: string,
    model: string,
    licensePlate: string,
  },
  DifferentVehicles?: {
    name: string,
  },
}

export type daily_trip_type = {
  driver: {
    name: string,
    id: string,
    image: string,
  },
  AddressFrom: {
    name: string
  },
  AddressTo: {
    name: string
  },
  when: string,
  price: number,
  id: string,
  car?: {
    brand: string,
    licensePlate: string,
    model: string
  },
  DifferentVehicles?: {
    name: string,
  },
  passengers: {
    id: string,
    User?: {
      image: string,
      name: string
    }[]
  }[]
}

export type notification_type = {
  id: number;
  userId: string;
  type: string;
  content: string;
  image: string;
  happenedAt: string;
  tripReqId: number | null;
  deletedAt: string | null;
}

export enum notification_content_types {
  TRIP_REQUEST = "TRIP_REQUEST",
  STARTED_FOLLOW = "STARTED_FOLLOW",
  ACCEPTED_TRIP_REQUEST = "ACCEPTED_TRIP_REQUEST",
  REFUSED_TRIP_REQUEST = "REFUSED_TRIP_REQUEST"
}