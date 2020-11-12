const base_url = "https://api.football-data.org/v2/";
const authKey = "62f1ea43bb3741b682803c6ddb1f5835";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// fungsi menggabungkan url
function generateUrl(path) {
  const url = base_url + path;
  return url;
}

// fungsi request
function request(url) {
  let req = new Request(url, {
    headers: {
      "X-Auth-Token": authKey,
    },
  });
  return req;
}

// fungsi mendapatkan hasil liga inggris
function getLigaBola() {
  const url = generateUrl("competitions/2021/standings");
  if ("caches" in window) {
    caches.match(request(url)).then((response) => {
      if (response) {
        response.json().then((data) => {
          let tableHTML = "";
          data.standings[0].table.forEach((standing) => {
            tableHTML += `
                <tr>
                  <th scope="row">${standing.position}</th>
                  <td>${standing.team.name}</td>
                  <td>${standing.won}</td>
                  <td>${standing.draw}</td>
                  <td>${standing.lost}</td>
                  <td>${standing.goalsFor}</td>
                  <td>${standing.goalsAgainst}</td>
                  <td>${standing.goalDifference}</td>
                  <td>${standing.points}</td>
                </tr>
        `;
          });
          // sisipkan ke dalam home.html
          document.getElementById("dataBola").innerHTML = tableHTML;
        });
      }
    });
  }

  fetch(request(url))
    .then(status)
    .then(json)
    .then((data) => {
      // insert table secara dinamis
      let tableHTML = "";
      data.standings[0].table.forEach((standing) => {
        tableHTML += `
            <tr class="text-center">
              <th scope="row">${standing.position}</th>
              <td>${standing.team.name}</td>
              <td>${standing.won}</td>
              <td>${standing.draw}</td>
              <td>${standing.lost}</td>
              <td>${standing.goalsFor}</td>
              <td>${standing.goalsAgainst}</td>
              <td>${standing.goalDifference}</td>
              <td>${standing.points}</td>
            </tr>
        `;
      });
      // sisipkan ke dalam home.html
      document.getElementById("dataBola").innerHTML = tableHTML;
    })
    .catch(error);
}

// fungsi mendapatkan team lig inggris
function getTeamBola() {
  const url = generateUrl("competitions/2021/teams");

  if ("caches" in window) {
    caches.match(request(url)).then((response) => {
      if (response) {
        response.json().then((data) => {
          let cardsHTML = "";
          data.teams.forEach((team) => {
            cardsHTML += `
              <div class="col s6 m4 l3">
                <a href="./team-detail.html?id=${team.id}">
                  <div class="card">
                    <img class="card-img-top" src="${team.crestUrl}" alt="Image Team" height="253">
                    <div class="card-body">
                      <p class="card-text">${team.name}</p>
                    </div>
                  </div>
                </a>
              </div>
        `;
          });
          // sisipkan ke dalam team.html
          document.getElementById("teamBola").innerHTML = cardsHTML;
        });
      }
    });
  }

  fetch(request(url))
    .then(status)
    .then(json)
    .then((data) => {
      // console.log(data.standings[0].table);
      // console.log(data);

      // insert table secara dinamis
      let cardsHTML = "";
      data.teams.forEach((team) => {
        cardsHTML += `
        <div class="col s6 m4 l3">
          <a href="./team-detail.html?id=${team.id}">
            <div class="card">
              <img class="card-img-top" src="${team.crestUrl}" alt="Image Team" height="253">
              <div class="card-body">
                <p class="card-text">${team.name}</p>
              </div>
            </div>
          </a>
        </div>
        `;
      });
      // sisipkan ke dalam team.html
      document.getElementById("teamBola").innerHTML = cardsHTML;
    })
    .catch(error);
}

