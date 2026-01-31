"""
Скрипт для поиска ID компании на HeadHunter
Использование: python scripts/find-hh-employer.py "Название компании"
"""

import sys
import requests
from urllib.parse import quote

def find_employer(company_name):
    """Поиск компании на HeadHunter по названию"""
    
    print(f'Поиск компании: "{company_name}"\n')
    
    url = f'https://api.hh.ru/employers?text={quote(company_name)}&per_page=20'
    
    headers = {
        'User-Agent': 'AOPlastic/1.0 (ao-plastic-website)'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        
        if not data.get('items'):
            print('❌ Компании не найдены. Попробуйте другое название.')
            return
        
        print(f"✅ Найдено компаний: {len(data['items'])}\n")
        print('=' * 80)
        
        for index, company in enumerate(data['items'], 1):
            print(f"\n{index}. {company['name']}")
            print(f"   ID: {company['id']}")
            print(f"   Открытых вакансий: {company.get('open_vacancies', 0)}")
            print(f"   URL: {company['alternate_url']}")
            
            if company.get('area'):
                print(f"   Регион: {company['area']['name']}")
            
            if company.get('description'):
                desc = company['description'][:100]
                print(f"   Описание: {desc}...")
            
            print('-' * 80)
        
        print('\n📝 Скопируйте ID нужной компании и вставьте в:')
        print('   app/api/hh-vacancies/route.ts')
        print('   const EMPLOYER_ID = "ВАШ_ID"\n')
        
    except requests.RequestException as e:
        print(f'❌ Ошибка при запросе: {e}')
    except Exception as e:
        print(f'❌ Ошибка: {e}')


def get_employer_info(employer_id):
    """Получить подробную информацию о компании по ID"""
    
    print(f'Получение информации о компании ID: {employer_id}\n')
    
    url = f'https://api.hh.ru/employers/{employer_id}'
    
    headers = {
        'User-Agent': 'AOPlastic/1.0 (ao-plastic-website)'
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        company = response.json()
        
        print('=' * 80)
        print(f"Название: {company['name']}")
        print(f"ID: {company['id']}")
        print(f"Открытых вакансий: {company.get('open_vacancies', 0)}")
        print(f"URL: {company['alternate_url']}")
        print(f"Регион: {company.get('area', {}).get('name', 'Не указан')}")
        
        if company.get('description'):
            print(f"\nОписание:")
            print(company['description'][:500])
        
        print('=' * 80)
        
        # Получаем вакансии
        vacancies_url = f'https://api.hh.ru/vacancies?employer_id={employer_id}&per_page=5'
        vac_response = requests.get(vacancies_url, headers=headers)
        
        if vac_response.ok:
            vac_data = vac_response.json()
            print(f"\n📋 Примеры вакансий (всего найдено: {vac_data['found']}):\n")
            
            for i, vac in enumerate(vac_data['items'], 1):
                print(f"{i}. {vac['name']}")
                print(f"   {vac['area']['name']}")
                if vac.get('salary'):
                    salary = vac['salary']
                    if salary.get('from') and salary.get('to'):
                        print(f"   💰 {salary['from']} - {salary['to']} {salary['currency']}")
                print(f"   🔗 {vac['alternate_url']}")
                print()
        
    except requests.RequestException as e:
        print(f'❌ Ошибка при запросе: {e}')
    except Exception as e:
        print(f'❌ Ошибка: {e}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('❌ Не указаны параметры!')
        print('\nИспользование:')
        print('  Поиск по названию:')
        print('    python scripts/find-hh-employer.py "Название компании"')
        print('\n  Информация по ID:')
        print('    python scripts/find-hh-employer.py --id 123456')
        print('\nПримеры:')
        print('  python scripts/find-hh-employer.py "АО Пластик"')
        print('  python scripts/find-hh-employer.py --id 541232')
        sys.exit(1)
    
    if sys.argv[1] == '--id' and len(sys.argv) > 2:
        get_employer_info(sys.argv[2])
    else:
        find_employer(sys.argv[1])
