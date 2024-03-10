import { PrismaClient } from '@prisma/client';
import axios from 'axios';

interface City {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: Record<string, unknown>;
  };
  'regiao-imediata': {
    id: number;
    nome: string;
  };
  'regiao-intermediara': {
    id: number;
    nome: string;
  };
  UF: {
    id: number;
    nome: string;
    sigla: string;
    regiao: {
      id: number;
      nome: string;
      sigla: string;
    };
  };
}


const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/RS/municipios');
    const cities:City[] = response.data;

    const courses: string[] = [
      'Técnico em Meio Ambiente',
      'Técnico em Administração',
      'Técnico em Informática',
      'Técnico em Química',
      'Análise e Desenvolvimento de Sistemas',
      'Processos Gerenciais',
      'Licenciatura em Letras',
      'Licenciatura em Química',
      'Engenharia Química',
      'Gestão Escolar',
      'Gestão Empresarial',
      'Engenharia de Materiais'
    ];

    // Manually insert the courses into the database
    for (const course of courses) {
      await prisma.course.create({
        data: {
          name: course,
        },
      });
    }

    for (const city of cities) {
      await prisma.city.create({
        data: {
          name: city.nome,
        },
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar as informações:", error);
  }
}

seedDatabase();