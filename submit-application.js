/**
 * WindBorne Systems Application Submission Script
 * Submits the coding challenge to the career applications endpoint
 */

const applicationData = {
  career_application: {
    name: "Monyvann Men",
    email: "m.men6603@gmail.com",
    role: "Junior Web Developer",
    notes:
      "Full-stack developer specializing in React/Next.js and TypeScript. Built an interactive real-time balloon constellation tracker integrating WindBorne's API with Open-Meteo weather data. Experienced in creating responsive, performant web applications with modern tooling. Eager to collaborate on innovative solutions and contribute to WindBorne's mission of improving weather forecasting through balloon technology.",
    submission_url: "https://wind-borne-balloon-constellation-tr.vercel.app/",
    portfolio_url: "https://monyvann.me",
    resume_url:
      "https://drive.google.com/file/d/1jrZvfWoUwWEIG0A9f1zRaa5riJhGViVP/view?usp=sharing",
  },
};

async function submitApplication() {
  console.log("Submitting WindBorne Systems Application...\n");
  console.log("Application Data:");
  console.log(JSON.stringify(applicationData, null, 2));
  console.log("\n" + "=".repeat(60) + "\n");

  try {
    const response = await fetch(
      "https://windbornesystems.com/career_applications.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(applicationData),
      }
    );

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    console.log(
      `Response Headers:`,
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log(`\nResponse Body:`);
    console.log(responseText);

    if (response.ok) {
      console.log("\nSUCCESS! Application submitted successfully!");
      console.log(
        "Status Code: 200 - Your coding challenge has been submitted!"
      );
    } else {
      console.log("\nWarning: Received non-200 status code");
      console.log("Please check the response above for details");
    }

    return response;
  } catch (error) {
    console.error("\nERROR submitting application:");
    console.error(error.message);
    throw error;
  }
}

// Run the submission
submitApplication()
  .then(() => {
    console.log("\n" + "=".repeat(60));
    console.log("Application submission process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nSubmission failed!");
    process.exit(1);
  });
