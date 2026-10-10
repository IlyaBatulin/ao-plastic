"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Search,
  X,
} from "lucide-react";
import productsData from "@/data/products.json";
import { createClient } from "@/utils/supabase/client";
import {
  CUSTOMER_TIER_META,
  DEMO_CUSTOMERS,
  type CustomerTier,
} from "@/lib/customer-access";
import "./account-portal.css";

type Order = {
  id: number;
  created_at: string;
  items: {
    id: number;
    quantity: number;
    products?: { name?: string } | null;
  }[];
};
type Reservation = {
  id: number;
  product_name: string;
  quantity: number;
  unit: string;
  requested_delivery_date: string;
  status: string;
};
type AccountData = {
  demoMode?: boolean;
  profile: Record<string, any>;
  manager: { name: string; email?: string; phone?: string } | null;
  orders: Order[];
  reservations: Reservation[];
  reservationsAvailable: boolean;
};
type Product = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  image?: string;
};
type Tab =
  | "overview"
  | "requests"
  | "deliveries"
  | "documents"
  | "analytics"
  | "new";
type Draft = {
  productId: string;
  quantity: string;
  unit: string;
  date: string;
  delivery: string;
  address: string;
  comment: string;
};
const emptyDraft: Draft = {
  productId: "",
  quantity: "",
  unit: "т",
  date: "",
  delivery: "pickup",
  address: "",
  comment: "",
};
const catalog: Product[] = (productsData.categories as any[]).flatMap(
  (category) =>
    [
      ...(category.products || []),
      ...(category.subcategories || []).flatMap(
        (sub: any) => sub.products || [],
      ),
    ].map((product: any) => ({
      id: String(product.id),
      name: String(product.name),
      category: String(category.name),
      categoryId: String(category.id),
      image: product.image,
    })),
);
const suggested = ["polystyrene", "abs", "dispersion"]
  .map((id) => catalog.find((product) => product.categoryId === id))
  .filter(Boolean) as Product[];
const dateString = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
const dateLabel = (
  value: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" },
) => {
  const date = new Date(value.length === 10 ? value + "T12:00:00" : value);
  return Number.isNaN(date.getTime())
    ? "Не указана"
    : new Intl.DateTimeFormat("ru-RU", options).format(date);
};
const stateLabel = (status: string) =>
  ({
    requested: "На согласовании",
    confirmed: "Подтверждено",
    cancelled: "Отменено",
    completed: "Завершено",
    expired: "Срок истёк",
  })[status] || "Уточняется";
const nav: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "Обзор", icon: LayoutDashboard },
  { id: "requests", label: "Мои заявки", icon: ClipboardList },
  { id: "deliveries", label: "Поставки", icon: CalendarDays },
  { id: "documents", label: "Документы", icon: FileText },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
];

export default function AccountPage() {
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [view, setView] = useState<CustomerTier>("silver");
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setError("");
      try {
        const response = await fetch("/api/customer/account", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401) {
          router.replace("/account/login");
          return;
        }
        if (!response.ok) throw new Error("Не удалось загрузить кабинет");
        setData(await response.json());
      } catch (e) {
        if (!controller.signal.aborted)
          setError(e instanceof Error ? e.message : "Ошибка соединения");
      }
    }
    void load();
    return () => controller.abort();
  }, [router, attempt]);
  async function logout() {
    try {
      await fetch("/api/customer/preview-auth", { method: "DELETE" });
      await createClient().auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setError("Не удалось выйти. Попробуйте ещё раз.");
    }
  }
  if (!data)
    return (
      <main className="cp-loading" role="status">
        {error || "Загружаем ваш кабинет…"}
        {error && (
          <button
            className="cp-secondary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Попробовать ещё раз
          </button>
        )}
      </main>
    );
  const tier: CustomerTier = data.demoMode
    ? view
    : ["silver", "gold", "partner"].includes(data.profile.access_tier)
      ? data.profile.access_tier
      : "silver";
  const demo = DEMO_CUSTOMERS.find((customer) => customer.id === tier)!;
  const company = data.demoMode
    ? demo.company
    : data.profile.company_name || "Моя компания";
  const contact = data.demoMode
    ? demo.contact
    : data.profile.contact_name || "Покупатель";
  return (
    <Workspace
      key={data.demoMode ? view : "account"}
      data={data}
      tier={tier}
      company={company}
      contact={contact}
      onTier={setView}
      onLogout={logout}
      error={error}
    />
  );
}

