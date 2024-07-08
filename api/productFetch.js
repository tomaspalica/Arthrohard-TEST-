import axios from "../node_modules/axios";

const apiLink = "https://brandstestowy.smallhost.pl/api/random";

export async function getProducts(page, pageSize) {
  const respone = await axios.get(
    `${apiLink}?pageNumber=${page}&pageSize=${pageSize}`
  );
  return respone.data;
}
