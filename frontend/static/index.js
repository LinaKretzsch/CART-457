// console.log("JS is loaded!");

const navigateTo = url => {
  history.pushState(null, null, url);
  router();
};


// is site wants to get data before actual site renders
const router = async () => {
  const routes = [
    { path: "/", view: () => console.log("Viewing StartPage") },
    { path: "/account", view: () => console.log("Viewing Account") },
    { path: "/drawing", view: () => console.log("Viewing Drawing") },
    { path: "/gallery", view: () => console.log("Viewing Gallery") }

  ];

  // Test each route for potential match
  const potentialMatches = routes.map(route => {
    return {
      route: route,
      isMatch: location.pathname === route.path
    };
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

  if(!match){
    match = {
      route: routes[0],
      isMatch: true
    };
  }

  console.log(match.route.view());

};

// Add event listener if user reverts in browser
window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

  // Add event listener for when you add sites as links
  document.body.addEventListener("click", e => {
    if(e.target.matches("[data-link]")){
      e.preventDefault(); //
      navigateTo(e.target.href);
    }
  });
  router();
});
