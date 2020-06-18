import { __awaiter, __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthService = class AuthService {
    constructor(router, afAuth) {
        this.router = router;
        this.afAuth = afAuth;
        if (sessionStorage.getItem("logged") == undefined) {
            sessionStorage.setItem("logged", false.toString());
        }
        this.loggedIn = JSON.parse(sessionStorage.getItem("logged"));
        this.afAuth.auth.onAuthStateChanged(user => {
            if (user) {
                this.user = user;
                sessionStorage.setItem('user', JSON.stringify(this.user.email));
            }
            else {
                sessionStorage.setItem('user', null);
            }
        });
    }
    logIn(login, passord) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var result = yield this.afAuth.auth.signInWithEmailAndPassword(login, passord);
                this.loggedIn = true;
                sessionStorage.setItem("logged", this.loggedIn.toString());
                sessionStorage.setItem("user", login);
                this.router.navigate(['/']);
            }
            catch (e) {
                alert("Credenciales incorrectas");
            }
        });
    }
    logOut() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.afAuth.auth.signOut();
            localStorage.removeItem('user');
            this.loggedIn = false;
            sessionStorage.setItem("logged", this.loggedIn.toString());
            this.router.navigate(['/login-form']);
        });
    }
    get isLoggedIn() {
        return this.loggedIn;
    }
};
AuthService = __decorate([
    Injectable()
], AuthService);
export { AuthService };
let AuthGuardService = class AuthGuardService {
    constructor(router, authService) {
        this.router = router;
        this.authService = authService;
    }
    canActivate(route) {
        const isLoggedIn = this.authService.isLoggedIn;
        const isLoginForm = route.routeConfig.path === 'login-form';
        if (isLoggedIn && isLoginForm) {
            this.router.navigate(['/']);
            return false;
        }
        if (!isLoggedIn && !isLoginForm) {
            this.router.navigate(['/login-form']);
        }
        return isLoggedIn || isLoginForm;
    }
};
AuthGuardService = __decorate([
    Injectable()
], AuthGuardService);
export { AuthGuardService };
//# sourceMappingURL=auth.service.js.map