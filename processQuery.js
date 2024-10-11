export async function processQuery(url, prompt) {
  // config für POST REQUEST
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: "You're an assistand, answer this:" + prompt,
    }),
  };

  // Post request and await
  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  // set up a reader to process the response as a stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  const data = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    // decode and split the chunk into lines

    const lines = decoder.decode(value, { stream: true }).split("\n");

    for (const line of lines) {
      if (line.trim()) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.done) {
            break;
          }
          data.push(parsed.response);
        } catch (err) {
          throw new Error(`Error parsing JSON: ${err.message}`);
        }
      }
    }
  }

  return data.join("");
}
