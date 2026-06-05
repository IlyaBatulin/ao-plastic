export type NextPageParams = Record<string, string | string[]>
export type NextPageSearchParams = Record<string, string | string[] | undefined>

export type NextPageProps<
  TParams extends NextPageParams = NextPageParams,
  TSearch extends NextPageSearchParams = NextPageSearchParams,
> = {
  params?: Promise<TParams>
  searchParams?: Promise<TSearch>
}

/** Разворачивает params/searchParams на серверных page.tsx (Next.js 16). */
export async function unwrapNextPageProps<
  TParams extends NextPageParams = NextPageParams,
  TSearch extends NextPageSearchParams = NextPageSearchParams,
>(props: NextPageProps<TParams, TSearch>) {
  const [params, searchParams] = await Promise.all([
    props.params ?? Promise.resolve({} as TParams),
    props.searchParams ?? Promise.resolve({} as TSearch),
  ])
  return { params, searchParams }
}