function Workspace({
  data,
  tier,
  company,
  contact,
  onTier,
  onLogout,
  error,
}: {
  data: AccountData;
  tier: CustomerTier;
  company: string;
  contact: string;
  onTier: (tier: CustomerTier) => void;
  onLogout: () => void;
  error: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [reservations, setReservations] = useState(data.reservations);
  const [ready, setReady] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const identity = data.demoMode
    ? "demo-" + tier
    : String(data.profile.id || data.profile.email || "customer");
  const storageKey = "aoplastic-requests-v2-" + identity;
  useEffect(() => {
    if (data.demoMode) {
      const date = new Date();
      date.setDate(date.getDate() + (tier === "partner" ? 3 : 7));
      const sample: Reservation[] = [
        {
          id: tier === "partner" ? 1049 : tier === "gold" ? 1048 : 1047,
          product_name:
            tier === "silver"
              ? "Полистирол вспенивающийся «УПЕКС», марка 2"
              : "АБС-пластик 2020-31",
          quantity: tier === "partner" ? 40 : tier === "gold" ? 20 : 10,
          unit: "т",
          requested_delivery_date: dateString(date),
          status: "confirmed",
        },
      ];
      try {
        const saved = JSON.parse(sessionStorage.getItem(storageKey) || "null");
        setReservations(Array.isArray(saved) ? saved : sample);
      } catch {
        setReservations(sample);
      }
    }
    setReady(true);
  }, [data.demoMode, tier, storageKey]);
  useEffect(() => {
    if (ready && data.demoMode) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(reservations));
      } catch {
        /* Browser storage may be unavailable. */
      }
    }
  }, [reservations, ready, data.demoMode, storageKey]);
  function go(next: Tab) {
    setTab(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }
  const today = dateString(new Date());
  const upcoming = reservations
    .filter(
      (item) =>
        item.requested_delivery_date >= today &&
        ["requested", "confirmed"].includes(item.status),
    )
    .sort((a, b) =>
      a.requested_delivery_date.localeCompare(b.requested_delivery_date),
    );
  const title =
    tab === "overview"
      ? "Ваш кабинет"
      : tab === "new"
        ? "Новая заявка"
        : nav.find((item) => item.id === tab)!.label;
  return (
    <main className="customer-portal">
      <header className="cp-header">
        <Link className="cp-brand" href="/">
          <img src="/images/logo123.png" alt="АО «Пластик» — на главную" />
          <span>Клиентский сервис</span>
        </Link>
        <div className="cp-header-actions">
          <div className="cp-account">
            <span className="cp-avatar">
              {contact
                .split(" ")
                .slice(0, 2)
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <strong>{company}</strong>
              <small>{contact}</small>
            </div>
          </div>
          <button
            className="cp-icon-button"
            onClick={onLogout}
            aria-label="Выйти из кабинета"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>
      <div className="cp-shell">
        <aside className="cp-sidebar">
          <p className="cp-sidebar-label">Личный кабинет</p>
          <nav className="cp-nav" aria-label="Разделы кабинета">
            {nav
              .filter((item) => item.id !== "analytics" || tier !== "silver")
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  aria-current={tab === item.id ? "page" : undefined}
                >
                  <item.icon />
                  {item.label}
                </button>
              ))}
          </nav>
          <div className="cp-sidebar-bottom">
            <span>АО «Пластик»</span>
            <p>
              Продукция и решения
              <br />
              для вашего бизнеса
            </p>
            <Link href="/products">
              Перейти в каталог <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
        <div className="cp-content">
          {data.demoMode && (
            <div className="cp-demo">
              <span>
                Демонстрация кабинета · заявки не отправляются менеджеру
              </span>
              <label>
                Тестовый профиль
                <select
                  aria-label="Тестовый профиль"
                  value={tier}
                  onChange={(event) =>
                    onTier(event.target.value as CustomerTier)
                  }
                >
                  <option value="silver">Серебряный</option>
                  <option value="gold">Золотой</option>
                  <option value="partner">Партнёр</option>
                </select>
              </label>
            </div>
          )}
          {error && (
            <p role="alert" className="cp-error">
              {error}
            </p>
          )}
          <div className="cp-heading">
            <div>
              <div className="cp-eyebrow">{company}</div>
              <h1 ref={heading} tabIndex={-1}>
                {title}
              </h1>
              <p className="cp-subtitle">
                {tab === "overview"
                  ? "Заказы, поставки и документы — всё под рукой."
                  : tab === "new"
                    ? "Укажите продукцию и пожелания к поставке. Условия согласуем отдельно."
                    : "Информация по вашей компании."}
              </p>
            </div>
            {tab === "overview" ? (
              <span className={"cp-tag " + tier}>
                {CUSTOMER_TIER_META[tier].label}
              </span>
            ) : (
              tab !== "new" && (
                <button className="cp-primary" onClick={() => go("new")}>
                  <Plus size={16} />
                  Новая заявка
                </button>
              )
            )}
          </div>
          {tab === "new" ? (
            <OrderForm
              key={identity}
              identity={identity}
              data={data}
              company={company}
              onComplete={(reservation) =>
                setReservations((current) => [reservation, ...current])
              }
              onClose={() => go("requests")}
            />
          ) : (
            <>
              {tab === "overview" && (
                <>
                  <div className="cp-metrics">
                    <Metric
                      label="Заявки"
                      value={String(reservations.length)}
                      note="в вашем кабинете"
                    />
                    <Metric
                      label="Ближайшая поставка"
                      value={
                        upcoming[0]
                          ? dateLabel(upcoming[0].requested_delivery_date, {
                              day: "2-digit",
                              month: "2-digit",
                            })
                          : "—"
                      }
                      note={
                        upcoming[0]
                          ? stateLabel(upcoming[0].status)
                          : "пока не запланирована"
                      }
                    />
                    <Metric
                      label="История заказов"
                      value={String(data.orders.length)}
                      note={
                        data.demoMode
                          ? "демонстрационные данные"
                          : "доступно в кабинете"
                      }
                    />
                  </div>
                  <div className="cp-grid">
                    <div>
                      <section className="cp-panel cp-start">
                        <div className="cp-path">
                          <span>
                            <b>01</b> Продукция
                          </span>
                          <span>—</span>
                          <span>
                            <b>02</b> Поставка
                          </span>
                          <span>—</span>
                          <span>
                            <b>03</b> Проверка
                          </span>
                        </div>
                        <h2>Спланируем следующую поставку?</h2>
                        <p>
                          Найдите нужную марку в каталоге, укажите объём и
                          удобную дату. Черновик можно продолжить позже в этой
                          вкладке.
                        </p>
                        <button
                          className="cp-primary"
                          onClick={() => go("new")}
                        >
                          Новая заявка <ArrowRight size={16} />
                        </button>
                      </section>
                      <section className="cp-panel cp-section">
                        <div className="cp-panel-heading">
                          <h2>Последние заявки</h2>
                          <button
                            className="cp-link"
                            onClick={() => go("requests")}
                          >
                            Все заявки <ArrowRight size={14} />
                          </button>
                        </div>
                        <Requests items={reservations.slice(0, 3)} />
                      </section>
                      {tier === "partner" && (
                        <section className="cp-panel cp-panel-pad cp-section">
                          <h2>История сотрудничества</h2>
                          <p className="cp-subtitle">
                            Количество заказов по месяцам
                            {data.demoMode ? " · пример" : ""}
                          </p>
                          <OrderChart orders={data.orders} />
                        </section>
                      )}
                    </div>
                    <aside>
                      <section className="cp-panel">
                        <div className="cp-panel-heading">
                          <h2>Ближайшая поставка</h2>
                        </div>
                        {upcoming[0] ? (
                          <Shipment item={upcoming[0]} />
                        ) : (
                          <div className="cp-panel-pad cp-muted">
                            Поставок пока нет. Выберите желаемую дату при
                            оформлении заявки.
                          </div>
                        )}
                        <div className="cp-panel-pad" style={{ paddingTop: 0 }}>
                          <button
                            className="cp-link"
                            onClick={() => go("deliveries")}
                          >
                            План поставок <ArrowRight size={14} />
                          </button>
                        </div>
                      </section>
                      <Support manager={data.manager} />
                    </aside>
                  </div>
                </>
              )}
              {tab === "requests" && (
                <>
                  <section className="cp-panel">
                    <div className="cp-panel-heading">
                      <h2>Заявки на поставку</h2>
                      <span className="cp-muted">{reservations.length}</span>
                    </div>
                    <Requests items={reservations} />
                  </section>
                  <section className="cp-panel cp-section">
                    <div className="cp-panel-heading">
                      <h2>История заказов</h2>
                    </div>
                    {data.orders.length ? (
                      <div
                        className="cp-table-wrap"
                        tabIndex={0}
                        role="region"
                        aria-label="История заказов"
                      >
                        <table className="cp-table">
                          <thead>
                            <tr>
                              <th>Заказ</th>
                              <th>Продукция</th>
                              <th>Дата</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.orders.map((order) => (
                              <tr key={order.id}>
                                <td>№ {order.id}</td>
                                <td>
                                  {order.items.map((item) => (
                                    <div key={item.id}>
                                      {item.products?.name ||
                                        "Позиция каталога"}
                                    </div>
                                  ))}
                                </td>
                                <td>{dateLabel(order.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <Empty title="История пока пуста">
                        Здесь появятся ваши заказы.
                      </Empty>
                    )}
                  </section>
                </>
              )}
              {tab === "deliveries" && (
                <div className="cp-grid">
                  <section className="cp-panel">
                    <div className="cp-panel-heading">
                      <h2>План поставок</h2>
                    </div>
                    {upcoming.length ? (
                      upcoming.map((item) => (
                        <Shipment key={item.id} item={item} />
                      ))
                    ) : (
                      <Empty title="Поставки не запланированы">
                        Желаемую дату можно указать в новой заявке.
                      </Empty>
                    )}
                    <p className="cp-note cp-panel-pad">
                      Дата в заявке — пожелание клиента. Подтверждённые поставки
                      отмечены отдельно.
                    </p>
                  </section>
                  <Calendar items={upcoming} />
                </div>
              )}
              {tab === "documents" && (
                <div className="cp-grid">
                  <section className="cp-panel">
                    <Empty title="Документы по вашим заказам">
                      <span>
                        Раздел подготовлен для договоров, счетов и спецификаций.
                        Обмен документами пока не подключён. За актуальными
                        файлами обратитесь к менеджеру.
                      </span>
                    </Empty>
                  </section>
                  <aside>
                    <section className="cp-panel cp-summary">
                      <h2>Реквизиты компании</h2>
                      <dl>
                        <Detail label="Организация" value={company} />
                        <Detail
                          label="ИНН"
                          value={
                            data.demoMode
                              ? "Пример профиля"
                              : data.profile.inn || "Не указан"
                          }
                        />
                        <Detail label="Контактное лицо" value={contact} />
                      </dl>
                    </section>
                    <Support manager={data.manager} />
                  </aside>
                </div>
              )}
              {tab === "analytics" && (
                <div className="cp-grid">
                  <section className="cp-panel cp-panel-pad">
                    <h2>Динамика заказов</h2>
                    <p className="cp-subtitle">
                      Количество заказов за последние шесть месяцев
                      {data.demoMode ? " · демонстрация" : ""}
                    </p>
                    <OrderChart orders={data.orders} />
                    <p className="cp-note">
                      На основе истории в кабинете. Объёмы в разных единицах не
                      суммируются.
                    </p>
                  </section>
                  <section className="cp-panel cp-panel-pad">
                    <h2>Планирование закупок</h2>
                    <p className="cp-subtitle">
                      Укажите желаемый объём и дату следующей поставки — они
                      появятся в вашем плане.
                    </p>
                    <button
                      className="cp-secondary cp-section"
                      onClick={() => go("new")}
                    >
                      Запланировать поставку <ArrowRight size={14} />
                    </button>
                    <p className="cp-note">
                      Рыночные прогнозы и цены не отображаются до подключения
                      проверенного источника данных.
                    </p>
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="cp-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
function Empty({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cp-empty">
      <FileText size={30} />
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
function Support({ manager }: { manager: AccountData["manager"] }) {
  return (
    <section className="cp-panel cp-panel-pad cp-support">
      <div className="cp-eyebrow">На связи</div>
      <h3>{manager?.name || "Отдел продаж"}</h3>
      <p>Поможем с выбором марки, условиями и документами.</p>
      {manager?.phone && (
        <a href={"tel:" + manager.phone.replace(/[^+\d]/g, "")}>
          {manager.phone}
        </a>
      )}
      <a href={"mailto:" + (manager?.email || "info@td-plastic.ru")}>
        {manager?.email || "info@td-plastic.ru"}
      </a>
    </section>
  );
}
function Requests({ items }: { items: Reservation[] }) {
  if (!items.length)
    return (
      <Empty title="Заявок пока нет">
        Начните с выбора продукции. Здесь появятся отправленные заявки и их
        статусы.
      </Empty>
    );
  return (
    <div
      className="cp-table-wrap"
      tabIndex={0}
      role="region"
      aria-label="Заявки на поставку"
    >
      <table className="cp-table cp-request-table">
        <thead>
          <tr>
            <th>Заявка / продукция</th>
            <th>Объём</th>
            <th>Дата поставки</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <strong>№ {item.id}</strong>
                <small>{item.product_name}</small>
              </td>
              <td data-label="Объём" style={{ whiteSpace: "nowrap" }}>
                {item.quantity} {item.unit}
              </td>
              <td data-label="Дата поставки" style={{ whiteSpace: "nowrap" }}>
                {dateLabel(item.requested_delivery_date)}
              </td>
              <td>
                <span className={"cp-tag " + item.status}>
                  {stateLabel(item.status)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Shipment({ item }: { item: Reservation }) {
  return (
    <div className="cp-shipment">
      <div className="cp-date-block">
        <strong>
          {dateLabel(item.requested_delivery_date, { day: "numeric" })}
        </strong>
        <small>
          {dateLabel(item.requested_delivery_date, { month: "short" })}
        </small>
      </div>
      <div className="cp-shipment-info">
        <h3>{item.product_name}</h3>
        <p>
          {item.quantity} {item.unit} · заявка № {item.id}
        </p>
        <span className={"cp-tag " + item.status}>
          {stateLabel(item.status)}
        </span>
      </div>
    </div>
  );
}
function Calendar({ items }: { items: Reservation[] }) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return (
    <section className="cp-panel cp-panel-pad">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <h3 style={{ textTransform: "capitalize" }}>
          {dateLabel(dateString(month), { month: "long", year: "numeric" })}
        </h3>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="cp-icon-button"
            aria-label="Предыдущий месяц"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
            }
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className="cp-icon-button"
            aria-label="Следующий месяц"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="cp-calendar">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <span className="cp-day-name" key={day}>
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, i) => (
          <span key={"empty" + i} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const value = dateString(
            new Date(month.getFullYear(), month.getMonth(), i + 1),
          );
          const matches = items.filter(
            (item) => item.requested_delivery_date === value,
          );
          return (
            <span
              key={value}
              className={matches.length ? "has-shipment" : ""}
              aria-label={
                dateLabel(value) +
                (matches.length
                  ? ": " +
                    matches
                      .map(
                        (item) =>
                          item.product_name + ", " + stateLabel(item.status),
                      )
                      .join("; ")
                  : "")
              }
            >
              {i + 1}
              {matches.length > 0 && <i />}
            </span>
          );
        })}
      </div>
      <p className="cp-note">Выделены даты из плана поставок.</p>
    </section>
  );
}
function OrderChart({ orders }: { orders: Order[] }) {
  const now = new Date();
  const months = Array.from(
    { length: 6 },
    (_, i) => new Date(now.getFullYear(), now.getMonth() - 5 + i, 1),
  );
  const values = months.map(
    (month) =>
      orders.filter((order) => {
        const date = new Date(order.created_at);
        return (
          date.getMonth() === month.getMonth() &&
          date.getFullYear() === month.getFullYear()
        );
      }).length,
  );
  return (
    <>
      <div
        className="cp-bars"
        role="img"
        aria-label={months
          .map(
            (month, i) =>
              dateLabel(dateString(month), { month: "long" }) +
              ": " +
              values[i] +
              " заказов",
          )
          .join(", ")}
      >
        {values.map((value, i) => (
          <div className="cp-bar" key={i}>
            <span>{value}</span>
            <div
              style={{
                height: Math.max(2, (value / Math.max(1, ...values)) * 130),
              }}
            />
          </div>
        ))}
      </div>
      <div className="cp-bars-labels">
        {months.map((month) => (
          <span key={month.toISOString()}>
            {dateLabel(dateString(month), { month: "short" })}
          </span>
        ))}
      </div>
    </>
  );
}

function OrderForm({
  identity,
  data,
  company,
  onComplete,
  onClose,
}: {
  identity: string;
  data: AccountData;
  company: string;
  onComplete: (item: Reservation) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Draft>({
    ...emptyDraft,
    address: data.demoMode ? "" : data.profile.delivery_address || "",
  });
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const [completed, setCompleted] = useState<number | null>(null);
  const [saveWarning, setSaveWarning] = useState(false);
  const key = "aoplastic-order-draft-v2-" + identity;
  const product = catalog.find((item) => item.id === draft.productId);
  const today = dateString(new Date());
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(key) || "null");
      if (saved && typeof saved === "object") {
        const safe = Object.fromEntries(
          Object.keys(emptyDraft)
            .filter((field) => typeof saved[field] === "string")
            .map((field) => [field, saved[field]]),
        );
        setDraft((current) => ({ ...current, ...safe }));
      }
    } catch {
      setSaveWarning(true);
    }
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded || completed !== null) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(draft));
    } catch {
      setSaveWarning(true);
    }
  }, [draft, loaded, key, completed]);
  const results = useMemo(() => {
    const value = query.trim().toLocaleLowerCase("ru");
    return value
      ? catalog
          .filter((item) =>
            (item.name + " " + item.category)
              .toLocaleLowerCase("ru")
              .includes(value),
          )
          .slice(0, 7)
      : suggested;
  }, [query]);
  function update(field: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setError("");
  }
  function changeStep(value: number) {
    setStep(value);
    setError("");
    requestAnimationFrame(() => stepHeading.current?.focus());
  }
  function validate(): string {
    if (!product) return "Выберите продукцию из каталога.";
    const quantity = Number(draft.quantity.replace(",", "."));
    if (!Number.isFinite(quantity) || quantity <= 0)
      return "Укажите количество больше нуля.";
    if (draft.unit === "уп." && !Number.isInteger(quantity))
      return "Укажите целое количество упаковок.";
    if (step >= 2) {
      const date = new Date(draft.date + "T12:00:00");
      if (
        !draft.date ||
        Number.isNaN(date.getTime()) ||
        dateString(date) !== draft.date ||
        draft.date < today
      )
        return "Выберите сегодняшнюю или будущую дату поставки.";
      if (draft.delivery === "delivery" && !draft.address.trim())
        return "Укажите адрес доставки.";
    }
    return "";
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    if (step < 3) {
      changeStep(step + 1);
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    const quantity = Number(draft.quantity.replace(",", "."));
    try {
      let reservation: Reservation;
      if (data.demoMode) {
        reservation = {
          id: Date.now(),
          product_name: product!.name,
          quantity,
          unit: draft.unit,
          requested_delivery_date: draft.date,
          status: "requested",
        };
      } else {
        const response = await fetch("/api/customer/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productName: product!.name,
            quantity,
            unit: draft.unit,
            requestedDeliveryDate: draft.date,
            comment:
              (draft.delivery === "pickup"
                ? "Самовывоз."
                : "Доставка: " + draft.address + ".") +
              " " +
              draft.comment,
          }),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(
            body.error || "Не удалось отправить заявку. Попробуйте ещё раз.",
          );
        if (!body.reservation?.id)
          throw new Error(
            "Сервер не подтвердил сохранение заявки. Обратитесь к менеджеру.",
          );
        reservation = body.reservation;
      }
      onComplete(reservation);
      setCompleted(reservation.id);
      try {
        sessionStorage.removeItem(key);
      } catch {
        /* The success remains visible. */
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Ошибка соединения. Черновик сохранён.",
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  if (!loaded)
    return (
      <section className="cp-panel cp-panel-pad" role="status">
        Открываем черновик…
      </section>
    );
  if (completed !== null)
    return (
      <section className="cp-panel cp-success" role="status">
        <CheckCircle2 size={36} />
        <div className="cp-eyebrow">№ {completed}</div>
        <h2>
          {data.demoMode ? "Тестовая заявка сохранена" : "Заявка сохранена"}
        </h2>
        <p>
          {data.demoMode
            ? "Она появится в списке заявок и плане поставок этого тестового профиля. Данные сохранены только в этой вкладке; менеджеру ничего не отправлено."
            : "Заявка доступна в вашем кабинете. Цена, наличие и дата поставки требуют отдельного подтверждения."}
        </p>
        <button className="cp-primary" onClick={onClose}>
          Перейти к заявкам <ArrowRight size={16} />
        </button>
      </section>
    );
  return (
    <div className={step === 3 ? "cp-grid cp-order-review" : "cp-grid"}>
      <section className="cp-panel">
        <ol className="cp-progress" aria-label="Этапы заявки">
          {["Продукция", "Поставка", "Проверка"].map((label, i) => (
            <li key={label} aria-current={step === i + 1 ? "step" : undefined}>
              <b>{step > i + 1 ? <Check size={13} /> : i + 1}</b>
              {label}
            </li>
          ))}
        </ol>
        <form className="cp-form-body" onSubmit={submit} noValidate>
          <h2 ref={stepHeading} tabIndex={-1}>
            {step === 1
              ? "Что вы хотите заказать?"
              : step === 2
                ? "Как вам удобно получить продукцию?"
                : "Проверьте заявку"}
          </h2>
          <p className="cp-subtitle">
            {step === 1
              ? "Поиск по названию, марке или направлению."
              : step === 2
                ? "Дата предварительная — подтвердим её после согласования."
                : "Проверьте количество и условия получения перед отправкой."}
          </p>
          {step === 1 && (
            <>
              {!product ? (
                <>
                  <label className="cp-search">
                    <span className="sr-only">Найти продукцию</span>
                    <Search />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Например, УПЕКС или АБС 2020"
                    />
                  </label>
                  <div className="cp-products">
                    {results.map((item) => (
                      <button
                        className="cp-product"
                        key={item.id}
                        type="button"
                        onClick={() => {
                          update("productId", item.id);
                          update(
                            "unit",
                            ["machine-parts", "hoztovary"].includes(
                              item.categoryId,
                            )
                              ? "уп."
                              : "т",
                          );
                        }}
                      >
                        {item.image && (
                          <img src={item.image} alt="" loading="lazy" />
                        )}
                        <span>
                          <strong>{item.name}</strong>
                          <small>{item.category}</small>
                        </span>
                        <Plus size={16} />
                      </button>
                    ))}
                    {!results.length && (
                      <p className="cp-note">
                        Ничего не найдено. Попробуйте другую марку или название.
                      </p>
                    )}
                  </div>
                  <Link className="cp-link" href="/products" target="_blank">
                    Посмотреть весь каталог <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <div className="cp-selected">
                    <Package size={22} />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                    </div>
                    <button
                      className="cp-icon-button"
                      type="button"
                      aria-label="Изменить продукцию"
                      onClick={() => update("productId", "")}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  <div className="cp-fields">
                    <label className="cp-field">
                      Количество
                      <input
                        aria-required="true"
                        inputMode="decimal"
                        value={draft.quantity}
                        onChange={(event) =>
                          update("quantity", event.target.value)
                        }
                        placeholder="Например, 10"
                      />
                    </label>
                    <label className="cp-field">
                      Единица измерения
                      <select
                        value={draft.unit}
                        onChange={(event) => update("unit", event.target.value)}
                      >
                        <option value="т">Тонны</option>
                        <option value="уп.">Упаковки</option>
                      </select>
                    </label>
                  </div>
                  <p className="cp-note">
                    Для штучной продукции укажите количество упаковок. Состав и
                    фасовку уточнит менеджер; расчёт поштучно пока доступен
                    через каталог.
                  </p>
                </>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <fieldset className="cp-radio">
                <legend>Способ получения</legend>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={draft.delivery === "pickup"}
                    onChange={() => update("delivery", "pickup")}
                  />
                  Самовывоз
                </label>
                <label>
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    checked={draft.delivery === "delivery"}
                    onChange={() => update("delivery", "delivery")}
                  />
                  Доставка
                </label>
              </fieldset>
              <label className="cp-field">
                Желаемая дата
                <input
                  aria-required="true"
                  type="date"
                  min={today}
                  value={draft.date}
                  onChange={(event) => update("date", event.target.value)}
                />
              </label>
              {draft.delivery === "delivery" && (
                <label className="cp-field">
                  Адрес доставки
                  <input
                    aria-required="true"
                    value={draft.address}
                    maxLength={500}
                    onChange={(event) => update("address", event.target.value)}
                    placeholder="Город, улица, номер здания"
                  />
                </label>
              )}
              <label className="cp-field">
                Комментарий <span className="cp-muted">Необязательно</span>
                <textarea
                  rows={3}
                  maxLength={450}
                  value={draft.comment}
                  onChange={(event) => update("comment", event.target.value)}
                  placeholder="Особенности разгрузки, упаковки или другой вопрос"
                />
              </label>
            </>
          )}
          {step === 3 && (
            <>
              <dl className="cp-review">
                <Detail label="Продукция" value={product?.name} />
                <Detail
                  label="Количество"
                  value={draft.quantity + " " + draft.unit}
                />
                <Detail
                  label="Получение"
                  value={
                    draft.delivery === "pickup"
                      ? "Самовывоз"
                      : "Доставка: " + draft.address
                  }
                />
                <Detail label="Желаемая дата" value={dateLabel(draft.date)} />
                <Detail label="Организация" value={company} />
                {draft.comment && (
                  <Detail label="Комментарий" value={draft.comment} />
                )}
              </dl>
              <p className="cp-note">
                Это запрос на согласование поставки, а не подтверждённый заказ.
                Цена и документы согласуются отдельно.
              </p>
            </>
          )}
          {error && (
            <p className="cp-error" role="alert">
              {error}
            </p>
          )}
          {saveWarning && (
            <p className="cp-note">
              Браузер не позволяет сохранить черновик. Не закрывайте страницу до
              отправки.
            </p>
          )}
          <div className="cp-form-footer">
            {step > 1 ? (
              <button
                type="button"
                className="cp-link"
                disabled={busy}
                onClick={() => changeStep(step - 1)}
              >
                <ArrowLeft size={14} />
                Назад
              </button>
            ) : (
              <span className="cp-muted" style={{ fontSize: 11 }}>
                Шаг 1 из 3
              </span>
            )}
            <button className="cp-primary" type="submit" disabled={busy}>
              {busy
                ? "Сохраняем…"
                : step === 3
                  ? data.demoMode
                    ? "Сохранить тестовую заявку"
                    : "Отправить заявку"
                  : "Продолжить"}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </section>
      <aside>
        <section className="cp-panel cp-summary">
          <div className="cp-eyebrow">Ваша заявка</div>
          <h2>{company}</h2>
          <dl>
            <Detail
              label="Продукция"
              value={product?.name || "Пока не выбрана"}
            />
            <Detail
              label="Количество"
              value={
                draft.quantity
                  ? draft.quantity + " " + draft.unit
                  : "Не указано"
              }
            />
            <Detail
              label="Желаемая дата"
              value={draft.date ? dateLabel(draft.date) : "Не выбрана"}
            />
          </dl>
          <p className="cp-note">
            Стоимость и возможность поставки подтвердим после проверки заявки.
          </p>
        </section>
        <Support manager={data.manager} />
      </aside>
    </div>
  );
}
