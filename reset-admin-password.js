const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // Chercher tous les admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    console.log('\n=== Comptes Admin existants ===');
    if (admins.length === 0) {
      console.log('Aucun compte admin trouvé.');
      console.log('\nCréation d\'un nouveau compte admin...');
      
      const email = 'admin@anireserve.com';
      const password = 'Admin123!';
      const name = 'Administrateur';
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await prisma.admin.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      
      console.log('\n✅ Compte admin créé avec succès !');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', email);
      console.log('🔑 Mot de passe:', password);
      console.log('👤 Nom:', name);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log(`\n${admins.length} compte(s) admin trouvé(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} (${admin.email})`);
      });
      
      // Réinitialiser le mot de passe du premier admin
      const firstAdmin = admins[0];
      const newPassword = 'Admin123!';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await prisma.admin.update({
        where: { id: firstAdmin.id },
        data: { password: hashedPassword },
      });
      
      console.log('\n✅ Mot de passe réinitialisé !');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', firstAdmin.email);
      console.log('🔑 Nouveau mot de passe:', newPassword);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();

