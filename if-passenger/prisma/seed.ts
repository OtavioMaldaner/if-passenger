import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

async function seedDatabase() {
  try {
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
    await prisma.$disconnect();
  } catch (error) {
    console.error("Erro ao criar as informações:", error);
  }
}

seedDatabase();