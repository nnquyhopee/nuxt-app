export default defineNuxtRouteMiddleware((_to, _from) => {
  const isLoggedIn = false;
  if (!isLoggedIn) {
    return navigateTo("/about");
  }
});
