"use server"
import axios from "axios";

export const getCities = async () => {
  const req = await axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/RS/municipios");
  return req.data;
};