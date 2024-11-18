self.addEventListener("message", async (event) => {
  try {
    const apiUrl = event.data;

    const responses = await Promise.all([fetch(apiUrl), fetch(apiUrl), fetch(apiUrl)]);

    const data = await Promise.any(responses.map((response) => response.json()));

    self.postMessage(data.results[0].question);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
});
