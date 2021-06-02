export default class NavbarController {
  constructor() {
    this.users = localStorage.users ? JSON.parse(localStorage.users) : [];
  }
}
