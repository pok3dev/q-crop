const izbrisiAPI = async (podaci) => {
  const url = await fetch("http://localhost:3001/projekti/izbrisiProjekat", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(podaci),
  });

  return url.json();
};
module.exports = izbrisiAPI;
