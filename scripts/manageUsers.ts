/**
 * Завдання 1: Управління списком користувачів (CLI)
 *   npm run users                          # Показати список
 *   npm run users -- "Петро Іванов" petro@example.com   # Додати користувача
 */
import { FILES, readJSON, writeJSON } from '../lib/jsonStore';
import { errorMessage, nextId, validateUser } from '../lib/logic';
import type { User } from '../lib/types';

async function readUsers(): Promise<User[]> {
  try {
    return await readJSON<User[]>(FILES.users);
  } catch (error) {
    console.error('Помилка читання файлу:', errorMessage(error));
    return [];
  }
}

async function addUser(name: string, email: string): Promise<void> {
  const users = await readUsers();
  const validationError = validateUser(users, name, email);
  if (validationError) {
    console.error(`❌ ${validationError}`);
    return;
  }

  const newUser: User = { id: nextId(users), name, email };
  users.push(newUser);
  await writeJSON(FILES.users, users);

  console.log('\n✓ Новий користувач доданий:');
  console.log(`  ID: ${newUser.id}`);
  console.log(`  Ім'я: ${newUser.name}`);
  console.log(`  Email: ${newUser.email}`);
}

async function listUsers(): Promise<void> {
  const users = await readUsers();

  console.log('\n📋 Список всіх користувачів:\n');
  console.log("ID | Ім'я                    | Email");
  console.log('---+-------------------------+--------------------------------');
  users.forEach((user) => {
    console.log(`${String(user.id).padEnd(2)} | ${user.name.padEnd(23)} | ${user.email}`);
  });
  console.log(`\n📊 Всього користувачів: ${users.length}\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await listUsers();
  } else if (args.length >= 2) {
    await addUser(args[0].trim(), args[1].trim());
    await listUsers();
  } else {
    console.log('❌ Помилка: недостатньо аргументів');
    console.log('\nВикористання:');
    console.log('  npm run users                             # Показати список');
    console.log("  npm run users -- <ім'я> <email>           # Додати користувача");
    console.log('\nПриклад:');
    console.log('  npm run users -- "Петро Іванов" petro@example.com');
  }
}

main().catch((error) => {
  console.error('Критична помилка:', errorMessage(error));
  process.exit(1);
});
