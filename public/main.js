document.getElementById("loadUser").addEventListener("click", async () => {
  const response = await fetch("/api/user");
  const data = await response.json();

  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="card">
      <img src="${data.user.picture}">
      <h2>${data.user.firstName} ${data.user.lastName}</h2>
      <p><b>Gender:</b> ${data.user.gender}</p>
      <p><b>Age:</b> ${data.user.age}</p>
      <p><b>DOB:</b> ${new Date(data.user.dob).toDateString()}</p>
      <p><b>Address:</b> ${data.user.address}, ${data.user.city}</p>
    </div>

    <div class="card">
      <h2>Country Information</h2>
      <img src="${data.country.flag}" width="100">
      <p><b>Country:</b> ${data.country.name}</p>
      <p><b>Capital:</b> ${data.country.capital}</p>
      <p><b>Languages:</b> ${data.country.languages}</p>
      <p><b>Currency:</b> ${data.country.currency}</p>
      <p><b>Exchange Rates:</b></p>
      <p>1 ${data.country.currency} = ${data.exchangeRates.USD} USD</p>
      <p>1 ${data.country.currency} = ${data.exchangeRates.KZT} KZT</p>
    </div>

    <div class="card">
      <h2>News</h2>
      ${data.news.map(n => `
        <div class="news">
          <h3>${n.title}</h3>
          ${n.image ? `<img src="${n.image}" width="200">` : ""}
          <p>${n.description || ""}</p>
          <a href="${n.url}" target="_blank">Read more</a>
        </div>
      `).join("")}
    </div>
  `;
});