function getTeamBolaById() {
  const url = generateUrl("teams/");
  return new Promise((resolve, reject) => {
    // Ambil nilai query parameter (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(request(url + idParam)).then((response) => {
        if (response) {
          response.json().then((data) => {
            let squadTeamHTML = "";
            let teamDetailHTML = `
                <!-- jumbotron -->
                  <div class="jumbotron jumbotron-fluid jumbo-team">
                    <div class="container">
                      <div class="row align-items-center">
                        <div class="col m3 offset-m3 col s6">
                          <img src="${data.crestUrl}" class="img-fluid" alt="icon team">
                        </div>
                        <div class="col m5 offset-m1 col s6">
                          <h1>${data.name}</h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- collapsible -->
                    <!-- info team -->
                    <div id="accordion">
                      <div class="card">
                        <div class="card-header" id="infoTeams">
                          <h5 class="mb-0">
                            <button class="btn btn-link" data-toggle="collapse" data-target="#infoTeam" aria-expanded="true"
                              aria-controls="infoTeam">
                              <i class="large material-icons">info_outline</i> Info Team
                            </button>
                          </h5>
                        </div>

                        <div id="infoTeam" class="collapse" aria-labelledby="infoTeams" data-parent="#accordion">
                          <div class="card-body">
                            <div class="row text-justify justify-content-center">
                              <div class="col m5 s6">
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Name : ${data.shortName}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Address : ${data.address}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Phone : ${data.phone}</h4>
                                  </div>
                                </div>
                              </div>
                              <div class="col m5 s6">
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Website : ${data.website}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Venue : ${data.venue}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Founded : ${data.founded}</h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;

            data.squad.forEach((sq) => {
              squadTeamHTML += `
                  <tr>
                    <td>${sq.name}</td>
                    <td>${sq.position}</td>
                    <td>${sq.nationality}</td>
                    <td>${sq.role}</td>
                  </tr>
                  `;
            });
            // sisipkan komponen html kedalam elemen id #content-body
            document.getElementById("body-content").innerHTML = teamDetailHTML;
            document.getElementById("squadTeam").innerHTML = squadTeamHTML;
            // kirim object data hasil parsing json agar bisa di simpen ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(request(url + idParam))
      .then(status)
      .then(json)
      .then((data) => {
        console.log(data);
        // menyusun tag html secara dinamis
        let squadTeamHTML = "";
        let teamDetailHTML = `
      <!-- jumbotron -->
        <div class="jumbotron jumbotron-fluid jumbo-team">
          <div class="container">
            <div class="row align-items-center">
              <div class="col m3 offset-m3 col s6">
                <img src="${data.crestUrl}" class="img-fluid" alt="icon team">
              </div>
              <div class="col m5 offset-m1 col s6">
                <h1>${data.name}</h1>
              </div>
            </div>
          </div>
        </div>

        <!-- collapsible -->
          <!-- info team -->
          <div id="accordion">
            <div class="card">
              <div class="card-header" id="infoTeams">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" data-target="#infoTeam" aria-expanded="true"
                    aria-controls="infoTeam">
                    <i class="large material-icons">info_outline</i> Info Team
                  </button>
                </h5>
              </div>

              <div id="infoTeam" class="collapse" aria-labelledby="infoTeams" data-parent="#accordion">
                <div class="card-body">
                  <div class="row text-justify justify-content-center">
                    <div class="col m5 s12 text-justify">
                      <div class="row">
                        <div class="col s12">
                          <h4>Name : ${data.shortName}</h4>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12">
                          <h4>Address : ${data.address}</h4>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12">
                          <h4>Phone : ${data.phone}</h4>
                        </div>
                      </div>
                    </div>
                    <div class="col m5 s12 text-justify">
                      <div class="row">
                        <div class="col s12">
                          <h4>Website : ${data.website}</h4>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12">
                          <h4>Venue : ${data.venue}</h4>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col s12">
                          <h4>Founded : ${data.founded}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      `;

        data.squad.forEach((sq) => {
          squadTeamHTML += `
        <tr>
          <td>${sq.name}</td>
          <td>${sq.position}</td>
          <td>${sq.nationality}</td>
          <td>${sq.role}</td>
        </tr>
        `;
        });
        // sisipkan komponen html kedalam elemen id #content-body
        document.getElementById("body-content").innerHTML = teamDetailHTML;
        document.getElementById("squadTeam").innerHTML = squadTeamHTML;
        resolve(data);
      })
      .catch(error);
  });
}

function getSavedTeamBola() {
  getData().then((data) => {
    console.log(data);
    // menyusun komponen html secara dinamis
    let cardsHTML = "";
    data.forEach((team) => {
      cardsHTML += `
        <div class="col-lg-3 col-6">
          
            <div class="card">
            <!-- <button class="btn-floating btn-small waves-effect waves-light red" id="delete"><i class="material-icons">delete</i></button> -->
             <a href="./team-detail.html?id=${team.id}&saved=true">
              <img class="card-img-top" src="${team.crestUrl}" alt="Image Team" height="253">
              <div class="card-body">
                <p class="card-text">${team.name}</p>
              </div>
              </a>
            </div> 
        </div>
        `;
    });
    // sisipkan ke dalam team.html
    document.getElementById("teamBola").innerHTML = cardsHTML;
  });
}

function getSavedTeamBolaById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");

  getTeamById(idParam).then((data) => {
    console.log(data);
    let squadTeamHTML = "";
    let teamDetailHTML = `
                <!-- jumbotron -->
                  <div class="jumbotron jumbotron-fluid jumbo-team">
                    <div class="container">
                      <div class="row align-items-center">
                        <div class="col m3 offset-m3 col s6">
                          <img src="${data.crestUrl}" class="img-fluid" alt="icon team">
                        </div>
                        <div class="col m5 offset-m1 col s6">
                          <h1>${data.name}</h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- collapsible -->
                    <!-- info team -->
                    <div id="accordion">
                      <div class="card">
                        <div class="card-header" id="infoTeams">
                          <h5 class="mb-0">
                            <button class="btn btn-link" data-toggle="collapse" data-target="#infoTeam" aria-expanded="true"
                              aria-controls="infoTeam">
                              <i class="large material-icons">info_outline</i> Info Team
                            </button>
                          </h5>
                        </div>

                        <div id="infoTeam" class="collapse" aria-labelledby="infoTeams" data-parent="#accordion">
                          <div class="card-body">
                            <div class="row text-justify justify-content-center">
                              <div class="col m5 s6">
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Name : ${data.shortName}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Address : ${data.address}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Phone : ${data.phone}</h4>
                                  </div>
                                </div>
                              </div>
                              <div class="col m5 s6">
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Website : ${data.website}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Venue : ${data.venue}</h4>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col s12">
                                    <h4>Founded : ${data.founded}</h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                `;

    data.squad.forEach((sq) => {
      squadTeamHTML += `
                  <tr>
                    <td>${sq.name}</td>
                    <td>${sq.position}</td>
                    <td>${sq.nationality}</td>
                    <td>${sq.role}</td>
                  </tr>
                  `;
    });
    // sisipkan komponen html kedalam elemen id #content-body
    document.getElementById("body-content").innerHTML = teamDetailHTML;
    document.getElementById("squadTeam").innerHTML = squadTeamHTML;
  });
}
