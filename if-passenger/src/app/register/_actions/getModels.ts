"use server"
import axios from "axios";

export const getModels = async (brand: string) => {
  const req = await axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${brand}/modelos`);
  return req.data;
};