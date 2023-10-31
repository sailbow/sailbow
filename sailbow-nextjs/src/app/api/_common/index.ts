export function urlSearchParamsToObject(searchParams: URLSearchParams): { [key: string]: string } {
  const obj: { [key: string]: string } = {};
  
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  
  return obj;
}