import { useAxios } from "./useAxios";
import useAppStore from "@/stores/AppStore";
import { toast } from "@/components/toast/toast";

function useProductsRoutes() {
  const { secureAxios } = useAxios();

  const getProducts = async (
    sort: "Newest" | "Oldest",
    page: number,
    categories: string[],
    suppliers: string[],
    setIsLoading?: (isLoading: boolean) => void,
    setPages?: (pages: number) => void
  ) => {
    setIsLoading && setIsLoading(true);
    let fxsort = -1;
    if (sort === "Newest") fxsort = -1;
    else if (sort === "Oldest") fxsort = 1;

    await secureAxios
      .get(
        `/shop/products?page=${page}${
          categories.length > 0 ? "&category=" + JSON.stringify(categories) : ""
        }${
          suppliers.length > 0 ? "&supplier=" + JSON.stringify(suppliers) : ""
        }&limit=20&sort=${fxsort}`
      )
      .then((res) => {
        useAppStore.setState((state) => {
          state.products = res.data.products ? res.data.products : [];
          setPages && setPages(res.data.pages);
        });
      })
      .catch((err) => {
        toast({
          description: err.response?.data?.message || err.message,
          variant: "error",
        });
      })
      .finally(() => setIsLoading && setIsLoading(false));
  };
  return { getProducts };
}

export default useProductsRoutes;
