const apiLink = "https://brandstestowy.smallhost.pl/api/random";

export async function getProducts(page, pageSize) {
  try {
    const response = await fetch(
      `${apiLink}?pageNumber=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data.data);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.log(error.message);
  }
}
