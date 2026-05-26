import type { Language } from "@/lib/language"
import { publicationEnglish } from "./publications-en"

export interface PublicationLink {
  label: string
  url: string
  labelEn?: string
}

export interface Publication {
  title: string
  subtitle?: string
  titleEn?: string
  subtitleEn?: string
  links: PublicationLink[]
}

export type LocalizedPublication = {
  title: string
  subtitle?: string
  links: { label: string; url: string }[]
}

function localizeLinkLabel(label: string, lang: Language): string {
  if (lang === "ru") return label
  const replacements: [string, string][] = [
    ["Новость на портале ", "News on "],
    ["Новость в ", "News in "],
    ["Новость ", "News "],
    ["Статья в ", "Article in "],
    ["Статья на ", "Article on "],
    ["Статья ", "Article "],
    ["Комментарий ", "Commentary "],
    ["Интервью ", "Interview "],
    ["Публикация ", "Publication "],
    ["Пост-релиз ", "Post-release "],
    ["Анонс ", "Announcement "],
    ["Бюллетень ", "Bulletin "],
    ["Отраслевой портал ", "Industry portal "],
    ["Текстовая версия", "Text version"],
    ["Печатная версия", "Print version"],
    ["Версия статьи в Word", "Article version (Word)"],
  ]
  let result = label
  for (const [from, to] of replacements) {
    if (result.startsWith(from)) {
      result = to + result.slice(from.length)
      break
    }
  }
  return result
}

export function getPublications(lang: Language): LocalizedPublication[] {
  return publications.map((pub, index) => {
    const en = publicationEnglish[index]
    return {
      title: lang === "en" ? (pub.titleEn ?? en?.title ?? pub.title) : pub.title,
      subtitle:
        lang === "en" ? (pub.subtitleEn ?? en?.subtitle ?? pub.subtitle) : pub.subtitle,
      links: pub.links.map((link, linkIndex) => ({
        url: link.url,
        label:
          lang === "en"
            ? (link.labelEn ?? en?.linkLabels?.[linkIndex] ?? localizeLinkLabel(link.label, "en"))
            : link.label,
      })),
    }
  })
}

