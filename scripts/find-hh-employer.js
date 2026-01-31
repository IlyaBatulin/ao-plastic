async function findEmployer(companyName) {
  try {
    console.log(`Поиск компании: "${companyName}"\n`);
    
    const response = await fetch(
      `https://api.hh.ru/employers?text=${encodeURIComponent(companyName)}&per_page=20`,
      {
        headers: {
          'User-Agent': 'AOPlastic/1.0 (ao-plastic-website)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items.length === 0) {
      console.log('❌ Компании не найдены. Попробуйте другое название.');
      return;
    }
    
    console.log(`✅ Найдено компаний: ${data.items.length}\n`);
    console.log('=' .repeat(80));
    
    data.items.forEach((company, index) => {
      console.log(`\n${index + 1}. ${company.name}`);
      console.log(`   ID: ${company.id}`);
      console.log(`   Открытых вакансий: ${company.open_vacancies || 0}`);
      console.log(`   URL: ${company.alternate_url}`);
      console.log(`   Регион: ${company.area?.name || 'Не указан'}`);
      if (company.description) {
        console.log(`   Описание: ${company.description.substring(0, 100)}...`);
      }
      console.log('-'.repeat(80));
    });
    
    console.log('\n📝 Скопируйте ID нужной компании и вставьте в:');
    console.log('   app/api/hh-vacancies/route.ts');
    console.log('   const EMPLOYER_ID = "ВАШ_ID"\n');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

// Получаем название компании из аргументов командной строки
const companyName = process.argv[2];

if (!companyName) {
  console.log('❌ Не указано название компании!');
  console.log('\nИспользование:');
  console.log('  node scripts/find-hh-employer.js "Название компании"');
  console.log('\nПример:');
  console.log('  node scripts/find-hh-employer.js "АО Пластик"');
  process.exit(1);
}

findEmployer(companyName);
