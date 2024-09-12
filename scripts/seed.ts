const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main() {
  try {
    /*await database.category.createMany({
      data: [
        { name: 'S1' },
        { name: 'S2' },
        { name: 'S3' },
        { name: 'S4' },
        { name: 'S5' },
        { name: 'S6' },
      ],
    });


    await database.tag.createMany({
      data: [
        { name: 'Economie' },
        { name: 'Langues' },
        { name: 'News' },
      ],
    });*/
    
    await database.category.deleteMany({
      where: {
        name: { in: ['Cours', 'Formation'] },
      },
    });

    console.log('Success deleting categories');
  } catch (error) {
    console.log('Error interacting with the database', error);
  } finally {
    await database.$disconnect();
  }
}

main();