export const publications: Publication[] = [
  {
    title: "Спрос рождает потребитель",
    subtitle: "Промышленные предприятия Тульской области постепенно возвращаются к привычному режиму работы",
    links: [
      { label: "Статья в Российской газете от 16.06.2020", url: "https://rg.ru/2020/06/16/reg-cfo/promyshlennye-predpriiatiia-tulskoj-oblasti-vozobnovili-svoiu-rabotu.html" },
    ],
  },
  {
    title: "На АО «Пластик» запустили производство медицинских масок 3.06.2020",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/45569_3.6.2020/" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/44277/" },
      { label: "Новость на портале unipack.ru", url: "https://news.unipack.ru/79556/" },
      { label: "Новость в газете Молодой коммунар", url: "https://mk.tula.ru/news/n/27512811" },
      { label: "Новость в газете Знамя Узловая", url: "http://znamyuzl.ru/news/ao-plaqqstik-zapustilo-proizvods/" },
      { label: "Публикация в блоге «Сделано у нас»", url: "https://sdelanounas.ru/blogs/133370/" },
      { label: "Новость на портале Market report", url: "http://www.mrcplast.ru/news-news_open-371577.html" },
      { label: "Новость на портале RCC", url: "http://rcc.ru/article/na-quot-plastikequot-zapustili-proizvodstvo-medicinskih-masok-74341" },
    ],
  },
  {
    title: "«Пластик» (Узловая) повысил экологичность ПСВ 18.05.2020",
    links: [
      { label: "Новость на портале Пластэксперт", url: "https://e-plastic.ru/news/plastik-uzlovaya-povysil-ekologichnost-psv/" },
    ],
  },
  {
    title: "Узловский пластик перешел на экологичный антипирен при производстве ПСВ 18.05.2020",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/45420_18.5.2020/" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/44135/" },
    ],
  },
  {
    title: "COVID-19 возродил пластик из пепла?",
    links: [
      { label: "Комментарий генерального директора ТД «Пластик» Романа Кизимова в обзоре агентства «Интерфакс» от 14.04.2020", url: "https://www.interfax.ru/business/704162" },
    ],
  },
  {
    title: "На территории технопарка АО «Пластик» планируется запуск нового завода",
    links: [
      { label: "Новость на портале «Корпорации развития Тульской области»", url: "https://www.invest-tula.com/news/2544/" },
      { label: "Новость на портале «Тульская пресса»", url: "https://www.tulapressa.ru/2019/06/pmef-2019-v-tulskoj-oblasti-poyavitsya-proizvodstvo-moyushhix-sredstv-dlya-molochnogo-zhivotnovodstva-4612/" },
      { label: "Новость на портале газеты «Молодой коммунар»", url: "http://mk.tula.ru/news/n/27208701/" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/44713_13.2.2020/" },
      { label: "Новость на портале Advis.ru", url: "https://www.advis.ru/php/view_news.php?id=DEBE475D-11B2-7243-8E76-6CE10168C5F2" },
    ],
  },
  {
    title: "Как делают пластик",
    links: [
      { label: "Статья на сайте газеты «Московский комсомолец»", url: "https://tula.mk.ru/economics/2019/12/06/kak-delayut-plastik.html" },
    ],
  },
  {
    title: "Своими глазами: «Пластик» (Узловая) — крупнейший в России производитель АБС пластиков",
    links: [
      { label: "Статья на портале «Сделано у нас»", url: "https://sdelanounas.ru/blogs/127802/" },
    ],
  },
  {
    title: "Элементарно и периодически",
    links: [
      { label: "Статья на сайте газеты «Знамя Узловая»", url: "https://znamyuzl.ru/" },
    ],
  },
  {
    title: "Узловский «Пластик» отмечает 60-летие",
    links: [
      { label: "Новость на сайте правительства Тульской области", url: "https://tularegion.ru/presscenter/press-release/?ELEMENT_ID=174595" },
    ],
  },
  {
    title: "За громкими успехами предприятия стоит многолетний напряженный труд",
    links: [
      { label: "Статья на сайте газеты «Знамя Узловая»", url: "https://tularegion.ru/presscenter/press-release/?ELEMENT_ID=174595" },
    ],
  },
  {
    title: "АО «Пластик» (г. Узловая) и ЗАО «АТЛАНТ» (г. Минск) заключили соглашение о намерениях по сотрудничеству в сфере разработок и внедрения АБС-пластиков в производстве бытовой техники",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/43736_22.10.2019/" },
      { label: "Новость на портале Пластэксперт", url: "https://e-plastic.ru/news/k2019-plastik-g-uzlovaya-i-atlant-zaklyuchili-soglashenie-o-namereniyakh/?sphrase_id=8081" },
      { label: "Новость на портале POLY PRO", url: "https://polyprofi.ru/news/plastik_budet_postavlyat_abs_plastiki_v_belarus.html" },
      { label: "Новость в журнале «Полимерные материалы»", url: "http://www.polymerbranch.com/news/company/view/17287.html" },
      { label: "Новость в журнале «Пластикс»", url: "https://www.plastics.ru/index.php?lang=ru&view=news&category_id=28&entry_id=20411" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/42471/" },
      { label: "Новость в журнале Химкурьер", url: "https://chem-courier.com/ru/he_polis_plastik_i_atlant_zakljuchili_soglashenie_o_nameren-BHAGWJ" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-360566.html" },
      { label: "Новость в газете Знамя Узловая", url: "https://znamyuzl.ru/" },
    ],
  },
  {
    title: "«Пластик» внедрил новую марку АБС для литья крупногабаритных изделий",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/43758_23.10.2019/" },
    ],
  },
  {
    title: "K 2019: «Пластик» второй раз представит свои ключевые продукты",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/43663_16.10.2019/" },
    ],
  },
  {
    title: "Японские правила тульских предприятий",
    links: [
      { label: "Статья в газете «Тульский молодой коммунар»", url: "http://mk.tula.ru/news/n/21453757/" },
    ],
  },
  {
    title: "На площадке «Пластика» появится производство моющих средств для молочного животноводства",
    links: [
      { label: "Новость на портале The DairyNews", url: "https://www.dairynews.ru/news/v-tulskoy-oblasti-poyavitsya-proizvodstvo-moyushch.html" },
      { label: "Новость на портале Advis", url: "https://www.advis.ru/php/view_news.php?id=45C5FBC7-975F-D441-A049-E9190B6A1C8B" },
      { label: "Новость на портале «Тульские новости»", url: "https://newstula.ru/fn_453935.html" },
      { label: "Новость на портале «Myslo новости»", url: "https://myslo.ru/news/tula/2019-06-07-park-razvlechenij-i-kompozitnyj-klaster-investsoglasheniya-vtorogo-dnya-pmef-2019" },
      { label: "Новость на ленте «Интерфакс-Россия»", url: "http://www.interfax-russia.ru/Center/news.asp?sec=1679&id=1036734" },
      { label: "Новость на портале «Тульские известия»", url: "http://ti71.ru/news/apk/moyushchie_sredstva_dlya_molochnogo_zhivotnovodstva_budut_izgotavlivat_v_uzlovoy/" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/news/podpisany-soglash222222222222222222eniya-o-sotru/" },
      { label: "Новость на портале «Тульские СМИ»", url: "http://tulasmi.ru/news/354900/" },
      { label: "Новость на портале «Тульская пресса»", url: "https://www.tulapressa.ru/2019/06/pmef-2019-v-tulskoj-oblasti-poyavitsya-proizvodstvo-moyushhix-sredstv-dlya-molochnogo-zhivotnovodstva-4612/" },
      { label: "Новость в газете «Тульский молодой коммунар»", url: "http://mk.tula.ru/news/n/17140428/" },
      { label: "Новость на портале Первый Тульский", url: "https://1tulatv.ru/novosti/119195-v-tulskoy-oblasti-budut-proizvodit-moyushchie-sredstva-dlya-molochnogo/" },
    ],
  },
  {
    title: "В технопарке АО «Пластик» открылось новое производство геосинтетики",
    links: [
      { label: "Новость на ленте «Интерфакс-Россия»", url: "http://www.interfax-russia.ru/Center/news.asp?sec=1679&id=1034433" },
      { label: "Новость на портале «Тульские новости»", url: "https://newstula.ru/fn_452426.html" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/news/dlya-komfortnoy-rab9999999999999999999oty-reziden/" },
      { label: "Новость на портале Первый Тульский", url: "https://1tulatv.ru/novosti/118647-v-uzlovoy-otkrylos-novoe-proizvodstvo-plastik.html" },
    ],
  },
  {
    title: "АО «Пластик» реализует программу импортозамещения. Статья в «Российской газете». Спецвыпуск «Нефтехимия» 12 апреля 2019 г. № 7839",
    links: [
      { label: "Российская газета: СПЕЦВЫПУСК НЕФТЕХИМИЯ № 7839 (PDF)", url: "https://oaoplastic.ru/wp-content/uploads/2019/04/Rossijskaya-gazeta.pdf" },
      { label: "Статья на портале РГ", url: "https://rg.ru/2019/04/12/reg-cfo/v-rossii-nachali-proizvodit-plastmassu-dlia-bytovoj-i-elektrotehniki.html" },
      { label: "Версия статьи в Word", url: "https://oaoplastic.ru/wp-content/uploads/2015/02/Rossijskaya-gazeta-Spetsvypusk-817839.doc" },
    ],
  },
  {
    title: "АО «Пластик» принял участие в профориентационном марафоне",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/start-proforientatsi2222222222222222onnogo-mar/" },
    ],
  },
  {
    title: "Губернатор Тульской области Алексей Дюмин и генеральный директор АО «Пластик» подписали соглашение о сотрудничестве в реализации инфраструктурного инвестпроекта в Узловой",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/41003_18.02.2019/" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/40231/" },
      { label: "Новость на портале Тульской службы новостей", url: "http://www.tsn24.ru/aleksej-dyumin-i-generalnyj-direktor-oao-plastik-podpisali-soglashenie-o-sotrudnichestve.html" },
      { label: "Новость на портале делового издания Professional", url: "http://proftula.ru/articles/536/42434/" },
      { label: "Новость на портале Первый Тульский", url: "https://1tulatv.ru/novosti/111986-uzlovskoe-predpriyatie-moderniziruet-infrastrukturu.html" },
      { label: "Новость на портале правительства Тульской области", url: "https://tularegion.ru/presscenter/press-release/?ELEMENT_ID=149740&sphrase_id=9782728" },
    ],
  },
  {
    title: "АО «Пластик» продемонстрировал обновленный ассортимент материалов на выставке «Интерпластика»",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/news/rasshirennaya-tsvet%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86%D1%86ovaya-palit/" },
      { label: "Статья в журнале «Пластикс»", url: "https://oaoplastic.ru/wp-content/uploads/2015/02/Plastik.pdf" },
    ],
  },
  {
    title: "ЕЖЕНЕДЕЛЬНЫЙ БЮЛЛЕТЕНЬ НЕФТЕГАЗ №3",
    links: [
      { label: "Бюллетень МЭАЦ СНГПР", url: "https://oaoplastic.ru/wp-content/uploads/2015/02/Byulleten-MEATS-SNGPR-Ezhenedelnyj-03-04-02-2018.pdf" },
    ],
  },
  {
    title: "БЮЛЛЕТЕНЬ. ПЕРЕРАБОТКА И НЕФТЕГАЗОХИМИЯ № 02-1",
    links: [
      { label: "«Пластик» представил новинки на выставке «Интерпластика»", url: "https://oaoplastic.ru/wp-content/uploads/2015/02/Byulleten-MEATS-SNGPR-Pererabotka-i-NGH-02-1-04-02-2018.pdf" },
    ],
  },
  {
    title: "Анонс выставки «Интерпластика 2019»",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/novinkirossiyskogoabszhdutposetiteleyvystavkiinterplastika/" },
      { label: "Новость на портале Abiz", url: "http://abiz.ru/news/polimery/interplastica-2019-uzlovskiy-plastik-predstavit-novyye-razrabotki" },
      { label: "Новость на портале unipack.ru", url: "https://news.unipack.ru/73195/" },
    ],
  },
  {
    title: "О векторах развития и инструментах продвижения продукта на рынке рассказал генеральный директор торгового дома «Пластик» Роман Кизимов",
    links: [
      { label: "Интервью в журнале «СИБУР Клиентам» (выпуск №10)", url: "https://magazine.sibur.ru/ru/10/article/partners/industry-as-a-single-interconnected-organism/" },
    ],
  },
  {
    title: "Выступление Генерального директора Торгового Дома «Пластик» Кизимова Романа на конференции «Полистирол и АБС-пластики 2018»",
    links: [
      { label: "Новость на портале CREON", url: "http://www.creonenergy.ru/consulting/detailConf.php?ID=125268" },
    ],
  },
  {
    title: "Haitian организовал живой и полезный семинар для переработчиков",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/haitianorganizovalzhivoyipoleznyyseminardlyapererabotchikov/" },
    ],
  },
  {
    title: "«Пластик» и ИНХС РАН договорились о развитии сотрудничества",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/plastikiinkhsrandogovorilisorazvitiisotrudnichestva/" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/39392_26.09.2018/" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/dogovorilis-o-razvitii-nau222chno/" },
      { label: "Новость на портале PromPortal.su", url: "http://promportal.su/news/6203/oao-plastik-g-uzlovaya-i-institut-neftehimicheskogo-sinteza-podpisali-memorandum-o-sotrudnichestve.htm" },
      { label: "Новость на портале Межотраслевого экспертно-аналитического центра Союза Нефтегазопромышленников России", url: "https://sngpr.ru.com/plastik/" },
    ],
  },
  {
    title: "Емкость российского рынка АБС-пластиков вырастет к 2019 г.",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/39377_25.9.2018/" },
      { label: "Новость на портале Рупек", url: "https://plastinfo.ru/information/news/39377_25.9.2018/" },
      { label: "Новость на портале RCC", url: "http://rcc.ru/article/emkost-rossiyskogo-rynka-abs-plastikov-vyrastet-k-2019-g-65895#astart" },
    ],
  },
  {
    title: "Узловский «Пластик» представил свою продукцию на выставке «Plast 2018» в Италии",
    links: [
      { label: "Новость на портале Инвест Тула", url: "http://invest-tula.com/news/news/6294/" },
      { label: "Новость на портале Тульские СМИ", url: "http://tulasmi.ru/news/339584/" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/predstavlyaet-dlya-nas-bolshoy/" },
    ],
  },
  {
    title: "«Пластик» впервые представит продукцию на выставке Plast 2018 в Италии",
    links: [
      { label: "Статья в журнале «Пластикс»", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=27&entry_id=18854" },
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/plastikuzlovayavpervyeuchastvuetnavystavkeplast2018/" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/pr777odolzhaya-tradit888iyu-/" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/37846_24.5.2018/" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-339629.html" },
      { label: "Новость на портале Advis", url: "http://www.advis.ru/php/view_news.php?id=8A300BD1-2726-D04F-B4B8-F35E10CC0E66" },
      { label: "Новость на портале PlasticHelper", url: "http://plastichelper.ru/news/21384-yzlovskoi-plastik-nameren-rasshirit-svoe-prisytstvie-na-rynke-evropy" },
      { label: "Новость на портале chem.ru", url: "http://chem.ru/vystavki/15169-plastik-uzlovaja-vpervye-uchastvuet-na-vystavke-plast-2018.html" },
      { label: "Новость на портале Chemical-guide.ru", url: "http://chemical-guide.ru/plastik-vpervye-predstavit-produk/" },
    ],
  },
  {
    title: "Чем живет узловский «Пластик»",
    links: [
      { label: "Новость на портале Тульские СМИ", url: "http://tulasmi.ru/news/256269" },
    ],
  },
  {
    title: "«Пластик» нарастил поставки АБС на внутренний рынок на 13,6%",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/plastik-naras66til-postavki-abs-/" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/37478/" },
    ],
  },
  {
    title: "АО «Пластик» оказал помощь предприятию Всероссийского общества слепых",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/37050_19.3.2018/" },
      { label: "Новость на портале Тульские СМИ", url: "http://tulasmi.ru/news/255740" },
      { label: "Новость в газете «Тульские известия»", url: "http://ti71.ru/articles/society/yarkiy_svet_nizvolta/" },
    ],
  },
  {
    title: "АО «Пластик» получил знак Made in Russia",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/plastik-poluchil-z44nak-made-in-/" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/37062_20.03.2018/" },
    ],
  },
  {
    title: "«Пластик» подвел первые итоги выставки «Интерпластика 2018»",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/36845_27.02.2018/" },
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/plastikuzlovayapodvelitogiuchastiyavinterplastike2018/" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/company/view/15095.html" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/otprav222leny-testovye-partii-mat/" },
      { label: "Новость на портале Рупек", url: "http://www.rupec.ru/news/37202/" },
      { label: "Новость на портале Интерпластика", url: "http://interplastica.ru/17268/p/1831-interplastica-2018-plastik-podvel-pervyie-itogi-vyistavki" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-336239.html" },
    ],
  },
  {
    title: "Новость о создании нового текстильного производства на площадке АО «Пластик»",
    links: [
      { label: "Новость информационного агентства Интерфакс", url: "http://www.interfax-russia.ru/Center/news.asp?id=910375" },
      { label: "Новость на портале Тульские СМИ", url: "http://tulasmi.ru/news/255082" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://znamyuzl.ru/news/sozdayutsya-111novye-proizvodstva/" },
      { label: "Новость службы новостей RuNews24", url: "http://runews24.ru/tula/16/02/2018/b768754ec82effc65d4b3eb9197cd106" },
      { label: "Новость в журнале «Инвест-Форсайт»", url: "https://www.if24.ru/invest-region-ot-19-02-2018/" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/37222/" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/36895_2.3.2018/" },
    ],
  },
  {
    title: "Комментарий Генерального директора Торгового Дома «Пластик» Романа Кизимова по выставке «Интерпластика 2018»",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/36596_6.2.2018/" },
      { label: "Новость на портале Интерпластика", url: "http://www.interplastica.ru/17268/p/1821-itogi-21-oy-mejdunarodnoy-spetsializirovannoy-vyistavki-interplastica-2018" },
      { label: "Новость на портале Адвис", url: "http://www.advis.ru/php/view_news.php?id=B805CA12-6086-634C-BF78-070ECA580F63" },
    ],
  },
  {
    title: "Импортозамещение — одна из ключевых задач предприятия",
    links: [
      { label: "Статья Генерального директора ООО ТД «Пластик» Кизимова Романа в «Российской газете» Спецвыпуск №7476 (13) от 22.01.2018", url: "https://rg.ru/2018/01/22/importozameshchenie-odna-iz-kliuchevyh-zadach-predpriiatiia.html" },
      { label: "Печатная версия", url: "https://oaoplastic.ru/wp-content/uploads/2018/01/statya.pdf" },
    ],
  },
  {
    title: "«Пластик» успешно прошел первый этап сертификации «Сделано в России»",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/plastikuzlovayauspeshnoproshelpervyyetapsdelanovrossii/" },
    ],
  },
  {
    title: "Усовершенствованные материалы от АО «Пластик» на «Интерпластике 2018»",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastic.ru/news/interplastika2018plastikuzlovayagotovitshirokuyuekspozitsiyu/" },
      { label: "Новость на портале Интерпластика", url: "http://interplastica.ru/17268/p/1784-interplastica-2018-plastik-uzlovaya-gotovit-shirokuyu-ekspozitsiyu" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/36240_10.01.2018/" },
      { label: "Отраслевой портал Унипак", url: "https://news.unipack.ru/68513/" },
      { label: "Новость на информационном портале «Вокруг Москвы»", url: "http://aroundmos.ru/news/stroitelstvo/0330" },
    ],
  },
  {
    title: "Новые марки — новые возможности",
    links: [
      { label: "Статья в журнале «Пластикс» N9 (171) 2017", url: "https://oaoplastic.ru/wp-content/uploads/2017/10/Plastic.pdf" },
      { label: "Новость на портале ADVIS", url: "http://www.advis.ru/php/view_news.php?id=04ECB222-A602-4445-AFA2-7EFEDC2B0449" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/35180_10.10.2017/" },
    ],
  },
  {
    title: "«Пластик» модернизирует производство вспенивающегося полистирола",
    links: [
      { label: "Новость в информационном агентстве Интерфакс Россия", url: "http://www.interfax-russia.ru/Center/news.asp?id=853352&sec=1679" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-330181.html" },
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/34193_25.07.2017/" },
      { label: "Новость на портале Адвис", url: "http://www.advis.ru/php/view_news.php?id=D5A38C13-4D8C-8147-8E55-33E704249E89" },
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/35873/" },
      { label: "Новость на портале Ассоциации производителей и поставщиков пенополистирола", url: "http://epsrussia.ru/news/610" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/14241.html" },
    ],
  },
  {
    title: "«Пластик» поздравили «Премьер-министр» и голос Кремля Евгений Хорошевцев",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/uzlovaya_city/60388-plastik-pozdravil-premer-ministr-i-golos-kremlya-3.html" },
    ],
  },
  {
    title: "«Пластик» открыл собственный магазин товаров народного потребления",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/naviki/60380-v-assortimente-bolshoy-vybor.html" },
    ],
  },
  {
    title: "Пост-релиз конференции «Полимеры в автомобилестроении 2017»",
    links: [
      { label: "Новость на портале RCC", url: "http://rcc.ru/article/zalozhnik-sprosa-59755" },
    ],
  },
  {
    title: "Торжество по случаю Дня химика в г.Узловая намечено на 9 июня",
    links: [
      { label: "Статья в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/naviki/59698-v-etom-godu-torzhestva-namecheny-na-9-iyunya.html" },
    ],
  },
  {
    title: "Узловский полистирол получил сертификат анализа соответствия RoHS Directive",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/33308_17.5.2017/" },
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/psv-s-iz-uzlovoi-sertificirovan-po-rohs_11681.htm" },
    ],
  },
  {
    title: "«Пластик» выпустил новую линейку пластиковых хозтоваров (18.05.2017)",
    links: [
      { label: "Новость на портале Пластинфо", url: "https://plastinfo.ru/information/news/33331_18.05.2017/" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/company/view/13984.html" },
    ],
  },
  {
    title: "Каждую смену — разные задания",
    links: [
      { label: "Статья о мастере смены «Пластика» в газете «Знамя Узловая» от 18.04.2017", url: "https://oaoplastic.ru/wp-content/uploads/2017/04/Plastik_Znamya.pdf" },
    ],
  },
  {
    title: "Модификаторы для жесткого ПВХ",
    links: [
      { label: "Статья независимого эксперта Г.Б. Барсамяна в журнале «Пластикс» о новом продукте АО «Пластик»", url: "https://oaoplastic.ru/wp-content/uploads/2017/04/Barsamyan_statya_Plastiks.pdf" },
    ],
  },
  {
    title: "Анна Даутова: «Российский рынок полимеров ждет перебалансировка»",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/anna-dautova-rossiiskii-rynok-polimerov-zhdet-perebalansirovka_11602.htm" },
      { label: "Новость на портале Market Report", url: "http://www.mrcplast.ru/news-news_open-327107.html" },
      { label: "Новость на портале HimTrade", url: "http://news.himtrade.ru/news_industry_0_16226_0.htm" },
      { label: "Бюллетень Союза нефтегазопромышленников России", url: "https://oaoplastic.ru/wp-content/uploads/2017/04/SK-Byulleten-Pererabotka-i-Himiya-01-4-10-04-17.pdf" },
    ],
  },
  {
    title: "Итоги «Интерпластики 2017» (9.03.2017)",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/35036/" },
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/plastik-operativno-pretvoryaet-v-zhizn-dostizheniya-interplastiki-2017_11526.htm" },
      { label: "Новость на портале Интерпластика", url: "http://interplastica.ru/17268/p/1533" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/32624_10.03.2017/" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/naviki/56325-plastik-aktivno-prorabatyvaet-eksportnoe-napravlenie.html" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/company/view/13773.html" },
    ],
  },
  {
    title: "Пластиковые товары для дома оказались на выставке моды (22.02.2017)",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/plastikovye-tovary-dlya-doma-okazalis-na-vystavke-mody_11498.htm" },
    ],
  },
  {
    title: "Тульская область является одним из наиболее успешно развивающихся промышленных регионов России (21.02.2017)",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/region/55714-tulskaya-oblast-yavlyaetsya-odnim-iz-naibolee-uspeshno-razvivayuschihsya-promyshlennyh-regionov-rossii.html" },
    ],
  },
  {
    title: "Анонсы участия Пластика в Интерпластике",
    links: [
      { label: "Новость на сайте информационного агентства Advis", url: "http://www.advis.ru/php/view_news.php?id=AAF6F1EE-BA32-8841-AF18-D3AF9F580E00" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/32048_30.12.2016/" },
      { label: "Новость на портале Интерпластика", url: "http://interplastica.ru/17268/p/1458" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/53925-interplastika-2017.html" },
    ],
  },
  {
    title: "Потенциал рынка упаковки ПСВ в России велик (26.01.2017)",
    links: [
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/54745-potencial-rynka-upakovki-psv-v-rossii-velik.html" },
      { label: "Отраслевой портал Упаковка", url: "http://messe.unipack.ru/publication/63613/" },
      { label: "Новость на портале Plastichelper", url: "http://plastichelper.ru/news/11308-segment-ypakovki-v-rossii-mojet-potrebliat-do-73-tys-tonn-psv-c" },
    ],
  },
  {
    title: "Нам есть с чем работать. Производство ПСВ-С сравнялось с объемом потребления (25.01.2017)",
    links: [
      { label: "Новость в газете Знамя Узловая", url: "http://www.znamyuzl.ru/54559-nam-est-s-chem-rabotat.html" },
      { label: "Новость на портале журнала «Полимерные материалы»", url: "http://www.polymerbranch.com/news/view/13576.html" },
    ],
  },
  {
    title: "«Пластик» вошел в экспертный совет по развитию нефтехимии (22.12.2016)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/31956_22.12.2016/" },
      { label: "Новость на портале ХимОнлайн", url: "http://www.himonline.ru/news/?id=344350" },
      { label: "Отраслевой портал Унипак", url: "http://news.unipack.ru/63215/" },
    ],
  },
  {
    title: "К 2016: итоги работы объединённого российского стенда. Встреча с организаторами, друзьями и партнерами прошла на высоте (1.12.2016)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/31725_01.12.2016/" },
    ],
  },
  {
    title: "К 2016: успешное выступление «Пластик» Узловая. Премьерой выставки стал новый продукт – модификатор на основе АБС. (24.10.2016)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/31352_24.10.2016/" },
      { label: "Новость на портале Пластэксперт", url: "http://www.e-plastic.ru/news/plastik-uzlovaya-vpervye-v-dyusseldorfe_11163.htm" },
      { label: "Информационный портал Тула Сми", url: "http://tulasmi.ru/news/239291" },
      { label: "Ассоциация производителей и поставщиков пенополистирола", url: "http://c10095.shared.hc.ru/news/538" },
    ],
  },
  {
    title: "В химическом комплексе Тульской области ожидается рост до 5% по итогам 2016 (21.10.2016)",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/34281/" },
      { label: "Новость на портале Экопром Сервис", url: "http://ecopromservice-ltd.ru/v-himiceskom-komplekse-tulskoj-oblasti-ozidaetsa-rost-do-5-po-itogam-2016g-/" },
    ],
  },
  {
    title: "Объемы производства АБС-пластиков в России впервые превысили импорт (27.09.2016)",
    links: [
      { label: "Новость на портале Рупек", url: "http://www.rupec.ru/news/34115/" },
      { label: "Новость на портале Сделано у нас", url: "http://sdelanounas.ru/blogs/84051" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/31067_28.09.2016/" },
      { label: "Новость на портале Пластикс", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=27&entry_id=16743" },
      { label: "Новость на портале Полимерные Материалы", url: "http://www.polymerbranch.com/news/view/13164.html" },
      { label: "Новость на портале Упаковано", url: "http://www.upakovano.ru/news/500588" },
    ],
  },
  {
    title: "В России есть как минимум шесть новых ниш для применения АБС. Пластик Узловая разработала марку АБС, которая может быть использована для детских игрушек (27.09.2016)",
    links: [
      { label: "Новость на портале РСС", url: "http://rcc.ru/article/v-rossii-est-kak-minimum-shest-novyh-nish-dlya-primeneniya-abs-56752#astart" },
    ],
  },
  {
    title: "Узловский «Пластик» запустил производство модификатора для композиций ПВХ. Предварительные испытания дали положительный результат (14.09.2016)",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/34032/" },
      { label: "Новость на портале Пластикс", url: "http://plastics.ru/index.php?lang=ru&view=news&category_id=15&entry_id=16674" },
      { label: "Новость на портале Экопром Сервис", url: "http://ecopromservice-ltd.ru/uzlovskij-plastik-zapustil-proizvodstvo-modifikatora-dla-kompozicij-pvh/" },
    ],
  },
  {
    title: "«Пластик» провел круглый стол по вопросам переработки и потребления АБС-пластиков. В мероприятии приняли участие более 30 компаний (3.06.2016)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/30023_09.06.2016/" },
      { label: "Новость на портале Пластэксперт", url: "http://www.e-plastic.ru/news/v-g-uzlovaya-proshel-kruglyi-stol-po-voprosam-abs-plastikov_10877.htm" },
    ],
  },
  {
    title: "Автопроизводители и поставщики компонентов встретятся в Москве. «Пластик» готов совершенствовать свои технологии (4.05.2016)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/29653_04.05.2016/" },
      { label: "Новость на портале РСС", url: "http://rcc.ru/article/vstrecha-avtoproizvoditeley-s-postavschikami-komponentov-sostoitsya-18-maya-54331#astart" },
    ],
  },
  {
    title: "II международная конференция «Конструкционные полимеры и композиты» (18.04.2016)",
    links: [
      { label: "Новость на портале Альянс-Аналитик", url: "http://www.alliance-analytics.ru/conference/5739.php" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/12592.html" },
    ],
  },
  {
    title: "Компания «Шеллстоун Кемикалс» стала дилером Узловского «Пластика» (3.04.2016)",
    links: [
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/11215.html" },
      { label: "Новость на портале Plasthelper", url: "http://plastichelper.ru/news/7033-yzlovskoi-plastik-i-shellstoyn-kemikals-zakluchili-dilerskoe-soglashenie" },
      { label: "Новость в газете «Знамя Узловая»", url: "http://www.znamyuzl.ru/43585-my-zainteresovany-v-rabote-s-uzlovskim-plastikom.html" },
      { label: "Новость на портале ХимКнига", url: "http://himkniga.com/dosug/5148" },
      { label: "Новость на портале БЕЗ Формата", url: "http://uzlovaya.bezformata.ru/listnews/shellstoun-kemikals-stala-dilerom/31394799/" },
    ],
  },
  {
    title: "Узловский «Пластик» осваивает новые ниши. Интервью с Генеральным директором Даутовой Анной. (28.01.2016)",
    links: [
      { label: "Интервью на портале Пластикс", url: "http://www.plastics.ru/pdf/journal/2016/03/Plastik.pdf" },
    ],
  },
  {
    title: "«Интерпластика»- 2016 на пульсе перемен в экономике. Настало время Российского производителя. (26.01.2016)",
    links: [
      { label: "Новость на портале Интерпластика", url: "http://interplastica.ru/ru/467/press/554/567" },
      { label: "Новость на портале Пластэксперт", url: "http://www.e-plastic.ru/news/plastik-uzlovaya-vnov-na-interplastike_10484.htm" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/articles/553/" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/publ/view/227.html" },
      { label: "Новость на портале Пластикс", url: "http://www.plastics.ru/index.php?lang=ru&view=news_archive&category_id=27&entry_id=15885" },
    ],
  },
  {
    title: "В Москве состоялся форум полимеры России 2016. Мы видим сразу несколько точек роста. (10.01.2016)",
    links: [
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/13516.html" },
      { label: "Новость на портале РСС", url: "http://rcc.ru/article/podderzhat-pererabotku-57925#astart" },
    ],
  },
  {
    title: "Потенциал роста для переработки АБС-пластиков составляет 100 тыс. тонн в год. (15.01.2016)",
    links: [
      { label: "Новость на портале Рупек", url: "http://www.rupec.ru/news/34116/" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/13161.html" },
    ],
  },
  {
    title: "Рынок АБС сжимается, роль российских материалов. «Пластику» удается сохранять продажи на прежнем уровне (25.01.2016)",
    links: [
      { label: "Новость на Пластинфо", url: "http://plastinfo.ru/information/articles/print/532" },
    ],
  },
  {
    title: "Узловский «Пластик» запустил в производство новые марки АБС для электротехники. Улучшена способность к переработке. (15.12.2015)",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/32529/" },
      { label: "Новость на портале Пластэксперт", url: "http://www.e-plastic.ru/forum/viewtopic.php?t=22638" },
      { label: "Новость на портале Полимерные материалы", url: "http://www.polymerbranch.com/news/view/12181.html" },
      { label: "Анна Даутова: «Первое, на что мы смотрим как российский поставщик, – это местный рынок и его потребности»", url: "http://rupec.ru/news/32338/" },
    ],
  },
  {
    title: "Российский АБС-пластик получит второе дыхание в автопроме (27.10.2015)",
    links: [
      { label: "Новость на портале АТИ-Медиа", url: "http://ati.su/Media/News.aspx?HeadingID=9&ID=73227" },
      { label: "Новость в журнале «Пластикс»", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=27&entry_id=15423" },
      { label: "Новость на портале ХимОнлайн", url: "http://www.himonline.ru/n/4E09E" },
      { label: "Новость на портале ПластЭксперт", url: "http://e-plastics.ru/information/news/27841_27.10.2015/" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/print/27841" },
      { label: "Новость на портале Маркет репорт", url: "http://www.mrcplast.ru/news-news_open-313020.html" },
    ],
  },
  {
    title: "Минпромторг оценил влияние «Пластика» на отрасль (3.08.2015)",
    links: [
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/minpromtorg-plastik-okazyvaet-sushestvennoe-vliyanie-na-otrasli-promyshlennosti-i-torgovli_10088.htm" },
      { label: "Новость на портале ХимОнлайн", url: "http://www.himonline.ru/n/4AABA" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/27057_04.08.2015/" },
    ],
  },
  {
    title: "Новая узловская марка АБС получила разрешение на контакт с пищевыми продуктами (21.07.2015)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/26940_22.07.2015" },
      { label: "Новость на портале Химпорт", url: "http://www.chemport.ru/chemprodnews_11574.html" },
      { label: "Новость на портале CarboFood", url: "http://carbofood.ru/tara-i-upakovka-novosti/novaia-yzlovskaia-marka-abs-polychila-razreshenie-na-kontakt-s-pishevymi-prodyktami" },
      { label: "Новость на сайте журнала «Пластикс»", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=15&entry_id=15064" },
      { label: "Новость на портале Plastic helper", url: "http://plastichelper.ru/news/8032-yzlovskoi-plastik-polychil-razreshenie-dlia-novogo-abs-na-ispolzovanie-s-pishevymi-prodyktami" },
      { label: "Новость на портале Химонлайн", url: "http://www.himonline.ru/n/4A36A" },
      { label: "Новость на портале Unipack.ru", url: "http://news.unipack.ru/56087/" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-310815.html" },
      { label: "Новость на сайте журнале «Полимерные материалы»", url: "http://www.polymerbranch.com/news/view/11618.html" },
    ],
  },
  {
    title: "В АО «Пластик» ввели в действие Кодекс корпоративной этики и Антикоррупционную политику (15.07.2015)",
    links: [
      { label: "Новость на портале Химпорт", url: "http://www.chemport.ru/chemprodnews_11569.html" },
    ],
  },
  {
    title: "Рынок АБС сжимается, роль российских материалов растет",
    subtitle: "Интервью генерального директора Торгового дома «Пластик» Анны Даутовой, публикация на портале Пластинфо 6.07.2015",
    links: [
      { label: "Интервью на портале Пластинфо", url: "http://plastinfo.ru/information/articles/532/" },
    ],
  },
  {
    title: "Емкость российского рынка вспенивающегося полистирола продолжает сокращаться",
    subtitle: "Новость с комментарием от ТД «Пластик» на портале «Рупек» 2.07.2015",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/31642/" },
    ],
  },
  {
    title: "Пластик изучает возможности дозагрузки мощностей по АБС и строительства новых",
    subtitle: "Новость о «Пластике» на портале «Рупек» 1.07.2015",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/31630/" },
    ],
  },
  {
    title: "Емкость российского рынка АБС-пластиков сократилась на 21% за пять месяцев",
    subtitle: "Комментарий ТД «Пластик» порталу «Рупек» 30.06.2015",
    links: [
      { label: "Новость на портале Рупек", url: "http://rupec.ru/news/31626/" },
    ],
  },
  {
    title: "«Пластик» (Узловая) запустил в производство новые марки АБС, аналогичные импортным материалам (4.06.2015)",
    links: [
      { label: "Новость на портале Импортозамещение", url: "http://importozamechenie.ru/plastik-uzlovaya-zapustil-v-proizvodstvo-novye-marki-abs-analogichnye-importnym-materialam/" },
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/plastik-uzlovaya-zapustil-novye-marki-abs-sovsem-kak-importnye_9947.htm" },
      { label: "Новость на портале Химонлайн", url: "http://www.himonline.ru/n/48432" },
      { label: "Новость на сайте журнала «Пластикс»", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=15&entry_id=14847" },
      { label: "Новость на сайте Химпорт", url: "http://www.chemport.ru/chemprodnews_11399.html" },
      { label: "Новость на портале Plastichelper.ru", url: "http://plastichelper.ru/news/6927-yzlovskoi-plastik-zapystit-novye-marki-abs-dlia-proizvodstva-elektrotehniki" },
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/26484_04.06.2015/" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-307784.html" },
      { label: "Новость в газете Знамя Узловая", url: "http://www.znamyuzl.ru/practica/45615-marochnyy-assortiment-abs.html" },
    ],
  },
  {
    title: "«Пластик» принял участие в бизнес-миссии «Торгово-промышленный диалог: Россия–Египет» (28.05.2015)",
    links: [
      { label: "Новость на портале 4geo.ru", url: "http://tula.4geo.ru/news/show/2015/5/26/kair" },
      { label: "Новость на портале Новомосковск сегодня", url: "http://www.nmosktoday.ru/news/economics/29304/" },
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/egiptyane-zainteresovalis-uzlovskim-plastikom_9929.htm" },
      { label: "Новость на портале Химонлайн", url: "http://www.himonline.ru/n/47E89" },
    ],
  },
  {
    title: "На импортозамещение у отрасли остается чуть более года",
    subtitle: "Комментарий генерального директора Торгового дома «Пластик» Анны Даутовой журналу «Химкурьер» №5, 2015",
    links: [
      { label: "Текстовая версия", url: "https://oaoplastic.ru/wp-content/uploads/2015/05/%D0%94%D0%B0%D1%83%D1%82%D0%BE%D0%B2%D0%B0_%D0%A5%D0%B8%D0%BC%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%801.docx" },
    ],
  },
  {
    title: "Узловский Пластик продолжает расширять сбытовую сеть (30.04.2015)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/26138_30.04.2015/" },
      { label: "Новость на портале ХимОнлайн", url: "http://www.himonline.ru/news/?id=289497" },
      { label: "Новость на портале Chemport", url: "http://www.chemport.ru/chemprodnews_11274.html" },
      { label: "Публикация в издании Знамя, Узловая", url: "http://www.znamyuzl.ru/practica/44561-plastik-rasshiril-dilerskuyu-set.html" },
      { label: "Новость на портале Химия Украины и мира", url: "http://ukrchem.dp.ua/2015/04/29/rossiya-oao-plastik-rasshiryaet-sbytovuyu-set-v-ukraine-i-belarusi.html" },
    ],
  },
  {
    title: "Продукция «Пластика» — лауреат конкурса «100 лучших товаров России» (28.04.2015)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/26113_28.4.2015/" },
      { label: "Новость на портале Chemport", url: "http://www.chemport.ru/chemprodnews_11282.html" },
    ],
  },
  {
    title: "На Узловском «Пластике» озвучили характеристики новой марки АБС 1525-31",
    subtitle: "Статья на портале «Химкурьер» 14.04.2015",
    links: [
      { label: "Статья на портале Химкурьер", url: "https://oaoplastic.ru/wp-content/uploads/2015/05/%D0%A5%D0%B8%D0%BC%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80_%D1%81%D0%BA%D0%B0%D0%BD.jpg" },
    ],
  },
  {
    title: "Компания «Шеллстоун Кемикалс» стала дилером узловского «Пластика» (03.04.2015)",
    links: [
      { label: "Новость на портале Пластинфо", url: "http://plastinfo.ru/information/news/25806_06.04.2015/" },
      { label: "Новость на портале ПластЭксперт", url: "http://www.e-plastic.ru/news/kompaniya-shellstoun-kemikals-stala-dilerom-uzlovskogo-plastika_9787.htm" },
      { label: "Новость на портале Plasthelper", url: "http://plastichelper.ru/news/7033-yzlovskoi-plastik-i-shellstoyn-kemikals-zakluchili-dilerskoe-soglashenie" },
      { label: "Новость на портале Маркет Репорт", url: "http://www.mrcplast.ru/news-news_open-308057.html" },
      { label: "Новость на портале БЕЗ ФОРМАТА", url: "http://uzlovaya.bezformata.ru/listnews/shellstoun-kemikals-stala-dilerom/31394799/" },
      { label: "Новость на портале ХимОнлайн", url: "http://bizon.ru/news/view/news_id/131017" },
    ],
  },
  {
    title: "«Пластик» выпустит новые марки АБС для электротехники (26.03.2015)",
    links: [
      { label: "Новость на сайте журнала Пластикс", url: "http://www.plastics.ru/index.php?lang=ru&view=news&category_id=15&entry_id=14589" },
      { label: "Новость на портале Лакокраска", url: "http://lakokraska-ya.ru/news2/detail.php?ID=4272" },
      { label: "Новость на портале МаркетРепорт", url: "http://www.mrcplast.ru/news-news_open-307784.html" },
      { label: "Новость на портале Chemport", url: "http://www.chemport.ru/chemprodnews_11147.html" },
      { label: "Новость на портале Химия Украины и мира", url: "http://ukrchem.dp.ua/2015/03/27/rossiya-oao-plastik-vypustit-novye-marki-abs-plastikov-dlya-elektrotexniki.html" },
    ],
  },
  {
    title: "Несъемная опалубка «ПЛАСТБАУ-3». Перспективы малоэтажного монолитного домостроения в России.",
    subtitle: "Статья в журнале «Строительные материалы» №3, 2015",
    links: [
      { label: "Статья в журнале «Строительные материалы»", url: "https://oaoplastic.ru/wp-content/uploads/2015/04/plastbau-%D0%B2-%D0%A1%D0%9C.pdf" },
    ],
  },
  {
    title: "Узловая программа. Модернизация и оптимизация как средства против кризиса",
    subtitle: "Статья соинвестора АО «Пластик» Максима Кизимова в журнале «Коммерсантъ Деньги» №50 от 22.12.2014",
    links: [
      { label: "Статья в журнале «Коммерсантъ Деньги»", url: "https://oaoplastic.ru/wp-content/uploads/2015/02/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F_%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D1%80%D1%81%D0%B0%D0%BD%D1%82.pdf" },
    ],
  },
]
