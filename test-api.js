// Quick test to verify WindBorne API
async function testAPI() {
  console.log("Testing WindBorne API...");

  for (let i = 0; i <= 5; i++) {
    const paddedHours = i.toString().padStart(2, "0");
    const url = `https://a.windbornesystems.com/treasure/${paddedHours}.json`;

    try {
      const response = await fetch(url);
      console.log(
        `${paddedHours}.json: ${response.status} ${response.statusText}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          `  -> ${Array.isArray(data) ? data.length : "NOT AN ARRAY"} items`
        );
        if (Array.isArray(data) && data.length > 0) {
          console.log(`  -> First item:`, data[0]);
        }
      }
    } catch (error) {
      console.error(`${paddedHours}.json: ERROR`, error);
    }
  }
}

testAPI();
