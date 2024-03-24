"use server"
import axios from "axios";

export const getCars = async () => {
  const req = await axios.get("https://parallelum.com.br/fipe/api/v1/carros/marcas");
  return req.data;
};