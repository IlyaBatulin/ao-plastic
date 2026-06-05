// АВТОСГЕНЕРИРОВАНО скриптом scripts/generate-disclosure-ts.mjs
// Источник: https://oaoplastic.ru/about/raskrytie-informatsii
// Файлы документов лежат в public/documents/disclosure/.

export interface DisclosureDocument {
  title: string
  file: string
  fileType: string
  size?: number
}

export interface DisclosureSubsection {
  title: string
  docs: DisclosureDocument[]
}

export interface DisclosureSection {
  title: string
  docs: DisclosureDocument[]
  subsections: DisclosureSubsection[]
}

export const disclosureHero = {
  ru: {
    heroTitle: "Раскрытие информации",
    heroSubtitle: "Раскрытие информации по регулируемым видам деятельности",
    note: "Абонентский номер для обращений потребителей услуг по передаче электрической энергии и (или) технологическому присоединению: +7 (48731) 2-47-96; +7 (48731) 2-44-21",
    download: "Скачать",
  },
  en: {
    heroTitle: "Information Disclosure",
    heroSubtitle: "Disclosure of information on regulated activities",
    note: "Contact number for consumers of electricity transmission and (or) technological connection services: +7 (48731) 2-47-96; +7 (48731) 2-44-21",
    download: "Download",
  },
}

export const disclosureSections: DisclosureSection[] = [
  {
    "title": "Раскрытие информации в сфере холодного водоснабжения",
    "docs": [
      {
        "title": "Контактная информация",
        "file": "/documents/disclosure/kontaktnaya-informaciya.doc",
        "fileType": "DOC",
        "size": 38400
      },
      {
        "title": "Программа контроля качества воды",
        "file": "/documents/disclosure/programma-kontrolya-kachestva-vody.pdf",
        "fileType": "PDF",
        "size": 5474075
      }
    ],
    "subsections": [
      {
        "title": "Порядок выполнения технологических мероприятий, связанных с подключением к системе водоснабжения",
        "docs": [
          {
            "title": "Бланк заявления на подключение",
            "file": "/documents/disclosure/blank-zayavleniya-na-podklyuchenie.pdf",
            "fileType": "PDF",
            "size": 92639
          },
          {
            "title": "Перечень документов предоставляемых с заявкой на подключение",
            "file": "/documents/disclosure/perechen-dokumentov-predostavlyaemyh-s-zayavkoy-na-podklyuchenie.doc",
            "fileType": "DOC",
            "size": 29696
          },
          {
            "title": "Порядок действий организации и заявителя при осуществлении подключения",
            "file": "/documents/disclosure/poryadok-deystviy-organizacii-i-zayavitelya-pri-osuschestvlenii-podkly.doc",
            "fileType": "DOC",
            "size": 44032
          }
        ]
      },
      {
        "title": "Условия осуществления поставки регулируемых товаров и (или) осуществление регулируемых услуг",
        "docs": [
          {
            "title": "Типовой договор о подключении к системе водоснабжения",
            "file": "/documents/disclosure/tipovoy-dogovor-o-podklyuchenii-k-sisteme-vodosnabzheniya.docx",
            "fileType": "DOCX",
            "size": 69268
          },
          {
            "title": "Типовой договор на холодное водоснабжение",
            "file": "/documents/disclosure/tipovoy-dogovor-na-holodnoe-vodosnabzhenie.pdf",
            "fileType": "PDF",
            "size": 375143
          }
        ]
      },
      {
        "title": "Основные потребительские характеристики",
        "docs": [
          {
            "title": "Основные потребительские характеристики за 2013 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2013-god.pdf",
            "fileType": "PDF",
            "size": 87365
          },
          {
            "title": "Основные потребительские характеристики за 2014 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2014-god.pdf",
            "fileType": "PDF",
            "size": 335681
          },
          {
            "title": "Основные потребительские характеристики за 2015 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2015-god.pdf",
            "fileType": "PDF",
            "size": 491977
          },
          {
            "title": "Основные потребительские характеристики за 2016 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2016-god.xls",
            "fileType": "XLS",
            "size": 30720
          },
          {
            "title": "Основные потребительские характеристики за 2017 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2017-god.xlsx",
            "fileType": "XLSX",
            "size": 14162
          },
          {
            "title": "Основные потребительские характеристики за 2018 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2018-god.xls",
            "fileType": "XLS",
            "size": 34304
          },
          {
            "title": "Основные потребительские характеристики за 2019 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2019-god.xls",
            "fileType": "XLS",
            "size": 34304
          },
          {
            "title": "Основные потребительские характеристики за 2020 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 25974
          },
          {
            "title": "Основные потребительские характеристики за 2021 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2021-god.pdf",
            "fileType": "PDF",
            "size": 25932
          },
          {
            "title": "Основные потребительские характеристики за 2022 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2022-god.pdf",
            "fileType": "PDF",
            "size": 40129
          },
          {
            "title": "Основные потребительские характеристики за 2023 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2023-god.pdf",
            "fileType": "PDF",
            "size": 40695
          },
          {
            "title": "Основные потребительские характеристики за 2024 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2024-god.pdf",
            "fileType": "PDF",
            "size": 117787
          },
          {
            "title": "Основные потребительские характеристики за 2025 год",
            "file": "/documents/disclosure/osnovnye-potrebitelskie-harakteristiki-za-2025-god.pdf",
            "fileType": "PDF",
            "size": 119654
          }
        ]
      },
      {
        "title": "Показатели хозяйственной деятельности",
        "docs": [
          {
            "title": "Показатели хозяйственной деятельности за 2013 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2013-god.pdf",
            "fileType": "PDF",
            "size": 160148
          },
          {
            "title": "Показатели хозяйственной деятельности за 2014 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2014-god.pdf",
            "fileType": "PDF",
            "size": 1003277
          },
          {
            "title": "Показатели хозяйственной деятельности за 2015 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2015-god.pdf",
            "fileType": "PDF",
            "size": 818552
          },
          {
            "title": "Показатели хозяйственной деятельности за 2016 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2016-god.xls",
            "fileType": "XLS",
            "size": 40448
          },
          {
            "title": "Показатели хозяйственной деятельности за 2017 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2017-god.xlsx",
            "fileType": "XLSX",
            "size": 17757
          },
          {
            "title": "Показатели хозяйственной деятельности за 2018 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2018-god.xls",
            "fileType": "XLS",
            "size": 43520
          },
          {
            "title": "Показатели хозяйственной деятельности за 2019 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2019-god.xls",
            "fileType": "XLS",
            "size": 42496
          },
          {
            "title": "Показатели хозяйственной деятельности за 2020 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 44641
          },
          {
            "title": "Показатели хозяйственной деятельности за 2021 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2021-god.pdf",
            "fileType": "PDF",
            "size": 38953
          },
          {
            "title": "Показатели хозяйственной деятельности за 2022 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2022-god.pdf",
            "fileType": "PDF",
            "size": 54512
          },
          {
            "title": "Показатели хозяйственной деятельности за 2023 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2023-god.pdf",
            "fileType": "PDF",
            "size": 31474
          },
          {
            "title": "Показатели хозяйственной деятельности за 2024 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2024-god.pdf",
            "fileType": "PDF",
            "size": 127846
          },
          {
            "title": "Показатели хозяйственной деятельности за 2025 год",
            "file": "/documents/disclosure/pokazateli-hozyaystvennoy-deyatelnosti-za-2025-god.pdf",
            "fileType": "PDF",
            "size": 131852
          }
        ]
      },
      {
        "title": "Тарифы на питьевую воду",
        "docs": [
          {
            "title": "Тарифы на питьевую воду период регулирования 2пг 2013-1пг 2014",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-period-regulirovaniya-2pg-2013-1pg-2014.pdf",
            "fileType": "PDF",
            "size": 67535
          },
          {
            "title": "Тарифы на питьевую воду период регулирования 2пг 2014-1пг 2015",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-period-regulirovaniya-2pg-2014-1pg-2015.pdf",
            "fileType": "PDF",
            "size": 66385
          },
          {
            "title": "Тариф на питьевую воду период регулирования 2 пг 2015г_1пг 2016г",
            "file": "/documents/disclosure/tarif-na-pitevuyu-vodu-period-regulirovaniya-2-pg-2015g-1pg-2016g.pdf",
            "fileType": "PDF",
            "size": 275911
          },
          {
            "title": "Тариф на питьевую воду период регулирования 2016 год",
            "file": "/documents/disclosure/tarif-na-pitevuyu-vodu-period-regulirovaniya-2016-god.pdf",
            "fileType": "PDF",
            "size": 221398
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2017 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2017-god.pdf",
            "fileType": "PDF",
            "size": 893749
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2018 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2018-god.docx",
            "fileType": "DOCX",
            "size": 47221
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2019 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2019-god.xls",
            "fileType": "XLS",
            "size": 36352
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2020 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2020-god.xls",
            "fileType": "XLS",
            "size": 36352
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2021 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2021-god.pdf",
            "fileType": "PDF",
            "size": 195207
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2022 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2022-god.pdf",
            "fileType": "PDF",
            "size": 58039
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2023 год",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2023-god.pdf",
            "fileType": "PDF",
            "size": 69783
          },
          {
            "title": "Тарифы на питьевую воду в период регулирования 2024-2028 годы",
            "file": "/documents/disclosure/tarify-na-pitevuyu-vodu-v-period-regulirovaniya-2024-2028-gody.pdf",
            "fileType": "PDF",
            "size": 34019
          }
        ]
      },
      {
        "title": "Регистрация и ход реализации заявок о подключении к централизованной системе холодного водоснабжения",
        "docs": [
          {
            "title": "Информация о ходе реализации заявок о подключении на 2015 год",
            "file": "/documents/disclosure/informaciya-o-hode-realizacii-zayavok-o-podklyuchenii-na-2015-god.xlsx",
            "fileType": "XLSX",
            "size": 13129
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2016 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k-.xls",
            "fileType": "XLS",
            "size": 29696
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2017 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k-.xlsx",
            "fileType": "XLSX",
            "size": 13198
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2018 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--2.xls",
            "fileType": "XLS",
            "size": 29696
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2019 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--3.xls",
            "fileType": "XLS",
            "size": 28672
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2020 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k-.pdf",
            "fileType": "PDF",
            "size": 49482
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2021 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--2.pdf",
            "fileType": "PDF",
            "size": 49348
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2022 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--3.pdf",
            "fileType": "PDF",
            "size": 49348
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2023 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--4.pdf",
            "fileType": "PDF",
            "size": 49348
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2024 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--5.pdf",
            "fileType": "PDF",
            "size": 49344
          },
          {
            "title": "Информация о регистрации и ходе реализации заявок о подключении к системе водоснабжения за 2025 год",
            "file": "/documents/disclosure/informaciya-o-registracii-i-hode-realizacii-zayavok-o-podklyuchenii-k--6.pdf",
            "fileType": "PDF",
            "size": 275747
          }
        ]
      },
      {
        "title": "Предложение о размере тарифа",
        "docs": [
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение на 2017 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-na-2017-god.xlsx",
            "fileType": "XLSX",
            "size": 11499
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение в 2018 году",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-v-2018-godu.xls",
            "fileType": "XLS",
            "size": 27648
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение в 2019-2023 годах",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-v-2019-2023-g.xlsx",
            "fileType": "XLSX",
            "size": 167764
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение в 2020 году",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-v-2020-godu.xls",
            "fileType": "XLS",
            "size": 151040
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение в 2022 году",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-v-2022-godu.pdf",
            "fileType": "PDF",
            "size": 44309
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение в 2023 году",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-v-2023-godu.pdf",
            "fileType": "PDF",
            "size": 44271
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение на период 2024-2028 годов",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-na-period-202.pdf",
            "fileType": "PDF",
            "size": 48483
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение на 2025 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-na-2025-god.pdf",
            "fileType": "PDF",
            "size": 52143
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение на 2026 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-na-2026-god.pdf",
            "fileType": "PDF",
            "size": 52142
          },
          {
            "title": "Предложение о размере тарифа на холодное водоснабжение на 2027 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-holodnoe-vodosnabzhenie-na-2027-god.pdf",
            "fileType": "PDF",
            "size": 203440
          }
        ]
      }
    ]
  },
  {
    "title": "Раскрытие информации оказания услуг по передаче электроэнергии",
    "docs": [
      {
        "title": "Контактная информация",
        "file": "/documents/disclosure/kontaktnaya-informaciya.pdf",
        "fileType": "PDF",
        "size": 198670
      },
      {
        "title": "Техническая возможность доступа к регулируемым услугам",
        "file": "/documents/disclosure/tehnicheskaya-vozmozhnost-dostupa-k-reguliruemym-uslugam.pdf",
        "fileType": "PDF",
        "size": 1155260
      },
      {
        "title": "Условия оказания услуг по передаче электроэнергии",
        "file": "/documents/disclosure/usloviya-okazaniya-uslug-po-peredache-elektroenergii.pdf",
        "fileType": "PDF",
        "size": 226868
      }
    ],
    "subsections": [
      {
        "title": "Перечень зон деятельности с детализацией по потребителям",
        "docs": [
          {
            "title": "Перечень зон деятельности на 01.01.2013",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2013.pdf",
            "fileType": "PDF",
            "size": 73643
          },
          {
            "title": "Перечень зон деятельности на 01.01.2014",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2014.pdf",
            "fileType": "PDF",
            "size": 73321
          },
          {
            "title": "Перечень зон деятельности на 01.01.2015",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2015.pdf",
            "fileType": "PDF",
            "size": 220893
          },
          {
            "title": "Перечень зон деятельности на 01.01.2016",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2016.pdf",
            "fileType": "PDF",
            "size": 173932
          },
          {
            "title": "Перечень зон деятельности на 01.01.2017",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2017.xls",
            "fileType": "XLS",
            "size": 28160
          },
          {
            "title": "Перечень зон деятельности на 01.01.2018",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2018.xls",
            "fileType": "XLS",
            "size": 27136
          },
          {
            "title": "Перечень зон деятельности на 01.01.2019",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2019.xls",
            "fileType": "XLS",
            "size": 27136
          },
          {
            "title": "Перечень зон деятельности на 01.01.2020",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2020.xls",
            "fileType": "XLS",
            "size": 27136
          },
          {
            "title": "Перечень зон деятельности на 01.01.2021",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2021.pdf",
            "fileType": "PDF",
            "size": 127291
          },
          {
            "title": "Перечень зон деятельности на 01.01.2022",
            "file": "/documents/disclosure/perechen-zon-deyatelnosti-na-01-01-2022.pdf",
            "fileType": "PDF",
            "size": 57168
          }
        ]
      },
      {
        "title": "Сведения о проводимых ремонтах",
        "docs": [
          {
            "title": "График ремонтов на 2013 год",
            "file": "/documents/disclosure/grafik-remontov-na-2013-god.pdf",
            "fileType": "PDF",
            "size": 524332
          },
          {
            "title": "График ремонтов на 2014 год",
            "file": "/documents/disclosure/grafik-remontov-na-2014-god.pdf",
            "fileType": "PDF",
            "size": 623657
          },
          {
            "title": "График ремонтов, выполненных в 2014 году",
            "file": "/documents/disclosure/grafik-remontov-vypolnennyh-v-2014-godu.pdf",
            "fileType": "PDF",
            "size": 1799325
          },
          {
            "title": "График ремонтов на 2015 год",
            "file": "/documents/disclosure/grafik-remontov-na-2015-god.pdf",
            "fileType": "PDF",
            "size": 1622415
          },
          {
            "title": "График ремонтов на 2016 год",
            "file": "/documents/disclosure/grafik-remontov-na-2016-god.pdf",
            "fileType": "PDF",
            "size": 2740258
          },
          {
            "title": "График ремонтов на 2017 год",
            "file": "/documents/disclosure/grafik-remontov-na-2017-god.xls",
            "fileType": "XLS",
            "size": 109568
          },
          {
            "title": "График ремонтов на 2018 год",
            "file": "/documents/disclosure/grafik-remontov-na-2018-god.xlsx",
            "fileType": "XLSX",
            "size": 67748
          },
          {
            "title": "График ремонтов на 2019 год",
            "file": "/documents/disclosure/grafik-remontov-na-2019-god.xls",
            "fileType": "XLS",
            "size": 101376
          },
          {
            "title": "График ремонтов на 2020 год",
            "file": "/documents/disclosure/grafik-remontov-na-2020-god.xls",
            "fileType": "XLS",
            "size": 102400
          },
          {
            "title": "График ремонтов на 2021 год",
            "file": "/documents/disclosure/grafik-remontov-na-2021-god.pdf",
            "fileType": "PDF",
            "size": 366954
          },
          {
            "title": "График ремонтов на 2022 год",
            "file": "/documents/disclosure/grafik-remontov-na-2022-god.pdf",
            "fileType": "PDF",
            "size": 80277
          }
        ]
      },
      {
        "title": "Сведения об объемах передаваемой электроэнергии и потерях в сетях",
        "docs": [
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2013 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2013-god.pdf",
            "fileType": "PDF",
            "size": 110600
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2014 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2014-god.pdf",
            "fileType": "PDF",
            "size": 107123
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2015 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2015-god.pdf",
            "fileType": "PDF",
            "size": 269207
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2015 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2015-god.pdf",
            "fileType": "PDF",
            "size": 434403
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2016 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2016-god.pdf",
            "fileType": "PDF",
            "size": 400104
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2016 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2016-god.xls",
            "fileType": "XLS",
            "size": 35840
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2017 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2017-god.xls",
            "fileType": "XLS",
            "size": 28160
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2017 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2017-god.xls",
            "fileType": "XLS",
            "size": 32768
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2018 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2018-god.xls",
            "fileType": "XLS",
            "size": 27648
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2018 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2018-god.xls",
            "fileType": "XLS",
            "size": 32768
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2019 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2019-god.xls",
            "fileType": "XLS",
            "size": 27648
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2019 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2019-god.xls",
            "fileType": "XLS",
            "size": 32768
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2020 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2020-god.xls",
            "fileType": "XLS",
            "size": 27648
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2020 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 132438
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии на 2021 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-na-2021-god.pdf",
            "fileType": "PDF",
            "size": 176434
          },
          {
            "title": "Сведения об объемах передаваемой электроэнергии за 2021 год и на 2022 год",
            "file": "/documents/disclosure/svedeniya-ob-obemah-peredavaemoy-elektroenergii-za-2021-god-i-na-2022-.pdf",
            "fileType": "PDF",
            "size": 77079
          }
        ]
      },
      {
        "title": "Закупка для компенсации потерь",
        "docs": [
          {
            "title": "Закупка для компенсации потерь на 2015 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2015-god.docx",
            "fileType": "DOCX",
            "size": 42003
          },
          {
            "title": "Закупка для компенсации потерь на 2016 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2016-god.pdf",
            "fileType": "PDF",
            "size": 203105
          },
          {
            "title": "Закупка для компенсации потерь на 2017 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2017-god.doc",
            "fileType": "DOC",
            "size": 56832
          },
          {
            "title": "Закупка для компенсации потерь на 2018 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2018-god.docx",
            "fileType": "DOCX",
            "size": 46163
          },
          {
            "title": "Закупка для компенсации потерь на 2019 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2019-god.doc",
            "fileType": "DOC",
            "size": 57856
          },
          {
            "title": "Закупка для компенсации потерь на 2020 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2020-god.doc",
            "fileType": "DOC",
            "size": 57856
          },
          {
            "title": "Закупка для компенсации потерь на 2021 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2021-god.pdf",
            "fileType": "PDF",
            "size": 128687
          },
          {
            "title": "Закупка для компенсации потерь на 2022 год",
            "file": "/documents/disclosure/zakupka-dlya-kompensacii-poter-na-2022-god.pdf",
            "fileType": "PDF",
            "size": 59967
          }
        ]
      },
      {
        "title": "Мероприятия по энергосбережению",
        "docs": [
          {
            "title": "Мероприятия по энергосбережению 2016-2018 гг",
            "file": "/documents/disclosure/meropriyatiya-po-energosberezheniyu-2016-2018-gg.xlsx",
            "fileType": "XLSX",
            "size": 13403
          },
          {
            "title": "Мониторинг по энергосбережению",
            "file": "/documents/disclosure/monitoring-po-energosberezheniyu.xlsx",
            "fileType": "XLSX",
            "size": 12876
          },
          {
            "title": "Мероприятия по энергосбережению на 2019-2023 г",
            "file": "/documents/disclosure/meropriyatiya-po-energosberezheniyu-na-2019-2023-g.xls",
            "fileType": "XLS",
            "size": 34816
          },
          {
            "title": "Мониторинг по энергосбережению на 2016-2018 гг",
            "file": "/documents/disclosure/monitoring-po-energosberezheniyu-na-2016-2018-gg.xls",
            "fileType": "XLS",
            "size": 35840
          },
          {
            "title": "Мониторинг по энергосбережению за 2019 г",
            "file": "/documents/disclosure/monitoring-po-energosberezheniyu-za-2019-g.xls",
            "fileType": "XLS",
            "size": 52224
          },
          {
            "title": "Мониторинг по энергосбережению за 2020 г",
            "file": "/documents/disclosure/monitoring-po-energosberezheniyu-za-2020-g.pdf",
            "fileType": "PDF",
            "size": 74779
          },
          {
            "title": "Мониторинг по энергосбережению за 2021 г",
            "file": "/documents/disclosure/monitoring-po-energosberezheniyu-za-2021-g.pdf",
            "fileType": "PDF",
            "size": 72750
          }
        ]
      },
      {
        "title": "Параметры регулирования",
        "docs": [
          {
            "title": "Параметры регулирования на 2017 — 2021 год",
            "file": "/documents/disclosure/parametry-regulirovaniya-na-2017-2021-god.doc",
            "fileType": "DOC",
            "size": 58880
          },
          {
            "title": "Параметры регулирования на 2022 — 2026 годы",
            "file": "/documents/disclosure/parametry-regulirovaniya-na-2022-2026-gody.pdf",
            "fileType": "PDF",
            "size": 78996
          }
        ]
      },
      {
        "title": "Предложения предприятия о размере тарифа на регулируемый вид деятельности",
        "docs": [
          {
            "title": "Предложение о размере тарифа на 2013 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2013-god.pdf",
            "fileType": "PDF",
            "size": 137820
          },
          {
            "title": "Предложение о размере тарифа на 2014 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2014-god.pdf",
            "fileType": "PDF",
            "size": 156957
          },
          {
            "title": "Предложение о размере тарифа на 2015 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2015-god.pdf",
            "fileType": "PDF",
            "size": 177162
          },
          {
            "title": "Предложение о размере тарифа на 2021 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2021-god.xls",
            "fileType": "XLS",
            "size": 133632
          },
          {
            "title": "Предложение о размере тарифа на 2022-2026 годы",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2022-2026-gody.pdf",
            "fileType": "PDF",
            "size": 212228
          },
          {
            "title": "Предложение о размере тарифа на 2023 год",
            "file": "/documents/disclosure/predlozhenie-o-razmere-tarifa-na-2023-god.pdf",
            "fileType": "PDF",
            "size": 318865
          }
        ]
      },
      {
        "title": "Тарифы на услуги по передаче электроэнергии",
        "docs": [
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2013 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2013-god.pdf",
            "fileType": "PDF",
            "size": 61739
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2014 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2014-god.pdf",
            "fileType": "PDF",
            "size": 62985
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2015 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2015-god.pdf",
            "fileType": "PDF",
            "size": 200462
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2016 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2016-god.pdf",
            "fileType": "PDF",
            "size": 164871
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2017 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2017-god.pdf",
            "fileType": "PDF",
            "size": 216332
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2018 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2018-god.docx",
            "fileType": "DOCX",
            "size": 45214
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2019 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2019-god.doc",
            "fileType": "DOC",
            "size": 58880
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2020 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2020-god.doc",
            "fileType": "DOC",
            "size": 59392
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2021 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2021-god.pdf",
            "fileType": "PDF",
            "size": 244045
          },
          {
            "title": "Тариф на оказание услуг по передаче электроэнергии 2022 год",
            "file": "/documents/disclosure/tarif-na-okazanie-uslug-po-peredache-elektroenergii-2022-god.pdf",
            "fileType": "PDF",
            "size": 76593
          }
        ]
      },
      {
        "title": "Стандартизированные тарифные ставки на технологическое присоединение",
        "docs": [
          {
            "title": "Стандартизированные тарифные ставки на технологическое присоединение в 2015 году",
            "file": "/documents/disclosure/standartizirovannye-tarifnye-stavki-na-tehnologicheskoe-prisoedinenie-.pdf",
            "fileType": "PDF",
            "size": 2259788
          },
          {
            "title": "Стандартизированные тарифные ставки на технологическое присоединение в 2016 году",
            "file": "/documents/disclosure/standartizirovannye-tarifnye-stavki-na-tehnologicheskoe-prisoedinenie--2.pdf",
            "fileType": "PDF",
            "size": 1977603
          },
          {
            "title": "Стандартизированные тарифные ставки на технологическое присоединение в 2017 году",
            "file": "/documents/disclosure/standartizirovannye-tarifnye-stavki-na-tehnologicheskoe-prisoedinenie--3.pdf",
            "fileType": "PDF",
            "size": 262550
          }
        ]
      },
      {
        "title": "Показатели уровня надежности",
        "docs": [
          {
            "title": "Показатели уровня надежности и качества за 2014 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2014-god.xls",
            "fileType": "XLS",
            "size": 175104
          },
          {
            "title": "Показатели уровня надежности и качества за 2015 на 2017-2021",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2015-na-2017-2021.xls",
            "fileType": "XLS",
            "size": 168960
          },
          {
            "title": "Показатели уровня надежности и качества за 2016 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2016-god.xls",
            "fileType": "XLS",
            "size": 184320
          },
          {
            "title": "Показатели уровня надежности и качества за 2017 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2017-god.xls",
            "fileType": "XLS",
            "size": 222720
          },
          {
            "title": "Показатели уровня надежности и качества за 2018 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2018-god.xls",
            "fileType": "XLS",
            "size": 919552
          },
          {
            "title": "Показатели уровня надежности и качества за 2019 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2019-god.xls",
            "fileType": "XLS",
            "size": 862208
          },
          {
            "title": "Показатели уровня надежности и качества за 2020 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 148707
          },
          {
            "title": "Показатели уровня надежности и качества за 2021 год",
            "file": "/documents/disclosure/pokazateli-urovnya-nadezhnosti-i-kachestva-za-2021-god.pdf",
            "fileType": "PDF",
            "size": 138178
          }
        ]
      },
      {
        "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность",
        "docs": [
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc.docx",
            "fileType": "DOCX",
            "size": 45079
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2015 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc.xlsx",
            "fileType": "XLSX",
            "size": 16602
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2017 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc-2.xlsx",
            "fileType": "XLSX",
            "size": 10272
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2018 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc.xls",
            "fileType": "XLS",
            "size": 27136
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2019 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc-2.xls",
            "fileType": "XLS",
            "size": 26112
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2020 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc.pdf",
            "fileType": "PDF",
            "size": 126660
          },
          {
            "title": "Сведения о лицах, намеревающихся перераспределить максимальную мощность за 2021 год",
            "file": "/documents/disclosure/svedeniya-o-licah-namerevayuschihsya-pereraspredelit-maksimalnuyu-mosc-2.pdf",
            "fileType": "PDF",
            "size": 51252
          }
        ]
      },
      {
        "title": "Величины резервируемой максимальной мощности",
        "docs": [
          {
            "title": "Резервирование мощности за 2015 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2015-god.xls",
            "fileType": "XLS",
            "size": 26112
          },
          {
            "title": "Резервирование мощности за 2016 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2016-god.xls",
            "fileType": "XLS",
            "size": 25600
          },
          {
            "title": "Резервирование мощности за 2017 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2017-god.xls",
            "fileType": "XLS",
            "size": 25600
          },
          {
            "title": "Резервирование мощности за 2018 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2018-god.xls",
            "fileType": "XLS",
            "size": 26112
          },
          {
            "title": "Резервирование мощности за 2019 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2019-god.xls",
            "fileType": "XLS",
            "size": 29184
          },
          {
            "title": "Резервирование мощности за 2020 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 131512
          },
          {
            "title": "Резервирование мощности за 2021 год",
            "file": "/documents/disclosure/rezervirovanie-moschnosti-za-2021-god.pdf",
            "fileType": "PDF",
            "size": 58505
          }
        ]
      },
      {
        "title": "Структура затрат на производство и реализацию услуг",
        "docs": [
          {
            "title": "Структура затрат на производство и реализацию услуг за 2014 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2014-god.xlsx",
            "fileType": "XLSX",
            "size": 160962
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2015 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2015-god.pdf",
            "fileType": "PDF",
            "size": 1048323
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2016 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2016-god.xls",
            "fileType": "XLS",
            "size": 244224
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2017 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2017-god.xlsx",
            "fileType": "XLSX",
            "size": 427654
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2018 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2018-god.xls",
            "fileType": "XLS",
            "size": 661504
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2019 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2019-god.xls",
            "fileType": "XLS",
            "size": 662016
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2020 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2020-god.pdf",
            "fileType": "PDF",
            "size": 68797
          },
          {
            "title": "Структура затрат на производство и реализацию услуг за 2021 год",
            "file": "/documents/disclosure/struktura-zatrat-na-proizvodstvo-i-realizaciyu-uslug-za-2021-god.pdf",
            "fileType": "PDF",
            "size": 68951
          },
          {
            "title": "Порядок выполнения технологического присоединения",
            "file": "/documents/disclosure/poryadok-vypolneniya-tehnologicheskogo-prisoedineniya.docx",
            "fileType": "DOCX",
            "size": 46419
          },
          {
            "title": "режимный день декабрь 2013",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2013.xlsx",
            "fileType": "XLSX",
            "size": 334733
          },
          {
            "title": "режимный день декабрь 2014",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2014.xlsx",
            "fileType": "XLSX",
            "size": 303253
          },
          {
            "title": "режимный день июнь 2013",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2013.xlsx",
            "fileType": "XLSX",
            "size": 335363
          },
          {
            "title": "режимный день июнь 2014",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2014.xlsx",
            "fileType": "XLSX",
            "size": 336779
          },
          {
            "title": "режимный день декабрь 2015",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2015.xlsx",
            "fileType": "XLSX",
            "size": 314713
          },
          {
            "title": "режимный день июнь 2015",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2015.xlsx",
            "fileType": "XLSX",
            "size": 312507
          },
          {
            "title": "режимный день июнь 2016",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2016.pdf",
            "fileType": "PDF",
            "size": 7074325
          },
          {
            "title": "режимный день декабрь 2016",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2016.pdf",
            "fileType": "PDF",
            "size": 199826
          },
          {
            "title": "режимный день июль 2017",
            "file": "/documents/disclosure/rezhimnyy-den-iyul-2017.xlsx",
            "fileType": "XLSX",
            "size": 321147
          },
          {
            "title": "режимный день декабрь 2017",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2017.xlsx",
            "fileType": "XLSX",
            "size": 434969
          },
          {
            "title": "режимный день июнь 2018",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2018.xls",
            "fileType": "XLS",
            "size": 692736
          },
          {
            "title": "режимный день декабрь 2018",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2018.xls",
            "fileType": "XLS",
            "size": 693760
          },
          {
            "title": "режимный день июнь 2019",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2019.xls",
            "fileType": "XLS",
            "size": 694784
          },
          {
            "title": "режимный день декабрь 2019",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2019.xls",
            "fileType": "XLS",
            "size": 670208
          },
          {
            "title": "режимный день июнь 2020",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2020.pdf",
            "fileType": "PDF",
            "size": 210639
          },
          {
            "title": "режимный день декабрь 2020",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2020.pdf",
            "fileType": "PDF",
            "size": 210486
          },
          {
            "title": "режимный день июнь 2021",
            "file": "/documents/disclosure/rezhimnyy-den-iyun-2021.pdf",
            "fileType": "PDF",
            "size": 215255
          },
          {
            "title": "режимный день декабрь 2021",
            "file": "/documents/disclosure/rezhimnyy-den-dekabr-2021.pdf",
            "fileType": "PDF",
            "size": 216557
          }
        ]
      },
      {
        "title": "Бланки заявок на присоединение. Заполненные заявки отправляются на e-mail: TKargina@uzlplast.ru",
        "docs": [
          {
            "title": "ЗАЯВКА физического лица на присоединение по одному источнику электроснабжения энергопринимающих устройств с максимальной мощностью до 15 кВт включительно",
            "file": "/documents/disclosure/zayavka-fizicheskogo-lica-na-prisoedinenie-po-odnomu-istochniku-elektr.docx",
            "fileType": "DOCX",
            "size": 16799
          },
          {
            "title": "ЗАЯВКА юридического лица (индивидуального предпринимателя), физического лица на присоединение энергопринимающих устройств",
            "file": "/documents/disclosure/zayavka-yuridicheskogo-lica-individualnogo-predprinimatelya-fizichesko.docx",
            "fileType": "DOCX",
            "size": 20826
          },
          {
            "title": "ЗАЯВКА юридического лица (индивидуального предпринимателя),физического лица на присоединение по одному источнику электроснабжения энергопринимающих устройств с максимальной мощностью до 150 кВт включительно",
            "file": "/documents/disclosure/zayavka-yuridicheskogo-lica-individualnogo-predprinimatelya-fizichesko.rtf",
            "fileType": "RTF",
            "size": 88932
          },
          {
            "title": "ЗАЯВКА юридического лица (индивидуального предпринимателя), физического лица на временное присоединение энергопринимающих устройств",
            "file": "/documents/disclosure/zayavka-yuridicheskogo-lica-individualnogo-predprinimatelya-fizichesko-2.rtf",
            "fileType": "RTF",
            "size": 71781
          }
        ]
      },
      {
        "title": "Прогнозные сведения о расходах за технологическое присоединение",
        "docs": [
          {
            "title": "Прогноз расчетов за технологическое присоединение на 2016 год",
            "file": "/documents/disclosure/prognoz-raschetov-za-tehnologicheskoe-prisoedinenie-na-2016-god.xls",
            "fileType": "XLS",
            "size": 110592
          },
          {
            "title": "Прогноз расчетов за технологическое присоединение на 2017 год",
            "file": "/documents/disclosure/prognoz-raschetov-za-tehnologicheskoe-prisoedinenie-na-2017-god.xls",
            "fileType": "XLS",
            "size": 115712
          },
          {
            "title": "Прогноз расчетов за технологическое присоединение на 2018 год",
            "file": "/documents/disclosure/prognoz-raschetov-za-tehnologicheskoe-prisoedinenie-na-2018-god.xlsx",
            "fileType": "XLSX",
            "size": 88706
          },
          {
            "title": "Прогноз расходов за технологическое присоединение на 2019 г",
            "file": "/documents/disclosure/prognoz-rashodov-za-tehnologicheskoe-prisoedinenie-na-2019-g.xls",
            "fileType": "XLS",
            "size": 124928
          },
          {
            "title": "Прогноз расходов за технологическое присоединение на 2020 г",
            "file": "/documents/disclosure/prognoz-rashodov-za-tehnologicheskoe-prisoedinenie-na-2020-g.pdf",
            "fileType": "PDF",
            "size": 896248
          },
          {
            "title": "Прогноз расходов за технологическое присоединение на 2021 г",
            "file": "/documents/disclosure/prognoz-rashodov-za-tehnologicheskoe-prisoedinenie-na-2021-g.pdf",
            "fileType": "PDF",
            "size": 949960
          },
          {
            "title": "Прогноз расходов за технологическое присоединение на 2022 г",
            "file": "/documents/disclosure/prognoz-rashodov-za-tehnologicheskoe-prisoedinenie-na-2022-g.pdf",
            "fileType": "PDF",
            "size": 1287781
          }
        ]
      }
    ]
  },
  {
    "title": "Конкурсы, тендеры",
    "docs": [
      {
        "title": "Положение о проведении конкурсов на поставку ТМЦ, выполнение подрядных работ и оказания услуг",
        "file": "/documents/disclosure/polozhenie-o-provedenii-konkursov-na-postavku-tmc-vypolnenie-podryadny.doc",
        "fileType": "DOC",
        "size": 248832
      }
    ],
    "subsections": []
  }
]
